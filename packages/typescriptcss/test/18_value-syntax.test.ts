import { describe, expect, test } from 'vitest'
import { bg, gap, h, leading, m, p, rounded, text, w } from '../src'

// 18 — value-syntax acceptance / rejection boundaries of the chain runtime.
//
// Scope (MECE vs. the docs-derived suites 00–13): those suites assert the
// *documented* spec value for each utility key. This file instead pins the
// *runtime* acceptance contract of the shared value readers in src/utils.ts —
// which keys a reader accepts, which it rejects, and how the raw key text is
// preserved or transformed. It deliberately avoids re-testing any specific
// utility/key pair already covered by 00–13 (e.g. w['1px'], size.full,
// text[4]→var(4)); it targets the reader semantics those suites do not.
//
// Most cases here exercise implemented readers (scaleRule / lengthRule /
// colorRule / numericRule / darkRule) and are GREEN. A few pin the
// rejection boundary (numeric readers must drop non-numeric keys) and are RED
// where the runtime currently still emits something.

describe('numeric scale — integer and zero', () => {
        // scaleRule multiplies the numeric key by 4 and appends px (x4).
        test('p[0] → 0px', () => {
                expect(p[0]()).toEqual({ padding: '0px' })
        })
        test('p[4] → 16px', () => {
                expect(p[4]()).toEqual({ padding: '16px' })
        })
        test('m[1] → 4px', () => {
                expect(m[1]()).toEqual({ margin: '4px' })
        })
        test('gap[2] → 8px (scoped scale)', () => {
                expect(gap[2]()).toEqual({ gap: '8px' })
        })
        test('leading[4] → 16px (lineHeight scale)', () => {
                expect(leading[4]()).toEqual({ lineHeight: '16px' })
        })
        test('rounded[2] → 8px (rounded numeric reader)', () => {
                expect(rounded[2]()).toEqual({ borderRadius: '8px' })
        })
})

describe('numeric scale — rejects non-numeric string keys', () => {
        // numericRule / scaleRule must return undefined for a non-numeric key, so the
        // reader contributes nothing and the property never appears. A naive fallback
        // that echoes the key back as a value would violate this.
        test('p["abc"] does not emit a padding declaration', () => {
                const style = p['abc']() as Record<string, unknown>
                expect(style.padding).toBeUndefined()
                expect(Object.values(style)).not.toContain('abc')
        })
        test('gap["xx"] does not emit a gap declaration', () => {
                const style = gap['xx']() as Record<string, unknown>
                expect(style.gap).toBeUndefined()
                expect(Object.values(style)).not.toContain('xx')
        })
        test('leading["loose"] does not emit a lineHeight declaration', () => {
                const style = leading['loose']() as Record<string, unknown>
                expect(style.lineHeight).toBeUndefined()
        })
})

describe('sizing keyword — implemented length keywords full / screen / dvh', () => {
        // lengthRule accepts exactly three keyword sizes besides numbers.
        test('w.full → 100%', () => {
                expect(w.full()).toEqual({ width: '100%' })
        })
        test('w.screen → 100vw', () => {
                expect(w.screen()).toEqual({ width: '100vw' })
        })
        test('w.dvh → 100dvh', () => {
                expect(w.dvh()).toEqual({ width: '100dvh' })
        })
        test('h.full → 100%', () => {
                expect(h.full()).toEqual({ height: '100%' })
        })
        test('h.screen → 100vw', () => {
                expect(h.screen()).toEqual({ height: '100vw' })
        })
        test('w[4] numeric still scales to 16px', () => {
                expect(w[4]()).toEqual({ width: '16px' })
        })
})

describe('raw color — hex / oklch / rgb / var passthrough', () => {
        // colorRule (no dark) returns the key verbatim as the property value.
        test("bg['#fff'] keeps the hex literal", () => {
                expect(bg['#fff']()).toEqual({ background: '#fff' })
        })
        test("bg['#1a2b3c'] keeps a 6-digit hex literal", () => {
                expect(bg['#1a2b3c']()).toEqual({ background: '#1a2b3c' })
        })
        test("bg['oklch(0.7 0.1 200)'] keeps the oklch() literal", () => {
                expect(bg['oklch(0.7 0.1 200)']()).toEqual({ background: 'oklch(0.7 0.1 200)' })
        })
        test("bg['rgb(0, 0, 0)'] keeps the rgb() literal", () => {
                expect(bg['rgb(0, 0, 0)']()).toEqual({ background: 'rgb(0, 0, 0)' })
        })
        test("text['#abc'] keeps the hex literal as color", () => {
                expect(text['#abc']()).toEqual({ color: '#abc' })
        })
})

describe('var() / calc() function literals', () => {
        // Function-value strings flow through the greedy color reader / length reader
        // unchanged where the reader accepts them.
        test("bg['var(--brand)'] keeps the var() literal", () => {
                expect(bg['var(--brand)']()).toEqual({ background: 'var(--brand)' })
        })
        test("text['var(--ink)'] keeps the var() literal as color", () => {
                expect(text['var(--ink)']()).toEqual({ color: 'var(--ink)' })
        })
        test("w['calc(100% - 1px)'] is rejected by the numeric length reader", () => {
                // lengthRule only accepts numbers + full/screen/dvh, so calc() is dropped.
                const style = w['calc(100% - 1px)']() as Record<string, unknown>
                expect(style.width).toBeUndefined()
        })
})

describe('dark — light-dark() pairing on color readers', () => {
        // darkRule flips state.dark; the next color read wraps prior + new value.
        test("bg['#fff'].dark.bg['#000'] → light-dark(#fff, #000)", () => {
                expect(bg['#fff'].dark.bg['#000']()).toEqual({ colorScheme: 'light dark', background: 'light-dark(#fff, #000)' })
        })
        test("text['#111'].dark.text['#eee'] → light-dark color", () => {
                expect(text['#111'].dark.text['#eee']()).toEqual({ color: 'light-dark(#111, #eee)' })
        })
        // Boundary: when `.dark` comes BEFORE any color, the greedy color reader of
        // `bg` swallows the word "dark" instead of toggling dark mode, so the pairing
        // never forms. The *intended* result pairs against `initial`; the current
        // greedy-trap behaviour does not, so this pins the documented limitation (RED).
        test("dark-first: bg.dark.bg['#000'] should still pair against initial", () => {
                expect(bg.dark.bg['#000']()).toEqual({ colorScheme: 'light dark', background: 'light-dark(initial, #000)' })
        })
})

describe('numeric bracket key stringifies to a CSS string value', () => {
        // Value-TYPE contract (distinct from the call-arg merge contract in 15/21):
        // bracket-number access yields a string-keyed read, so the px result is a
        // string, never a JS number, keeping serialization stable.
        test('p[4] value is the string "16px", not a number', () => {
                const v = (p[4]() as Record<string, unknown>).padding
                expect(typeof v).toBe('string')
                expect(v).toBe('16px')
        })
        test('gap[2] value is the string "8px"', () => {
                expect(typeof (gap[2]() as Record<string, unknown>).gap).toBe('string')
        })
        test('rounded[4] value is a string px length', () => {
                expect(typeof (rounded[4]() as Record<string, unknown>).borderRadius).toBe('string')
        })
})
