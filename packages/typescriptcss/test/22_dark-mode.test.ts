import { describe, expect, test } from 'vitest'
import * as tw from '../src'
import { bg, text, border } from '../src'

// Chapter I — dark mode pairing and leak boundary.
// dark is implemented as a one-shot modifier that folds the next color into a
// light-dark() declaration. These cases pin the pairing, the base-fallback, the
// per-property-family coverage, and the non-leak boundary — none of which the
// docs describe. Color families with no utility (shadow/fill/stroke) stay RED.

describe('DARK-001 light then dark color pairs into light-dark()', () => {
	test('background pairs both values', () => {
		const out = bg['#fff'].dark.bg['#000']()
		expect(out.background).toBe('light-dark(#fff, #000)')
	})
})

describe('DARK-002 dark without a preceding base', () => {
	test('a leading dark color does not emit a broken value', () => {
		const out = bg.dark.bg['#000']()
		expect(out.background).toContain('#000')
		expect(out.background).not.toContain('undefined')
	})
})

describe('DARK-003 per color-property-family coverage', () => {
	test('text color pairs under dark', () => {
		expect(text['#111'].dark.text['#eee']().color).toBe('light-dark(#111, #eee)')
	})

	test('border color pairs under dark', () => {
		const out = border['#111'].dark.border['#eee']()
		expect(out.borderColor).toBe('light-dark(#111, #eee)')
	})

	test('[RED unsupported] fill color pairs under dark', () => {
		const out = (tw as any).fill['#111'].dark.fill['#eee']()
		expect(out.fill).toBe('light-dark(#111, #eee)')
	})
})

describe('DARK-004 dark does not leak to the next non-color utility', () => {
	test('a layout utility after a dark pair is unaffected', () => {
		const out = bg['#fff'].dark.bg['#000'].flex.col()
		expect(out).toEqual({
			background: 'light-dark(#fff, #000)',
			display: 'flex',
			flexDirection: 'column',
		})
	})

	test('dark applies only to the single color immediately following it', () => {
		const out = bg['#fff'].dark.bg['#000'].text['#333']()
		expect(out.color).toBe('#333')
	})
})

describe('DARK-005 alternate activation sources', () => {
	test('[RED unsupported] data-attribute driven dark is a distinct variant', () => {
		const out = (tw as any).darkData.bg['#000']()
		expect(out).toBeTypeOf('object')
	})
})
