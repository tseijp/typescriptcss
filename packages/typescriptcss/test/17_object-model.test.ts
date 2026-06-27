import { describe, expect, test } from 'vitest'
import { flex, gap, bg, text, p, rounded } from '../src'

// 17 — JS object model & Proxy robustness.
//
// MECE boundary: files 00–13 cover feature mappings and 15/16 cover the API
// contract and grammar precedence. This file attacks the chain *as a JS object*:
// it must survive thenable probing, symbol access, reflection, prototype
// shenanigans, pathologically deep access, and frozen inputs, while always
// producing an independent plain-object snapshot. None of these are feature
// assertions — they are language-level invariants of the Proxy.

describe('thenable safety: a chain must not look like a Promise', () => {
        test('reading .then returns undefined (not a function)', () => {
                expect((flex as any).then).toBeUndefined()
                expect((flex.col as any).then).toBeUndefined()
        })
        test('await on a chain does not hang / unwrap (then is undefined)', async () => {
                const resolved = await (flex.col as any)
                // Since `then` is undefined the value is returned as-is by the runtime.
                expect(typeof resolved).toBe('function')
                expect(resolved()).toEqual({ display: 'flex', flexDirection: 'column' })
        })
        test('Promise.resolve() does not treat the chain as thenable', async () => {
                const v: any = await Promise.resolve(flex)
                expect(typeof v).toBe('function')
                expect(v()).toEqual({ display: 'flex' })
        })
})

describe('symbol access is inert', () => {
        test('Symbol.iterator is undefined (chain is not iterable)', () => {
                expect((flex as any)[Symbol.iterator]).toBeUndefined()
                expect(() => [...(flex as any)]).toThrow()
        })
        test('Symbol.toPrimitive is undefined', () => {
                expect((flex as any)[Symbol.toPrimitive]).toBeUndefined()
        })
        test('Symbol.asyncIterator is undefined', () => {
                expect((flex as any)[Symbol.asyncIterator]).toBeUndefined()
        })
        test('an arbitrary symbol key resolves to undefined', () => {
                const s = Symbol('x')
                expect((flex as any)[s]).toBeUndefined()
        })
})

describe('reflection on a chain', () => {
        test('typeof a chain is function', () => expect(typeof gap).toBe('function'))
        test('a chain is callable via Reflect.apply', () => {
                expect(Reflect.apply(flex.col as any, undefined, [])).toEqual({ display: 'flex', flexDirection: 'column' })
        })
        test('property access via Reflect.get yields a callable chain', () => {
                const seg = Reflect.get(flex as any, 'col')
                expect(typeof seg).toBe('function')
                expect((seg as any)()).toEqual({ display: 'flex', flexDirection: 'column' })
        })
        test('chained Reflect.get composes like dotted access', () => {
                const a = Reflect.get(Reflect.get(flex as any, 'col'), 'row')
                expect((a as any)()).toEqual({ display: 'flex', flexDirection: 'row' })
        })
})

describe('prototype access does not pollute and does not leak Object.prototype', () => {
        test('reading __proto__ off a chain returns a chain, not Object.prototype', () => {
                const p = (flex as any).__proto__
                expect(p).not.toBe(Object.prototype)
                expect(typeof p).toBe('function')
        })
        test('reading constructor off a chain returns a chain, not Function', () => {
                const c = (flex as any).constructor
                expect(c).not.toBe(Function)
                expect(typeof c).toBe('function')
        })
        test('building through __proto__/prototype keys produces own props, no global pollution', () => {
                const out = (flex as any).__proto__.x.prototype.y() as Record<string, unknown>
                // keys land as ordinary own properties of the returned style object...
                expect(Object.prototype.hasOwnProperty.call(out, '__proto__') || Object.prototype.hasOwnProperty.call(out, 'prototype')).toBe(true)
                // ...and nothing leaked onto the global Object prototype.
                expect(({} as any).x).toBeUndefined()
                expect(({} as any).y).toBeUndefined()
                expect((Object.prototype as any).x).toBeUndefined()
        })
        test('a "polluted" key from one chain does not appear on a fresh object', () => {
                void (bg as any).polluted.value()
                expect(({} as any).polluted).toBeUndefined()
        })
})

