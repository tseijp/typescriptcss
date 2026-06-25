import { describe, it, expect } from 'vitest'
import * as t from '../src/index.ts'

const num = <T>(c: T, k: number) => (c as unknown as Record<number, () => Record<string, unknown>>)[k]()
const key = <T>(c: T, k: string) => (c as unknown as Record<string, () => Record<string, unknown>>)[k]()

describe('UTIL-LAYOUT display / position / overflow', () => {
        it('display family', () => {
                expect(t.block()).toEqual({ display: 'block' })
                expect(t.hidden()).toEqual({ display: 'none' })
                expect(t.flex()).toEqual({ display: 'flex' })
                expect(t.grid()).toEqual({ display: 'grid' })
                expect(t.inline()).toEqual({ display: 'inline' })
                expect(t.inlineBlock()).toEqual({ display: 'inline-block' })
                expect(t.inlineFlex()).toEqual({ display: 'inline-flex' })
                expect(t.table()).toEqual({ display: 'table' })
                expect(t.inline.block()).toEqual({ display: 'inline-block' })
                expect(t.inline.flex()).toEqual({ display: 'inline-flex' })
        })
        it('position family', () => {
                expect(t.relative()).toEqual({ position: 'relative' })
                expect(t.absolute()).toEqual({ position: 'absolute' })
        })
        it('inset / top / left positional offsets', () => {
                expect(num(t.inset, 2)).toEqual({ inset: '8px' })
                expect(num(t.top, 0)).toEqual({ top: '0px' })
                expect(num(t.left, 4)).toEqual({ left: '16px' })
        })
        it('overflow family', () => {
                expect(t.overflow.auto()).toEqual({ overflow: 'auto' })
                expect(t.overflow.hidden()).toEqual({ overflow: 'hidden' })
                expect(t.overflow.scroll()).toEqual({ overflow: 'scroll' })
                expect(t.overflow.visible()).toEqual({ overflow: 'visible' })
        })
})

