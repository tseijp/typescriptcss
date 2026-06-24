// Shared integration-test harness for the typescriptcss bundler adapters.
//
// This file is intentionally self-contained: the only third-party runtime
// dependency it relies on is `vitest`, which is the single test-support package
// present in the repository lockfile. dedent, fast-glob and playwright are NOT
// installed, so the template helpers, glob and DOM observation below are all
// implemented locally with the Node standard library and `fetch`.
//
// Each `test` spins up a real bundler project in a temporary directory, rewrites
// the workspace dependencies to absolute `file:` references to the packages in
// this repository, installs with pnpm, and exposes `exec`, `spawn` and `fs`
// helpers plus a small set of observation utilities (fetchStyles, scanners).

import { exec, execFile, spawn, type ChildProcess } from 'node:child_process'
import fs from 'node:fs/promises'
import { createServer } from 'node:net'
import { platform, tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify, stripVTControlCharacters } from 'node:util'
import { test as defaultTest, type ExpectStatic } from 'vitest'

const THIS_DIR = path.dirname(fileURLToPath(import.meta.url))
export const REPO_ROOT = path.join(THIS_DIR, '..')

// Workspace packages whose `workspace:*` / `workspace:^` specifiers are rewritten
// to absolute `file:` directory references. pnpm resolves and links these from
// the live source tree so the temp project exercises the real adapter code.
const WORKSPACE_PACKAGES: Record<string, string> = {
        typescriptcss: path.join(REPO_ROOT, 'packages', 'typescriptcss'),
        '@typescriptcss/plugin-core': path.join(REPO_ROOT, 'packages', '@typescriptcss', 'plugin-core'),
        '@typescriptcss/plugin-next': path.join(REPO_ROOT, 'packages', '@typescriptcss', 'plugin-next'),
        '@typescriptcss/plugin-vite': path.join(REPO_ROOT, 'packages', '@typescriptcss', 'plugin-vite'),
        '@typescriptcss/plugin-rollup': path.join(REPO_ROOT, 'packages', '@typescriptcss', 'plugin-rollup'),
}

export const IS_WINDOWS = platform() === 'win32'

const execFileAsync = promisify(execFile)

const TEST_TIMEOUT = IS_WINDOWS ? 300000 : 240000
const ASSERTION_TIMEOUT = IS_WINDOWS ? 20000 : 15000

const TMP_ROOT = tmpdir()

interface SpawnedProcess {
        dispose: () => Promise<void>
        flush: () => void
        onStdout: (predicate: (message: string) => boolean) => Promise<void>
        onStderr: (predicate: (message: string) => boolean) => Promise<void>
}

interface ChildProcessOptions {
        cwd?: string
        env?: Record<string, string>
}

interface ExecOptions {
        ignoreStdErr?: boolean
        stdin?: string
}

interface TestConfig {
        fs: { [filePath: string]: string | Uint8Array }
        timeout?: number
        installDependencies?: boolean
}

interface TestContext {
        root: string
        expect: ExpectStatic
        exec(command: string, options?: ChildProcessOptions, execOptions?: ExecOptions): Promise<string>
        spawn(command: string, options?: ChildProcessOptions): Promise<SpawnedProcess>
        fs: {
                write(filePath: string, content: string | Uint8Array, encoding?: BufferEncoding): Promise<void>
                create(filePaths: string[]): Promise<void>
                read(filePath: string): Promise<string>
                delete(filePath: string): Promise<void>
                exists(filePath: string): Promise<boolean>
                glob(pattern: string): Promise<string[]>
                readAll(pattern: string): Promise<[string, string][]>
                expectFileToContain(filePath: string, contents: string | RegExp | (string | RegExp)[]): Promise<void>
                expectFileNotToContain(filePath: string, contents: (string | RegExp)[]): Promise<void>
        }
}

type TestCallback = (context: TestContext) => Promise<void> | void

interface TestFlags {
        only?: boolean
        skip?: boolean
        concurrent?: boolean
}

type SpawnActor = { predicate: (message: string) => boolean; resolve: () => void }

