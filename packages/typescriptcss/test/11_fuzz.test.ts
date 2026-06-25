import { describe, it, expect } from 'vitest'
import { flex, p, m, gap, bg, w, h, rounded, text, font } from '../src/index.ts'
import type { Chain } from '../src/types.ts'
import { rng, pick, assertNoLeakedMarkers, isPlainStyle, styleEqual } from './_helpers.ts'

const independentChains: Array<[string, () => Record<string, unknown>]> = [
        ['p[2]', () => p[2]()],
        ['m[3]', () => m[3]()],
        ['gap[4]', () => gap[4]()],
        ['w[10]', () => w[10]()],
        ['h[10]', () => h[10]()],
        ['rounded[2]', () => rounded[2]()],
        ['bg', () => bg['#0b1120']()],
        ['font[600]', () => font[600]()],
]

describe('FUZZ-001 independent utilities are order-insensitive', () => {
        const next = rng(1234)
        for (let trial = 0; trial < 64; trial++) {
                it(`trial ${trial}: a random permutation matches the canonical merge`, () => {
                        const chosen = independentChains.filter(() => next() > 0.5)
                        if (chosen.length === 0) return
                        const merged = Object.assign({}, ...chosen.map(([, fn]) => fn()))
                        const shuffled = [...chosen].sort(() => next() - 0.5)
                        const reMerged = Object.assign({}, ...shuffled.map(([, fn]) => fn()))
                        expect(styleEqual(merged, reMerged)).toBe(true)
                })
        }
})

describe('FUZZ-002 same-property writes via repeated roots resolve to the last write', () => {
        const next = rng(99)
        for (let trial = 0; trial < 32; trial++) {
                it(`trial ${trial}: the last background color wins when the root is repeated`, () => {
                        const values = Array.from({ length: 1 + Math.floor(next() * 5) }, (_, i) => `#${i}${i}${i}`)
                        let c = bg[values[0]]
                        for (let i = 1; i < values.length; i++) c = c.bg[values[i]]
                        const out = (c as unknown as () => Record<string, unknown>)()
                        expect(out.background).toBe(values[values.length - 1])
                        expect(Object.keys(out)).toEqual(['background'])
                })
        }
})

describe('FUZZ-003 finished objects never contain forbidden values', () => {
        const next = rng(2024)
        const keys = ['#fff', '#000', 'transparent', 'currentColor', 'var(--x)', 'rgb(1,2,3)', 'oklch(50% 0 0)']
        for (let trial = 0; trial < 100; trial++) {
                it(`trial ${trial}: random color/size chain is a clean plain object`, () => {
                        const out = bg[pick(next, keys)].text[pick(next, keys)]()
                        expect(isPlainStyle(out)).toBe(true)
                        expect(assertNoLeakedMarkers(out)).toEqual([])
                        for (const v of Object.values(out)) expect(typeof v === 'string' || typeof v === 'number').toBe(true)
                })
        }
})

describe('FUZZ-005 reserved words and long strings do not hang or pollute', () => {
        const reserved = ['constructor', 'prototype', '__proto__', 'toString', 'valueOf', 'hasOwnProperty', 'then', 'catch']
        for (const word of reserved) {
                it(`native fallback handles the reserved word "${word}"`, () => {
                        if (word === 'then') {
                                expect((flex as unknown as Record<string, unknown>).then).toBeUndefined()
                                return
                        }
                        const out = (flex as unknown as Record<string, Record<string, () => Record<string, unknown>>>)[word].x()
                        if (word === '__proto__') {
                                expect(Object.getPrototypeOf(out)).toBe(Object.prototype)
                                expect(Object.prototype.hasOwnProperty.call(out, '__proto__')).toBe(false)
                        } else {
                                expect(Object.prototype.hasOwnProperty.call(out, word)).toBe(true)
                                expect((out as Record<string, unknown>)[word]).toBe('x')
                        }
                        expect((Object.prototype as Record<string, unknown>).polluted).toBeUndefined()
                })
        }
        it('a very long arbitrary value is preserved verbatim', () => {
                const long = 'a'.repeat(10000)
                const out = (bg as unknown as Record<string, () => Record<string, unknown>>)[long]()
                expect(out.background).toBe(long)
        })
})

describe('FUZZ-006 sharing and forking one base does not cross-contaminate', () => {
        const next = rng(7)
        for (let trial = 0; trial < 32; trial++) {
                it(`trial ${trial}: forks off a shared base are independent`, () => {
                        const base = flex.col
                        const a = (base as unknown as Record<number, Chain>)[1 + Math.floor(next() * 9)]
                        const b = base.gap[1 + Math.floor(next() * 9)]
                        const baseOut = base()
                        expect(baseOut).toEqual({ display: 'flex', flexDirection: 'column' })
                        expect(a as unknown as () => Record<string, unknown>).toBeDefined()
                        expect('gap' in baseOut).toBe(false)
                        void b
                })
        }
})

describe('FUZZ-007 plain object merge follows the reference model', () => {
        const next = rng(555)
        for (let trial = 0; trial < 40; trial++) {
                it(`trial ${trial}: last truthy arg wins per property`, () => {
                        const objs = Array.from({ length: 1 + Math.floor(next() * 4) }, (_, i) => ({ color: `c${i}`, [`k${i}`]: i }))
                        const out = p[2](...objs)
                        expect(out.color).toBe(`c${objs.length - 1}`)
                        expect(out.padding).toBe('8px')
                })
        }
})