describe('UTIL-FLEXGRID flexbox and grid', () => {
        it('flex direction / wrap / numeric', () => {
                expect(t.flex.row()).toEqual({ display: 'flex', flexDirection: 'row' })
                expect(t.flex.col()).toEqual({ display: 'flex', flexDirection: 'column' })
                expect(t.flex.wrap()).toEqual({ display: 'flex', flexWrap: 'wrap' })
                expect(t.flex.nowrap()).toEqual({ display: 'flex', flexWrap: 'nowrap' })
                expect(num(t.flex, 1)).toEqual({ display: 'flex', flex: 1 })
        })
        it('grid columns / col span / col start', () => {
                expect(num(t.cols, 3)).toEqual({ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' })
                expect(t.cols.subgrid()).toEqual({ gridTemplateColumns: 'subgrid' })
                expect(num(t.col, 2)).toEqual({ gridColumn: 'span 2 / span 2' })
                expect(t.col.span[2]()).toEqual({ gridColumn: 'span 2 / span 2' })
                expect(t.col.full()).toEqual({ gridColumn: '1 / -1' })
                expect(num(t.colStart, 2)).toEqual({ gridColumnStart: 2 })
        })
        it('auto flow / auto columns', () => {
                expect(t.flow.row()).toEqual({ gridAutoFlow: 'row' })
                expect(t.flow.col()).toEqual({ gridAutoFlow: 'column' })
                expect(num(t.auto.cols, 4)).toEqual({ gridAutoColumns: '16px' })
        })
        it('gap and axis gap', () => {
                expect(num(t.gap, 4)).toEqual({ gap: '16px' })
                expect(num(t.gap.x, 2)).toEqual({ columnGap: '8px' })
                expect(num(t.gap.y, 2)).toEqual({ rowGap: '8px' })
        })
        it('justify / items / content / place alignment', () => {
                expect(t.justify.between()).toEqual({ justifyContent: 'space-between' })
                expect(t.justify.center()).toEqual({ justifyContent: 'center' })
                expect(t.justify.start()).toEqual({ justifyContent: 'flex-start' })
                expect(t.justify.end()).toEqual({ justifyContent: 'flex-end' })
                expect(t.justify.items.center()).toEqual({ justifyItems: 'center' })
                expect(t.items.center()).toEqual({ alignItems: 'center' })
                expect(t.items.start()).toEqual({ alignItems: 'flex-start' })
                expect(t.content.center()).toEqual({ alignContent: 'center' })
                expect(t.content.stretch()).toEqual({ alignContent: 'stretch' })
                expect(t.place.items.center()).toEqual({ placeItems: 'center' })
        })
})

describe('UTIL-SPACING margin / padding', () => {
        it('margin shorthand / sides / axis / auto', () => {
                expect(num(t.m, 2)).toEqual({ margin: '8px' })
                expect(num(t.mt, 1)).toEqual({ marginTop: '4px' })
                expect(num(t.mb, 1)).toEqual({ marginBottom: '4px' })
                expect(num(t.ml, 1)).toEqual({ marginLeft: '4px' })
                expect(num(t.mr, 1)).toEqual({ marginRight: '4px' })
                expect(num(t.mx, 2)).toEqual({ marginLeft: '8px', marginRight: '8px' })
                expect(num(t.my, 2)).toEqual({ marginBottom: '8px', marginTop: '8px' })
                expect(t.mx.auto()).toEqual({ marginLeft: 'auto', marginRight: 'auto' })
                expect(t.my.auto()).toEqual({ marginBottom: 'auto', marginTop: 'auto' })
        })
        it('padding shorthand / sides / axis', () => {
                expect(num(t.p, 6)).toEqual({ padding: '24px' })
                expect(num(t.pt, 1)).toEqual({ paddingTop: '4px' })
                expect(num(t.pb, 1)).toEqual({ paddingBottom: '4px' })
                expect(num(t.pl, 1)).toEqual({ paddingLeft: '4px' })
                expect(num(t.pr, 1)).toEqual({ paddingRight: '4px' })
                expect(num(t.px, 2)).toEqual({ paddingLeft: '8px', paddingRight: '8px' })
                expect(num(t.py, 2)).toEqual({ paddingBottom: '8px', paddingTop: '8px' })
        })
})

describe('UTIL-SIZING width / height / size / min / max', () => {
        it('width and height numeric + keywords', () => {
                expect(num(t.w, 10)).toEqual({ width: '40px' })
                expect(t.w.full()).toEqual({ width: '100%' })
                expect(t.w.screen()).toEqual({ width: '100vw' })
                expect(num(t.h, 10)).toEqual({ height: '40px' })
                expect(t.h.dvh()).toEqual({ height: '100dvh' })
        })
        it('size sets both axes', () => {
                expect(num(t.size, 8)).toEqual({ width: '32px', height: '32px' })
        })
        it('min/max width and height', () => {
                expect(num(t.max.w, 72)).toEqual({ maxWidth: '288px' })
                expect(num(t.max.h, 72)).toEqual({ maxHeight: '288px' })
                expect(num(t.min.w, 10)).toEqual({ minWidth: '40px' })
                expect(num(t.min.h, 10)).toEqual({ minHeight: '40px' })
                expect(t.max.w.full()).toEqual({ maxWidth: '100%' })
        })
})

describe('UTIL-TYPOGRAPHY font / text / leading / tracking', () => {
        it('font weight numeric + keyword and family', () => {
                expect(num(t.font, 600)).toEqual({ fontWeight: 600 })
                expect(t.font.bold()).toEqual({ fontWeight: 700 })
                expect(t.font.semibold()).toEqual({ fontWeight: 600 })
                expect(t.font.medium()).toEqual({ fontWeight: 500 })
                expect(t.font.normal()).toEqual({ fontWeight: 400 })
                expect(t.font.sans()).toEqual({ fontFamily: 'Arial, Helvetica, sans-serif' })
        })
        it('text size numeric, named sizes, align, color', () => {
                expect(num(t.text, 4)).toEqual({ fontSize: '16px' })
                expect(t.text.xs()).toEqual({ fontSize: '12px', lineHeight: '16px' })
                expect(t.text.sm()).toEqual({ fontSize: '14px', lineHeight: '20px' })
                expect(t.text.base()).toEqual({ fontSize: '16px', lineHeight: '24px' })
                expect(t.text.center()).toEqual({ textAlign: 'center' })
                expect(t.text.left()).toEqual({ textAlign: 'left' })
                expect(t.text.right()).toEqual({ textAlign: 'right' })
                expect(key(t.text, '#fff')).toEqual({ color: '#fff' })
        })
        it('line-height and letter-spacing', () => {
                expect(num(t.leading, 6)).toEqual({ lineHeight: '24px' })
                expect(t.tracking.tight()).toEqual({ letterSpacing: '-0.025em' })
        })
})

describe('UTIL-BACKGROUND background color', () => {
        it('bg sets background color from a raw value', () => {
                expect(key(t.bg, '#0b1120')).toEqual({ background: '#0b1120' })
                expect(key(t.bg, 'transparent')).toEqual({ background: 'transparent' })
        })
})

describe('UTIL-BORDER radius / width / color / side / collapse', () => {
        it('rounded default / numeric / full', () => {
                expect(t.rounded()).toEqual({ borderRadius: '4px' })
                expect(num(t.rounded, 4)).toEqual({ borderRadius: '16px' })
                expect(t.rounded.full()).toEqual({ borderRadius: '9999px' })
        })
        it('border base / color / sides / axes / collapse', () => {
                expect(t.border()).toEqual({ borderStyle: 'solid', borderWidth: '1px' })
                expect(key(t.border, '#f00')).toEqual({ borderStyle: 'solid', borderWidth: '1px', borderColor: '#f00' })
                expect(t.border.t()).toEqual({ borderTopStyle: 'solid', borderTopWidth: '1px' })
                expect(t.border.b()).toEqual({ borderBottomStyle: 'solid', borderBottomWidth: '1px' })
                expect(t.border.l()).toEqual({ borderLeftStyle: 'solid', borderLeftWidth: '1px' })
                expect(t.border.r()).toEqual({ borderRightStyle: 'solid', borderRightWidth: '1px' })
                expect(t.border.x()).toEqual({ borderLeftStyle: 'solid', borderLeftWidth: '1px', borderRightStyle: 'solid', borderRightWidth: '1px' })
                expect(t.border.y()).toEqual({ borderBottomStyle: 'solid', borderBottomWidth: '1px', borderTopStyle: 'solid', borderTopWidth: '1px' })
                expect(num(t.border.t, 2)).toEqual({ borderTopStyle: 'solid', borderTopWidth: '2px' })
        })
        it.fails('[RED] border.collapse must not leak border base declarations', () => {
                expect(t.border.collapse()).toEqual({ borderCollapse: 'collapse' })
        })
})

describe('UTIL-TABLE table-layout', () => {
        it('table layout keywords', () => {
                expect(t.table.auto()).toEqual({ display: 'table', tableLayout: 'auto' })
                expect(t.table.fixed()).toEqual({ display: 'table', tableLayout: 'fixed' })
        })
})

describe('UTIL-TRANSFORM translate', () => {
        it('translate x/y with numeric and raw values', () => {
                expect(num(t.translate.x, 4)).toEqual({ transform: 'translateX(16px)' })
                expect(num(t.translate.y, 4)).toEqual({ transform: 'translateY(16px)' })
                expect(key(t.translate.x, '50%')).toEqual({ transform: 'translateX(50%)' })
        })
})

describe('UTIL-INTERACTION pointer-events', () => {
        it('pointer events keywords', () => {
                expect(t.pointer.events.auto()).toEqual({ pointerEvents: 'auto' })
                expect(t.pointer.events.none()).toEqual({ pointerEvents: 'none' })
        })
})
