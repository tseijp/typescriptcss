import { describe, expect, test } from 'vitest'
import * as tw from '../src'
import { gap, p, bg, text, w } from '../src'

// Chapter C — value-syntax classification.
// Pins the *acceptance/rejection domain* of values per utility category, which
// the docs never describe: numeric-scale utilities reject arbitrary strings,
// while color and native fallbacks accept any string. Also covers var(), calc(),
// arbitrary strings, and number-vs-string equivalence. No per-utility value table.

describe('VALUE-001 integers and zero on numeric scales', () => {
	test('the spacing scale multiplies by 4px', () => {
		expect(p[0]()).toEqual({ padding: '0px' })
		expect(p[1]()).toEqual({ padding: '4px' })
		expect(gap[10]()).toEqual({ gap: '40px' })
	})
})

describe('VALUE-004 sizing keywords vs numeric scale', () => {
	test('full / screen / dvh keywords are not multiplied like numbers', () => {
		expect(w['full' as any]()).toEqual({ width: '100%' })
		expect(w['screen' as any]()).toEqual({ width: '100vw' })
		expect(w['dvh' as any]()).toEqual({ width: '100dvh' })
	})
})

describe('VALUE-005 raw CSS color values', () => {
	test('color utilities accept hex / oklch / rgb verbatim', () => {
		expect(bg['#0b1120']()).toEqual({ background: '#0b1120' })
		expect(text['oklch(98.5% 0 0)']()).toEqual({ color: 'oklch(98.5% 0 0)' })
		expect(bg['rgb(1 2 3)']()).toEqual({ background: 'rgb(1 2 3)' })
	})
})

describe('VALUE-006/007 var() and calc() arbitrary values', () => {
	test('a variable reference is preserved on a color property', () => {
		expect(bg['var(--brand)']()).toEqual({ background: 'var(--brand)' })
	})

	test('calc() with spaces and slashes survives as a native value', () => {
		expect((tw as any).width['calc(100% - 2rem)']()).toEqual({ width: 'calc(100% - 2rem)' })
	})
})

describe('VALUE-003 numeric scale rejects arbitrary strings', () => {
	test('a string value on a numeric-only utility is not silently accepted', () => {
		// the scale reader only fires for numbers; a bare word must not produce gap
		const out = gap['nonsense' as any]
		// resolving an unknown key on the gap scope yields a chain whose call has no gap
		const finalized = typeof out === 'function' ? (out as any)() : {}
		expect(finalized).not.toHaveProperty('gap', 'nonsense')
	})
})

describe('VALUE-008 arbitrary strings on native fallback', () => {
	test('a quoted content string is kept verbatim', () => {
		expect((tw as any).content['"\\2014"']()).toEqual({ content: '"\\2014"' })
	})
})

describe('VALUE-012 number vs numeric string equivalence', () => {
	test('bracketed numbers arrive as strings and native fallback keeps them verbatim', () => {
		expect((tw as any).zIndex[5]()).toEqual({ zIndex: '5' })
		expect((tw as any).order[3]()).toEqual({ order: '3' })
	})
})

describe('VALUE-011 nullish call arguments vs CSS values', () => {
	test('nullish call arguments are skipped, not coerced into CSS values', () => {
		expect(gap[2](null as any, undefined as any)).toEqual({ gap: '8px' })
	})
})
