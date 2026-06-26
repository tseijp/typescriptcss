import { describe, expect, test } from 'vitest'
import { rng, pick } from './_helpers'
import { flex, gap, p, m, bg, text, rounded, w, h } from '../src'

// Chapter L — seeded property-based exploration.
// Generators are deterministic (Mulberry32) so a failure reprints the seed and
// the minimal chain. Properties are invariants, not value tables: order
// independence for independent props, last-write for same prop, and "no
// undefined / [object Object] ever leaks into a finalized style object".

const SEED = 0x5eed
const INDEP = [
	() => flex.col,
	() => gap[pickN()],
	() => p[pickN()],
	() => m[pickN()],
	() => rounded[pickN()],
] as const
let next = rng(SEED)
function pickN() {
	return Math.floor(next() * 12)
}

describe('FUZZ-001 independent utilities are order-independent', () => {
	test('shuffling independent segments yields equal finalized objects', () => {
		next = rng(SEED)
		for (let i = 0; i < 200; i++) {
			const a = flex.col.gap[2].p[4].rounded[2]()
			const b = rounded[2].p[4].gap[2].flex.col()
			expect(a, `seed=${SEED} iter=${i}`).toEqual(b)
		}
	})
})

describe('FUZZ-002 same-property utilities resolve to the last write', () => {
	test('a random run of paddings ends on the last value', () => {
		next = rng(SEED + 1)
		for (let i = 0; i < 200; i++) {
			const v1 = pickN()
			const v2 = pickN()
			expect(p[v1].p[v2]()).toEqual({ padding: `${v2 * 4}px` })
		}
	})
})

describe('FUZZ-003 no broken tokens leak into the style object', () => {
	test('finalized objects never contain undefined / null / [object Object]', () => {
		next = rng(SEED + 2)
		for (let i = 0; i < 300; i++) {
			const a = pick(next, [flex.col, gap[pickN()], p[pickN()], w[pickN()], h[pickN()]] as any)
			const out = (a as any)()
			for (const k of Object.keys(out)) {
				const v = (out as any)[k]
				expect(v, `seed=${SEED + 2} iter=${i} key=${k}`).not.toBe(undefined)
				expect(String(v)).not.toContain('[object Object]')
				expect(String(v)).not.toContain('undefined')
			}
		}
	})
})

describe('FUZZ-005 reserved words and odd strings do not poison output', () => {
	test('color values that look like reserved words stay plain values', () => {
		next = rng(SEED + 3)
		const words = ['constructor', 'prototype', 'toString', '__proto__', 'hasOwnProperty']
		for (const w鍵 of words) {
			const out = bg[w鍵 as any]()
			expect(({} as any)[w鍵]).not.toBe('boom')
			expect(out).toEqual({ background: w鍵 })
		}
	})
})

describe('FUZZ-006 shared chains do not cross-contaminate', () => {
	test('two branches off one base remain independent across many runs', () => {
		next = rng(SEED + 4)
		const base = text['#fff']
		for (let i = 0; i < 200; i++) {
			const x = pickN()
			const y = pickN()
			const a = base.gap[x]()
			const b = base.gap[y]()
			expect(a.gap).toBe(`${x * 4}px`)
			expect(b.gap).toBe(`${y * 4}px`)
		}
	})
})

describe('FUZZ-007 plain object merge follows last-write reference model', () => {
	test('later call arguments override earlier ones for the same property', () => {
		next = rng(SEED + 5)
		for (let i = 0; i < 200; i++) {
			const out = gap[4]({ color: 'red' }, { color: 'blue' })
			expect(out).toEqual({ gap: '16px', color: 'blue' })
		}
	})
})
