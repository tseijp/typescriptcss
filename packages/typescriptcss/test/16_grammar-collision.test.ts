import { describe, expect, test } from 'vitest'
import * as _ from '../src'

// 16 — Grammar collision / disambiguation.
//
// MECE boundary: files 00–13 ask "does token T under root R map to CSS C?". This
// file asks the orthogonal question: "when the SAME token could be read several
// ways, which reader wins?" It exercises resolve()'s precedence ladder
//   scoped-local  >  greedy reader  >  global rule  >  state reader  >  native
// and the points where a greedy reader deliberately over-captures a word.
//
// Per _REDESIGN.md: collision points are enumerated MECHANICALLY with test.each,
// not sampled. The precedence facts that the runtime implements (scoped beats
// greedy, numeric branch, two-level scope, col vs cols) are GREEN. The greedy
// OVER-CAPTURE cases are written with the correct Tailwind expectation — e.g.
// `bg.cover` must mean `background-size: cover`, not the colour string "cover" —
// so the current swallow-as-value behaviour fails loudly (RED). No `?.`, no
// `?? fallback`, no `as any`: a wrong value must surface as a failure.

// --- GREEN: scoped-local wins over the numeric / greedy reader --------------

describe('flex: display vs numeric basis vs direction/wrap word', () => {
        test('flex alone is the display rule', () => expect(_.flex()).toEqual({ display: 'flex' }))
        const numeric: Array<[number, number]> = [
                [1, 1],
                [3, 3],
                [0, 0],
        ]
        test.each(numeric)('flex[%i] is the numeric flex shorthand', (key, val) => {
                expect(_.flex[key]()).toEqual({ display: 'flex', flex: val })
        })
        const words: Array<[keyof typeof _.flex, Record<string, unknown>]> = [
                ['col', { flexDirection: 'column' }],
                ['row', { flexDirection: 'row' }],
                ['wrap', { flexWrap: 'wrap' }],
                ['nowrap', { flexWrap: 'nowrap' }],
        ]
        test.each(words)('flex.%s is a scoped word (beats the numeric reader)', (word, decl) => {
                expect((_.flex[word] as typeof _.flex)()).toEqual({ display: 'flex', ...decl })
        })
        test('a non-numeric unknown word under flex falls through to native', () => {
                expect(_.flex.order['2']()).toEqual({ display: 'flex', order: '2' })
        })
})

describe('text: scoped words beat the greedy colour reader (GREEN)', () => {
        const scoped: Array<[string, Record<string, unknown>]> = [
                ['center', { textAlign: 'center' }],
                ['left', { textAlign: 'left' }],
                ['right', { textAlign: 'right' }],
                ['base', { fontSize: '16px', lineHeight: '24px' }],
                ['sm', { fontSize: '14px', lineHeight: '20px' }],
                ['xs', { fontSize: '12px', lineHeight: '16px' }],
        ]
        test.each(scoped)('text.%s is its scoped meaning, not a colour', (word, decl) => {
                expect((_.text[word as keyof typeof _.text] as typeof _.flex)()).toEqual(decl)
        })
        test('text[4] is fontSize (numeric branch of the text reader)', () => {
                expect(_.text[4]()).toEqual({ fontSize: '16px' })
        })
        const colors: Array<[string, string]> = [
                ['red', 'red'],
                ['#fff', '#fff'],
                ['currentColor', 'currentColor'],
        ]
        test.each(colors)('text["%s"] with no scoped entry is read as a colour', (key, val) => {
                expect((_.text[key as keyof typeof _.text] as typeof _.flex)()).toEqual({ color: val })
        })
})

describe('font: weight words vs numeric weight vs family (GREEN)', () => {
        const weights: Array<[string, number]> = [
                ['bold', 700],
                ['medium', 500],
                ['normal', 400],
                ['semibold', 600],
        ]
        test.each(weights)('font.%s → fontWeight %i', (word, val) => {
                expect((_.font[word as keyof typeof _.font] as typeof _.flex)()).toEqual({ fontWeight: val })
        })
        test('font.sans is the family entry (scoped word beats the numeric reader)', () => {
                expect(_.font.sans()).toEqual({ fontFamily: 'Arial, Helvetica, sans-serif' })
        })
        const numeric: Array<[number, number]> = [
                [600, 600],
                [100, 100],
        ]
        test.each(numeric)('font[%i] is read as a numeric fontWeight', (key, val) => {
                expect(_.font[key]()).toEqual({ fontWeight: val })
        })
})

