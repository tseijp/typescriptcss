// Plugin options (OPTION-001..006), Rollup core representative build.
import { collectClasses, definedClasses } from '../utils'
import { ENTRY_A, ENTRY_B, H_FACTORY, SINGLE_ENTRY, TOKENS, TSCONFIG, esmRunner, packageJson, pickResult, rollupConfig, ROLLUP_DEV, test } from './_fixtures'

test(
        'OPTION-001/002 include & exclude: only targeted modules are transformed',
        {
                fs: {
                        'package.json': packageJson({}, ROLLUP_DEV),
                        'tsconfig.json': TSCONFIG,
                        'src/jsx.ts': H_FACTORY,
                        'src/a.tsx': ENTRY_A,
                        'src/b.tsx': ENTRY_B,
                        // include only a.tsx; b.tsx must keep its original JS meaning (style object).
                        'rollup.config.mjs': rollupConfig({ output: 'file', multi: true, pluginExtra: 'include: /a\\.tsx$/' }),
                        'run-a.mjs': esmRunner('./dist/a.js', ['shared', 'marker']),
                        'run-b.mjs': esmRunner('./dist/b.js', ['shared', 'marker']),
                },
        },
        async ({ exec, expect }) => {
                await exec('pnpm rollup -c rollup.config.mjs')
                const a = pickResult(await exec('node run-a.mjs'))
                const b = pickResult(await exec('node run-b.mjs'))
                // a.tsx transformed → class reference; b.tsx untouched → inline style object survives.
                expect(a.shared.className ?? '').toMatch(/tcss-/)
                expect(b.shared.className).toBeUndefined()
                expect(JSON.stringify(b.shared)).toContain('column')
        },
)

test(
        'OPTION-003 classPrefix: JS reference and CSS selector share the prefix',
        {
                fs: {
                        'package.json': packageJson({}, ROLLUP_DEV),
                        'tsconfig.json': TSCONFIG,
                        'src/jsx.ts': H_FACTORY,
                        'src/tokens.ts': TOKENS,
                        'src/index.tsx': SINGLE_ENTRY,
                        'rollup.config.mjs': rollupConfig({ output: 'file', pluginExtra: "classPrefix: 'xyz'" }),
                },
        },
        async ({ exec, expect, fs }) => {
                await exec('pnpm rollup -c rollup.config.mjs')
                const jsText = (await fs.readAll('dist/**/*.js')).map(([, c]) => c).join('\n')
                const sheet = (await fs.readAll('dist/**/*.css')).map(([, c]) => c).join('\n')
                const refs = collectClasses(jsText, { prefix: 'xyz' })
                expect(refs.length).toBeGreaterThan(0)
                expect(refs.every((c) => c.startsWith('xyz-'))).toBe(true)
                const defined = definedClasses(sheet, { prefix: 'xyz' })
                expect(refs.filter((c) => !defined.has(c))).toEqual([])
                // no leftover default-prefix classes.
                expect(collectClasses(jsText, { prefix: 'tcss' })).toEqual([])
        },
)

test(
        'OPTION-004 fileName: the named CSS asset is retrievable from rollup output',
        {
                fs: {
                        'package.json': packageJson({}, ROLLUP_DEV),
                        'tsconfig.json': TSCONFIG,
                        'src/jsx.ts': H_FACTORY,
                        'src/tokens.ts': TOKENS,
                        'src/index.tsx': SINGLE_ENTRY,
                        'rollup.config.mjs': rollupConfig({ output: 'file', pluginExtra: "fileName: 'styles/app.css'" }),
                },
        },
        async ({ exec, expect, fs }) => {
                await exec('pnpm rollup -c rollup.config.mjs')
                expect(await fs.exists('dist/styles/app.css')).toBe(true)
        },
)

test(
        'OPTION-005 minify: turning minify off preserves the same declaration meaning',
        {
                fs: {
                        'package.json': packageJson({}, ROLLUP_DEV),
                        'tsconfig.json': TSCONFIG,
                        'src/jsx.ts': H_FACTORY,
                        'src/tokens.ts': TOKENS,
                        'src/index.tsx': SINGLE_ENTRY,
                        'rollup.min.mjs': rollupConfig({ output: 'file', pluginExtra: 'minify: true' }).replace("dir: 'dist'", "dir: 'dist-min'"),
                        'rollup.pretty.mjs': rollupConfig({ output: 'file', pluginExtra: 'minify: false' }).replace("dir: 'dist'", "dir: 'dist-pretty'"),
                },
        },
        async ({ exec, expect, fs }) => {
                await exec('pnpm rollup -c rollup.min.mjs')
                await exec('pnpm rollup -c rollup.pretty.mjs')
                const min = (await fs.readAll('dist-min/**/*.css')).map(([, c]) => c).join('\n')
                const pretty = (await fs.readAll('dist-pretty/**/*.css')).map(([, c]) => c).join('\n')
                // Same raw value present in both regardless of formatting (meaning parity).
                expect(min).toContain('#0b1120')
                expect(pretty).toContain('#0b1120')
                // Same class tokens defined either way.
                expect([...definedClasses(min)].sort()).toEqual([...definedClasses(pretty)].sort())
        },
)

test(
        'OPTION-006 root: relative token import resolves against the fixture root',
        {
                fs: {
                        'package.json': packageJson({}, ROLLUP_DEV),
                        'tsconfig.json': TSCONFIG,
                        'src/jsx.ts': H_FACTORY,
                        'src/tokens.ts': TOKENS,
                        'src/index.tsx': SINGLE_ENTRY,
                        'rollup.config.mjs': rollupConfig({ output: 'file', pluginExtra: 'root: process.cwd()' }),
                },
        },
        async ({ exec, expect, fs }) => {
                await exec('pnpm rollup -c rollup.config.mjs')
                const sheet = (await fs.readAll('dist/**/*.css')).map(([, c]) => c).join('\n')
                // The imported raw token resolved (it would be dropped if root resolution failed).
                expect(sheet).toContain('#0b1120')
        },
)
