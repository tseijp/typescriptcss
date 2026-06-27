import { describe, expect, test } from 'vitest'
import * as _ from '../src'

// 14 — UTIL-ACCESSIBILITY.
//
// MECE boundary: this file owns the three accessibility utility families that
// Tailwind ships and typescriptcss documents — screen-reader visibility
// (`sr.only` / `notSr.only`) and the `forcedColorAdjust.*` keyword pair. None of
// these roots are exported from src/index.ts, so every chain below reads through
// an `undefined` root and throws a TypeError at the first member access. That is
// the honest, intended RED signal that the feature is absent.
//
// Per _REDESIGN.md absolute rules: every surface is enumerated with test.each
// (no representative sampling), expected values are the correct Tailwind
// declarations (not weakened to the runtime's current output), and the missing
// roots are read DIRECTLY — `_.sr.only()` — with no `?.`, no `?? fallback`, and
// no `as any`. Masking the access would silently pass; we want it to fail loudly.
//
// Note: `_.sr`, `_.notSr`, `_.forcedColorAdjust` are not on the Utility type, so
// these lines are also a type error. That is itself the indicator of an
// unimplemented surface and is intentionally left unsuppressed.

// --- sr-only ---------------------------------------------------------------
// Tailwind's `sr-only` clips the box to the canonical 1px a11y rect while
// keeping it in the accessibility tree.
const SR_ONLY = {
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: '0',
        margin: '-1px',
        overflow: 'hidden',
        clipPath: 'inset(50%)',
        whiteSpace: 'nowrap',
        borderWidth: '0',
}

// --- not-sr-only -----------------------------------------------------------
// `not-sr-only` reverses `sr-only`, returning the element to the normal flow.
const NOT_SR_ONLY = {
        position: 'static',
        width: 'auto',
        height: 'auto',
        padding: '0',
        margin: '0',
        overflow: 'visible',
        clipPath: 'none',
        whiteSpace: 'normal',
}

describe('sr.only — full declaration set (one assertion per CSS property)', () => {
        const decls = Object.entries(SR_ONLY)
        test('sr.only emits exactly the sr-only declaration block', () => {
                expect(_.sr.only()).toEqual(SR_ONLY)
        })
        test.each(decls)('sr.only sets %s: %s', (prop, value) => {
                expect((_.sr.only() as Record<string, unknown>)[prop]).toBe(value)
        })
        test('sr.only result is a plain object with exactly these keys', () => {
                const style = _.sr.only()
                expect(Object.keys(style).sort()).toEqual(Object.keys(SR_ONLY).sort())
                expect(Object.getPrototypeOf(style)).toBe(Object.prototype)
        })
        test('sr.only merges call-time overrides', () => {
                expect(_.sr.only({ color: 'red' })).toEqual({ ...SR_ONLY, color: 'red' })
        })
})

describe('notSr.only — full declaration set (one assertion per CSS property)', () => {
        const decls = Object.entries(NOT_SR_ONLY)
        test('notSr.only emits exactly the not-sr-only declaration block', () => {
                expect(_.notSr.only()).toEqual(NOT_SR_ONLY)
        })
        test.each(decls)('notSr.only sets %s: %s', (prop, value) => {
                expect((_.notSr.only() as Record<string, unknown>)[prop]).toBe(value)
        })
        test('notSr.only result is a plain object with exactly these keys', () => {
                const style = _.notSr.only()
                expect(Object.keys(style).sort()).toEqual(Object.keys(NOT_SR_ONLY).sort())
                expect(Object.getPrototypeOf(style)).toBe(Object.prototype)
        })
        test('notSr.only merges call-time overrides', () => {
                expect(_.notSr.only({ display: 'block' })).toEqual({ ...NOT_SR_ONLY, display: 'block' })
        })
})

describe('forcedColorAdjust — the forced-colors opt in/out keyword pair', () => {
        const cases: Array<[string, string]> = [
                ['auto', 'auto'],
                ['none', 'none'],
        ]
        test.each(cases)('forcedColorAdjust.%s → { forcedColorAdjust: "%s" }', (word, value) => {
                expect(_.forcedColorAdjust[word]()).toEqual({ forcedColorAdjust: value })
        })
        test('forcedColorAdjust.none merges call-time args', () => {
                expect(_.forcedColorAdjust.none({ color: 'red' })).toEqual({ forcedColorAdjust: 'none', color: 'red' })
        })
        test('forcedColorAdjust.auto is a single-declaration plain object', () => {
                const style = _.forcedColorAdjust.auto()
                expect(Object.keys(style)).toEqual(['forcedColorAdjust'])
                expect(Object.getPrototypeOf(style)).toBe(Object.prototype)
        })
})
