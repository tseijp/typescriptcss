import { describe, expect, test } from 'vitest'
import * as tw from '../src'
import { flex, text, font, border, rounded, max, min, col } from '../src'

// Chapter A2 — chain grammar collision.
// The same word can be a root utility, a scope keyword, or a native CSS value.
// These tests pin the disambiguation boundaries where the *previous* segment
// changes the meaning of the next property access. This is the parser contract,
// not the per-utility value table in 00–13.

describe('GRAMMAR-001 flex: display vs numeric vs direction scope', () => {
	test('flex.col is a direction scope and drops the numeric flex reader', () => {
		// after entering the col scope, a numeric access must NOT add flex: 1
		expect(flex.col[1 as any]()).not.toHaveProperty('flex')
	})

	test('direction is set once: a later .row cannot override .col', () => {
		const out = (flex.col as any).row()
		expect(out.flexDirection).toBe('column')
	})
})

describe('GRAMMAR-002 text: size vs raw color vs align', () => {
	test('text is greedy, so a literal word becomes a color value not an align keyword', () => {
		// text.dark must be swallowed as color: 'dark', not treated as a dark variant
		expect(text['dark' as any]()).toEqual({ color: 'dark' })
	})

	test('text.center resolves to the align keyword, not a color', () => {
		expect(text.center()).toEqual({ textAlign: 'center' })
	})
})

describe('GRAMMAR-003 font: weight vs family scope', () => {
	test('font.semibold sets a weight and does not leak into family', () => {
		expect(font.semibold()).toEqual({ fontWeight: 600 })
	})
})

describe('GRAMMAR-004 border: side scope exit then color', () => {
	test('a raw color after the base border targets borderColor', () => {
		const out = border['#f00']()
		expect(out.borderColor).toBe('#f00')
	})
})

describe('GRAMMAR-005 rounded: default call vs value read isolation', () => {
	test('default rounded and a valued rounded do not share state', () => {
		const def = rounded()
		const val = rounded[4]()
		expect(def.borderRadius).toBe('4px')
		expect(val.borderRadius).toBe('16px')
	})
})

describe('GRAMMAR-006 max/min nested scope termination', () => {
	test('max.w ends its scope and does not steal the next root', () => {
		const out = max.w[24]()
		expect(out.maxWidth).toBe('96px')
	})

	test('min.h is independent from max.w', () => {
		expect(min.h[10]()).toEqual({ minHeight: '40px' })
	})
})

describe('GRAMMAR-007 col: grid span vs flex.col direction', () => {
	test('col as a grid utility differs from the col direction scope', () => {
		const grid = (col as any).span[2]()
		const dir = flex.col()
		expect(dir.flexDirection).toBe('column')
		// the grid col must produce a grid declaration, never a flex direction
		expect(grid).not.toHaveProperty('flexDirection')
		expect(grid).toHaveProperty('gridColumn')
	})
})

describe('GRAMMAR-008/009 native value vs same-named root', () => {
	test('display.flex as a native property is not confused with the flex root', () => {
		expect((tw as any).display['flex']()).toEqual({ display: 'flex' })
		expect(flex()).toEqual({ display: 'flex' })
	})
})

describe('GRAMMAR-010 scope does not persist past one access', () => {
	test('a greedy reader does not hijack the following independent utility', () => {
		const out = text['#fff'].font.semibold()
		expect(out).toEqual({ color: '#fff', fontWeight: 600 })
	})
})
