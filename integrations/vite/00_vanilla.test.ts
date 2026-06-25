// VITE-VANILLA — production build, three output modes, marker render.
//
// Vanilla has no JSX. The plugin only rewrites JSX `style` attributes, so for a
// vanilla DOM entry the head/file collection has nothing to rewrite. inline mode
// is a no-op (the runtime call yields a plain object applied at runtime) and is
// expected to render the marker; head/file are expected RED for vanilla until the
// plugin can collect from non-JSX `el.style` assignment.
import { MARKER, RAW_VALUE, assertNoInvalid, expectResolved, fetchPage, fetchStyles, pkg, retryAssertion, test, vanilla, viteConfig } from './_fixtures'

test(
        'VITE-VANILLA inline: build succeeds and the marker element renders the runtime style',
        {
                fs: {
                        'package.json': pkg(vanilla.deps),
                        'vite.config.ts': viteConfig({ output: 'inline' }),
                        ...vanilla.files(),
                },
        },
        async ({ exec, expect, fs }) => {
                await exec('pnpm vite build')
                // inline: no dedicated CSS asset required; the marker is set at runtime.
                const builtJs = (await fs.readAll('dist/**/*.js')).map(([, c]) => c).join('\n')
                expect(builtJs).toContain(MARKER)
                expect(builtJs).toContain(RAW_VALUE)
                assertNoInvalid(expect, builtJs)
        },
)

test(
        'VITE-VANILLA head: dev server serves the marker and a reachable stylesheet',
        {
                fs: {
                        'package.json': pkg(vanilla.deps),
                        'vite.config.ts': viteConfig({ output: 'head' }),
                        ...vanilla.files(),
                },
        },
        async ({ spawn, expect }) => {
                const server = await spawn('pnpm vite --port 0')
                let url = ''
                await server.onStdout((m) => ((url = m.match(/https?:\/\/[^\s]+/)?.[0] ?? url), url !== ''))
                await retryAssertion(async () => {
                        const page = await fetchPage(url, '/')
                        expect(page).toContain('id="app"')
                        // RED expectation: the collected style must be reachable. For a vanilla
                        // (non-JSX) source there is no JSX `style` attribute to rewrite, so head
                        // collection currently produces nothing — this surfaces the gap.
                        const sheet = await fetchStyles(url, '/')
                        expectResolved(expect, page, sheet)
                        assertNoInvalid(expect, sheet)
                })
                await server.dispose()
        },
)

test(
        'VITE-VANILLA file: production build emits a reachable CSS asset for collected styles',
        {
                fs: {
                        'package.json': pkg(vanilla.deps),
                        'vite.config.ts': viteConfig({ output: 'file' }),
                        ...vanilla.files(),
                },
        },
        async ({ exec, expect, fs }) => {
                await exec('pnpm vite build')
                const htmlText = await fs.read('dist/index.html')
                const sheet = (await fs.readAll('dist/**/*.css')).map(([, c]) => c).join('\n')
                // RED expectation: marker class referenced and resolved in the asset.
                expectResolved(expect, htmlText, sheet)
                assertNoInvalid(expect, sheet)
        },
)
