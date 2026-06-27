import { describe, expect, test } from 'vitest'
import { flex, text, bg, font, border, rounded, max, min, col, cols, justify, gap, size, w, h, mx, my } from '../src'

// 16 — Grammar collision / disambiguation.
//
// MECE boundary: files 00–13 ask "does token T under root R map to CSS C?".
// This file asks the orthogonal question: "when the SAME token could be read
// several ways, which reader wins?" It exercises resolve()'s precedence ladder
//   scoped-local  >  greedy reader  >  global rule  >  state reader  >  native
// and the points where a greedy reader deliberately swallows an unexpected word.
// These are properties of the resolution algorithm, not of any feature table.

describe('flex: display vs numeric basis vs direction word', () => {
        test('flex alone is the display rule', () => expect(flex()).toEqual({ display: 'flex' }))
        test('flex[<num>] is read as the flex shorthand (numeric branch)', () => {
                expect(flex[1]()).toEqual({ display: 'flex', flex: 1 })
                expect(flex[3]()).toEqual({ display: 'flex', flex: 3 })
        })
        test('flex.col / flex.row are direction words (scoped-local wins over the numeric reader)', () => {
                expect(flex.col()).toEqual({ display: 'flex', flexDirection: 'column' })
                expect(flex.row()).toEqual({ display: 'flex', flexDirection: 'row' })
        })
        test('flex.wrap / flex.nowrap are wrap words', () => {
                expect(flex.wrap()).toEqual({ display: 'flex', flexWrap: 'wrap' })
                expect(flex.nowrap()).toEqual({ display: 'flex', flexWrap: 'nowrap' })
        })
        test('a non-numeric unknown word under flex is dropped by the numeric reader, then native-falls-through', () => {
                // flex's own reader only matches numbers, so an unknown word becomes a
                // native CSS key fed by the following segment.
                expect(flex.order['2']()).toEqual({ display: 'flex', order: '2' })
        })
})

describe('text: scoped words beat the greedy color reader', () => {
        test('text.center is textAlign, not color "center"', () => expect(text.center()).toEqual({ textAlign: 'center' }))
        test('text.left is textAlign, not color "left"', () => expect(text.left()).toEqual({ textAlign: 'left' }))
        test('text.right is textAlign, not color "right"', () => expect(text.right()).toEqual({ textAlign: 'right' }))
        test('text.base/sm/xs are size words, not colors', () => {
                expect(text.base()).toEqual({ fontSize: '16px', lineHeight: '24px' })
                expect(text.sm()).toEqual({ fontSize: '14px', lineHeight: '20px' })
                expect(text.xs()).toEqual({ fontSize: '12px', lineHeight: '16px' })
        })
        test('text[<num>] is fontSize (numeric branch of the text reader)', () => {
                expect(text[4]()).toEqual({ fontSize: '16px' })
        })
        test('a word with no scoped entry is swallowed as a color by the greedy reader', () => {
                expect(text.red()).toEqual({ color: 'red' })
                expect(text['#fff']()).toEqual({ color: '#fff' })
        })
        test('GREEDY OVER-CAPTURE: an unimplemented pseudo-word is wrongly read as a color', () => {
                // `text.hover` has no scoped meaning, so the greedy color reader eats it.
                expect(text.hover()).toEqual({ color: 'hover' })
                expect(text.focus()).toEqual({ color: 'focus' })
        })
})

describe('bg: greedy color reader has NO scope, so it captures everything', () => {
        test('bg.<color> reads color', () => {
                expect(bg.red()).toEqual({ background: 'red' })
                expect(bg.transparent()).toEqual({ background: 'transparent' })
        })
        test('GREEDY OVER-CAPTURE: bg.flex is read as the color "flex", not display:flex', () => {
                expect(bg.flex()).toEqual({ background: 'flex' })
        })
        test('GREEDY OVER-CAPTURE: bg.hover is read as the color "hover"', () => {
                expect(bg.hover()).toEqual({ background: 'hover' })
        })
        test('bg[<num>] is captured as a (numeric) color value too', () => {
                expect(bg[4]()).toEqual({ background: '4' })
        })
})

describe('font: weight words vs numeric weight vs family', () => {
        test('weight words map to fontWeight numbers', () => {
                expect(font.bold()).toEqual({ fontWeight: 700 })
                expect(font.medium()).toEqual({ fontWeight: 500 })
                expect(font.normal()).toEqual({ fontWeight: 400 })
                expect(font.semibold()).toEqual({ fontWeight: 600 })
        })
        test('font.sans is the family entry (scoped word wins over the numeric reader)', () => {
                expect(font.sans()).toEqual({ fontFamily: 'Arial, Helvetica, sans-serif' })
        })
        test('font[<num>] is read as a numeric fontWeight', () => {
                expect(font[600]()).toEqual({ fontWeight: 600 })
                expect(font[100]()).toEqual({ fontWeight: 100 })
        })
})

