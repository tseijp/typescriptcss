import { describe, expect, test } from 'vitest'
import * as tw from '../src'
import { flex, gap, p } from '../src'

// Chapter B — JavaScript object model and Proxy destruction.
// These cases attack the Proxy itself: thenable confusion, symbol access,
// reflection, prototype pollution, deep chains, and call-argument aliasing.
// None of this is in the docs; it guards the runtime model the chain relies on.

describe('PROXY-001 thenable safety', () => {
	test('awaiting a chain does not hang or recurse', async () => {
		const c = flex.col as any
		// reading `then` must yield undefined so the chain is not treated as a promise
		expect(c.then).toBeUndefined()
		const awaited = await (c as any)
		// awaiting a non-thenable returns the value itself
		expect(typeof awaited).toBe('function')
	})
})

describe('PROXY-002 symbol access is inert', () => {
	test('well-known symbols do not produce CSS properties', () => {
		const c = gap[4] as any
		expect(c[Symbol.toStringTag]).toBeUndefined()
		expect(c[Symbol.iterator]).toBeUndefined()
		// the finalized object is unaffected
		expect(gap[4]()).toEqual({ gap: '16px' })
	})
})

describe('PROXY-003 chain vs result reflection', () => {
	test('Object.keys on a finalized object lists only CSS properties', () => {
		const out = flex.col.gap[4]()
		expect(Reflect.ownKeys(out).every((k) => typeof k === 'string')).toBe(true)
		expect(Object.keys(out)).toEqual(expect.arrayContaining(['display', 'flexDirection', 'gap']))
	})
})

describe('PROXY-004 prototype pollution resistance', () => {
	test('__proto__ as a key never poisons Object.prototype', () => {
		const out = gap[4]({ ['__proto__' as any]: { polluted: true } })
		expect(({} as any).polluted).toBeUndefined()
		expect(out).toEqual({ gap: '16px' })
	})

	test('constructor / prototype as values do not leak function references', () => {
		const out = (tw as any).content['constructor']()
		for (const k of Object.keys(out)) expect(typeof (out as any)[k]).not.toBe('function')
		expect(out).toEqual({ content: 'constructor' })
	})
})

describe('PROXY-005 then/catch/finally as native CSS candidates', () => {
	test('reading then on a chain stays undefined (promise-safe boundary)', () => {
		expect((p[1] as any).then).toBeUndefined()
	})
})

describe('PROXY-006 deep chains', () => {
	test('a long chain does not overflow or drop segments', () => {
		let c: any = gap[1]
		for (let i = 0; i < 500; i++) c = c.p[1]
		const out = c()
		expect(out.gap).toBe('4px')
		expect(out.padding).toBe('4px')
	})
})

describe('PROXY-009 call argument objects are not mutated', () => {
	test('a frozen argument object is read, not written', () => {
		const arg = Object.freeze({ color: 'red' })
		expect(() => gap[4](arg)).not.toThrow()
		expect(gap[4](arg)).toEqual({ gap: '16px', color: 'red' })
	})

	test('an object with no prototype is accepted', () => {
		const arg = Object.assign(Object.create(null), { color: 'blue' })
		expect(gap[4](arg)).toEqual({ gap: '16px', color: 'blue' })
	})
})

describe('PROXY-010 snapshot semantics of the returned object', () => {
	test('mutating a call argument after finalization does not change the result', () => {
		const arg: any = { color: 'red' }
		const out = gap[4](arg)
		arg.color = 'green'
		expect(out.color).toBe('red')
	})
})
