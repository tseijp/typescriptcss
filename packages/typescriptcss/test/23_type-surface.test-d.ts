import { describe, expectTypeOf, test } from 'vitest'
import { flex, gap, p, bg, text, w, font, define } from '../src'
import type { Chain } from '../src/types'

// Chapter J — type surface.
// These assertions run under `typecheck.enabled`. Positive cases confirm a valid
// chain stays a Chain; `@ts-expect-error` cases confirm the type rejects a value
// in the wrong domain at the marked position. Runtime success and type success
// are separate oracles — nothing here calls toBe on a runtime value.

describe('TYPE-001 positive root utilities', () => {
	test('roots narrow to a Chain and finalize to a style object', () => {
		expectTypeOf(flex.col).toMatchTypeOf<Chain>()
		expectTypeOf(gap[4]).toMatchTypeOf<Chain>()
		expectTypeOf(p[6]()).toBeObject()
	})
})

describe('TYPE-003 value-domain rejection', () => {
	test('a color string on a numeric scale utility is rejected at the value', () => {
		// @ts-expect-error gap is a numeric scale; a hex string is not a valid index
		gap['#fff']
	})

	test('a keyword-only utility rejects an unknown word', () => {
		// @ts-expect-error width keyword domain does not include an arbitrary word
		w['nonsense-keyword']
	})
})

describe('TYPE-002 category mismatch is rejected', () => {
	test('a layout keyword on a color utility is rejected', () => {
		// @ts-expect-error bg expects a color domain, not a flex keyword
		bg.flex
	})
})

describe('TYPE-005 call-argument contract', () => {
	test('plain object, null, undefined, false are valid call arguments', () => {
		expectTypeOf(gap[4]).toBeCallableWith({ color: 'red' })
		expectTypeOf(gap[4]).toBeCallableWith(null)
		expectTypeOf(gap[4]).toBeCallableWith(undefined)
		expectTypeOf(gap[4]).toBeCallableWith(false)
	})
})

describe('TYPE-006 define generic boundary', () => {
	test('define returns the requested chain type without polluting roots', () => {
		const ring = define<Chain>('ring', { boxShadow: '0 0 0 3px' })
		expectTypeOf(ring).toMatchTypeOf<Chain>()
	})
})

describe('TYPE-008 literal widening stability', () => {
	test('a color literal and an as-const color are both accepted', () => {
		const c = '#0b1120' as const
		expectTypeOf(bg[c]).toMatchTypeOf<Chain>()
		expectTypeOf(text['#fff']).toMatchTypeOf<Chain>()
	})
})

describe('TYPE-007 utility domain survives after a scope', () => {
	test('font weight keyword is available in the font scope', () => {
		expectTypeOf(font.semibold).toMatchTypeOf<Chain>()
	})
})