describe('border: side scope vs colour reader vs numeric width (GREEN)', () => {
        test('border alone applies the default style+width', () => {
                expect(_.border()).toEqual({ borderStyle: 'solid', borderWidth: '1px' })
        })
        test('border.<colour> is captured by the colour reader', () => {
                expect(_.border.red()).toEqual({ borderStyle: 'solid', borderWidth: '1px', borderColor: 'red' })
        })
        const sides: Array<[string, Record<string, unknown>]> = [
                ['b', { borderBottomStyle: 'solid', borderBottomWidth: '1px' }],
                ['t', { borderTopStyle: 'solid', borderTopWidth: '1px' }],
                ['l', { borderLeftStyle: 'solid', borderLeftWidth: '1px' }],
                ['r', { borderRightStyle: 'solid', borderRightWidth: '1px' }],
                ['x', { borderLeftStyle: 'solid', borderLeftWidth: '1px', borderRightStyle: 'solid', borderRightWidth: '1px' }],
                ['y', { borderBottomStyle: 'solid', borderBottomWidth: '1px', borderTopStyle: 'solid', borderTopWidth: '1px' }],
        ]
        test.each(sides)('border.%s rewrites to per-side props (scoped beats colour reader)', (side, decl) => {
                expect((_.border[side as keyof typeof _.border] as typeof _.flex)()).toEqual(decl)
        })
        test('border.<side>[<num>] reads a per-side numeric width', () => {
                expect(_.border.b[2]()).toEqual({ borderBottomStyle: 'solid', borderBottomWidth: '2px' })
        })
        test('border.collapse keeps the default style and adds collapse', () => {
                expect(_.border.collapse()).toEqual({ borderStyle: 'solid', borderWidth: '1px', borderCollapse: 'collapse' })
        })
})

describe('rounded: default value vs numeric scale vs full word (GREEN)', () => {
        test('rounded alone is the 4px default', () => expect(_.rounded()).toEqual({ borderRadius: '4px' }))
        test('rounded[2] reads a scaled radius and replaces the default', () => {
                expect(_.rounded[2]()).toEqual({ borderRadius: '8px' })
        })
        test('rounded.full is the keyword and replaces the default', () => {
                expect(_.rounded.full()).toEqual({ borderRadius: '9999px' })
        })
})

describe('max / min: two-level scope (axis word then length reader) (GREEN)', () => {
        const cases: Array<[() => Record<string, unknown>, Record<string, unknown>]> = [
                [() => _.max.w[4](), { maxWidth: '16px' }],
                [() => _.max.h[4](), { maxHeight: '16px' }],
                [() => _.min.w[4](), { minWidth: '16px' }],
                [() => _.min.h[4](), { minHeight: '16px' }],
                [() => _.max.w.full(), { maxWidth: '100%' }],
                [() => _.min.h.screen(), { minHeight: '100vw' }],
        ]
        test.each(cases)('two-level axis scope #%#', (fn, decl) => expect(fn()).toEqual(decl))
})

describe('col / cols: lexically close roots, different properties (GREEN)', () => {
        const cases: Array<[() => Record<string, unknown>, Record<string, unknown>]> = [
                [() => _.col[2](), { gridColumn: 'span 2 / span 2' }],
                [() => _.col.span[3](), { gridColumn: 'span 3 / span 3' }],
                [() => _.col.full(), { gridColumn: '1 / -1' }],
                [() => _.cols[3](), { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }],
                [() => _.cols.subgrid(), { gridTemplateColumns: 'subgrid' }],
                [() => _.cols.none(), { gridTemplateColumns: 'none' }],
        ]
        test.each(cases)('col/cols disambiguation #%#', (fn, decl) => expect(fn()).toEqual(decl))
})

describe('justify: words vs the nested items scope (GREEN)', () => {
        const content: Array<[string, string]> = [
                ['between', 'space-between'],
                ['center', 'center'],
                ['start', 'flex-start'],
                ['end', 'flex-end'],
        ]
        test.each(content)('justify.%s → justifyContent %s', (word, val) => {
                expect((_.justify[word as keyof typeof _.justify] as typeof _.flex)()).toEqual({ justifyContent: val })
        })
        test('justify.items.* switches to justifyItems (nested scope wins)', () => {
                expect(_.justify.items.center()).toEqual({ justifyItems: 'center' })
                expect(_.justify.items.stretch()).toEqual({ justifyItems: 'stretch' })
        })
})