export function test(name: string, config: TestConfig, testCallback: TestCallback, { only = false, skip = false, concurrent = false }: TestFlags = {}) {
        return defaultTest(
                name,
                {
                        timeout: config.timeout ?? TEST_TIMEOUT,
                        retry: process.env.CI ? 1 : 0,
                        only,
                        skip,
                        concurrent,
                },
                async (options) => {
                        await fs.mkdir(TMP_ROOT, { recursive: true })
                        const root = await fs.mkdtemp(path.join(TMP_ROOT, 'typescriptcss-integration-'))

                        const disposables: (() => Promise<void>)[] = []

                        const context: TestContext = {
                                root,
                                expect: options.expect,
                                async exec(command, childProcessOptions = {}, execOptions = {}) {
                                        const cwd = childProcessOptions.cwd ?? root
                                        return new Promise((resolve, reject) => {
                                                const child = exec(
                                                        command,
                                                        {
                                                                cwd,
                                                                maxBuffer: 100 * 1024 * 1024,
                                                                ...childProcessOptions,
                                                                env: { ...process.env, ...childProcessOptions.env },
                                                        },
                                                        (error, stdout, stderr) => {
                                                                if (error) {
                                                                        if (execOptions.ignoreStdErr !== true) console.error(stderr)
                                                                        reject(error)
                                                                } else {
                                                                        resolve(`${stdout.toString()}\n\n${stderr.toString()}`)
                                                                }
                                                        },
                                                )
                                                if (execOptions.stdin) {
                                                        child.stdin?.write(execOptions.stdin)
                                                        child.stdin?.end()
                                                }
                                        })
                                },
                                async spawn(command, childProcessOptions = {}) {
                                        let resolveDisposal: (() => void) | undefined
                                        let rejectDisposal: ((error: Error) => void) | undefined
                                        const disposePromise = new Promise<void>((resolve, reject) => {
                                                resolveDisposal = resolve
                                                rejectDisposal = reject
                                        })

                                        const cwd = childProcessOptions.cwd ?? root
                                        const child = spawn(command, {
                                                cwd,
                                                detached: !IS_WINDOWS,
                                                shell: true,
                                                ...childProcessOptions,
                                                env: { ...process.env, ...childProcessOptions.env },
                                        })

                                        let disposed = false
                                        async function dispose() {
                                                if (disposed) return disposePromise
                                                disposed = true
                                                await killProcessTree(child)
                                                const timer = setTimeout(() => {
                                                        forceKillProcessTree(child)
                                                        rejectDisposal?.(new Error(`spawned process (${command}) did not exit in time`))
                                                }, ASSERTION_TIMEOUT)
                                                disposePromise.then(
                                                        () => clearTimeout(timer),
                                                        () => clearTimeout(timer),
                                                )
                                                return disposePromise
                                        }
                                        disposables.push(dispose)

                                        const stdoutMessages: string[] = []
                                        const stderrMessages: string[] = []
                                        const stdoutActors: SpawnActor[] = []
                                        const stderrActors: SpawnActor[] = []
                                        const combined: ['stdout' | 'stderr', string][] = []

                                        function notifyNext(actors: SpawnActor[], messages: string[]) {
                                                if (actors.length <= 0) return
                                                const [next] = actors
                                                for (const [idx, message] of messages.entries()) {
                                                        if (next.predicate(message)) {
                                                                messages.splice(0, idx + 1)
                                                                actors.splice(actors.indexOf(next), 1)
                                                                next.resolve()
                                                                break
                                                        }
                                                }
                                        }

                                        child.stdout?.on('data', (result) => {
                                                const content = result.toString()
                                                combined.push(['stdout', content])
                                                for (const line of content.split('\n')) stdoutMessages.push(stripVTControlCharacters(line))
                                                notifyNext(stdoutActors, stdoutMessages)
                                        })
                                        child.stderr?.on('data', (result) => {
                                                const content = result.toString()
                                                combined.push(['stderr', content])
                                                for (const line of content.split('\n')) stderrMessages.push(stripVTControlCharacters(line))
                                                notifyNext(stderrActors, stderrMessages)
                                        })
                                        child.on('exit', () => resolveDisposal?.())
                                        child.on('error', (error) => {
                                                if (error.name !== 'AbortError') throw error
                                        })

                                        options.onTestFailed(() => {
                                                for (const [type, message] of combined) {
                                                        if (type === 'stdout') console.log(message)
                                                        else console.error(message)
                                                }
                                        })

                                        return {
                                                dispose,
                                                flush() {
                                                        stdoutActors.splice(0)
                                                        stderrActors.splice(0)
                                                        stdoutMessages.splice(0)
                                                        stderrMessages.splice(0)
                                                },
                                                onStdout(predicate) {
                                                        return new Promise<void>((resolve) => {
                                                                stdoutActors.push({ predicate, resolve })
                                                                notifyNext(stdoutActors, stdoutMessages)
                                                        })
                                                },
                                                onStderr(predicate) {
                                                        return new Promise<void>((resolve) => {
                                                                stderrActors.push({ predicate, resolve })
                                                                notifyNext(stderrActors, stderrMessages)
                                                        })
                                                },
                                        }
                                },
                                fs: {
                                        async write(filename, content, encoding = 'utf8') {
                                                const full = path.join(root, filename)
                                                await fs.mkdir(path.dirname(full), { recursive: true })
                                                if (typeof content !== 'string') return await fs.writeFile(full, content)
                                                let text = content
                                                if (filename.endsWith('package.json')) text = await overwriteVersionsInPackageJson(text)
                                                await fs.writeFile(full, text, encoding)
                                        },
                                        async create(filenames) {
                                                for (const filename of filenames) {
                                                        const full = path.join(root, filename)
                                                        await fs.mkdir(path.dirname(full), { recursive: true })
                                                        await fs.writeFile(full, '')
                                                }
                                        },
                                        async delete(filename) {
                                                await fs.unlink(path.join(root, filename))
                                        },
                                        async read(filePath) {
                                                return fs.readFile(path.resolve(root, filePath), 'utf8')
                                        },
                                        async exists(filePath) {
                                                try {
                                                        await fs.access(path.resolve(root, filePath))
                                                        return true
                                                } catch {
                                                        return false
                                                }
                                        },
                                        async glob(pattern) {
                                                return globFiles(root, pattern)
                                        },
                                        async readAll(pattern) {
                                                const files = await globFiles(root, pattern)
                                                return Promise.all(files.map(async (file) => [file, await fs.readFile(path.join(root, file), 'utf8')] as [string, string]))
                                        },
                                        async expectFileToContain(filePath, contents) {
                                                return retryAssertion(async () => {
                                                        const fileContent = await this.read(filePath)
                                                        for (const content of Array.isArray(contents) ? contents : [contents]) {
                                                                if (content instanceof RegExp) options.expect(fileContent).toMatch(content)
                                                                else options.expect(fileContent).toContain(content)
                                                        }
                                                })
                                        },
                                        async expectFileNotToContain(filePath, contents) {
                                                return retryAssertion(async () => {
                                                        const fileContent = await this.read(filePath)
                                                        for (const content of contents) {
                                                                if (content instanceof RegExp) options.expect(fileContent).not.toMatch(content)
                                                                else options.expect(fileContent).not.toContain(content)
                                                        }
                                                })
                                        },
                                },
                        }

                        config.fs['.gitignore'] ??= txt`
				node_modules/
				dist/
				build/
				.next/
				out/
				.output/
				.vinxi/
				.solid/
				.svelte-kit/
				.nuxt/
			`

                        // pnpm needs to treat each temp project as its own workspace root so it
                        // does not climb up into this repository's workspace.
                        config.fs['pnpm-workspace.yaml'] ??= txt`
				packages: []
			`
                        config.fs['.npmrc'] ??= txt`
				node-linker=hoisted
				shamefully-hoist=true
			`

                        for (const [filename, content] of Object.entries(config.fs)) {
                                await context.fs.write(filename, content)
                        }

                        async function dispose() {
                                const results = await Promise.allSettled(disposables.map((d) => d()))
                                await gracefullyRemove(root)
                                const errors = results.flatMap((r) => (r.status === 'rejected' ? [r.reason] : []))
                                if (errors.length > 0) throw new AggregateError(errors, 'Failed to clean up spawned processes')
                        }
                        options.onTestFinished(dispose)

                        if (config.installDependencies ?? true) {
                                try {
                                        await context.exec('pnpm install --ignore-workspace --config.confirmModulesPurge=false')
                                } catch (error: any) {
                                        console.error(error?.stdout?.toString())
                                        console.error(error?.stderr?.toString())
                                        throw error
                                }
                        }

                        return await testCallback(context)
                },
        )
}

