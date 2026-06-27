import { describe, expect, test } from 'vitest'
import * as _ from '../src'
// Generated mechanically from docs/06_borders/*.mdx — chain() returns a style object.
// Unimplemented utilities return undefined and stay RED until added to src.

describe('border-radius', () => {
        test("rounded['0']", () => {
                expect(_.rounded['0']()).toEqual({ borderRadius: '0' })
        })
        test('rounded.full', () => {
                expect(_.rounded.full()).toEqual({ borderRadius: 'calc(infinity * 1px)' })
        })
        test('rounded[4]', () => {
                expect(_.rounded[4]()).toEqual({ borderRadius: 'var(4)' })
        })
        test('rounded.s.none', () => {
                expect(_.rounded.s.none()).toEqual({ borderStartStartRadius: '0', borderEndStartRadius: '0' })
        })
        test('rounded.s.full', () => {
                expect(_.rounded.s.full()).toEqual({ borderStartStartRadius: 'calc(infinity * 1px)', borderEndStartRadius: 'calc(infinity * 1px)' })
        })
        test('rounded.s[4]', () => {
                expect(_.rounded.s[4]()).toEqual({ borderStartStartRadius: 'var(4)', borderEndStartRadius: 'var(4)' })
        })
        test('rounded.e.none', () => {
                expect(_.rounded.e.none()).toEqual({ borderStartEndRadius: '0', borderEndEndRadius: '0' })
        })
        test('rounded.e.full', () => {
                expect(_.rounded.e.full()).toEqual({ borderStartEndRadius: 'calc(infinity * 1px)', borderEndEndRadius: 'calc(infinity * 1px)' })
        })
        test('rounded.e[4]', () => {
                expect(_.rounded.e[4]()).toEqual({ borderStartEndRadius: 'var(4)', borderEndEndRadius: 'var(4)' })
        })
        test('rounded.t.none', () => {
                expect(_.rounded.t.none()).toEqual({ borderTopLeftRadius: '0', borderTopRightRadius: '0' })
        })
        test('rounded.t.full', () => {
                expect(_.rounded.t.full()).toEqual({ borderTopLeftRadius: 'calc(infinity * 1px)', borderTopRightRadius: 'calc(infinity * 1px)' })
        })
        test('rounded.t[4]', () => {
                expect(_.rounded.t[4]()).toEqual({ borderTopLeftRadius: 'var(4)', borderTopRightRadius: 'var(4)' })
        })
        test('rounded.r.none', () => {
                expect(_.rounded.r.none()).toEqual({ borderTopRightRadius: '0', borderBottomRightRadius: '0' })
        })
        test('rounded.r.full', () => {
                expect(_.rounded.r.full()).toEqual({ borderTopRightRadius: 'calc(infinity * 1px)', borderBottomRightRadius: 'calc(infinity * 1px)' })
        })
        test('rounded.r[4]', () => {
                expect(_.rounded.r[4]()).toEqual({ borderTopRightRadius: 'var(4)', borderBottomRightRadius: 'var(4)' })
        })
        test('rounded.b.none', () => {
                expect(_.rounded.b.none()).toEqual({ borderBottomRightRadius: '0', borderBottomLeftRadius: '0' })
        })
        test('rounded.b.full', () => {
                expect(_.rounded.b.full()).toEqual({ borderBottomRightRadius: 'calc(infinity * 1px)', borderBottomLeftRadius: 'calc(infinity * 1px)' })
        })
        test('rounded.b[4]', () => {
                expect(_.rounded.b[4]()).toEqual({ borderBottomRightRadius: 'var(4)', borderBottomLeftRadius: 'var(4)' })
        })
        test('rounded.l.none', () => {
                expect(_.rounded.l.none()).toEqual({ borderTopLeftRadius: '0', borderBottomLeftRadius: '0' })
        })
        test('rounded.l.full', () => {
                expect(_.rounded.l.full()).toEqual({ borderTopLeftRadius: 'calc(infinity * 1px)', borderBottomLeftRadius: 'calc(infinity * 1px)' })
        })
        test('rounded.l[4]', () => {
                expect(_.rounded.l[4]()).toEqual({ borderTopLeftRadius: 'var(4)', borderBottomLeftRadius: 'var(4)' })
        })
        test("rounded.ss['0']", () => {
                expect(_.rounded.ss['0']()).toEqual({ borderStartStartRadius: '0' })
        })
        test('rounded.ss.full', () => {
                expect(_.rounded.ss.full()).toEqual({ borderStartStartRadius: 'calc(infinity * 1px)' })
        })
        test('rounded.ss[4]', () => {
                expect(_.rounded.ss[4]()).toEqual({ borderStartStartRadius: 'var(4)' })
        })
        test("rounded.se['0']", () => {
                expect(_.rounded.se['0']()).toEqual({ borderStartEndRadius: '0' })
        })
        test('rounded.se.full', () => {
                expect(_.rounded.se.full()).toEqual({ borderStartEndRadius: 'calc(infinity * 1px)' })
        })
        test('rounded.se[4]', () => {
                expect(_.rounded.se[4]()).toEqual({ borderStartEndRadius: 'var(4)' })
        })
        test("rounded.ee['0']", () => {
                expect(_.rounded.ee['0']()).toEqual({ borderEndEndRadius: '0' })
        })
        test('rounded.ee.full', () => {
                expect(_.rounded.ee.full()).toEqual({ borderEndEndRadius: 'calc(infinity * 1px)' })
        })
        test('rounded.ee[4]', () => {
                expect(_.rounded.ee[4]()).toEqual({ borderEndEndRadius: 'var(4)' })
        })
        test("rounded.es['0']", () => {
                expect(_.rounded.es['0']()).toEqual({ borderEndStartRadius: '0' })
        })
        test('rounded.es.full', () => {
                expect(_.rounded.es.full()).toEqual({ borderEndStartRadius: 'calc(infinity * 1px)' })
        })
        test('rounded.es[4]', () => {
                expect(_.rounded.es[4]()).toEqual({ borderEndStartRadius: 'var(4)' })
        })
        test("rounded.tl['0']", () => {
                expect(_.rounded.tl['0']()).toEqual({ borderTopLeftRadius: '0' })
        })
        test('rounded.tl.full', () => {
                expect(_.rounded.tl.full()).toEqual({ borderTopLeftRadius: 'calc(infinity * 1px)' })
        })
        test('rounded.tl[4]', () => {
                expect(_.rounded.tl[4]()).toEqual({ borderTopLeftRadius: 'var(4)' })
        })
        test("rounded.tr['0']", () => {
                expect(_.rounded.tr['0']()).toEqual({ borderTopRightRadius: '0' })
        })
        test('rounded.tr.full', () => {
                expect(_.rounded.tr.full()).toEqual({ borderTopRightRadius: 'calc(infinity * 1px)' })
        })
        test('rounded.tr[4]', () => {
                expect(_.rounded.tr[4]()).toEqual({ borderTopRightRadius: 'var(4)' })
        })
        test("rounded.br['0']", () => {
                expect(_.rounded.br['0']()).toEqual({ borderBottomRightRadius: '0' })
        })
        test('rounded.br.full', () => {
                expect(_.rounded.br.full()).toEqual({ borderBottomRightRadius: 'calc(infinity * 1px)' })
        })
        test('rounded.br[4]', () => {
                expect(_.rounded.br[4]()).toEqual({ borderBottomRightRadius: 'var(4)' })
        })
        test("rounded.bl['0']", () => {
                expect(_.rounded.bl['0']()).toEqual({ borderBottomLeftRadius: '0' })
        })
        test('rounded.bl.full', () => {
                expect(_.rounded.bl.full()).toEqual({ borderBottomLeftRadius: 'calc(infinity * 1px)' })
        })
        test('rounded.bl[4]', () => {
                expect(_.rounded.bl[4]()).toEqual({ borderBottomLeftRadius: 'var(4)' })
        })
})