describe('axis scope vs scalar read on the same root (GREEN)', () => {
        const cases: Array<[() => Record<string, unknown>, Record<string, unknown>]> = [
                [() => _.gap[4](), { gap: '16px' }],
                [() => _.gap.x[2](), { columnGap: '8px' }],
                [() => _.gap.y[2](), { rowGap: '8px' }],
                [() => _.mx.auto(), { marginLeft: 'auto', marginRight: 'auto' }],
                [() => _.my.auto(), { marginBottom: 'auto', marginTop: 'auto' }],
                [() => _.mx[4](), { marginLeft: '16px', marginRight: '16px' }],
        ]
        test.each(cases)('axis vs scalar #%#', (fn, decl) => expect(fn()).toEqual(decl))
})

// --- RED: greedy OVER-CAPTURE (colour reader swallows real CSS keywords) -----

describe('bg: greedy colour reader wrongly swallows non-colour bg-* keywords', () => {
        // In Tailwind these are background-size / -position / -attachment / -repeat
        // utilities. The greedy colorRule on `bg` has no scope, so it eats the word as
        // a colour value. Expected = the correct Tailwind declaration -> RED.
        const overcaptured: Array<[string, Record<string, unknown>]> = [
                ['cover', { backgroundSize: 'cover' }],
                ['contain', { backgroundSize: 'contain' }],
                ['center', { backgroundPosition: 'center' }],
                ['fixed', { backgroundAttachment: 'fixed' }],
                ['local', { backgroundAttachment: 'local' }],
                ['scroll', { backgroundAttachment: 'scroll' }],
                ['repeat', { backgroundRepeat: 'repeat' }],
                ['no-repeat', { backgroundRepeat: 'no-repeat' }],
        ]
        test.each(overcaptured)('bg.%s should be a background longhand, not a colour', (word, decl) => {
                expect((_.bg[word as keyof typeof _.bg] as typeof _.flex)()).toEqual(decl)
        })
        test.each(overcaptured)('bg.%s must not emit { background: word }', (word) => {
                expect((_.bg[word as keyof typeof _.bg] as typeof _.flex)()).not.toEqual({ background: word })
        })
})

describe('text: greedy colour reader wrongly swallows non-colour text-* keywords', () => {
        // Tailwind text-* keywords for overflow / wrap / white-space. The greedy
        // colour reader eats them; expected = the correct declaration -> RED.
        const overcaptured: Array<[string, Record<string, unknown>]> = [
                ['ellipsis', { textOverflow: 'ellipsis' }],
                ['clip', { textOverflow: 'clip' }],
                ['nowrap', { whiteSpace: 'nowrap' }],
                ['wrap', { textWrap: 'wrap' }],
                ['balance', { textWrap: 'balance' }],
        ]
        test.each(overcaptured)('text.%s should be a text longhand, not a colour', (word, decl) => {
                expect((_.text[word as keyof typeof _.text] as typeof _.flex)()).toEqual(decl)
        })
})

describe('greedy readers wrongly swallow pseudo-class words as colour values', () => {
        // `text.hover` / `bg.focus` have no scoped meaning, so the greedy colour reader
        // captures the pseudo word as a colour. The Tailwind-correct result is a
        // CONDITIONAL declaration nested under the pseudo-class selector -> RED.
        const cases: Array<[string, () => Record<string, unknown>, Record<string, unknown>]> = [
                ['text.hover.text.red', () => _.text.hover.text.red(), { '&:hover': { color: 'red' } }],
                ['text.focus.text.red', () => _.text.focus.text.red(), { '&:focus': { color: 'red' } }],
                ['bg.hover.bg.red', () => _.bg.hover.bg.red(), { '&:hover': { background: 'red' } }],
                ['bg.focus.bg.red', () => _.bg.focus.bg.red(), { '&:focus': { background: 'red' } }],
        ]
        test.each(cases)('%s nests under the pseudo selector', (_n, fn, decl) => {
                expect(fn()).toEqual(decl)
        })
})