test.only = (name: string, config: TestConfig, cb: TestCallback) => test(name, config, cb, { only: true })
test.skip = (name: string, config: TestConfig, cb: TestCallback) => test(name, config, cb, { skip: true })
test.concurrent = (name: string, config: TestConfig, cb: TestCallback) => test(name, config, cb, { concurrent: true })

async function overwriteVersionsInPackageJson(content: string): Promise<string> {
        const json = JSON.parse(content)
        for (const key of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
                const deps = json[key] || {}
                for (const dep in deps) {
                        if ((deps[dep] === 'workspace:*' || deps[dep] === 'workspace:^' || deps[dep] === 'workspace:') && WORKSPACE_PACKAGES[dep]) {
                                deps[dep] = `file:${WORKSPACE_PACKAGES[dep]}`
                        }
                }
        }
        // The local packages still carry `workspace:*` specifiers for each other
        // (e.g. plugin-core -> typescriptcss). Those only resolve inside this repo's
        // workspace, so rewrite every transitive reference to the same `file:` dir.
        json.pnpm ||= {}
        json.pnpm.overrides ||= {}
        for (const [name, dir] of Object.entries(WORKSPACE_PACKAGES)) {
                json.pnpm.overrides[name] ??= `file:${dir}`
        }
        return JSON.stringify(json, null, 2)
}

