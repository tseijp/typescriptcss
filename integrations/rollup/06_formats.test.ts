// FORMAT-CJS and FORMAT-DTS (single entry).
import { collectClasses, definedClasses } from '../utils'
import { H_FACTORY, SINGLE_ENTRY, TOKENS, TSCONFIG, cjsRunner, packageJson, pickResult, rollupConfig, ROLLUP_DEV, test, tsdownConfig } from './_fixtures'

const NAMES = ['a', 'b', 'c', 'marker']

test(
        'FORMAT-CJS: a require-able CJS entry executes and resolves its classes',
        {
                fs: {
                        'package.json': packageJson({}, ROLLUP_DEV),
                        'tsconfig.json': TSCONFIG,
                        'src/jsx.ts': H_FACTORY,
                        'src/tokens.ts': TOKENS,
                        'src/index.tsx': SINGLE_ENTRY,
                        'rollup.config.mjs': rollupConfig({ output: 'file', format: 'cjs' }),
                        'run.cjs': cjsRunner('./dist/index.cjs', NAMES),
                },
        },
        async ({ exec, expect, fs }) => {
                await exec('pnpm rollup -c rollup.config.mjs')
                const out = pickResult(await exec('node run.cjs'))
                expect(out.marker).toBe('SINGLE_MARKER')
                const jsText = (await fs.readAll('dist/**/*.cjs')).map(([, c]) => c).join('\n')
                const sheet = (await fs.readAll('dist/**/*.css')).map(([, c]) => c).join('\n')
                expect(collectClasses(jsText).filter((c) => !definedClasses(sheet).has(c))).toEqual([])
        },
)

test(
        'FORMAT-DTS: the transform does not break a tool that emits TypeScript declarations',
        {
                fs: {
                        'package.json': packageJson({}, { ...ROLLUP_DEV, typescript: '^5' }),
                        'tsconfig.json': TSCONFIG,
                        'src/jsx.ts': H_FACTORY,
                        'src/tokens.ts': TOKENS,
                        'src/index.tsx': SINGLE_ENTRY,
                        'tsdown.config.ts': tsdownConfig({ output: 'file' }).replace('dts: false', 'dts: true'),
                },
        },
        async ({ exec, expect, fs }) => {
                await exec('pnpm tsdown')
                const dts = await fs.glob('dist/**/*.d.ts')
                expect(dts.length).toBeGreaterThan(0)
                const decl = (await fs.readAll('dist/**/*.d.ts')).map(([, c]) => c).join('\n')
                expect(decl).toMatch(/marker/)
        },
)
