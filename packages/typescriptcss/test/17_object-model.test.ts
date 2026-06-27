import { describe, expect, test } from 'vitest'
import * as _ from '../src'

// 17 — JS object model & Proxy robustness.
//
// MECE boundary: files 00–13 cover feature mappings; 15/16 cover the API contract
// and grammar precedence. This file attacks the chain *as a JS object*: it must
// survive thenable probing, symbol access, reflection, prototype shenanigans,
// pathologically deep access, and frozen inputs, while always producing an
// independent plain-object snapshot.
//
// Per _REDESIGN.md this is the ONE chapter that is legitimately GREEN: these are
// language-level invariants of the Proxy, not feature mappings, and the Proxy
// already implements them. There is no `as any`: reflection access is expressed
// with precise `as unknown as <generic-object>` casts, never the `any` escape
// hatch, so a genuine type-domain regression would still surface.

// Precise generic views of a chain for reflection probing (no `any`).
type AnyObj = Record<PropertyKey, unknown>
type AnyFn = (...a: unknown[]) => Record<string, unknown>
const obj = (c: unknown) => c as unknown as AnyObj
const fn = (c: unknown) => c as unknown as AnyFn

describe('thenable safety: a chain must not look like a Promise', () => {
        test('reading .then returns undefined (not a function)', () => {
                expect(obj(_.flex).then).toBeUndefined()
                expect(obj(_.flex.col).then).toBeUndefined()
        })
        test('await on a chain does not hang / unwrap (then is undefined)', async () => {
                const resolved = await (_.flex.col as unknown as Promise<unknown>)
                expect(typeof resolved).toBe('function')
                expect(fn(resolved)()).toEqual({ display: 'flex', flexDirection: 'column' })
        })
        test('Promise.resolve() does not treat the chain as thenable', async () => {
                const v = await (Promise.resolve(_.flex) as unknown as Promise<unknown>)
                expect(typeof v).toBe('function')
                expect(fn(v)()).toEqual({ display: 'flex' })
        })
})

describe('symbol access is inert', () => {
        test('Symbol.iterator is undefined (chain is not iterable)', () => {
                expect(obj(_.flex)[Symbol.iterator]).toBeUndefined()
                expect(() => [...(_.flex as unknown as Iterable<unknown>)]).toThrow()
        })
        test('Symbol.toPrimitive is undefined', () => {
                expect(obj(_.flex)[Symbol.toPrimitive]).toBeUndefined()
        })
        test('Symbol.asyncIterator is undefined', () => {
                expect(obj(_.flex)[Symbol.asyncIterator]).toBeUndefined()
        })
        test('an arbitrary symbol key resolves to undefined', () => {
                const s = Symbol('x')
                expect(obj(_.flex)[s]).toBeUndefined()
        })
})

describe('reflection on a chain', () => {
        test('typeof a chain is function', () => expect(typeof _.gap).toBe('function'))
        test('a chain is callable via Reflect.apply', () => {
                expect(Reflect.apply(fn(_.flex.col), undefined, [])).toEqual({ display: 'flex', flexDirection: 'column' })
        })
        test('property access via Reflect.get yields a callable chain', () => {
                const seg = Reflect.get(obj(_.flex), 'col')
                expect(typeof seg).toBe('function')
                expect(fn(seg)()).toEqual({ display: 'flex', flexDirection: 'column' })
        })
        test('chained Reflect.get composes like dotted access', () => {
                const a = Reflect.get(obj(Reflect.get(obj(_.flex), 'col')), 'row')
                expect(fn(a)()).toEqual({ display: 'flex', flexDirection: 'row' })
        })
})

describe('prototype access does not pollute and does not leak Object.prototype', () => {
        test('reading __proto__ off a chain returns a chain, not Object.prototype', () => {
                const p = obj(_.flex).__proto__
                expect(p).not.toBe(Object.prototype)
                expect(typeof p).toBe('function')
        })
        test('reading constructor off a chain returns a chain, not Function', () => {
                const c = obj(_.flex).constructor
                expect(c).not.toBe(Function)
                expect(typeof c).toBe('function')
        })
        test('building through __proto__/prototype keys produces own props, no global pollution', () => {
                const out = fn(obj(obj(obj(_.flex).__proto__).x).prototype.y)() as Record<string, unknown>
                expect(Object.prototype.hasOwnProperty.call(out, '__proto__') || Object.prototype.hasOwnProperty.call(out, 'prototype')).toBe(true)
                expect(obj({}).x).toBeUndefined()
                expect(obj({}).y).toBeUndefined()
                expect((Object.prototype as unknown as AnyObj).x).toBeUndefined()
        })
        test('a "polluted" key from one chain does not appear on a fresh object', () => {
                void fn(obj(obj(_.bg).polluted).value)()
                expect(obj({}).polluted).toBeUndefined()
        })
})

