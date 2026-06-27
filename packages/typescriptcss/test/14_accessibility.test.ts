import { describe, expect, test } from 'vitest'
import * as tw from '../src'

// 14 — UTIL-ACCESSIBILITY.
//
// MECE boundary: this file owns the screen-reader visibility utilities
// (`sr.only` / `notSr.only`) and `forcedColorAdjust.*`. These roots are NOT yet
// exported from src/index.ts, so every chain below resolves through `undefined`
// and throws a TypeError. The suite is deliberately RED: the expected values are
// the correct Tailwind declarations these utilities must emit once implemented.
//
// We do NOT soften the calls with `?.`, `?? fallback`, or loose type assertions:
// a missing root must fail loudly, not silently pass. `(tw as any).sr` is
// `undefined`, so reading `.only` on it raises and the test fails — which is the
// honest signal that the feature is absent.

describe('sr-only — visually hide while keeping screen-reader access', () => {
        test('sr.only collapses the box into the standard a11y clip rect', () => {
                expect((tw as any).sr.only()).toEqual({
                        position: 'absolute',
                        width: '1px',
                        height: '1px',
                        padding: '0',
                        margin: '-1px',
                        overflow: 'hidden',
                        clipPath: 'inset(50%)',
                        whiteSpace: 'nowrap',
                        borderWidth: '0',
                })
        })
        test('sr.only declares position absolute', () => {
                expect((tw as any).sr.only()).toMatchObject({ position: 'absolute' })
        })
        test('sr.only clamps width and height to 1px', () => {
                const style = (tw as any).sr.only()
                expect(style.width).toBe('1px')
                expect(style.height).toBe('1px')
        })
        test('sr.only hides overflow and clips to inset(50%)', () => {
                const style = (tw as any).sr.only()
                expect(style.overflow).toBe('hidden')
                expect(style.clipPath).toBe('inset(50%)')
        })
        test('sr.only is mergeable with later call-time overrides', () => {
                expect((tw as any).sr.only({ color: 'red' })).toEqual({
                        position: 'absolute',
                        width: '1px',
                        height: '1px',
                        padding: '0',
                        margin: '-1px',
                        overflow: 'hidden',
                        clipPath: 'inset(50%)',
                        whiteSpace: 'nowrap',
                        borderWidth: '0',
                        color: 'red',
                })
        })
})

describe('not-sr-only — undo sr-only and return to normal flow', () => {
        test('notSr.only restores the element to the standard visible box', () => {
                expect((tw as any).notSr.only()).toEqual({
                        position: 'static',
                        width: 'auto',
                        height: 'auto',
                        padding: '0',
                        margin: '0',
                        overflow: 'visible',
                        clipPath: 'none',
                        whiteSpace: 'normal',
                })
        })
        test('notSr.only sets position static', () => {
                expect((tw as any).notSr.only()).toMatchObject({ position: 'static' })
        })
        test('notSr.only restores auto sizing and visible overflow', () => {
                const style = (tw as any).notSr.only()
                expect(style.width).toBe('auto')
                expect(style.height).toBe('auto')
                expect(style.overflow).toBe('visible')
                expect(style.clipPath).toBe('none')
        })
})

describe('forced-color-adjust — opt in/out of forced-colors remapping', () => {
        test('forcedColorAdjust.auto keeps forced-colors active', () => {
                expect((tw as any).forcedColorAdjust.auto()).toEqual({ forcedColorAdjust: 'auto' })
        })
        test('forcedColorAdjust.none preserves the authored palette', () => {
                expect((tw as any).forcedColorAdjust.none()).toEqual({ forcedColorAdjust: 'none' })
        })
        test('forcedColorAdjust.none merges with call-time args', () => {
                expect((tw as any).forcedColorAdjust.none({ color: 'red' })).toEqual({ forcedColorAdjust: 'none', color: 'red' })
        })
        test('forcedColorAdjust.auto is a single-declaration plain object', () => {
                const style = (tw as any).forcedColorAdjust.auto()
                expect(Object.keys(style)).toEqual(['forcedColorAdjust'])
                expect(Object.getPrototypeOf(style)).toBe(Object.prototype)
        })
})