// --- template-literal helpers ---------------------------------------------
// Minimal dedent: strips the common leading-tab/space indentation so fixtures
// can be written inline without pulling in the `dedent` package.
function dedent(strings: TemplateStringsArray | string, ...values: unknown[]): string {
        const raw = typeof strings === 'string' ? [strings] : strings.raw
        let result = ''
        for (let i = 0; i < raw.length; i++) {
                result += raw[i].replace(/\\\n[ \t]*/g, '').replace(/\\`/g, '`')
                if (i < values.length) result += String(values[i])
        }
        const lines = result.split('\n')
        let min = Infinity
        for (const line of lines) {
                if (line.trim().length === 0) continue
                const indent = line.match(/^[ \t]*/)?.[0].length ?? 0
                if (indent < min) min = indent
        }
        if (min === Infinity) min = 0
        return lines
                .map((line) => line.slice(min))
                .join('\n')
                .replace(/^\n+/, '')
                .replace(/\s+$/, '\n')
}

export const css = dedent
export const html = dedent
export const ts = dedent
export const tsx = dedent
export const js = dedent
export const jsx = dedent
export const json = dedent
export const yaml = dedent
export const txt = dedent
export const astro = dedent
export const svelte = dedent
export const vue = dedent
export const marko = dedent

// --- retry / port / process helpers ---------------------------------------
export async function retryAssertion<T>(fn: () => Promise<T>, { timeout = ASSERTION_TIMEOUT, delay = 50 }: { timeout?: number; delay?: number } = {}) {
        const end = Date.now() + timeout
        let error: any
        while (Date.now() < end) {
                try {
                        return await fn()
                } catch (err) {
                        error = err
                        await new Promise((resolve) => setTimeout(resolve, delay))
                }
        }
        throw error
}

export async function getRandomPort() {
        return new Promise<number>((resolve, reject) => {
                const server = createServer()
                server.unref()
                server.on('error', reject)
                server.listen(0, '127.0.0.1', () => {
                        const address = server.address()
                        server.close(() => {
                                if (address && typeof address === 'object') resolve(address.port)
                                else reject(new Error('Unable to allocate random port'))
                        })
                })
        })
}

async function killProcessTree(child: ChildProcess) {
        if (child.exitCode !== null || child.signalCode !== null || child.pid === undefined) return
        if (IS_WINDOWS) {
                await execFileAsync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { timeout: ASSERTION_TIMEOUT, windowsHide: true }).catch(() => {})
                return
        }
        try {
                process.kill(-child.pid, 'SIGTERM')
        } catch (error: any) {
                if (error?.code !== 'ESRCH') child.kill()
        }
}

function forceKillProcessTree(child: ChildProcess) {
        if (child.exitCode !== null || child.signalCode !== null || child.pid === undefined) return
        if (IS_WINDOWS) {
                execFile('taskkill', ['/pid', String(child.pid), '/T', '/F'], { windowsHide: true }, () => {})
                return
        }
        try {
                process.kill(-child.pid, 'SIGKILL')
        } catch (error: any) {
                if (error?.code !== 'ESRCH') child.kill('SIGKILL')
        }
}

async function gracefullyRemove(dir: string) {
        if (process.env.CI) return
        await fs.rm(dir, { recursive: true, force: true }).catch(() => {})
}