describe('border: side scope vs color reader vs numeric width', () => {
        test('border alone applies the default style+width', () => {
                expect(border()).toEqual({ borderStyle: 'solid', borderWidth: '1px' })
        })
        test('border.<word> is captured by the color reader', () => {
                expect(border.red()).toEqual({ borderStyle: 'solid', borderWidth: '1px', borderColor: 'red' })
        })
        test('border side words rewrite to per-side props (scoped-local wins over the color reader)', () => {
                expect(border.b()).toEqual({ borderBottomStyle: 'solid', borderBottomWidth: '1px' })
                expect(border.t()).toEqual({ borderTopStyle: 'solid', borderTopWidth: '1px' })
        })
        test('border.x / border.y expand to two sides', () => {
                expect(border.x()).toEqual({ borderLeftStyle: 'solid', borderLeftWidth: '1px', borderRightStyle: 'solid', borderRightWidth: '1px' })
                expect(border.y()).toEqual({ borderBottomStyle: 'solid', borderBottomWidth: '1px', borderTopStyle: 'solid', borderTopWidth: '1px' })
        })
        test('border.<side>[<num>] reads a per-side numeric width', () => {
                expect(border.b[2]()).toEqual({ borderBottomStyle: 'solid', borderBottomWidth: '2px' })
        })
        test('border.collapse keeps the default style and adds collapse', () => {
                expect(border.collapse()).toEqual({ borderStyle: 'solid', borderWidth: '1px', borderCollapse: 'collapse' })
        })
})

describe('rounded: default value vs numeric scale vs full word', () => {
        test('rounded alone is the 4px default', () => expect(rounded()).toEqual({ borderRadius: '4px' }))
        test('rounded[<num>] reads a scaled radius and replaces the default', () => {
                expect(rounded[2]()).toEqual({ borderRadius: '8px' })
        })
        test('rounded.full is the keyword and replaces the default', () => {
                expect(rounded.full()).toEqual({ borderRadius: '9999px' })
        })
})

describe('max / min: two-level scope (axis word then length reader)', () => {
        test('max.w / max.h read length on the right axis', () => {
                expect(max.w[4]()).toEqual({ maxWidth: '16px' })
                expect(max.h[4]()).toEqual({ maxHeight: '16px' })
        })
        test('min.w / min.h read length on the right axis', () => {
                expect(min.w[4]()).toEqual({ minWidth: '16px' })
                expect(min.h[4]()).toEqual({ minHeight: '16px' })
        })
        test('keyword lengths flow through the same reader', () => {
                expect(max.w.full()).toEqual({ maxWidth: '100%' })
                expect(min.h.screen()).toEqual({ minHeight: '100vw' })
        })
})

describe('col / cols: grid-column vs grid-template-columns (lexically close roots)', () => {
        test('col[<num>] is a span shorthand', () => expect(col[2]()).toEqual({ gridColumn: 'span 2 / span 2' }))
        test('col.span[<num>] is the explicit span scope', () => expect(col.span[3]()).toEqual({ gridColumn: 'span 3 / span 3' }))
        test('col.full is the full-row keyword', () => expect(col.full()).toEqual({ gridColumn: '1 / -1' }))
        test('cols[<num>] is a repeat() template (different property entirely)', () => {
                expect(cols[3]()).toEqual({ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' })
        })
        test('cols.subgrid is the keyword template', () => expect(cols.subgrid()).toEqual({ gridTemplateColumns: 'subgrid' }))
        test('cols with a non-numeric word passes the word straight through as the template', () => {
                expect(cols.none()).toEqual({ gridTemplateColumns: 'none' })
        })
})

describe('justify: words vs the nested items scope', () => {
        test('justify.between/center/start/end are justifyContent', () => {
                expect(justify.between()).toEqual({ justifyContent: 'space-between' })
                expect(justify.center()).toEqual({ justifyContent: 'center' })
                expect(justify.start()).toEqual({ justifyContent: 'flex-start' })
                expect(justify.end()).toEqual({ justifyContent: 'flex-end' })
        })
        test('justify.items.* switches to justifyItems (nested scope wins)', () => {
                expect(justify.items.center()).toEqual({ justifyItems: 'center' })
                expect(justify.items.stretch()).toEqual({ justifyItems: 'stretch' })
        })
})

describe('native value vs root: a CSS-keyword segment never resolves to a root chain', () => {
        test('size keyword reader handles full/screen, numbers scale', () => {
                expect(size[4]()).toEqual({ height: '16px', width: '16px' })
                expect(size.full()).toEqual({ height: '100%', width: '100%' })
        })
        test('w/h length readers: number scales, keyword passes', () => {
                expect(w[4]()).toEqual({ width: '16px' })
                expect(w.full()).toEqual({ width: '100%' })
                expect(h[4]()).toEqual({ height: '16px' })
                expect(h.screen()).toEqual({ height: '100vw' })
        })
        test('gap[<num>] vs gap.x/gap.y axis scope', () => {
                expect(gap[4]()).toEqual({ gap: '16px' })
                expect(gap.x[2]()).toEqual({ columnGap: '8px' })
                expect(gap.y[2]()).toEqual({ rowGap: '8px' })
        })
        test('mx.auto / my.auto are scoped words, not margin scale reads', () => {
                expect(mx.auto()).toEqual({ marginLeft: 'auto', marginRight: 'auto' })
                expect(my.auto()).toEqual({ marginBottom: 'auto', marginTop: 'auto' })
        })
        test('mx[<num>] still reads the margin scale on both sides', () => {
                expect(mx[4]()).toEqual({ marginLeft: '16px', marginRight: '16px' })
        })
})
