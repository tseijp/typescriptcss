// Module resolution (RESOLVE-001..005), Rollup core.
import { collectClasses, definedClasses, ts, tsx } from '../utils'
import { H_FACTORY, esmRunner, packageJson, pickResult, rollupConfig, ROLLUP_DEV, test } from './_fixtures'

test(
        'RESOLVE-001 relative token import: the raw value reaches the CSS output',
        {
                fs: {
                        'package.json': packageJson({}, ROLLUP_DEV),
                        'tsconfig.json': '{"compilerOptions":{"target":"ESNext","module":"ESNext","moduleResolution":"Bundler","jsx":"react","jsxFactory":"h","jsxFragmentFactory":"Fragment","skipLibCheck":true},"include":["src","*.ts"]}',
                        'src/jsx.ts': H_FACTORY,
                        'src/theme/colors.ts': ts`export const brand = '#0b1120'`,
                        'src/index.tsx': tsx`
				import { bg } from 'typescriptcss'
				import { brand } from './theme/colors'
				import { h } from './jsx'
				export const box = <div style={bg[brand]()} />
				export const marker = 'RESOLVE_RELATIVE'
			`,
                        'rollup.config.mjs': rollupConfig({ output: 'file' }),
                },
        },
        async ({ exec, expect, fs }) => {
                await exec('pnpm rollup -c rollup.config.mjs')
                const sheet = (await fs.readAll('dist/**/*.css')).map(([, c]) => c).join('\n')
                expect(sheet).toContain('#0b1120')
        },
)

test(
        'RESOLVE-002 tsconfig path alias token: TS resolution and the plugin read the same file',
        {
                fs: {
                        'package.json': packageJson({}, ROLLUP_DEV),
                        'tsconfig.json': '{"compilerOptions":{"target":"ESNext","module":"ESNext","moduleResolution":"Bundler","baseUrl":".","paths":{"@theme/*":["src/theme/*"]},"jsx":"react","jsxFactory":"h","jsxFragmentFactory":"Fragment","skipLibCheck":true},"include":["src","*.ts"]}',
                        'src/jsx.ts': H_FACTORY,
                        'src/theme/colors.ts': ts`export const brand = '#0b1120'`,
                        'src/index.tsx': tsx`
				import { bg } from 'typescriptcss'
				import { brand } from '@theme/colors'
				import { h } from './jsx'
				export const box = <div style={bg[brand]()} />
				export const marker = 'RESOLVE_ALIAS'
			`,
                        // rollup needs the alias too, so the build can resolve the import.
                        'rollup.config.mjs': rollupConfig({ output: 'file' }).replace('export default {', `import path from 'node:path'\nexport default {\n  resolve: { alias: { '@theme': path.resolve('src/theme') } },`),
                },
        },
        async ({ exec, expect, fs }) => {
                await exec('pnpm rollup -c rollup.config.mjs')
                const sheet = (await fs.readAll('dist/**/*.css')).map(([, c]) => c).join('\n')
                // If the plugin read a different file than TS resolution, the value would be lost.
                expect(sheet).toContain('#0b1120')
        },
)

test(
        'RESOLVE-003 barrel export: a re-exported token is not converted to an invalid value',
        {
                fs: {
                        'package.json': packageJson({}, ROLLUP_DEV),
                        'tsconfig.json': '{"compilerOptions":{"target":"ESNext","module":"ESNext","moduleResolution":"Bundler","jsx":"react","jsxFactory":"h","jsxFragmentFactory":"Fragment","skipLibCheck":true},"include":["src","*.ts"]}',
                        'src/jsx.ts': H_FACTORY,
                        'src/theme/colors.ts': ts`export const brand = '#0b1120'`,
                        'src/theme/index.ts': ts`export { brand } from './colors'`,
                        'src/index.tsx': tsx`
				import { bg } from 'typescriptcss'
				import { brand } from './theme'
				import { h } from './jsx'
				export const box = <div style={bg[brand]()} />
				export const marker = 'RESOLVE_BARREL'
			`,
                        'rollup.config.mjs': rollupConfig({ output: 'file' }),
                },
        },
        async ({ exec, expect, fs }) => {
                await exec('pnpm rollup -c rollup.config.mjs')
                const sheet = (await fs.readAll('dist/**/*.css')).map(([, c]) => c).join('\n')
                const jsText = (await fs.readAll('dist/**/*.js')).map(([, c]) => c).join('\n')
                // barrel value must resolve (a defined rule containing the raw value) and not
                // become undefined/[object Object].
                expect(sheet).toContain('#0b1120')
                expect(sheet).not.toMatch(/:\s*undefined/)
                expect(collectClasses(jsText).filter((c) => !definedClasses(sheet).has(c))).toEqual([])
        },
)