// --- file-system glob (no fast-glob) --------------------------------------
// Supports `**` (any depth) and `*` (single segment) globs, which is all the
// integration tests need.
async function globFiles(root: string, pattern: string): Promise<string[]> {
        const regex = globToRegExp(pattern)
        const out: string[] = []
        async function walk(dir: string) {
                let entries: import('node:fs').Dirent[]
                try {
                        entries = await fs.readdir(dir, { withFileTypes: true })
                } catch {
                        return
                }
                for (const entry of entries) {
                        if (entry.name === 'node_modules' || entry.name === '.git') continue
                        const abs = path.join(dir, entry.name)
                        const rel = path.relative(root, abs).split(path.sep).join('/')
                        if (entry.isDirectory()) await walk(abs)
                        else if (regex.test(rel)) out.push(rel)
                }
        }
        await walk(root)
        return out.sort()
}

function globToRegExp(pattern: string): RegExp {
        let re = ''
        for (let i = 0; i < pattern.length; i++) {
                const c = pattern[i]
                if (c === '*') {
                        if (pattern[i + 1] === '*') {
                                // `**/` matches any number of path segments (including none).
                                if (pattern[i + 2] === '/') {
                                        re += '(?:.*/)?'
                                        i += 2
                                } else {
                                        re += '.*'
                                        i += 1
                                }
                        } else {
                                re += '[^/]*'
                        }
                } else if ('.+?^${}()|[]\\'.includes(c)) {
                        re += `\\${c}`
                } else {
                        re += c
                }
        }
        return new RegExp(`^${re}$`)
}

// --- HTML / CSS observation -----------------------------------------------
const LINK_RE = /<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi
const HREF_RE = /href=["']([^"']+)["']/i
const STYLE_RE = /<style\b[^>]*>([\s\S]*?)<\/style>/gi
export interface ClassScannerOptions {
        /** Class prefix to scan for. Defaults to the public default prefix used by the fixtures. */
        prefix?: string
}

function escapeRegExp(value: string) {
        return value.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
}

function classTokenRe({ prefix = 'tcss' }: ClassScannerOptions = {}) {
        return new RegExp(`\\b(${escapeRegExp(prefix)}-[a-zA-Z0-9_-]+)\\b`, 'g')
}

function classSelectorRe({ prefix = 'tcss' }: ClassScannerOptions = {}) {
        return new RegExp(`\\.(${escapeRegExp(prefix)}-[a-zA-Z0-9_-]+)\\s*[,\\{]`, 'g')
}

function normalizeBase(base: string) {
        while (base.endsWith('/')) base = base.slice(0, -1)
        return base
}

/** Fetch a page and return every stylesheet reachable from it, concatenated. */
export async function fetchStyles(base: string, route = '/'): Promise<string> {
        base = normalizeBase(base)
        const res = await fetch(`${base}${route}`)
        const page = await res.text()
        const sheets: string[] = []

        const hrefs: string[] = []
        for (const link of page.match(LINK_RE) ?? []) {
                const href = link.match(HREF_RE)?.[1]
                if (href) hrefs.push(href)
        }
        sheets.push(
                ...(await Promise.all(
                        hrefs.map(async (href) => {
                                const url = href.startsWith('http') ? href : `${base}${href.startsWith('/') ? '' : '/'}${href.replace(/^\.\//, '')}`
                                const css = await fetch(url, { headers: { Accept: 'text/css' } })
                                return css.ok ? await css.text() : ''
                        }),
                )),
        )
        for (const match of page.matchAll(STYLE_RE)) sheets.push(match[1])
        return sheets.join('\n')
}

export async function fetchPage(base: string, route = '/'): Promise<string> {
        const res = await fetch(`${normalizeBase(base)}${route}`)
        return res.text()
}

/** All `tcss-*` class tokens that appear in a string (HTML, CSS or JS). */
export function collectClasses(source: string, options: ClassScannerOptions = {}): string[] {
        const out = new Set<string>()
        for (const match of source.matchAll(classTokenRe(options))) out.add(match[1])
        return [...out]
}

/** Class names that have a `.tcss-…{…}` rule in the given CSS text. */
export function definedClasses(css: string, options: ClassScannerOptions = {}): Set<string> {
        const out = new Set<string>()
        for (const match of css.matchAll(classSelectorRe(options))) out.add(match[1])
        return out
}