describe('finished style objects are ordinary, independent objects', () => {
        test('result has Object.prototype and is extensible', () => {
                const r = _.flex.col()
                expect(Object.getPrototypeOf(r)).toBe(Object.prototype)
                expect(Object.isExtensible(r)).toBe(true)
        })
        test('result is enumerable via spread / entries / keys', () => {
                const r = _.gap[4]() as Record<string, unknown>
                expect({ ...r }).toEqual({ gap: '16px' })
                expect(Object.keys(r)).toEqual(['gap'])
                expect(Object.entries(r)).toEqual([['gap', '16px']])
        })
        test('result can be safely frozen by the caller', () => {
                const r = Object.freeze(_.p[4]() as Record<string, unknown>)
                expect(r).toEqual({ padding: '16px' })
                expect(Object.isFrozen(r)).toBe(true)
        })
        test('two distinct chains never return the same object reference', () => {
                expect(_.flex.col()).not.toBe(_.flex.col())
                expect(_.gap[4]()).not.toBe(_.gap[4]())
        })
})

describe('frozen / sealed call arguments are handled without mutation', () => {
        test('a frozen arg object is merged, not mutated', () => {
                const arg = Object.freeze({ color: 'red' })
                const out = _.flex(arg)
                expect(out).toEqual({ display: 'flex', color: 'red' })
                expect(arg).toEqual({ color: 'red' })
        })
        test('a sealed arg object is merged correctly', () => {
                const arg = Object.seal({ margin: '1px' })
                expect(_.flex.col(arg)).toEqual({ display: 'flex', flexDirection: 'column', margin: '1px' })
        })
        test('the returned object is never the frozen input', () => {
                const arg = Object.freeze({ a: '1' })
                expect(_.flex(arg)).not.toBe(arg)
        })
})

describe('pathologically deep chains do not throw', () => {
        test('500 unknown-word segments off flex still produce a plain object', () => {
                let chain: AnyObj = obj(_.flex)
                for (let i = 0; i < 500; i++) chain = obj(chain[`k${i}`])
                const style = fn(chain)()
                expect(typeof style).toBe('object')
                expect(Object.getPrototypeOf(style)).toBe(Object.prototype)
                expect(style.display).toBe('flex')
        })
        test('alternating key/value deep chain collapses into own props', () => {
                let chain: AnyObj = obj(_.flex)
                for (let i = 0; i < 100; i++) chain = obj(chain[i % 2 === 0 ? `prop${i}` : `val${i}`])
                const style = fn(chain)() as Record<string, unknown>
                expect(style.display).toBe('flex')
                for (const [k, v] of Object.entries(style)) {
                        if (k === 'display') continue
                        expect(typeof v).toBe('string')
                }
        })
        test('repeated re-reads of a long prefix stay deterministic (snapshot stability)', () => {
                const prefix = _.flex.col.items.center.gap[4].p[2]
                const a = prefix()
                const b = prefix()
                expect(a).toEqual(b)
                expect(a).toEqual({ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '8px' })
        })
})

describe('greedy readers still obey object-model invariants', () => {
        test('bg greedy capture returns a plain, JSON-safe object', () => {
                const r = _.bg.anything() as Record<string, unknown>
                expect(Object.getPrototypeOf(r)).toBe(Object.prototype)
                expect(JSON.parse(JSON.stringify(r))).toEqual({ background: 'anything' })
        })
        test('text greedy capture is snapshot-independent across calls', () => {
                const c = _.text.coral
                expect(c()).toEqual({ color: 'coral' })
                expect(c()).not.toBe(c())
        })
        test('rounded default reader returns a fresh object each call', () => {
                expect(_.rounded()).not.toBe(_.rounded())
                expect(_.rounded()).toEqual({ borderRadius: '4px' })
        })
})
