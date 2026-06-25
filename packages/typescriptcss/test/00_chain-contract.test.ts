import { describe, it, expect } from 'vitest'
import * as lib from '../src/index.ts'
import { flex, bg, text, gap, p, m, define } from '../src/index.ts'
import { assertNoLeakedMarkers, isPlainStyle, styleEqual } from './_helpers.ts'

const ROOTS: Array<[string, unknown]> = Object.entries(lib).filter(([k]) => k !== 'define')

describe('API-001 each public root utility finalizes to a plain CSS object', () => {
        for (const [name, value] of ROOTS) {
                it(`${name}() is a callable chain returning a plain style object`, () => {
                        expect(typeof value).toBe('function')
                        const out = (value as (...a: unknown[]) => Record<string, unknown>)()
                        expect(isPlainStyle(out)).toBe(true)
                        expect(assertNoLeakedMarkers(out)).toEqual([])
                })
        }
})

describe('API-002 multiple utilities compose into one finished object', () => {
        it('flex.col.gap[4].p[6] merges every declaration', () => {
                const out = flex.col.gap[4].p[6]()
                expect(out).toEqual({
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        padding: '24px',
                })
                expect(assertNoLeakedMarkers(out)).toEqual([])
        })
})

describe('API-003 call argument merges on top and wins ties', () => {
        it('plain object is added to the result', () => {
                const out = flex.col({ position: 'sticky', top: 0 })
                expect(out).toMatchObject({ display: 'flex', flexDirection: 'column', position: 'sticky', top: 0 })
        })
        it('argument value overrides the same property from the chain', () => {
                const out = bg['#fff']({ background: '#000' })
                expect(out.background).toBe('#000')
        })
})

describe('API-004 multiple args plus nullish/false are filtered in order', () => {
        it('only truthy objects apply, last write wins, order preserved', () => {
                const out = p[2]({ color: 'red' }, null, undefined, false, { color: 'blue', margin: '1px' })
                expect(out).toEqual({ padding: '8px', color: 'blue', margin: '1px' })
        })
        it('all-nullish args leave the chain result untouched', () => {
                const out = p[2](null, undefined, false)
                expect(out).toEqual({ padding: '8px' })
        })
})

describe('API-005 saved chain forks without cross-contamination', () => {
        it('two suffixes off one base do not pollute each other or the base', () => {
                const base = flex.col
                const a = base.gap[4]()
                const b = base.p[6]()
                const baseOut = base()
                expect(baseOut).toEqual({ display: 'flex', flexDirection: 'column' })
                expect(a).toEqual({ display: 'flex', flexDirection: 'column', gap: '16px' })
                expect(b).toEqual({ display: 'flex', flexDirection: 'column', padding: '24px' })
                expect('padding' in a).toBe(false)
                expect('gap' in b).toBe(false)
        })
})

describe('API-006 re-calling one chain yields equal, non-aliased results', () => {
        it('two calls are meaning-equal but not the same reference', () => {
                const c = flex.col.gap[4]
                const x = c()
                const y = c()
                expect(styleEqual(x, y)).toBe(true)
                expect(x).not.toBe(y)
                ;(x as Record<string, unknown>).gap = 'mutated'
                expect(c().gap).toBe('16px')
        })
})

describe('API-007 same suffix off different roots keeps each root meaning', () => {
        it('gap[4] applies after flex and after grid independently', () => {
                const f = flex.gap[4]()
                const g = lib.grid.gap[4]()
                expect(f).toEqual({ display: 'flex', gap: '16px' })
                expect(g).toEqual({ display: 'grid', gap: '16px' })
        })
})

describe('API-008 define registers a utility without disturbing existing ones', () => {
        it('a fresh static utility finalizes and existing utilities still work', () => {
                const brand = define<typeof flex>('brandPrimary', { color: 'rebeccapurple' })
                expect(brand()).toEqual({ color: 'rebeccapurple' })
                expect(flex.col()).toEqual({ display: 'flex', flexDirection: 'column' })
        })
        it('define with an explicit scope name composes through that scope', () => {
                const stack = define<typeof flex>('brandStack', { display: 'flex' }, 'flex')
                expect((stack as typeof flex).col()).toEqual({ display: 'flex', flexDirection: 'column' })
        })
})

describe('API-009 redefinition lifetime is observable and consistent', () => {
        it('a chain captured before redefinition keeps its captured state', () => {
                const first = define<typeof flex>('lifetimeProbe', { color: 'red' })
                const captured = first
                define<typeof flex>('lifetimeProbe', { color: 'blue' })
                expect(captured()).toEqual({ color: 'red' })
        })
})

describe('API-010 native CSS property fallback keeps its property name', () => {
        it('string and numeric native values surface under the property name', () => {
                const s = (flex as unknown as Record<string, Record<string, () => Record<string, unknown>>>).position.relative()
                expect(s.position).toBe('relative')
                const n = (flex as unknown as Record<string, Record<number, () => Record<string, unknown>>>).zIndex[5]()
                expect(n.zIndex).toBe('5')
        })
})

describe('API-011 css marker does not change the runtime style object', () => {
        it('leading css and a mid-chain css produce the same finished style', () => {
                const plain = flex.col.bg['#0b1120']()
                const leading = lib.css.flex.col.bg['#0b1120']()
                const mid = flex.col.css.bg['#0b1120']()
                expect(styleEqual(plain, leading)).toBe(true)
                expect(styleEqual(plain, mid)).toBe(true)
                expect(assertNoLeakedMarkers(leading)).toEqual([])
                expect(assertNoLeakedMarkers(mid)).toEqual([])
        })
})

describe('API-012 finished object survives serializers without leaking internals', () => {
        it('JSON, structuredClone, and spread expose only CSS properties', () => {
                const out = flex.col.gap[4].p[6].bg['#0b1120']()
                const json = JSON.parse(JSON.stringify(out))
                expect(json).toEqual(out)
                const cloned = structuredClone(out)
                expect(cloned).toEqual(out)
                const spread = { ...out }
                expect(spread).toEqual(out)
                expect(assertNoLeakedMarkers(json)).toEqual([])
                for (const v of Object.values(out)) expect(typeof v === 'function').toBe(false)
                expect(typeof m).toBe('function')
                expect(typeof text).toBe('function')
                expect(typeof gap).toBe('function')
        })
})