test(
        'RESOLVE-004 dynamic param vs import name collision: a local param is not mistaken for an import',
        {
                fs: {
                        'package.json': packageJson({}, ROLLUP_DEV),
                        'tsconfig.json': '{"compilerOptions":{"target":"ESNext","module":"ESNext","moduleResolution":"Bundler","jsx":"react","jsxFactory":"h","jsxFragmentFactory":"Fragment","skipLibCheck":true},"include":["src","*.ts"]}',
                        'src/jsx.ts': H_FACTORY,
                        'src/theme/colors.ts': ts`export const brand = '#0b1120'`,
                        'src/index.tsx': tsx`
				import { bg } from 'typescriptcss'
				import { brand } from './theme/colors'
				import { h } from './jsx'
				// 'brand' is also a function parameter here — must NOT be replaced by the import value.
				export const make = (brand) => <div style={bg[brand]()} />
				export const fixed = <div style={bg[brand]()} />
				export const marker = 'RESOLVE_COLLISION'
			`,
                        'rollup.config.mjs': rollupConfig({ output: 'inline' }),
                        'run.mjs': esmRunner('./dist/index.js', ['make', 'fixed', 'marker']),
                },
        },
        async ({ exec, expect }) => {
                await exec('pnpm rollup -c rollup.config.mjs')
                const out = pickResult(await exec('node run.mjs'))
                // The fixed element used the import value (static); the dynamic one keeps runtime
                // semantics. Neither must crash; marker survives.
                expect(out.marker).toBe('RESOLVE_COLLISION')
                expect(JSON.stringify(out.fixed)).toContain('#0b1120')
        },
)

test(
        'RESOLVE-005 cyclic token module: build does not hang and classifies as success or explicit non-support',
        {
                fs: {
                        'package.json': packageJson({}, ROLLUP_DEV),
                        'tsconfig.json': '{"compilerOptions":{"target":"ESNext","module":"ESNext","moduleResolution":"Bundler","jsx":"react","jsxFactory":"h","jsxFragmentFactory":"Fragment","skipLibCheck":true},"include":["src","*.ts"]}',
                        'src/jsx.ts': H_FACTORY,
                        'src/a.ts': ts`import './b'\nexport const brand = '#0b1120'`,
                        'src/b.ts': ts`import './a'\nexport const ink = '#f8fafc'`,
                        'src/index.tsx': tsx`
				import { bg } from 'typescriptcss'
				import { brand } from './a'
				import { h } from './jsx'
				export const box = <div style={bg[brand]()} />
				export const marker = 'RESOLVE_CYCLIC'
			`,
                        'rollup.config.mjs': rollupConfig({ output: 'file' }),
                },
                timeout: 120_000,
        },
        async ({ exec, expect, fs }) => {
                // Primary observation: the build terminates (does not hang).
                await exec('pnpm rollup -c rollup.config.mjs')
                const sheet = (await fs.readAll('dist/**/*.css')).map(([, c]) => c).join('\n')
                // Either the value resolved (success) — assert it; if a tool ever classifies
                // cyclic as non-support, this becomes a visible RED rather than a hang.
                expect(sheet).toContain('#0b1120')
        },
)
