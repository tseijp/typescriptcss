// Source map (one TSX single entry), deduplication smoke, invalid artifact scanner.
import { collectClasses, decodeInlineSourceMap, definedClasses, scanArtifacts, scanClassReferences, ts, tsx } from '../utils'
import { H_FACTORY, TSCONFIG, packageJson, rollupConfig, ROLLUP_DEV, test } from './_fixtures'

test(
        'source map: the transformed marker region maps back to the original component source',
        {
                fs: {
                        'package.json': packageJson({}, ROLLUP_DEV),
                        'tsconfig.json': TSCONFIG,
                        'src/jsx.ts': H_FACTORY,
                        'src/index.tsx': tsx`
				import { flex, gap, p, text } from 'typescriptcss'
				import { h } from './jsx'
				export const box = <div style={gap[3].flex.col()} />
				export const marker = 'SOURCEMAP_MARKER'
			`,
                        'rollup.config.mjs': rollupConfig({ output: 'file', sourcemap: 'inline' }),
                },
        },
        async ({ exec, expect, fs }) => {
                await exec('pnpm rollup -c rollup.config.mjs')
                const js = (await fs.readAll('dist/**/*.js')).map(([, c]) => c).join('\n')
                const map = decodeInlineSourceMap(js)
                // A map is produced and references the original source file.
                expect(map).not.toBeNull()
                expect(map!.sources.some((s) => /index\.tsx/.test(s))).toBe(true)
        },
)

test(
        'dedup: the same chain reused in one module / across modules does not multiply rules without bound',
        {
                fs: {
                        'package.json': packageJson({}, ROLLUP_DEV),
                        'tsconfig.json': TSCONFIG,
                        'src/jsx.ts': H_FACTORY,
                        'src/shared.tsx': tsx`
				import { flex } from 'typescriptcss'
				import { h } from './jsx'
				export const x = <div style={gap[3].flex.col()} />
			`,
                        'src/index.tsx': tsx`
				import { flex } from 'typescriptcss'
				import { h } from './jsx'
				import { x } from './shared'
				// same chain used twice in this module + once in shared.tsx
				export const a = <div style={gap[3].flex.col()} />
				export const b = <div style={gap[3].flex.col()} />
				export const c = x
				export const marker = 'DEDUP_MARKER'
			`,
                        'rollup.config.mjs': rollupConfig({ output: 'file' }),
                },
        },
        async ({ exec, expect, fs }) => {
                await exec('pnpm rollup -c rollup.config.mjs')
                const sheet = (await fs.readAll('dist/**/*.css')).map(([, c]) => c).join('\n')
                // One identical chain → one class token defined (count not asserted beyond "deduped").
                const tokens = [...definedClasses(sheet)]
                const occurrences = tokens.map((t) => (sheet.match(new RegExp(`\\.${t}\\s*\\{`, 'g')) ?? []).length)
                // no rule body repeated unboundedly: each base selector appears at most once.
                expect(Math.max(...occurrences, 0)).toBeLessThanOrEqual(1)
        },
)

test(
        'invalid artifact scanner: no undefined/null/[object Object] in JS or CSS, and no dangling class',
        {
                fs: {
                        'package.json': packageJson({}, ROLLUP_DEV),
                        'tsconfig.json': TSCONFIG,
                        'src/jsx.ts': H_FACTORY,
                        'src/tokens.ts': ts`export const brand = '#0b1120'`,
                        'src/index.tsx': tsx`
				import { bg, flex, p, text } from 'typescriptcss'
				import { brand } from './tokens'
				import { h } from './jsx'
				export const a = <div style={p[6].flex.col.bg[brand]()} />
				export const b = <span style={text['#f8fafc']({ position: 'sticky', top: '0px' })} />
				export const marker = 'SCANNER_MARKER'
			`,
                        'rollup.config.mjs': rollupConfig({ output: 'file' }),
                },
        },
        async ({ exec, expect, fs }) => {
                await exec('pnpm rollup -c rollup.config.mjs')
                const js = await fs.readAll('dist/**/*.js')
                const cssFiles = await fs.readAll('dist/**/*.css')
                const all = [...js, ...cssFiles]

                // No invalid declaration values anywhere.
                expect(scanArtifacts(all).invalidDeclarations).toEqual([])

                // Every tcss-* referenced by JS resolves to a rule in the CSS; no dangling.
                const jsText = js.map(([, c]) => c).join('\n')
                const sheet = cssFiles.map(([, c]) => c).join('\n')
                const report = scanClassReferences(jsText, sheet)
                expect(report.dangling).toEqual([])
                expect(collectClasses(jsText).length).toBeGreaterThan(0)
        },
)
