import { describe, expect, test } from 'vitest'
import * as tw from '../src'
import { styleEqual } from './_helpers.ts'

// Chapter 21 — COMPOSITION.
//
// MECE scope: this file is exclusively about what happens when *multiple*
// segments are chained together. The single-utility -> single-declaration
// mappings (one segment, one property) already live in 00..13 and are NOT
// re-checked here. Here we assert the composition algebra only:
//   - accumulation across independent properties,
//   - last-write-wins on a repeated property,
//   - order-independence for independent properties,
//   - call-argument override of accumulated declarations,
//   - the filter / transform / gradient / shadow families that are still
//     unimplemented (those segments are accessed directly so they go RED).
//
// Implemented spacing/flex/grid families compose -> GREEN.
// Unimplemented filter/transform-scale/gradient/shadow roots -> RED on access.

describe('accumulation across independent properties', () => {
        test('p[4].m[2] keeps both declarations', () => {
                expect(tw.p[4].m[2]()).toEqual({ padding: '16px', margin: '8px' })
        })
        test('px[2].py[3] keeps both axis declarations', () => {
                expect(tw.px[2].py[3]()).toEqual({ paddingLeft: '8px', paddingRight: '8px', paddingBottom: '12px', paddingTop: '12px' })
        })
        test('p[4].px[8] adds axis on top of shorthand', () => {
                expect(tw.p[4].px[8]()).toEqual({ padding: '16px', paddingLeft: '32px', paddingRight: '32px' })
        })
        test('three independent props accumulate', () => {
                expect(tw.p[1].m[2].gap[3]()).toEqual({ padding: '4px', margin: '8px', gap: '12px' })
        })
        test('flex.col.gap[4] accumulates display + direction + gap', () => {
                expect(tw.flex.col.gap[4]()).toEqual({ display: 'flex', flexDirection: 'column', gap: '16px' })
        })
        test('flex.row.items.center composes flex scope then items group', () => {
                expect(tw.flex.row.items.center()).toEqual({ display: 'flex', flexDirection: 'row', alignItems: 'center' })
        })
        test('gap.x[2].gap.y[3] accumulates both gap axes', () => {
                expect(tw.gap.x[2].gap.y[3]()).toEqual({ columnGap: '8px', rowGap: '12px' })
        })
        test('grid.cols[3].gap[4] composes display + template + gap', () => {
                expect(tw.grid.cols[3].gap[4]()).toEqual({ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px' })
        })
})

describe('last-write-wins on a repeated property', () => {
        test('p[4].p[8] -> only the last padding survives', () => {
                expect(tw.p[4].p[8]()).toEqual({ padding: '32px' })
        })
        test('m[2].m[4].m[6] -> only the final margin survives', () => {
                expect(tw.m[2].m[4].m[6]()).toEqual({ margin: '24px' })
        })
        test('gap[2].gap[5] -> last gap wins', () => {
                expect(tw.gap[2].gap[5]()).toEqual({ gap: '20px' })
        })
        test('flex.col.flex.row -> last direction wins, display kept once', () => {
                expect(tw.flex.col.flex.row()).toEqual({ display: 'flex', flexDirection: 'row' })
        })
        test('leading override only touches lineHeight, font-size preserved', () => {
                // text.base seeds fontSize+lineHeight; leading[10] must override lineHeight only.
                expect(tw.text.base.leading[10]()).toEqual({ fontSize: '16px', lineHeight: '40px' })
        })
        test('font-size override via leading then text.base re-seeds both', () => {
                expect(tw.leading[10].text.base()).toEqual({ fontSize: '16px', lineHeight: '24px' })
        })
})

describe('order-independence for independent properties', () => {
        test('p[4].m[2] === m[2].p[4]', () => {
                expect(styleEqual(tw.p[4].m[2](), tw.m[2].p[4]())).toBe(true)
        })
        test('gap.x[2].gap.y[3] === gap.y[3].gap.x[2]', () => {
                expect(styleEqual(tw.gap.x[2].gap.y[3](), tw.gap.y[3].gap.x[2]())).toBe(true)
        })
        test('px[2].py[3] === py[3].px[2]', () => {
                expect(styleEqual(tw.px[2].py[3](), tw.py[3].px[2]())).toBe(true)
        })
        test('p[4].m[2].h[8] is permutation-invariant', () => {
                expect(styleEqual(tw.p[4].m[2].h[8](), tw.h[8].p[4].m[2]())).toBe(true)
                expect(styleEqual(tw.p[4].m[2].h[8](), tw.m[2].h[8].p[4]())).toBe(true)
        })
})

describe('call-argument override of accumulated declarations', () => {
        test('inline arg overrides a previously accumulated property', () => {
                expect(tw.p[4]({ padding: '0px' })).toEqual({ padding: '0px' })
        })
        test('inline arg adds a brand-new property', () => {
                expect(tw.p[4]({ color: 'red' })).toEqual({ padding: '16px', color: 'red' })
        })
        test('later inline arg wins over earlier inline arg', () => {
                expect(tw.m[2]({ margin: '1px' }, { margin: '2px' })).toEqual({ margin: '2px' })
        })
        test('flex.col(arg) merges arg after composed declarations', () => {
                expect(tw.flex.col({ color: 'red' })).toEqual({ display: 'flex', flexDirection: 'column', color: 'red' })
        })
        test('falsy args (null/false/undefined) are ignored', () => {
                expect(tw.flex.col(null as never, false as never, undefined)).toEqual({ display: 'flex', flexDirection: 'column' })
        })
        test('call with no args returns the composed object', () => {
                expect(tw.p[4].m[2]()).toEqual({ padding: '16px', margin: '8px' })
        })
})

describe('finished composite is a fresh plain object each call', () => {
        test('repeated calls produce equal but non-identical objects', () => {
                const chain = tw.p[4].m[2]
                const a = chain()
                const b = chain()
                expect(a).toEqual(b)
                expect(a).not.toBe(b)
        })
        test('mutating one result does not leak into the next', () => {
                const chain = tw.p[4]
                const a = chain() as Record<string, unknown>
                a.padding = 'MUTATED'
                expect(chain()).toEqual({ padding: '16px' })
        })
})

// Helper: a typed escape hatch for roots that are intentionally not exported
// yet. Reading `.scale` etc. yields undefined, so the property access below
// throws — that thrown error is the RED signal for the unimplemented root.
const u = tw as unknown as Record<string, Record<string | number, () => Record<string, string>>>

describe('transform family — translate single-axis GREEN; multi-axis accumulation RED', () => {
        test('translate.x single axis writes transform (GREEN)', () => {
                expect(tw.translate.x[4]()).toEqual({ transform: 'translateX(16px)' })
        })
        test('translate.y single axis writes transform (GREEN)', () => {
                expect(tw.translate.y[8]()).toEqual({ transform: 'translateY(32px)' })
        })
        test('translate.x[4].translate.y[8] should accumulate transform functions (RED — currently overwrites)', () => {
                // Documents the transform-accumulation gap: two transform writes must
                // concatenate, not last-write-wins.
                expect(tw.translate.x[4].translate.y[8]()).toEqual({ transform: 'translateX(16px) translateY(32px)' })
        })
        test('scale root unimplemented — accumulates into transform (RED)', () => {
                expect(u.scale[4]()).toEqual({ transform: 'scale(4)' })
        })
        test('rotate root unimplemented — accumulates into transform (RED)', () => {
                expect(u.rotate[45]()).toEqual({ transform: 'rotate(45deg)' })
        })
        test('skew root unimplemented (RED)', () => {
                expect((u.skew as unknown as Record<string, Record<number, () => Record<string, string>>>).x[3]()).toEqual({ transform: 'skewX(3deg)' })
        })
})

describe('filter family — unimplemented roots compose into one filter (RED)', () => {
        test('blur root unimplemented (RED)', () => {
                expect(u.blur[4]()).toEqual({ filter: 'blur(16px)' })
        })
        test('brightness root unimplemented (RED)', () => {
                expect(u.brightness[50]()).toEqual({ filter: 'brightness(0.5)' })
        })
        test('blur then brightness should accumulate into one filter (RED)', () => {
                expect(u.blur[4].brightness[50]()).toEqual({ filter: 'blur(16px) brightness(0.5)' })
        })
})

describe('gradient family — unimplemented roots (RED)', () => {
        test('from root unimplemented (RED)', () => {
                expect((u.from as unknown as Record<string, Record<number, () => Record<string, string>>>).blue[500]()).toEqual({ '--tw-gradient-from': 'blue' })
        })
        test('to root unimplemented (RED)', () => {
                expect((u.to as unknown as Record<string, Record<number, () => Record<string, string>>>).red[500]()).toEqual({ '--tw-gradient-to': 'red' })
        })
})

describe('shadow family — unimplemented root (RED)', () => {
        test('shadow root unimplemented (RED)', () => {
                expect((u.shadow as unknown as Record<string, () => Record<string, string>>).lg()).toEqual({ boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' })
        })
})