describe('border-width', () => {
        test("border['1px']", () => {
                expect(_.border['1px']()).toEqual({ borderWidth: '1px' })
        })
        test('border[4]', () => {
                expect(_.border[4]()).toEqual({ borderWidth: '4px' })
        })
        test("border.x['1px']", () => {
                expect(_.border.x['1px']()).toEqual({ borderInlineWidth: '1px' })
        })
        test('border.x[4]', () => {
                expect(_.border.x[4]()).toEqual({ borderInlineWidth: '4px' })
        })
        test("border.y['1px']", () => {
                expect(_.border.y['1px']()).toEqual({ borderBlockWidth: '1px' })
        })
        test('border.y[4]', () => {
                expect(_.border.y[4]()).toEqual({ borderBlockWidth: '4px' })
        })
        test("border.s['1px']", () => {
                expect(_.border.s['1px']()).toEqual({ borderInlineStartWidth: '1px' })
        })
        test('border.s[4]', () => {
                expect(_.border.s[4]()).toEqual({ borderInlineStartWidth: '4px' })
        })
        test("border.e['1px']", () => {
                expect(_.border.e['1px']()).toEqual({ borderInlineEndWidth: '1px' })
        })
        test('border.e[4]', () => {
                expect(_.border.e[4]()).toEqual({ borderInlineEndWidth: '4px' })
        })
        test("border.t['1px']", () => {
                expect(_.border.t['1px']()).toEqual({ borderBlockStartWidth: '1px' })
        })
        test('border.bs[4]', () => {
                expect(_.border.bs[4]()).toEqual({ borderBlockStartWidth: '4px' })
        })
        test("border.b['1px']", () => {
                expect(_.border.b['1px']()).toEqual({ borderBlockEndWidth: '1px' })
        })
        test('border.be[4]', () => {
                expect(_.border.be[4]()).toEqual({ borderBlockEndWidth: '4px' })
        })
        test('border.t[4]', () => {
                expect(_.border.t[4]()).toEqual({ borderTopWidth: '4px' })
        })
        test("border.r['1px']", () => {
                expect(_.border.r['1px']()).toEqual({ borderRightWidth: '1px' })
        })
        test('border.r[4]', () => {
                expect(_.border.r[4]()).toEqual({ borderRightWidth: '4px' })
        })
        test('border.b[4]', () => {
                expect(_.border.b[4]()).toEqual({ borderBottomWidth: '4px' })
        })
        test("border.l['1px']", () => {
                expect(_.border.l['1px']()).toEqual({ borderLeftWidth: '1px' })
        })
        test('border.l[4]', () => {
                expect(_.border.l[4]()).toEqual({ borderLeftWidth: '4px' })
        })
        test('divide.x', () => {
                expect(_.divide.x()).toEqual({ '& > :not(:last-child)': { borderInlineStartWidth: '0px', borderInlineEndWidth: '1px' } })
        })
        test('divide.x[4]', () => {
                expect(_.divide.x[4]()).toEqual({ '& > :not(:last-child)': { borderInlineStartWidth: '0px', borderInlineEndWidth: '4px' } })
        })
        test('divide.y', () => {
                expect(_.divide.y()).toEqual({ '& > :not(:last-child)': { borderTopWidth: '0px', borderBottomWidth: '1px' } })
        })
        test('divide.y[4]', () => {
                expect(_.divide.y[4]()).toEqual({ '& > :not(:last-child)': { borderTopWidth: '0px', borderBottomWidth: '4px' } })
        })
})