// --- class-reference scanner ----------------------------------------------
// Cross-checks the `tcss-*` classes *referenced* by a payload (HTML or emitted
// JavaScript) against the classes actually *defined* by one or more
// stylesheets. Both directions are surfaced so a caller can fail on dangling
// references (a referenced class with no rule) while merely *observing*
// unreferenced rules, without asserting an exact rule count — matching the
// "差集合" reference checks in the rollup / next prompts.
export interface ClassReferenceReport {
        /** Every distinct `tcss-*` class referenced across the input sources. */
        referenced: string[]
        /** Every distinct `tcss-*` class with a `.tcss-…{…}` rule across the sheets. */
        defined: string[]
        /** Referenced classes that have no matching rule (treat as failure). */
        dangling: string[]
        /** Defined rules that nothing references (observe only, do not fix a count). */
        unreferenced: string[]
}

export function scanClassReferences(referencingSources: string | string[], stylesheets: string | string[], options: ClassScannerOptions = {}): ClassReferenceReport {
        const refSources = Array.isArray(referencingSources) ? referencingSources : [referencingSources]
        const sheets = Array.isArray(stylesheets) ? stylesheets : [stylesheets]
        const referenced = new Set<string>()
        for (const src of refSources) for (const c of collectClasses(src, options)) referenced.add(c)
        const defined = new Set<string>()
        for (const sheet of sheets) for (const c of definedClasses(sheet, options)) defined.add(c)
        const dangling = [...referenced].filter((c) => !defined.has(c))
        const unreferenced = [...defined].filter((c) => !referenced.has(c))
        return { referenced: [...referenced], defined: [...defined], dangling, unreferenced }
}

/** Convenience: just the referenced classes that resolve to no rule. */
export function danglingClassReferences(referencingSources: string | string[], stylesheets: string | string[], options: ClassScannerOptions = {}): string[] {
        return scanClassReferences(referencingSources, stylesheets, options).dangling
}

// --- artifact scanner -----------------------------------------------------
// Walks a set of `[relativePath, content]` artifact pairs (the shape returned
// by `context.fs.readAll(pattern)`) and collects invalid CSS declarations per
// file. Cross-file class-reference checking stays in `scanClassReferences`,
// because the HTML/CSS split is the caller's decision, not this scanner's.
export interface ArtifactReport {
        /** Relative paths of every scanned artifact. */
        files: string[]
        /** `[file, declaration]` pairs whose value is undefined / null / [object Object]. */
        invalidDeclarations: [string, string][]
}

export function scanArtifacts(artifacts: [string, string][]): ArtifactReport {
        const files: string[] = []
        const invalid: [string, string][] = []
        for (const [file, content] of artifacts) {
                files.push(file)
                for (const decl of invalidDeclarations(content)) invalid.push([file, decl])
        }
        return { files, invalidDeclarations: invalid }
}

/**
 * Scan a CSS / HTML-style payload for invalid declaration values. React's
 * `$undefined` protocol marker is explicitly ignored — only CSS declarations or
 * inline `style` attributes that contain `property:undefined`, `property:null`
 * or `[object Object]` are reported.
 */
export function invalidDeclarations(source: string): string[] {
        const bad: string[] = []
        // inline style attributes: style="a:b;c:d"
        for (const match of source.matchAll(/style=["']([^"']*)["']/gi)) {
                for (const decl of match[1].split(';')) {
                        const value = decl.split(':').slice(1).join(':').trim()
                        if (value === 'undefined' || value === 'null' || value === '[object Object]') bad.push(decl.trim())
                }
        }
        // CSS rule bodies: { a:b; c:d }
        for (const match of source.matchAll(/\{([^{}]*)\}/g)) {
                for (const decl of match[1].split(';')) {
                        if (!decl.includes(':')) continue
                        const value = decl.split(':').slice(1).join(':').trim()
                        if (value === 'undefined' || value === 'null' || value === '[object Object]') bad.push(decl.trim())
                }
        }
        return bad
}

/** Extract the inline `style` attribute string of the element bearing `marker`. */
export function inlineStyleOf(html: string, marker: string): string | null {
        const idx = html.indexOf(marker)
        if (idx < 0) return null
        // Search backwards for the opening `<` of the element that contains marker.
        const open = html.lastIndexOf('<', idx)
        if (open < 0) return null
        const tag = html.slice(open, html.indexOf('>', open) + 1)
        const style = tag.match(/style=["']([^"']*)["']/i)
        return style ? style[1] : null
}

