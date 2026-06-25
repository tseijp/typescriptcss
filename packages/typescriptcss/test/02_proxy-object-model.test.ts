import { describe, it, expect } from 'vitest'
import { flex, bg, p, define } from '../src/index.ts'
import { assertNoLeakedMarkers, isPlainStyle } from './_helpers.ts'

describe('PROXY-001 chain is not a thenable', () => {
        it('reading .then returns undefined so await/Promise.resolve do not recurse', () => {
                expect((flex as unknown as Record<string, unknown>).then).toBeUndefined()
        })
        it('Promise.resolve(chain) settles to a usable chain, await does not hang', async () => {
                const resolved = await Promise.resolve(flex.col)
                expect(typeof resolved).toBe('function')
                expect((resolved as typeof flex)()).toEqual({ display: 'flex', flexDirection: 'column' })
        })
})

describe('PROXY-002 symbol access never fabricates CSS', () => {
        it('well-known symbols read as undefined and keep the chain alive', () => {
                const c = flex.col as unknown as Record<symbol, unknown>
                expect(c[Symbol.toStringTag]).toBeUndefined()
                expect(c[Symbol.iterator]).toBeUndefined()
                expect(c[Symbol.asyncIterator]).toBeUndefined()
                expect((flex.col as typeof flex)()).toEqual({ display: 'flex', flexDirection: 'column' })
        })
})

describe('PROXY-003 reflection separates the chain from the finished object', () => {
        it('the finished object enumerates only CSS properties', () => {
                const out = flex.col.gap[4]()
                expect(Object.keys(out).sort()).toEqual(['display', 'flexDirection', 'gap'])
                expect(Reflect.ownKeys(out).every((k) => typeof k === 'string')).toBe(true)
                expect(assertNoLeakedMarkers(out)).toEqual([])
        })
        it('Object.assign over a finished object behaves like a plain map', () => {
                const out = flex.col()
                const merged = Object.assign({}, out, { color: 'red' })
                expect(merged).toEqual({ display: 'flex', flexDirection: 'column', color: 'red' })
        })
})

describe('PROXY-004 prototype-flavoured keys do not pollute or vanish', () => {
        it('using prototype words as native property names round-trips', () => {
                const out = (flex as unknown as Record<string, Record<string, () => Record<string, unknown>>>).toString.valueOf()
                expect(out.toString).toBe('valueOf')
                expect(isPlainStyle(out)).toBe(true)
        })
        it('no prototype pollution leaks onto Object.prototype', () => {
                ;(bg as unknown as Record<string, Record<string, () => unknown>>).__proto__?.polluted
                expect(({} as Record<string, unknown>).polluted).toBeUndefined()
                expect((Object.prototype as unknown as Record<string, unknown>).polluted).toBeUndefined()
        })
})

describe('PROXY-005 then is reserved; other promise words are native fallbacks', () => {
        it('then resolves to undefined, catch/finally pass through as fallbacks', () => {
                expect((flex as unknown as Record<string, unknown>).then).toBeUndefined()
                const out = (flex as unknown as Record<string, Record<string, () => Record<string, unknown>>>).catch.always()
                expect(out.catch).toBe('always')
        })
})

describe('PROXY-006 chain length scales without loss or overflow', () => {
        for (const pairs of [1, 10, 100, 1000, 5000]) {
                it(`${pairs} native (name,value) pairs all survive`, () => {
                        let c = flex as unknown as Record<string, Record<string, unknown>>
                        for (let i = 0; i < pairs; i++) c = (c[`p${i}`] as Record<string, Record<string, unknown>>)[`v${i}`] as Record<string, Record<string, unknown>>
                        const out = (c as unknown as () => Record<string, unknown>)()
                        expect(isPlainStyle(out)).toBe(true)
                        expect(out.display).toBe('flex')
                        expect(Object.keys(out)).toHaveLength(pairs + 1)
                        expect(out.p0).toBe('v0')
                        expect(out[`p${pairs - 1}`]).toBe(`v${pairs - 1}`)
                })
        }
})

describe('PROXY-007 concurrent calls on one shared chain do not cross talk', () => {
        it('parallel finalizations are independent', async () => {
                const shared = flex.col.gap[4]
                const results = await Promise.all(Array.from({ length: 50 }, async () => shared()))
                for (const r of results) expect(r).toEqual({ display: 'flex', flexDirection: 'column', gap: '16px' })
        })
})

describe('PROXY-008 concurrent define registrations are deterministic', () => {
        it('last registration of a name wins; distinct names are independent', () => {
                define<typeof flex>('concA', { color: 'red' })
                define<typeof flex>('concB', { color: 'green' })
                const lastWins = define<typeof flex>('concA', { color: 'blue' })
                expect(lastWins()).toEqual({ color: 'blue' })
                const b = define<typeof flex>('concB', { color: 'green' })
                expect(b()).toEqual({ color: 'green' })
        })
})

describe('PROXY-009 call arguments are read, never mutated', () => {
        it('a frozen argument object is not modified and applies normally', () => {
                const frozen = Object.freeze({ color: 'red' })
                const out = p[2](frozen)
                expect(out).toEqual({ padding: '8px', color: 'red' })
                expect(Object.isFrozen(frozen)).toBe(true)
                expect(frozen).toEqual({ color: 'red' })
        })
        it('a null-prototype argument object contributes its own keys', () => {
                const bare = Object.assign(Object.create(null), { color: 'green' })
                const out = p[2](bare as Record<string, unknown>)
                expect(out.color).toBe('green')
        })
})

describe('PROXY-010 finished object is a snapshot of the args at call time', () => {
        it('mutating the argument after the call does not change the result', () => {
                const arg: Record<string, unknown> = { color: 'red' }
                const out = p[2](arg)
                arg.color = 'blue'
                expect(out.color).toBe('red')
        })
})
