import { describe, expect, test } from 'vitest'
import * as _ from '../src'

// 18 — value-syntax acceptance / rejection boundaries of the chain runtime.
//
// MECE boundary: 00–13 assert the documented spec value for each utility KEY.
// This file pins the runtime VALUE-DOMAIN contract of the shared readers in
// src/utils.ts — which value shapes a reader accepts, which it rejects, and how
// the raw key text is transformed. It enumerates each value domain in full
// (test.each, no sampling): integer scale, fractional scale, negative scale,
// length keywords, raw colour, var()/calc(), percentage, fraction, arbitrary
// bracket values, and light-dark pairing.
//
// Per _REDESIGN.md the expectations are the correct Tailwind values, never
// weakened to the current output. Implemented domains (scaleRule x4, lengthRule
// keywords, colorRule passthrough, darkRule pairing) are GREEN; value domains
// Tailwind supports but the runtime does NOT (percentage, fraction, arbitrary
// length, length var()/calc(), dark-first pairing) fail loudly (RED). No `?.`,
// no `?? fallback`, no `as any`; a rejected value yields a missing property which
// the assertion catches.

// --- GREEN: numeric scale (integer, zero, fractional, negative) -------------
describe('numeric scale — integer, zero, fractional, negative (x4 → px)', () => {
        const cases: Array<[string, () => Record<string, unknown>, Record<string, unknown>]> = [
                ['p[0] → 0px', () => _.p[0](), { padding: '0px' }],
                ['p[4] → 16px', () => _.p[4](), { padding: '16px' }],
                ['m[1] → 4px', () => _.m[1](), { margin: '4px' }],
                ['gap[2] → 8px', () => _.gap[2](), { gap: '8px' }],
                ['leading[4] → 16px', () => _.leading[4](), { lineHeight: '16px' }],
                ['rounded[2] → 8px', () => _.rounded[2](), { borderRadius: '8px' }],
                ['p[0.5] → 2px (fractional)', () => _.p['0.5'](), { padding: '2px' }],
                ['p[1.5] → 6px (fractional)', () => _.p['1.5'](), { padding: '6px' }],
                ['p[2.5] → 10px (fractional)', () => _.p['2.5'](), { padding: '10px' }],
                ['m[-1] → -4px (negative)', () => _.m['-1'](), { margin: '-4px' }],
                ['m[-4] → -16px (negative)', () => _.m['-4'](), { margin: '-16px' }],
        ]
        test.each(cases)('%s', (_n, fn, decl) => expect(fn()).toEqual(decl))
})

// --- GREEN: numeric reader rejects non-numeric tokens -----------------------
describe('numeric scale — rejects non-numeric string keys (no echo-back)', () => {
        const rejected: Array<[string, () => Record<string, unknown>, string]> = [
                ['p["abc"]', () => _.p['abc'](), 'padding'],
                ['gap["xx"]', () => _.gap['xx'](), 'gap'],
                ['leading["loose"]', () => _.leading['loose'](), 'lineHeight'],
                ['m["auto-ish"]', () => _.m['auto-ish'](), 'margin'],
        ]
        test.each(rejected)('%s emits no declaration and never echoes the key', (_n, fn, prop) => {
                const style = fn() as Record<string, unknown>
                expect(style[prop]).toBeUndefined()
                expect(Object.values(style)).not.toContain('abc')
        })
})

// --- GREEN: length keywords full / screen / dvh -----------------------------
describe('sizing keyword — implemented length keywords full / screen / dvh', () => {
        const cases: Array<[string, () => Record<string, unknown>, Record<string, unknown>]> = [
                ['w.full → 100%', () => _.w.full(), { width: '100%' }],
                ['w.screen → 100vw', () => _.w.screen(), { width: '100vw' }],
                ['w.dvh → 100dvh', () => _.w.dvh(), { width: '100dvh' }],
                ['h.full → 100%', () => _.h.full(), { height: '100%' }],
                ['h.screen → 100vw', () => _.h.screen(), { height: '100vw' }],
                ['w[4] → 16px', () => _.w[4](), { width: '16px' }],
                ['size.full → 100% square', () => _.size.full(), { height: '100%', width: '100%' }],
        ]
        test.each(cases)('%s', (_n, fn, decl) => expect(fn()).toEqual(decl))
})

// --- GREEN: raw colour literals pass through verbatim ------------------------
describe('raw colour — hex / oklch / rgb / var passthrough', () => {
        const cases: Array<[string, () => Record<string, unknown>, Record<string, unknown>]> = [
                ["bg['#fff']", () => _.bg['#fff'](), { background: '#fff' }],
                ["bg['#1a2b3c']", () => _.bg['#1a2b3c'](), { background: '#1a2b3c' }],
                ["bg['oklch(0.7 0.1 200)']", () => _.bg['oklch(0.7 0.1 200)'](), { background: 'oklch(0.7 0.1 200)' }],
                ["bg['rgb(0, 0, 0)']", () => _.bg['rgb(0, 0, 0)'](), { background: 'rgb(0, 0, 0)' }],
                ["bg['var(--brand)']", () => _.bg['var(--brand)'](), { background: 'var(--brand)' }],
                ["text['#abc']", () => _.text['#abc'](), { color: '#abc' }],
                ["text['var(--ink)']", () => _.text['var(--ink)'](), { color: 'var(--ink)' }],
        ]
        test.each(cases)('%s', (_n, fn, decl) => expect(fn()).toEqual(decl))
})