/** Parse a `a:b;c:d` declaration string into a normalized property→value map. */
export function parseDeclarations(text: string): Record<string, string> {
        const out: Record<string, string> = {}
        for (const decl of text.split(';')) {
                if (!decl.includes(':')) continue
                const [prop, ...rest] = decl.split(':')
                out[prop.trim()] = rest.join(':').trim()
        }
        return out
}

/**
 * Resolve the effective declarations for a marker class by merging every
 * `.<class>{…}` base rule found across the provided stylesheets.
 */
export function declarationsForClass(css: string, className: string): Record<string, string> {
        const out: Record<string, string> = {}
        const re = new RegExp(`\\.${className.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\s*\\{([^{}]*)\\}`, 'g')
        for (const match of css.matchAll(re)) Object.assign(out, parseDeclarations(match[1]))
        return out
}

// --- source map decoding (dependency-free VLQ) ----------------------------
// A minimal source-map reader so the React source-map case can assert that the
// generated marker position maps back into the original component source,
// without pulling in `source-map-js`.

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
const B64_MAP: Record<string, number> = Object.fromEntries([...B64].map((c, i) => [c, i]))

function decodeVlq(segment: string): number[] {
        const values: number[] = []
        let shift = 0
        let value = 0
        for (const ch of segment) {
                const digit = B64_MAP[ch]
                const cont = digit & 0b100000
                value += (digit & 0b011111) << shift
                if (cont) {
                        shift += 5
                } else {
                        const negative = value & 1
                        value >>= 1
                        values.push(negative ? (value === 0 ? -0x80000000 : -value) : value)
                        shift = 0
                        value = 0
                }
        }
        return values
}

export interface DecodedMapping {
        /** 1-based line in the generated file. */
        generatedLine: number
        /** 0-based column in the generated file. */
        generatedColumn: number
        /** source file path (from the map `sources` array), if any. */
        source: string | null
        /** 1-based line in the original source, if any. */
        originalLine: number | null
        /** 0-based column in the original source, if any. */
        originalColumn: number | null
}

export interface DecodedSourceMap {
        sources: string[]
        mappings: DecodedMapping[]
        /** Find the mapping nearest to (and not after) the given generated position. */
        originalPositionFor(generatedLine: number, generatedColumn: number): DecodedMapping | null
}

/** Decode the `mappings` field of a raw source map (string or object). */
export function decodeSourceMap(raw: string | { sources: string[]; mappings: string }): DecodedSourceMap {
        const map = typeof raw === 'string' ? JSON.parse(raw) : raw
        const sources: string[] = map.sources ?? []
        const mappings: DecodedMapping[] = []

        let sourceIndex = 0
        let originalLine = 0
        let originalColumn = 0

        const lines = (map.mappings as string).split(';')
        for (let line = 0; line < lines.length; line++) {
                let generatedColumn = 0
                for (const segment of lines[line].split(',')) {
                        if (!segment) continue
                        const fields = decodeVlq(segment)
                        generatedColumn += fields[0]
                        const mapping: DecodedMapping = {
                                generatedLine: line + 1,
                                generatedColumn,
                                source: null,
                                originalLine: null,
                                originalColumn: null,
                        }
                        if (fields.length >= 4) {
                                sourceIndex += fields[1]
                                originalLine += fields[2]
                                originalColumn += fields[3]
                                mapping.source = sources[sourceIndex] ?? null
                                mapping.originalLine = originalLine + 1
                                mapping.originalColumn = originalColumn
                        }
                        mappings.push(mapping)
                }
        }

        return {
                sources,
                mappings,
                originalPositionFor(generatedLine, generatedColumn) {
                        let best: DecodedMapping | null = null
                        for (const mapping of mappings) {
                                if (mapping.generatedLine !== generatedLine) continue
                                if (mapping.generatedColumn > generatedColumn) continue
                                if (!best || mapping.generatedColumn > best.generatedColumn) best = mapping
                        }
                        return best
                },
        }
}

const INLINE_JS_MAP = /\/\/#\s*sourceMappingURL=data:application\/json;(?:charset=[^;]+;)?base64,([A-Za-z0-9+/=]+)/

/** Decode an inline `//# sourceMappingURL=…;base64,…` comment from generated JS. */
export function decodeInlineSourceMap(code: string): DecodedSourceMap | null {
        const match = code.match(INLINE_JS_MAP)
        if (!match) return null
        const json = Buffer.from(match[1], 'base64').toString('utf8')
        return decodeSourceMap(json)
}
