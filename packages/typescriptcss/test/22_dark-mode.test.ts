import { describe, expect, test } from 'vitest'
import * as tw from '../src'

// Chapter 22 — DARK MODE.
//
// MECE scope: this file owns the dark-mode *pairing* semantics only — how a
// `dark.*` segment combines with a preceding/base color to emit a
// `light-dark(base, dark)` value. Plain (non-dark) color emission is owned by
// 05_backgrounds / 04_typography and is not re-checked except as the explicit
// non-leak boundary. Transform/filter composition is owned by 21.
//
// `dark` is implemented for the color families that flow their `dark` flag
// through `colorRule` / `textRule`:
//   - bg   -> light-dark on `background`         (GREEN)
//   - text -> light-dark on `color`              (GREEN)
//   - border color utility                        (GREEN, but does NOT pair)
// Families with no implemented root surface go RED on direct access:
//   - fill / stroke / shadow                      (RED)
// Activation must be flag-driven via the `dark` chain; there is no
// data-attribute-driven activation source yet (RED).

describe('light -> dark pairing produces light-dark(base, dark)', () => {
        test('bg: base then dark.bg pairs the two colors', () => {
                expect(tw.bg.white.dark.bg.black()).toEqual({ colorScheme: 'light dark', background: 'light-dark(white, black)' })
        })
        test('bg: pairing works with hex literals', () => {
                expect(tw.bg['#fff'].dark.bg['#000']()).toEqual({ colorScheme: 'light dark', background: 'light-dark(#fff, #000)' })
        })
        test('text: base then dark.text pairs the foreground colors', () => {
                expect(tw.text.white.dark.text.black()).toEqual({ color: 'light-dark(white, black)' })
        })
        test('bg pairing emits colorScheme so light-dark() resolves', () => {
                const out = tw.bg.blue.dark.bg.red()
                expect(out.colorScheme).toBe('light dark')
                expect(out.background).toBe('light-dark(blue, red)')
        })
        test('text pairing does not spuriously emit colorScheme', () => {
                expect(tw.text.blue.dark.text.red()).toEqual({ color: 'light-dark(blue, red)' })
        })
        test('bg pairing works with currentColor / transparent keywords', () => {
                expect(tw.bg.transparent.dark.bg.currentColor()).toEqual({ colorScheme: 'light dark', background: 'light-dark(transparent, currentColor)' })
        })
        test('bg: only the final dark color is paired (last dark wins)', () => {
                expect(tw.bg.white.dark.bg.black.dark.bg.red()).toEqual({ colorScheme: 'light dark', background: 'light-dark(light-dark(white, black), red)' })
        })
        test('text and bg pair independently in the same chain', () => {
                // bg pairing also emits colorScheme; text pairing does not add its own.
                expect(tw.text.white.bg.black.dark.text.black.dark.bg.white()).toEqual({ color: 'light-dark(white, black)', background: 'light-dark(black, white)', colorScheme: 'light dark' })
        })
})

describe('missing-base fallback', () => {
        test('bg: dark with no preceding base falls back to initial', () => {
                expect(tw.dark.bg.black()).toEqual({ colorScheme: 'light dark', background: 'light-dark(initial, black)' })
        })
        test('text: dark with no preceding base falls back to initial', () => {
                expect(tw.dark.text.black()).toEqual({ color: 'light-dark(initial, black)' })
        })
        test('bg: only the matching property is used as the base', () => {
                // A non-color declaration in scope must not become the light-dark base.
                expect(tw.p[4].dark.bg.black()).toEqual({ padding: '16px', colorScheme: 'light dark', background: 'light-dark(initial, black)' })
        })
})

describe('color family — bg/text pair (GREEN), border works without pairing (GREEN)', () => {
        test('bg without dark is a plain background (GREEN baseline)', () => {
                expect(tw.bg.red()).toEqual({ background: 'red' })
        })
        test('text without dark is a plain color (GREEN baseline)', () => {
                expect(tw.text.red()).toEqual({ color: 'red' })
        })
        test('border color utility produces a border (GREEN)', () => {
                expect(tw.border.red()).toEqual({ borderStyle: 'solid', borderWidth: '1px', borderColor: 'red' })
        })
        test('border does not currently participate in light-dark pairing', () => {
                // Documents that the border family carries no light-dark wrapping today;
                // it emits a plain borderColor even under a dark segment.
                expect(tw.dark.border.red()).toEqual({ borderStyle: 'solid', borderWidth: '1px', borderColor: 'red' })
        })
})

describe('non-leak boundary — dark must not bleed across independent chains', () => {
        test('a fresh bg chain after a dark chain is not paired', () => {
                void tw.dark.bg.black()
                expect(tw.bg.green()).toEqual({ background: 'green' })
        })
        test('dark applied to one property does not pair an unrelated property', () => {
                // gap is not a color family; it must stay a plain declaration.
                expect(tw.dark.bg.black.gap[4]()).toEqual({ colorScheme: 'light dark', background: 'light-dark(initial, black)', gap: '16px' })
        })
        test('non-dark sibling of a paired call stays unpaired', () => {
                const paired = tw.bg.white.dark.bg.black()
                const plain = tw.bg.white()
                expect(paired.background).toBe('light-dark(white, black)')
                expect(plain).toEqual({ background: 'white' })
        })
        test('calling a paired chain twice yields identical paired output (no accumulation drift)', () => {
                const chain = tw.bg.white.dark.bg.black
                expect(chain()).toEqual(chain())
                expect(chain()).toEqual({ colorScheme: 'light dark', background: 'light-dark(white, black)' })
        })
        test('a dark segment alone (no following color) leaves css untouched', () => {
                expect(tw.bg.white.dark()).toEqual({ background: 'white' })
        })
})

// Typed escape hatch for unimplemented dark color families.
const u = tw as unknown as Record<string, Record<string | number, () => Record<string, string>>>

describe('fill / stroke / shadow dark families — unimplemented (RED)', () => {
        test('fill dark pairing — root unimplemented (RED)', () => {
                expect((u.fill as unknown as Record<string, () => Record<string, string>>).black()).toEqual({ fill: 'black' })
        })
        test('stroke dark pairing — root unimplemented (RED)', () => {
                expect((u.stroke as unknown as Record<string, () => Record<string, string>>).black()).toEqual({ stroke: 'black' })
        })
        test('shadow dark pairing — root unimplemented (RED)', () => {
                expect((u.shadow as unknown as Record<string, () => Record<string, string>>).black()).toEqual({ boxShadow: 'black' })
        })
})

describe('activation source — only the dark chain activates pairing', () => {
        test('the dark chain is the activation flag (GREEN)', () => {
                expect(tw.bg.white.dark.bg.black().background).toBe('light-dark(white, black)')
        })
        test('data-attribute-driven activation is unimplemented (RED)', () => {
                // A `[data-theme=dark]` style activation source has no root surface yet.
                expect((u.data as unknown as Record<string, Record<string, Record<string, () => Record<string, string>>>>).theme.dark.bg.black()).toEqual({ '[data-theme=dark] &': { background: 'black' } })
        })
})