describe('border-color', () => {
        test('border.inherit', () => {
                expect(_.border.inherit()).toEqual({ borderColor: 'inherit' })
        })
        test('border.currentColor', () => {
                expect(_.border.currentColor()).toEqual({ borderColor: 'currentColor' })
        })
        test('border.transparent', () => {
                expect(_.border.transparent()).toEqual({ borderColor: 'transparent' })
        })
        test('border.x.inherit', () => {
                expect(_.border.x.inherit()).toEqual({ borderInlineColor: 'inherit' })
        })
        test('border.x.currentColor', () => {
                expect(_.border.x.currentColor()).toEqual({ borderInlineColor: 'currentColor' })
        })
        test('border.x.transparent', () => {
                expect(_.border.x.transparent()).toEqual({ borderInlineColor: 'transparent' })
        })
        test('border.y.inherit', () => {
                expect(_.border.y.inherit()).toEqual({ borderBlockColor: 'inherit' })
        })
        test('border.y.currentColor', () => {
                expect(_.border.y.currentColor()).toEqual({ borderBlockColor: 'currentColor' })
        })
        test('border.y.transparent', () => {
                expect(_.border.y.transparent()).toEqual({ borderBlockColor: 'transparent' })
        })
        test('border.s.inherit', () => {
                expect(_.border.s.inherit()).toEqual({ borderInlineStartColor: 'inherit' })
        })
        test('border.s.currentColor', () => {
                expect(_.border.s.currentColor()).toEqual({ borderInlineStartColor: 'currentColor' })
        })
        test('border.s.transparent', () => {
                expect(_.border.s.transparent()).toEqual({ borderInlineStartColor: 'transparent' })
        })
        test('border.e.inherit', () => {
                expect(_.border.e.inherit()).toEqual({ borderInlineEndColor: 'inherit' })
        })
        test('border.e.currentColor', () => {
                expect(_.border.e.currentColor()).toEqual({ borderInlineEndColor: 'currentColor' })
        })
        test('border.e.transparent', () => {
                expect(_.border.e.transparent()).toEqual({ borderInlineEndColor: 'transparent' })
        })
        test('border.t.inherit', () => {
                expect(_.border.t.inherit()).toEqual({ borderBlockStartColor: 'inherit' })
        })
        test('border.t.currentColor', () => {
                expect(_.border.t.currentColor()).toEqual({ borderBlockStartColor: 'currentColor' })
        })
        test('border.t.transparent', () => {
                expect(_.border.t.transparent()).toEqual({ borderBlockStartColor: 'transparent' })
        })
        test('border.b.inherit', () => {
                expect(_.border.b.inherit()).toEqual({ borderBlockEndColor: 'inherit' })
        })
        test('border.b.currentColor', () => {
                expect(_.border.b.currentColor()).toEqual({ borderBlockEndColor: 'currentColor' })
        })
        test('border.b.transparent', () => {
                expect(_.border.b.transparent()).toEqual({ borderBlockEndColor: 'transparent' })
        })
        test('border.r.inherit', () => {
                expect(_.border.r.inherit()).toEqual({ borderRightColor: 'inherit' })
        })
        test('border.r.currentColor', () => {
                expect(_.border.r.currentColor()).toEqual({ borderRightColor: 'currentColor' })
        })
        test('border.r.transparent', () => {
                expect(_.border.r.transparent()).toEqual({ borderRightColor: 'transparent' })
        })
        test('border.l.inherit', () => {
                expect(_.border.l.inherit()).toEqual({ borderLeftColor: 'inherit' })
        })
        test('border.l.currentColor', () => {
                expect(_.border.l.currentColor()).toEqual({ borderLeftColor: 'currentColor' })
        })
        test('border.l.transparent', () => {
                expect(_.border.l.transparent()).toEqual({ borderLeftColor: 'transparent' })
        })
        test('divide.inherit', () => {
                expect(_.divide.inherit()).toEqual({ '& > :not(:last-child)': { borderColor: 'inherit' } })
        })
        test('divide.current', () => {
                expect(_.divide.current()).toEqual({ '& > :not(:last-child)': { borderColor: 'currentColor' } })
        })
        test('divide.transparent', () => {
                expect(_.divide.transparent()).toEqual({ '& > :not(:last-child)': { borderColor: 'transparent' } })
        })
        test('divide[4]', () => {
                expect(_.divide[4]()).toEqual({ '& > :not(:last-child)': { borderColor: '4' } })
        })
})

