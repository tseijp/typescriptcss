// ROLLUP-TSDOWN: the rollup plugin connects to a tsdown build (single, multi-entry,
// watch), plus one split-chain smoke. tsdown forwards rollup-style plugins.
import { collectClasses, definedClasses, retryAssertion } from '../utils'
import { ENTRY_A, ENTRY_B, H_FACTORY, SINGLE_ENTRY, SPLIT_ENTRY, TOKENS, TSCONFIG, esmRunner, packageJson, pickResult, test, tsdownConfig, TSDOWN_DEV } from './_fixtures'

test(
        'tsdown single entry: plugin transform + CSS asset emit, marker executable',
        {
                fs: {
                        'package.json': packageJson({}, TSDOWN_DEV),
                        'tsconfig.json': TSCONFIG,
                        'src/jsx.ts': H_FACTORY,
                        'src/tokens.ts': TOKENS,
                        'src/index.tsx': SINGLE_ENTRY,
                        'tsdown.config.ts': tsdownConfig({ output: 'file' }),
                        'run.mjs': esmRunner('./dist/index.js', ['a', 'b', 'c', 'marker']),
                },
        },
        async ({ exec, expect, fs }) => {
                await exec('pnpm tsdown')
                const out = pickResult(await exec('node run.mjs'))
                expect(out.marker).toBe('SINGLE_MARKER')
                const jsText = (await fs.readAll('dist/**/*.js')).map(([, c]) => c).join('\n')
                const sheet = (await fs.readAll('dist/**/*.css')).map(([, c]) => c).join('\n')
                expect(collectClasses(jsText).filter((c) => !definedClasses(sheet).has(c))).toEqual([])
        },
)

test(
        'tsdown multi-entry: each entry executes and shared/own classes resolve',
        {
                fs: {
                        'package.json': packageJson({}, TSDOWN_DEV),
                        'tsconfig.json': TSCONFIG,
                        'src/jsx.ts': H_FACTORY,
                        'src/a.tsx': ENTRY_A,
                        'src/b.tsx': ENTRY_B,
                        'tsdown.config.ts': tsdownConfig({ output: 'file', multi: true }),
                        'run-a.mjs': esmRunner('./dist/a.js', ['shared', 'ownA', 'marker']),
                        'run-b.mjs': esmRunner('./dist/b.js', ['shared', 'ownB', 'marker']),
                },
        },
        async ({ exec, expect, fs }) => {
                await exec('pnpm tsdown')
                const a = pickResult(await exec('node run-a.mjs'))
                const b = pickResult(await exec('node run-b.mjs'))
                expect(a.marker).toBe('ENTRY_A')
                expect(b.marker).toBe('ENTRY_B')
                const sheet = (await fs.readAll('dist/**/*.css')).map(([, c]) => c).join('\n')
                expect((a.shared.className ?? '').trim()).toBe((b.shared.className ?? '').trim())
        },
)

test(
        'tsdown split-chain smoke: a css-marked chain resolves through tsdown',
        {
                fs: {
                        'package.json': packageJson({}, TSDOWN_DEV),
                        'tsconfig.json': TSCONFIG,
                        'src/jsx.ts': H_FACTORY,
                        'src/index.tsx': SPLIT_ENTRY,
                        'tsdown.config.ts': tsdownConfig({ output: 'file' }),
                },
        },
        async ({ exec, expect, fs }) => {
                await exec('pnpm tsdown')
                const jsText = (await fs.readAll('dist/**/*.js')).map(([, c]) => c).join('\n')
                const sheet = (await fs.readAll('dist/**/*.css')).map(([, c]) => c).join('\n')
                expect(collectClasses(jsText).filter((c) => !definedClasses(sheet).has(c))).toEqual([])
        },
)

test(
        'tsdown watch: editing a raw value rebuilds without dangling references',
        {
                fs: {
                        'package.json': packageJson({}, TSDOWN_DEV),
                        'tsconfig.json': TSCONFIG,
                        'src/jsx.ts': H_FACTORY,
                        'src/index.tsx': SINGLE_ENTRY,
                        'src/tokens.ts': TOKENS,
                        'tsdown.config.ts': tsdownConfig({ output: 'file' }),
                },
        },
        async ({ exec, expect, fs, spawn }) => {
                const watcher = await spawn('pnpm tsdown --watch')
                await watcher.onStdout((m) => /build complete|completed|✔|done/i.test(m))
                await retryAssertion(async () => {
                        const sheet = (await fs.readAll('dist/**/*.css')).map(([, c]) => c).join('\n')
                        expect(sheet).toContain('#0b1120')
                })

                watcher.flush()
                await fs.write('src/tokens.ts', TOKENS.replace('#0b1120', '#abcdef'))
                await watcher.onStdout((m) => /build complete|completed|✔|done/i.test(m))

                await retryAssertion(async () => {
                        const jsText = (await fs.readAll('dist/**/*.js')).map(([, c]) => c).join('\n')
                        const sheet = (await fs.readAll('dist/**/*.css')).map(([, c]) => c).join('\n')
                        expect(sheet).toContain('#abcdef')
                        expect(collectClasses(jsText).filter((c) => !definedClasses(sheet).has(c))).toEqual([])
                })
                await watcher.dispose()
        },
)
