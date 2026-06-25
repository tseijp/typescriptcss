import { describe, it, expect } from 'vitest'
import { flex, text, font, border, rounded, max, min, col, grid, relative, h, w } from '../src/index.ts'

describe('GRAMMAR-001 flex: display / numeric flex / row / col / wrap stay distinct', () => {
        it('flex alone is display:flex', () => {
                expect(flex()).toEqual({ display: 'flex' })
        })
        it('flex[1] reads a numeric flex value without losing display', () => {
                expect(flex[1]()).toEqual({ display: 'flex', flex: 1 })
        })
        it('row / col set flex-direction, wrap sets flex-wrap', () => {
                expect(flex.row()).toEqual({ display: 'flex', flexDirection: 'row' })
                expect(flex.col()).toEqual({ display: 'flex', flexDirection: 'column' })
                expect(flex.wrap()).toEqual({ display: 'flex', flexWrap: 'wrap' })
                expect(flex.nowrap()).toEqual({ display: 'flex', flexWrap: 'nowrap' })
        })
        it('flex[1] then a scoped keyword keeps both readings', () => {
                expect(flex[1].row()).toEqual({ display: 'flex', flex: 1, flexDirection: 'row' })
        })
        it('GRAMMAR boundary: the numeric flex read does NOT survive a scoped keyword', () => {
                expect(flex.col[1]()).toEqual({ display: 'flex', flexDirection: 'column' })
        })
})

describe('GRAMMAR-002 text: numeric size / raw color / align keyword / named entry', () => {
        it('numeric is font-size', () => {
                expect(text[4]()).toEqual({ fontSize: '16px' })
        })
        it('raw color string is color', () => {
                expect(text['#fff']()).toEqual({ color: '#fff' })
        })
        it('align keyword is text-align, not color', () => {
                expect(text.center()).toEqual({ textAlign: 'center' })
        })
        it('named entry sm is a font-size/line-height pair, not a breakpoint', () => {
                expect(text.sm()).toEqual({ fontSize: '14px', lineHeight: '20px' })
        })
})

describe('GRAMMAR-003 font: numeric weight / weight keyword / family keyword', () => {
        it('numeric is font-weight', () => {
                expect(font[700]()).toEqual({ fontWeight: 700 })
        })
        it('weight keyword resolves to the same weight family', () => {
                expect(font.bold()).toEqual({ fontWeight: 700 })
                expect(font.semibold()).toEqual({ fontWeight: 600 })
                expect(font.medium()).toEqual({ fontWeight: 500 })
                expect(font.normal()).toEqual({ fontWeight: 400 })
        })
        it('family keyword resolves to font-family, not weight', () => {
                expect(font.sans()).toEqual({ fontFamily: 'Arial, Helvetica, sans-serif' })
        })
})

describe('GRAMMAR-004 border: base / side / axis / raw color / numeric width', () => {
        it('border base is a solid 1px border', () => {
                expect(border()).toEqual({ borderStyle: 'solid', borderWidth: '1px' })
        })
        it('border raw color sets border-color', () => {
                expect(border['#f00']()).toEqual({ borderStyle: 'solid', borderWidth: '1px', borderColor: '#f00' })
        })
        it('side scope sets only that side, then a numeric read sets that side width', () => {
                expect(border.t()).toEqual({ borderTopStyle: 'solid', borderTopWidth: '1px' })
                expect(border.t[2]()).toEqual({ borderTopStyle: 'solid', borderTopWidth: '2px' })
        })
        it('axis scope covers both sides', () => {
                expect(border.x()).toEqual({ borderLeftStyle: 'solid', borderLeftWidth: '1px', borderRightStyle: 'solid', borderRightWidth: '1px' })
        })
})

describe('GRAMMAR-005 rounded: default / numeric / full do not leak across chains', () => {
        it('default radius', () => {
                expect(rounded()).toEqual({ borderRadius: '4px' })
        })
        it('numeric radius', () => {
                expect(rounded[4]()).toEqual({ borderRadius: '16px' })
        })
        it('full radius', () => {
                expect(rounded.full()).toEqual({ borderRadius: '9999px' })
        })
        it('default and numeric chains are independent', () => {
                const base = rounded
                expect(base[2]()).toEqual({ borderRadius: '8px' })
                expect(base()).toEqual({ borderRadius: '4px' })
        })
})

describe('GRAMMAR-006 max / min: width / height nested scope does not steal next root', () => {
        it('max.w numeric and keyword', () => {
                expect(max.w[72]()).toEqual({ maxWidth: '288px' })
                expect(max.w.full()).toEqual({ maxWidth: '100%' })
        })
        it('min.h numeric', () => {
                expect(min.h[10]()).toEqual({ minHeight: '40px' })
        })
        it('after max.w[..] the chain finalizes; a fresh root w still means width', () => {
                expect(max.w[72]()).toEqual({ maxWidth: '288px' })
                expect(w[10]()).toEqual({ width: '40px' })
                expect(h[10]()).toEqual({ height: '40px' })
        })
})

describe('GRAMMAR-007 col span vs flex.col direction disambiguate by prior scope', () => {
        it('col.span[2] is a grid column span', () => {
                expect(col.span[2]()).toEqual({ gridColumn: 'span 2 / span 2' })
        })
        it('flex.col is a flex direction, not a grid span', () => {
                expect(flex.col()).toEqual({ display: 'flex', flexDirection: 'column' })
        })
        it('bare col[2] reads a numeric grid span', () => {
                expect(col[2]()).toEqual({ gridColumn: 'span 2 / span 2' })
        })
})

describe('GRAMMAR-008 native display.flex / position.relative vs root flex', () => {
        it('grid root is display:grid; relative root is position:relative', () => {
                expect(grid()).toEqual({ display: 'grid' })
                expect(relative()).toEqual({ position: 'relative' })
        })
        it('native display value access is a fallback property, not the root flex rule', () => {
                const out = (relative as unknown as Record<string, Record<string, () => Record<string, unknown>>>).display.flex()
                expect(out).toEqual({ position: 'relative', display: 'flex' })
        })
})

describe('GRAMMAR-009 native property whose name equals a utility name', () => {
        it('in property position a native key passes through as a fallback', () => {
                const out = (flex as unknown as Record<string, Record<string, () => Record<string, unknown>>>).color.red()
                expect(out).toEqual({ display: 'flex', color: 'red' })
        })
})

describe('GRAMMAR-010 scope does not persist past its read; greedy read is bounded', () => {
        it('after a scoped numeric read, a new root utility is not swallowed', () => {
                const out = flex.gap[4].p[2]()
                expect(out).toEqual({ display: 'flex', gap: '16px', padding: '8px' })
        })
        it('text greedy read consumes exactly one key then composes the next utility', () => {
                const out = text['#111'].font.bold()
                expect(out).toEqual({ color: '#111', fontWeight: 700 })
        })
})