describe('border-style', () => {
        test('border.solid', () => {
                expect(_.border.solid()).toEqual({ borderStyle: 'solid' })
        })
        test('border.dashed', () => {
                expect(_.border.dashed()).toEqual({ borderStyle: 'dashed' })
        })
        test('border.dotted', () => {
                expect(_.border.dotted()).toEqual({ borderStyle: 'dotted' })
        })
        test('border.double', () => {
                expect(_.border.double()).toEqual({ borderStyle: 'double' })
        })
        test('border.hidden', () => {
                expect(_.border.hidden()).toEqual({ borderStyle: 'hidden' })
        })
        test('border.none', () => {
                expect(_.border.none()).toEqual({ borderStyle: 'none' })
        })
        test('divide.solid', () => {
                expect(_.divide.solid()).toEqual({ '& > :not(:last-child)': { borderStyle: 'solid' } })
        })
        test('divide.dashed', () => {
                expect(_.divide.dashed()).toEqual({ '& > :not(:last-child)': { borderStyle: 'dashed' } })
        })
        test('divide.dotted', () => {
                expect(_.divide.dotted()).toEqual({ '& > :not(:last-child)': { borderStyle: 'dotted' } })
        })
        test('divide.double', () => {
                expect(_.divide.double()).toEqual({ '& > :not(:last-child)': { borderStyle: 'double' } })
        })
        test('divide.hidden', () => {
                expect(_.divide.hidden()).toEqual({ '& > :not(:last-child)': { borderStyle: 'hidden' } })
        })
        test('divide.none', () => {
                expect(_.divide.none()).toEqual({ '& > :not(:last-child)': { borderStyle: 'none' } })
        })
})