// --- GREEN: light-dark() pairing on color readers (correct ordering) ---------
describe('dark — light-dark() pairing when a base colour precedes .dark', () => {
        const cases: Array<[string, () => Record<string, unknown>, Record<string, unknown>]> = [
                ["bg['#fff'].dark.bg['#000']", () => _.bg['#fff'].dark.bg['#000'](), { colorScheme: 'light dark', background: 'light-dark(#fff, #000)' }],
                ["text['#111'].dark.text['#eee']", () => _.text['#111'].dark.text['#eee'](), { color: 'light-dark(#111, #eee)' }],
        ]
        test.each(cases)('%s', (_n, fn, decl) => expect(fn()).toEqual(decl))
})

// --- GREEN: bracket-number stringifies to a CSS string value ----------------
describe('numeric bracket key stringifies to a CSS string value (not a JS number)', () => {
        const cases: Array<[string, () => unknown, string]> = [
                ['p[4].padding', () => (_.p[4]() as Record<string, unknown>).padding, '16px'],
                ['gap[2].gap', () => (_.gap[2]() as Record<string, unknown>).gap, '8px'],
                ['rounded[4].borderRadius', () => (_.rounded[4]() as Record<string, unknown>).borderRadius, '16px'],
        ]
        test.each(cases)('%s is the string "%s"', (_n, get, val) => {
                const v = get()
                expect(typeof v).toBe('string')
                expect(v).toBe(val)
        })
})

// --- RED: percentage values on the numeric/length readers -------------------
describe('percentage value domain (Tailwind supports; runtime rejects → RED)', () => {
        const cases: Array<[string, () => Record<string, unknown>, Record<string, unknown>]> = [
                ["w['50%'] → 50%", () => _.w['50%'](), { width: '50%' }],
                ["h['100%'] → 100%", () => _.h['100%'](), { height: '100%' }],
                ["p['25%'] → 25%", () => _.p['25%'](), { padding: '25%' }],
        ]
        test.each(cases)('%s', (_n, fn, decl) => expect(fn()).toEqual(decl))
})

// --- RED: fraction values (Tailwind width fractions) ------------------------
describe('fraction value domain (Tailwind w-1/2 etc.; runtime rejects → RED)', () => {
        const cases: Array<[string, () => Record<string, unknown>, Record<string, unknown>]> = [
                ["w['1/2'] → 50%", () => _.w['1/2'](), { width: '50%' }],
                ["w['1/3'] → 33.333333%", () => _.w['1/3'](), { width: '33.333333%' }],
                ["w['2/3'] → 66.666667%", () => _.w['2/3'](), { width: '66.666667%' }],
        ]
        test.each(cases)('%s', (_n, fn, decl) => expect(fn()).toEqual(decl))
})

// --- RED: arbitrary length tokens on the numeric scale reader ---------------
describe('arbitrary length on scale readers (Tailwind p-[10px]/p-px; runtime rejects → RED)', () => {
        const cases: Array<[string, () => Record<string, unknown>, Record<string, unknown>]> = [
                ["p['10px'] → 10px", () => _.p['10px'](), { padding: '10px' }],
                ["p['px'] → 1px (Tailwind p-px)", () => _.p['px'](), { padding: '1px' }],
                ["gap['2rem'] → 2rem", () => _.gap['2rem'](), { gap: '2rem' }],
                ["m['1em'] → 1em", () => _.m['1em'](), { margin: '1em' }],
        ]
        test.each(cases)('%s', (_n, fn, decl) => expect(fn()).toEqual(decl))
})

// --- RED: var() / calc() on the length reader -------------------------------
describe('var()/calc() on the length reader (Tailwind arbitrary; runtime rejects → RED)', () => {
        const cases: Array<[string, () => Record<string, unknown>, Record<string, unknown>]> = [
                ["w['calc(100% - 1px)']", () => _.w['calc(100% - 1px)'](), { width: 'calc(100% - 1px)' }],
                ["w['var(--w)']", () => _.w['var(--w)'](), { width: 'var(--w)' }],
                ["h['calc(100vh - 2rem)']", () => _.h['calc(100vh - 2rem)'](), { height: 'calc(100vh - 2rem)' }],
        ]
        test.each(cases)('%s', (_n, fn, decl) => expect(fn()).toEqual(decl))
})

// --- RED: dark-first pairing (greedy bg swallows the word "dark") -----------
describe('dark-first pairing — .dark before any colour must still pair (RED)', () => {
        // When `.dark` comes before any colour, bg's greedy colour reader swallows the
        // word "dark" as a colour instead of toggling dark mode, so the pairing never
        // forms. The Tailwind-correct result pairs the new colour against `initial`.
        const cases: Array<[string, () => Record<string, unknown>, Record<string, unknown>]> = [
                ["bg.dark.bg['#000']", () => _.bg.dark.bg['#000'](), { colorScheme: 'light dark', background: 'light-dark(initial, #000)' }],
                ["text.dark.text['#000']", () => _.text.dark.text['#000'](), { color: 'light-dark(initial, #000)' }],
        ]
        test.each(cases)('%s', (_n, fn, decl) => expect(fn()).toEqual(decl))
})
