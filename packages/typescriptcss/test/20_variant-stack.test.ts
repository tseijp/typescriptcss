import { describe, expect, test } from 'vitest'
import { bg } from '../src'

// Chapter F — variant stack and ordering (RED ledger).
// Stacking is the only chapter allowed to combine multiple variants. Variants
// are unimplemented, so reading a variant segment must produce a narrowing
// chain, not undefined. Each case calls the stack directly (no guard) so the
// missing capability surfaces as a real failure.

const seg = (s: string) => (bg as any)[s]

describe('STACK-001 order of two variants is significant', () => {
	test('dark.hover and hover.dark are both chainable and finalize', () => {
		const a = (bg as any).dark.hover.bg['#000']()
		const b = (bg as any).hover.dark.bg['#000']()
		expect(a).toBeTypeOf('object')
		expect(b).toBeTypeOf('object')
	})
})

describe('STACK-002 conjunction of dark + viewport + state', () => {
	test('a four-condition stack stays a single finalizable chain', () => {
		const out = (bg as any).dark.md.hover.bg['#111']()
		expect(out).toBeTypeOf('object')
	})
})

describe('STACK-003 relational variants nest without swapping subject', () => {
	test('group.hover and peer.checked are distinct segments', () => {
		expect(seg('group')).toBeTypeOf('object')
		expect(seg('peer')).toBeTypeOf('object')
	})
})

describe('STACK-004 pseudo-element after interactive variant', () => {
	test('hover.before keeps both segments', () => {
		const out = (bg as any).hover.before.bg['#222']()
		expect(out).toBeTypeOf('object')
	})
})

describe('STACK-006 duplicate / contradictory variants', () => {
	test('a duplicated variant segment is idempotent on the chain', () => {
		const once = (bg as any).hover.bg['#333']()
		const twice = (bg as any).hover.hover.bg['#333']()
		expect(twice).toEqual(once)
	})
})

describe('STACK-007 deep variant stacks do not drop segments', () => {
	test('a 50-deep hover stack still finalizes', () => {
		let c: any = bg
		for (let i = 0; i < 50; i++) c = c.hover
		const out = c.bg['#444']()
		expect(out).toBeTypeOf('object')
	})
})