describe('finished style objects are ordinary, independent objects', () => {
        test('result has Object.prototype and is extensible', () => {
                const r = flex.col()
                expect(Object.getPrototypeOf(r)).toBe(Object.prototype)
                expect(Object.isExtensible(r)).toBe(true)
        })
        test('result is enumerable via spread / entries / keys', () => {
                const r = (gap as any)[4]() as Record<string, unknown>
                expect({ ...r }).toEqual({ gap: '16px' })
                expect(Object.keys(r)).toEqual(['gap'])
                expect(Object.entries(r)).toEqual([['gap', '16px']])
        })
        test('result can be safely frozen by the caller', () => {
                const r = Object.freeze(p[4]() as Record<string, unknown>)
                expect(r).toEqual({ padding: '16px' })
                expect(Object.isFrozen(r)).toBe(true)
        })
        test('two distinct chains never return the same object reference', () => {
                expect(flex.col()).not.toBe(flex.col())
                expect((gap as any)[4]()).not.toBe((gap as any)[4]())
        })
})

describe('frozen / sealed call arguments are handled without mutation', () => {
        test('a frozen arg object is merged, not mutated', () => {
                const arg = Object.freeze({ color: 'red' })
                const out = flex(arg as any)
                expect(out).toEqual({ display: 'flex', color: 'red' })
                expect(arg).toEqual({ color: 'red' })
        })
        test('a sealed arg object is merged correctly', () => {
                const arg = Object.seal({ margin: '1px' })
                expect(flex.col(arg as any)).toEqual({ display: 'flex', flexDirection: 'column', margin: '1px' })
        })
        test('the returned object is never the frozen input', () => {
                const arg = Object.freeze({ a: '1' })
                expect(flex(arg as any)).not.toBe(arg)
        })
})

describe('pathologically deep chains do not throw', () => {
        test('500 unknown-word segments off flex still produce a plain object', () => {
                let chain: any = flex
                for (let i = 0; i < 500; i++) chain = chain[`k${i}`]
                const style = chain()
                expect(typeof style).toBe('object')
                expect(Object.getPrototypeOf(style)).toBe(Object.prototype)
                expect(style.display).toBe('flex')
        })
        test('alternating key/value deep chain collapses into own props', () => {
                // k0 v0 k1 v1 ... : each pair becomes a single own CSS property.
                let chain: any = flex
                for (let i = 0; i < 100; i++) chain = chain[i % 2 === 0 ? `prop${i}` : `val${i}`]
                const style = chain() as Record<string, unknown>
                expect(style.display).toBe('flex')
                // every value present must be a string (the captured "value" segment)
                for (const [k, v] of Object.entries(style)) {
                        if (k === 'display') continue
                        expect(typeof v).toBe('string')
                }
        })
        test('repeated re-reads of a long prefix stay deterministic (snapshot stability)', () => {
                const prefix = (((flex.col.items.center.gap as any)[4] as any).p as any)[2]
                const a = prefix()
                const b = prefix()
                expect(a).toEqual(b)
                expect(a).toEqual({ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '8px' })
        })
})

describe('greedy readers still obey object-model invariants', () => {
        test('bg greedy capture returns a plain, JSON-safe object', () => {
                const r = (bg as any).anything() as Record<string, unknown>
                expect(Object.getPrototypeOf(r)).toBe(Object.prototype)
                expect(JSON.parse(JSON.stringify(r))).toEqual({ background: 'anything' })
        })
        test('text greedy capture is snapshot-independent across calls', () => {
                const c = (text as any).coral
                expect(c()).toEqual({ color: 'coral' })
                expect(c()).not.toBe(c())
        })
        test('rounded default reader returns a fresh object each call', () => {
                expect(rounded()).not.toBe(rounded())
                expect(rounded()).toEqual({ borderRadius: '4px' })
        })
})
