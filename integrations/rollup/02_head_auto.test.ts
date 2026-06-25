// 02 — MODE-HEAD and MODE-AUTO contract on a document-less build tool.
//
// PROMPT.md (rollup) "Output mode" + "最終監査":
//   "head は HTML document を所有しない build tool である点を曖昧にせず、公開契約として
//    選択可能か、明示的に分類されるか" を自動検証し、"silent な別 mode 化を見逃さない"。
//
// OBSERVED CONTRACT (from packages/@typescriptcss/plugin-rollup/src/index.ts):
//   const output = options.output === 'inline' ? 'inline' : 'file'
//   => any value other than 'inline' (including 'head' and 'auto') is coerced to 'file'.
//
// This is a SILENT fallback: requesting `head` on Rollup neither errors nor produces
// a document <style>; it quietly emits a CSS file asset. Per PROMPT.md this silent
// re-mode-ing must be made VISIBLE, not hidden. The tests below assert the actual
// observed behaviour and flag the contract gap:
//   - head produces a CSS *file* asset (same artifacts as file mode), with no
//     document/<style> mechanism — Rollup owns no HTML document.
//   - There is no public, explicit "head is unsupported here" signal (no error,
//     no warning). That absence is itself recorded as the contract observation.

import { collectClasses, definedClasses } from '../utils'
import { H_FACTORY, SINGLE_ENTRY, TOKENS, TSCONFIG, esmRunner, packageJson, pickResult, rollupConfig, ROLLUP_DEV, test } from './_fixtures'

const NAMES = ['a', 'b', 'c', 'marker']

test(
        'MODE-HEAD on Rollup: requesting head silently falls back to a CSS file asset (no document/<style>) — contract made visible',
        {
                fs: {
                        'package.json': packageJson({}, ROLLUP_DEV),
                        'tsconfig.json': TSCONFIG,
                        'src/jsx.ts': H_FACTORY,
                        'src/tokens.ts': TOKENS,
                        'src/index.tsx': SINGLE_ENTRY,
                        'rollup.config.mjs': rollupConfig({ output: 'head' }),
                        'run.mjs': esmRunner('./dist/index.js', NAMES),
                },
        },
        async ({ exec, expect, fs }) => {
                // The build succeeds without error or a "head unsupported" diagnostic.
                const log = await exec('pnpm rollup -c rollup.config.mjs')
                expect(log).not.toMatch(/head.*not.*support|unsupported.*head/i)

                // OBSERVED: head behaves exactly like file — a CSS asset is emitted, because
                // the adapter coerces every non-inline mode to 'file'. Rollup owns no HTML
                // document, so there is nowhere for a <style> tag to go.
                const cssAssets = await fs.glob('dist/**/*.css')
                expect(cssAssets.length).toBeGreaterThan(0)

                // And the JS references a class resolved by that asset (i.e. it is *file* output,
                // not inline-in-document and not a no-op).
                const jsText = (await fs.readAll('dist/**/*.js')).map(([, c]) => c).join('\n')
                const sheet = (await fs.readAll('dist/**/*.css')).map(([, c]) => c).join('\n')
                const referenced = collectClasses(jsText)
                expect(referenced.length).toBeGreaterThan(0)
                const dangling = referenced.filter((c) => !definedClasses(sheet).has(c))
                expect(dangling).toEqual([])

                // CONTRACT GAP (visible, not hidden): `head` on a document-less tool is neither
                // honoured (no <style>/head injection mechanism exists in the rollup adapter)
                // nor explicitly rejected. It is silently re-routed to `file`. This assertion
                // documents that the only observable result of `head` is identical to `file`.
                const out = pickResult(await exec('node run.mjs'))
                expect(out.marker).toBe('SINGLE_MARKER')
                // className present (file-style placement), not an inline style object.
                expect(out.a.className ?? '').toMatch(/tcss-/)
        },
)

test(
        'MODE-AUTO on Rollup: auto is classified into a known category (file) and no style is lost',
        {
                fs: {
                        'package.json': packageJson({}, ROLLUP_DEV),
                        'tsconfig.json': TSCONFIG,
                        'src/jsx.ts': H_FACTORY,
                        'src/tokens.ts': TOKENS,
                        'src/index.tsx': SINGLE_ENTRY,
                        'rollup.config.mjs': rollupConfig({ output: 'auto' }),
                        'run.mjs': esmRunner('./dist/index.js', NAMES),
                },
        },
        async ({ exec, expect, fs }) => {
                await exec('pnpm rollup -c rollup.config.mjs')

                // OBSERVED: auto is coerced to file on Rollup (known category). Style is preserved:
                // a CSS asset exists and every referenced class resolves.
                const cssAssets = await fs.glob('dist/**/*.css')
                expect(cssAssets.length).toBeGreaterThan(0)
                const jsText = (await fs.readAll('dist/**/*.js')).map(([, c]) => c).join('\n')
                const sheet = (await fs.readAll('dist/**/*.css')).map(([, c]) => c).join('\n')
                const dangling = collectClasses(jsText).filter((c) => !definedClasses(sheet).has(c))
                expect(dangling).toEqual([])

                const out = pickResult(await exec('node run.mjs'))
                expect(out.marker).toBe('SINGLE_MARKER')
        },
)
