import { describe, expect, test } from 'vitest'
import * as tw from '../src'
import { flex, gap, p, m, bg, text, rounded, border } from '../src'

// Chapter H — composition, conflict and cascade.
// Independent properties must coexist; same-property utilities must follow a
// deterministic last-write rule; multi-value families (filter, transform,
// gradient, shadow) must accumulate instead of clobbering. These are the
// composition invariants the docs never state. Many target unimplemented
// families and are honestly RED.

describe('COMPOSE-001 filter family accumulates', () => {
	test('blur and brightness combine into one filter declaration', () => {
		const out = (tw as any).blur[4].brightness[110]()
		expect(out.filter).toContain('blur(')
		expect(out.filter).toContain('brightness(')
	})
})

describe('COMPOSE-002 gradient components accumulate', () => {
	test('from / via / to compose a single gradient', () => {
		const out = (tw as any).bg.linear.from['#000'].to['#fff']()
		expect(typeof out.backgroundImage).toBe('string')
	})
})

describe('COMPOSE-003 transform components accumulate', () => {
	test('translate, rotate, scale compose into one transform', () => {
		const out = (tw as any).translate.x[4].rotate[45].scale[110]()
		expect(out.transform).toContain('translateX(')
		expect(out.transform).toContain('rotate(')
		expect(out.transform).toContain('scale(')
	})
})

describe('COMPOSE-004 shadow size and color coexist', () => {
	test('a shadow size and a shadow color do not erase each other', () => {
		const out = (tw as any).shadow[4].shadow['#0006']()
		expect(out.boxShadow).toBeTypeOf('string')
		expect(out.boxShadow).toContain('#0006')
	})
})

describe('COMPOSE-005 font-size implicit line-height vs explicit leading', () => {
	test('an explicit leading overrides the size-implied line-height', () => {
		const out = text.base.leading[10]()
		expect(out.lineHeight).toBe('40px')
	})
})

describe('COMPOSE-009 same-property last-write rule', () => {
	test('two paddings: the later one wins deterministically', () => {
		expect(p[2].p[6]()).toEqual({ padding: '24px' })
	})

	test('two gaps: the later one wins', () => {
		expect(gap[1].gap[8]()).toEqual({ gap: '32px' })
	})
})

describe('COMPOSE-010 independent property order independence', () => {
	test('reordering independent utilities yields an equal object', () => {
		const a = flex.col.gap[4].p[6].rounded[2]()
		const b = rounded[2].p[6].gap[4].flex.col()
		expect(a).toEqual(b)
	})
})

describe('COMPOSE-008 border base vs side coexist', () => {
	test('a base border and a side border combine without loss', () => {
		const out = border.t[2].border['#f00']()
		expect(out.borderColor).toBe('#f00')
		expect(out).toHaveProperty('borderTopWidth')
	})
})

describe('COMPOSE composition with call-arg override', () => {
	test('a call-argument overrides the accumulated chain for one property', () => {
		expect(m[4].p[4]({ padding: '0' })).toEqual({ margin: '16px', padding: '0' })
	})
})

describe('COMPOSE color + non-color independence', () => {
	test('a background color and a layout utility stay independent', () => {
		expect(bg['#000'].flex.col()).toEqual({
			background: '#000',
			display: 'flex',
			flexDirection: 'column',
		})
	})
})
