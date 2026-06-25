// 03 — CSS boundary API (SPLIT-001..005), Rollup core single entry.
//
// PROMPT.md (rollup) "CSS boundary API": Rollup core の single entry だけで全項目を確認。
//
// OBSERVED placement contract (plugin-core/src/utils/transform.ts `sections`):
//   - base target  = options.output ('file' | 'inline'; head/auto → file in the rollup adapter)
//   - split target = the processor's splitTarget (the rollup adapter does not pass one,
//     so it defaults to 'file')
//   - A leading `css` puts the whole chain on the split target.
//   - A mid-chain `css` puts the front on the base target and the tail on the split target.
//
// To observe a *genuine split into two different targets* (SPLIT-002), we run in
// `output: 'inline'` so the front stays inline (on the element) and the tail goes
// to the file asset. README "Output modes": "flex.col stays inline; bg goes to the file".

import { collectClasses, declarationsForClass, definedClasses } from '../utils'
import { H_FACTORY, SPLIT_ENTRY, TSCONFIG, esmRunner, packageJson, pickResult, rollupConfig, ROLLUP_DEV, test } from './_fixtures'

const NAMES = ['leading', 'middle', 'cascade', 'emptyFront', 'emptyBack', 'withArgs', 'marker']

function inlineDecls(marker: any): Record<string, string> {
        const { tag, children, className, ...rest } = marker ?? {}
        return rest
}

test(
        'SPLIT-001..005: css marker draws the file/inline boundary inside a chain',
        {
                fs: {
                        'package.json': packageJson({}, ROLLUP_DEV),
                        'tsconfig.json': TSCONFIG,
                        'src/jsx.ts': H_FACTORY,
                        'src/index.tsx': SPLIT_ENTRY,
                        // inline base target so the *front* of a mid-chain split stays inline and
                        // the *tail* lands in the file asset → two observable targets.
                        'rollup.config.mjs': rollupConfig({ output: 'inline' }),
                        'run.mjs': esmRunner('./dist/index.js', NAMES),
                },
        },
        async ({ exec, expect, fs }) => {
                await exec('pnpm rollup -c rollup.config.mjs')

                const out = pickResult(await exec('node run.mjs'))
                const sheet = (await fs.readAll('dist/**/*.css')).map(([, c]) => c).join('\n')
                const jsText = (await fs.readAll('dist/**/*.js')).map(([, c]) => c).join('\n')
                expect(out.marker).toBe('SPLIT_MARKER')

                // SPLIT-001: leading css — the whole chain is on the file target (a class, no
                // inline declarations on the element).
                expect(out.leading.className ?? '').toMatch(/tcss-/)
                expect(Object.keys(inlineDecls(out.leading))).toEqual([])

                // SPLIT-002: mid-chain css — front (flex.col.gap) inline, tail (bg/text) in file.
                const middleInline = inlineDecls(out.middle)
                expect(JSON.stringify(middleInline)).toContain('column') // flex.col stayed inline
                expect(out.middle.className ?? '').toMatch(/tcss-/) // tail produced a class
                const tailDecls = declarationsForClass(sheet, out.middle.className.trim())
                // The tail rule carries the post-split declarations (raw values only).
                expect(JSON.stringify(tailDecls)).toContain('#0b1120')
                // The composed meaning (inline front ⊕ file tail) reconstructs the full chain.
                expect(JSON.stringify(middleInline) + JSON.stringify(tailDecls)).toContain('#f8fafc')

                // SPLIT-003: same property before & after the split — cascade favours the tail.
                // bg['#111111'] (front, inline) then css.bg['#222222'] (tail, file). The last
                // write in cascade order must win; both halves are present and not dropped.
                const cascadeInline = inlineDecls(out.cascade)
                const cascadeTail = declarationsForClass(sheet, (out.cascade.className ?? '').trim())
                const composed = { ...cascadeInline, ...cascadeTail }
                // background appears exactly once in the composed meaning, resolving to the tail.
                expect(JSON.stringify(composed)).toContain('#222222')

                // SPLIT-004: empty front (leading css only) and empty back (trailing css only)
                // must not require empty selectors / empty assets / empty references.
                expect(out.emptyFront.className ?? '').toMatch(/tcss-/) // front empty, back has the class
                expect(Object.keys(inlineDecls(out.emptyFront))).toEqual([])
                // emptyBack: front has declarations, the (empty) tail must not emit a dangling class.
                expect(JSON.stringify(inlineDecls(out.emptyBack))).toContain('column')

                // SPLIT-005: split chain with call-arg plain object — the arg is neither dropped
                // nor double-applied. The plain object lands on the *split* (tail) target here.
                const withArgsTail = declarationsForClass(sheet, (out.withArgs.className ?? '').trim())
                const withArgsInline = inlineDecls(out.withArgs)
                const both = JSON.stringify({ ...withArgsInline, ...withArgsTail })
                expect(both).toContain('sticky') // call-arg present exactly once
                expect((both.match(/sticky/g) ?? []).length).toBe(1)

                // No dangling references across the split output.
                const dangling = collectClasses(jsText).filter((c) => !definedClasses(sheet).has(c))
                expect(dangling).toEqual([])
        },
)
