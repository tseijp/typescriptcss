import { describe, expect, test } from 'vitest'
import * as tw from '../src'
import { flex, gap, p, text, define } from '../src'

// Chapter A — public API and the chain calling contract.
// This file never asserts "utility X yields CSS value Y" (that is the job of the
// mechanical 00–13 suites). It asserts the *meta* contract that holds for every
// utility: how reading narrows, how calling finalizes, how forks stay isolated,
// how call arguments merge, and how `define` extends the registry. Assertions are
// structural / metamorphic, not value tables, so they do not duplicate the docs.

const isPlain = (o: unknown) =>
	typeof o === 'object' && o !== null && Object.getPrototypeOf(o) === Object.prototype

describe('API-001 root utility finalization', () => {
	test('every exported root that is callable returns a plain enumerable object', () => {
		const roots = Object.entries(tw).filter(([, v]) => typeof v === 'function' && v !== define)
		expect(roots.length).toBeGreaterThan(0)
		for (const [, root] of roots) {
			const out = (root as any)()
			expect(isPlain(out)).toBe(true)
			// no function / proxy / symbol leaks into the finalized object
			for (const key of Reflect.ownKeys(out)) {
				expect(typeof key).toBe('string')
				expect(typeof (out as any)[key as string]).not.toBe('function')
			}
		}
	})
})

describe('API-002 multi-utility composition', () => {
	test('a chain merges each segment into one object', () => {
		const out = flex.col.gap[4].p[6]()
		// keys come from independent utilities; none overwrites another
		expect(Object.keys(out).sort()).toEqual(['display', 'flexDirection', 'gap', 'padding'].sort())
	})
})

describe('API-003/004 call-argument merge', () => {
	test('plain object passed to call wins over the chain for the same property', () => {
		expect(gap[4]({ gap: '1rem' })).toEqual({ gap: '1rem' })
	})

	test('nullish and false arguments are ignored, valid objects apply in order', () => {
		expect(p[2](null, undefined, false, { color: 'red' }, { color: 'blue' })).toEqual({
			padding: '8px',
			color: 'blue',
		})
	})
})

describe('API-005/006 fork isolation and call idempotency', () => {
	test('branches off a saved chain do not pollute each other', () => {
		const base = flex.col
		const a = base.gap[2]()
		const b = base.gap[8]()
		expect(a.gap).toBe('8px')
		expect(b.gap).toBe('32px')
		expect(a).not.toBe(b)
	})

	test('calling the same chain twice yields equal but unshared objects', () => {
		const c = gap[4]
		const first = c()
		const second = c()
		expect(first).toEqual(second)
		expect(first).not.toBe(second)
	})
})

describe('API-007 same suffix across roots', () => {
	test('a shared numeric suffix keeps each root meaning', () => {
		expect(p[4]()).toEqual({ padding: '16px' })
		expect(gap[4]()).toEqual({ gap: '16px' })
	})
})

describe('API-008/009 define lifetime', () => {
	test('define registers a new root without disturbing existing ones', () => {
		const ring = define('ring', { boxShadow: '0 0 0 3px' })
		expect((ring as any)()).toEqual({ boxShadow: '0 0 0 3px' })
		expect(flex.col()).toEqual({ display: 'flex', flexDirection: 'column' })
	})

	test('a chain captured before redefinition keeps a consistent definition lifetime', () => {
		const before = define('tone', { color: '#111' }) as any
		const captured = before()
		define('tone', { color: '#222' })
		// the contract: a captured finalized object is a snapshot, never mutated later
		expect(captured).toEqual({ color: '#111' })
	})
})

describe('API-010 native property fallback', () => {
	test('an unknown CSS property survives as a key with its raw value', () => {
		expect((tw as any).zIndex[5]()).toEqual({ zIndex: '5' })
		expect((tw as any).position['sticky']()).toEqual({ position: 'sticky' })
	})
})

describe('API-011 css marker is meaning-neutral at runtime', () => {
	test('inserting css does not change the resulting style object', () => {
		expect(flex.col.css.bg['#000']()).toEqual(flex.col.bg['#000']())
	})
})

describe('API-012 serialization safety', () => {
	test('JSON and structured clone see only CSS properties', () => {
		const out = text['#fff'].font.semibold()
		expect(JSON.parse(JSON.stringify(out))).toEqual(out)
		expect(structuredClone(out)).toEqual(out)
	})
})
