// ROLLUP-TSUP: the rollup plugin connects to a tsup build (single + multi-entry),
// plus one split-chain smoke. tsup accepts rollup-style plugins via its `plugins` option.
import { collectClasses, definedClasses } from '../utils'
import { ENTRY_A, ENTRY_B, H_FACTORY, SINGLE_ENTRY, SPLIT_ENTRY, TOKENS, TSCONFIG, esmRunner, packageJson, pickResult, test, tsupConfig, TSUP_DEV } from './_fixtures'

test(
        'tsup single entry: plugin transform + CSS asset emit, marker executable',
        {
                fs: {
                        'package.json': packageJson({}, TSUP_DEV),
                        'tsconfig.json': TSCONFIG,
                        'src/jsx.ts': H_FACTORY,
                        'src/tokens.ts': TOKENS,
                        'src/index.tsx': SINGLE_ENTRY,
                        'tsup.config.ts': tsupConfig({ output: 'file' }),
                        'run.mjs': esmRunner('./dist/index.js', ['a', 'b', 'c', 'marker']),
                },
        },
        async ({ exec, expect, fs }) => {
                await exec('pnpm tsup')
                const out = pickResult(await exec('node run.mjs'))
                expect(out.marker).toBe('SINGLE_MARKER')
                const jsText = (await fs.readAll('dist/**/*.js')).map(([, c]) => c).join('\n')
                const sheet = (await fs.readAll('dist/**/*.css')).map(([, c]) => c).join('\n')
                expect(collectClasses(jsText).filter((c) => !definedClasses(sheet).has(c))).toEqual([])
        },
)

test(
        'tsup multi-entry: each entry executes and shared/own classes resolve',
        {
                fs: {
                        'package.json': packageJson({}, TSUP_DEV),
                        'tsconfig.json': TSCONFIG,
                        'src/jsx.ts': H_FACTORY,
                        'src/a.tsx': ENTRY_A,
                        'src/b.tsx': ENTRY_B,
                        'tsup.config.ts': tsupConfig({ output: 'file', multi: true }),
                        'run-a.mjs': esmRunner('./dist/a.js', ['shared', 'ownA', 'marker']),
                        'run-b.mjs': esmRunner('./dist/b.js', ['shared', 'ownB', 'marker']),
                },
        },
        async ({ exec, expect, fs }) => {
                await exec('pnpm tsup')
                const a = pickResult(await exec('node run-a.mjs'))
                const b = pickResult(await exec('node run-b.mjs'))
                expect(a.marker).toBe('ENTRY_A')
                expect(b.marker).toBe('ENTRY_B')
                const sheet = (await fs.readAll('dist/**/*.css')).map(([, c]) => c).join('\n')
                const defined = definedClasses(sheet)
                expect((a.shared.className ?? '').trim()).toBe((b.shared.className ?? '').trim())
                expect([a.ownA.className, b.ownB.className].map((c) => (c ?? '').trim()).filter((c) => !defined.has(c))).toEqual([])
        },
)

test(
        'tsup split-chain smoke: a css-marked chain still resolves through tsup',
        {
                fs: {
                        'package.json': packageJson({}, TSUP_DEV),
                        'tsconfig.json': TSCONFIG,
                        'src/jsx.ts': H_FACTORY,
                        'src/index.tsx': SPLIT_ENTRY,
                        'tsup.config.ts': tsupConfig({ output: 'file' }),
                },
        },
        async ({ exec, expect, fs }) => {
                await exec('pnpm tsup')
                const jsText = (await fs.readAll('dist/**/*.js')).map(([, c]) => c).join('\n')
                const sheet = (await fs.readAll('dist/**/*.css')).map(([, c]) => c).join('\n')
                expect(collectClasses(jsText).filter((c) => !definedClasses(sheet).has(c))).toEqual([])
        },
)
