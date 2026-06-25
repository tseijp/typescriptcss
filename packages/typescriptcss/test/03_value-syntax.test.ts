import { describe, it, expect } from 'vitest'
import { p, m, w, bg, text, size, leading, inset } from '../src/index.ts'
import { assertNoLeakedMarkers } from './_helpers.ts'

describe('VALUE-001 integers, zero, negatives', () => {
        it('positive integer scale multiplies by 4px', () => {
                expect(p[2]()).toEqual({ padding: '8px' })
                expect(p[10]()).toEqual({ padding: '40px' })
        })
        it('zero scale is 0px', () => {
                expect(p[0]()).toEqual({ padding: '0px' })
        })
        it('negative integer scale yields a negative length', () => {
                expect((m as unknown as Record<number, () => Record<string, unknown>>)[-2]()).toEqual({ margin: '-8px' })
        })
})

describe('VALUE-002 fractional and extreme numbers', () => {
        it('fractional scale keeps precision in px math', () => {
                expect((p as unknown as Record<number, () => Record<string, unknown>>)[0.5]()).toEqual({ padding: '2px' })
        })
        it('large number does not overflow to a non-finite value', () => {
                const out = (p as unknown as Record<number, () => Record<string, unknown>>)[1e6]()
                expect(out.padding).toBe('4000000px')
        })
})

describe('VALUE-003 non-finite and empty inputs are rejected by the scale read', () => {
        it('a non-numeric token does not produce a scale length on a numeric-only utility', () => {
                const out = (p as unknown as Record<string, () => Record<string, unknown>>).abc()
                expect('padding' in out).toBe(false)
        })
        it('the empty-string key is reserved and resolves to undefined, not a chain', () => {
                expect((p as unknown as Record<string, unknown>)['']).toBeUndefined()
        })
})

describe('VALUE-004 sizing keywords are not confused with the numeric scale', () => {
        it('full / screen / dvh map to their CSS forms', () => {
                expect(w.full()).toEqual({ width: '100%' })
                expect(w.screen()).toEqual({ width: '100vw' })
                expect(w.dvh()).toEqual({ width: '100dvh' })
        })
        it('size accepts numeric and keyword sizing', () => {
                expect(size[8]()).toEqual({ width: '32px', height: '32px' })
                expect(size.full()).toEqual({ width: '100%', height: '100%' })
        })
})

describe('VALUE-005 raw CSS color values', () => {
        const colors = ['#0b1120', '#fff', 'rgb(1,2,3)', 'rgba(1,2,3,0.5)', 'hsl(1 2% 3%)', 'oklch(98.5% 0 0)', 'transparent', 'currentColor', 'rebeccapurple']
        for (const c of colors) {
                it(`bg accepts ${c} verbatim`, () => {
                        expect((bg as unknown as Record<string, () => Record<string, unknown>>)[c]()).toEqual({ background: c })
                })
        }
})

describe('VALUE-006 CSS variable references', () => {
        it('var() is preserved as a color value', () => {
                expect((bg as unknown as Record<string, () => Record<string, unknown>>)['var(--accent)']()).toEqual({ background: 'var(--accent)' })
        })
        it('var() with fallback is preserved verbatim', () => {
                const v = 'var(--accent, #fff)'
                expect((bg as unknown as Record<string, () => Record<string, unknown>>)[v]()).toEqual({ background: v })
        })
})

describe('VALUE-007 arbitrary functional values keep whitespace and nesting', () => {
        const arbitraries = ['calc(100% - 8px)', 'min(10px, 2rem)', 'max(10px, 2rem)', 'clamp(1rem, 2vw, 3rem)', 'calc(min(10px, 1rem) + 2px)']
        for (const v of arbitraries) {
                it(`color path preserves ${v} verbatim`, () => {
                        expect((bg as unknown as Record<string, () => Record<string, unknown>>)[v]()).toEqual({ background: v })
                })
        }
        for (const v of arbitraries) {
                it.fails(`[RED unsupported] length utility rejects arbitrary value ${v}`, () => {
                        expect((w as unknown as Record<string, () => Record<string, unknown>>)[v]()).toEqual({ width: v })
                })
        }
})

describe('VALUE-008 arbitrary string values survive access and serialization', () => {
        const v = 'url("a b/c?d=1")'
        it('url with quotes/spaces round-trips through JSON', () => {
                const out = (bg as unknown as Record<string, () => Record<string, unknown>>)[v]()
                expect(out).toEqual({ background: v })
                expect(JSON.parse(JSON.stringify(out))).toEqual({ background: v })
        })
        it('unicode value is preserved', () => {
                const u = '"日本語"'
                expect((bg as unknown as Record<string, () => Record<string, unknown>>)[u]()).toEqual({ background: u })
        })
})

describe('VALUE-009 modifier-shaped values', () => {
        it('leading numeric scale is line-height in px', () => {
                expect(leading[6]()).toEqual({ lineHeight: '24px' })
        })
        it('text raw value path is independent of the numeric size path', () => {
                expect(text[5]()).toEqual({ fontSize: '20px' })
                expect(text['1.5']()).toEqual({ fontSize: '6px' })
        })
})

describe('VALUE-010 arbitrary native property/value pairs do not swap', () => {
        it('inset numeric uses the x4 scale', () => {
                expect(inset[2]()).toEqual({ inset: '8px' })
        })
        it('inset raw value is passed through under the inset property', () => {
                expect((inset as unknown as Record<string, () => Record<string, unknown>>)['10%']()).toEqual({ inset: '10%' })
        })
})

describe('VALUE-011 nullish/boolean call arguments vs CSS values', () => {
        it('nullish/false args are skipped, never serialized into the style', () => {
                const out = p[2](null, false, undefined)
                expect(out).toEqual({ padding: '8px' })
                expect(assertNoLeakedMarkers(out)).toEqual([])
        })
        it('an object whose value is a boolean is kept verbatim (caller responsibility)', () => {
                const out = p[2]({ flexGrow: 0 })
                expect(out).toEqual({ padding: '8px', flexGrow: 0 })
        })
})

describe('VALUE-012 number vs numeric-string equivalence on scale utilities', () => {
        it('p[2] and p["2"] are meaning-equal', () => {
                const a = p[2]()
                const b = (p as unknown as Record<string, () => Record<string, unknown>>)['2']()
                expect(a).toEqual(b)
        })
})