describe('outline-width', () => {
        test("outline['1px']", () => {
                expect(_.outline['1px']()).toEqual({ outlineWidth: '1px' })
        })
        test('outline[4]', () => {
                expect(_.outline[4]()).toEqual({ outlineWidth: '4px' })
        })
})

describe('outline-color', () => {
        test('outline.inherit', () => {
                expect(_.outline.inherit()).toEqual({ outlineColor: 'inherit' })
        })
        test('outline.currentColor', () => {
                expect(_.outline.currentColor()).toEqual({ outlineColor: 'currentColor' })
        })
        test('outline.transparent', () => {
                expect(_.outline.transparent()).toEqual({ outlineColor: 'transparent' })
        })
})

describe('outline-style', () => {
        test('outline.solid', () => {
                expect(_.outline.solid()).toEqual({ outlineStyle: 'solid' })
        })
        test('outline.dashed', () => {
                expect(_.outline.dashed()).toEqual({ outlineStyle: 'dashed' })
        })
        test('outline.dotted', () => {
                expect(_.outline.dotted()).toEqual({ outlineStyle: 'dotted' })
        })
        test('outline.double', () => {
                expect(_.outline.double()).toEqual({ outlineStyle: 'double' })
        })
        test('outline.none', () => {
                expect(_.outline.none()).toEqual({ outlineStyle: 'none' })
        })
        test('outline.hidden', () => {
                expect(_.outline.hidden()).toEqual({ outline: '2px solid transparent', outlineOffset: '2px' })
        })
})

describe('outline-offset', () => {
        test('outline.offset[4]', () => {
                expect(_.outline.offset[4]()).toEqual({ outlineOffset: '4px' })
        })
})
