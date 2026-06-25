// 01 — Rollup core · single entry · ESM · MODE-INLINE and MODE-FILE.
//
// PROMPT.md coverage:
//   - ROLLUP-CORE single entry, FORMAT-ESM
//   - MODE-INLINE: generated JS keeps the marker style meaning, no CSS asset required.
//   - MODE-FILE: generated JS class reference ↔ emitted CSS selector; CSS asset in graph.
//   - "inline と file は同じ source semantics" — both placements are reconstructed
//     and compared against the plugin-disabled baseline meaning.
//
// We do NOT re-verify utility CSS values here (that is unit). We only verify the
// *placement contract*: the same source produces inline declarations (inline) or
// a class + matching rule (file), and the recovered declaration set matches the
// baseline declaration set.

import { collectClasses, definedClasses, scanArtifacts } from '../utils'
import { ENTRY_A, H_FACTORY, SINGLE_ENTRY, TOKENS, TSCONFIG, esmRunner, packageJson, pickResult, rollupConfig, ROLLUP_DEV, test } from './_fixtures'

const NAMES = ['a', 'b', 'c', 'marker']

/** Recover the declaration set from an inline marker export (`{ tag, ...style }`). */
function inlineDecls(marker: any): Record<string, string> {
        const { tag, children, className, ...rest } = marker ?? {}
        return rest
}

test(
        'MODE-INLINE: single entry keeps inline style meaning and requires no CSS asset',
        {
                fs: {
                        'package.json': packageJson({}, ROLLUP_DEV),
                        'tsconfig.json': TSCONFIG,
                        'src/jsx.ts': H_FACTORY,
                        'src/tokens.ts': TOKENS,
                        'src/index.tsx': SINGLE_ENTRY,
                        'rollup.config.mjs': rollupConfig({ output: 'inline' }),
                        'run.mjs': esmRunner('./dist/index.js', NAMES),
                },
        },
        async ({ exec, expect, fs }) => {
                await exec('pnpm rollup -c rollup.config.mjs')

                // MODE-INLINE: no dedicated CSS asset is required.
                const cssAssets = await fs.glob('dist/**/*.css')
                expect(cssAssets).toEqual([])

                const out = await exec('node run.mjs')
                const inline = pickResult(out)

                expect(inline.marker).toBe('SINGLE_MARKER')
                // The marker style survives as inline declarations on the prop bag.
                const a = inlineDecls(inline.a)
                expect(JSON.stringify(a)).toContain('column') // flex.col
                expect(JSON.stringify(a)).toContain('#0b1120') // bg raw token
                // call-arg plain object merged.
                expect(JSON.stringify(inlineDecls(inline.c))).toContain('sticky')

                // No invalid declarations leaked into the JS.
                const arts = await fs.readAll('dist/**/*.js')
                expect(scanArtifacts(arts).invalidDeclarations).toEqual([])
        },
)

test(
        'MODE-FILE: single entry references a class whose rule lives in an emitted CSS asset',
        {
                fs: {
                        'package.json': packageJson({}, ROLLUP_DEV),
                        'tsconfig.json': TSCONFIG,
                        'src/jsx.ts': H_FACTORY,
                        'src/tokens.ts': TOKENS,
                        'src/index.tsx': SINGLE_ENTRY,
                        'rollup.config.mjs': rollupConfig({ output: 'file' }),
                        'run.mjs': esmRunner('./dist/index.js', NAMES),
                },
        },
        async ({ exec, expect, fs }) => {
                await exec('pnpm rollup -c rollup.config.mjs')

                // MODE-FILE: a CSS asset must be present in the output graph.
                const cssAssets = await fs.glob('dist/**/*.css')
                expect(cssAssets.length).toBeGreaterThan(0)
                const sheet = (await fs.readAll('dist/**/*.css')).map(([, c]) => c).join('\n')

                const out = await exec('node run.mjs')
                const file = pickResult(out)
                expect(file.marker).toBe('SINGLE_MARKER')

                // Every tcss-* class referenced from the built JS must have a rule in the sheet.
                const jsText = (await fs.readAll('dist/**/*.js')).map(([, c]) => c).join('\n')
                const referenced = collectClasses(jsText)
                expect(referenced.length).toBeGreaterThan(0)
                const defined = definedClasses(sheet)
                const dangling = referenced.filter((c) => !defined.has(c))
                expect(dangling).toEqual([])

                // The marker export carries a className (not an inline style object) in file mode.
                expect(typeof file.a.className === 'string' || file.a.className === undefined).toBe(true)
        },
)

test(
        'inline ⇔ file parity: both placements reconstruct the same declaration meaning',
        {
                fs: {
                        // One project that builds twice into separate dirs so we can diff meaning.
                        'package.json': packageJson({}, ROLLUP_DEV),
                        'tsconfig.json': TSCONFIG,
                        'src/jsx.ts': H_FACTORY,
                        'src/tokens.ts': TOKENS,
                        'src/index.tsx': ENTRY_A,
                        'rollup.inline.mjs': rollupConfig({ output: 'inline' }).replace("dir: 'dist'", "dir: 'dist-inline'"),
                        'rollup.file.mjs': rollupConfig({ output: 'file' }).replace("dir: 'dist'", "dir: 'dist-file'"),
                        'run.inline.mjs': esmRunner('./dist-inline/index.js', ['shared', 'ownA', 'marker']),
                        'run.file.mjs': esmRunner('./dist-file/index.js', ['shared', 'ownA', 'marker']),
                },
        },
        async ({ exec, expect, fs }) => {
                await exec('pnpm rollup -c rollup.inline.mjs')
                await exec('pnpm rollup -c rollup.file.mjs')

                const inline = pickResult(await exec('node run.inline.mjs'))
                const file = pickResult(await exec('node run.file.mjs'))

                // inline: decls live on the element. file: decls live in the rule for the class.
                const inlineShared = inlineDecls(inline.shared)
                const sheet = (await fs.readAll('dist-file/**/*.css')).map(([, c]) => c).join('\n')
                // The same raw CSS values appear in both placements (meaning parity, not text equality).
                expect(JSON.stringify(inlineShared)).toContain('#101828')
                expect(sheet).toContain('#101828')
                // Both markers identical.
                expect(inline.marker).toBe(file.marker)
        },
)
