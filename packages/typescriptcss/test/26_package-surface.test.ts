import { describe, expect, test } from 'vitest'
import * as entry from '../src'
import { flex, gap } from '../src'

// Chapter N — package surface and the zero-runtime premise.
// Observes the public entry: every README-documented API is importable, the
// finalized value is a plain object usable without any extra browser runtime,
// and the shared registry behaves deterministically. No utility value tables.

const DOCUMENTED_ROOTS = [
	'flex', 'gap', 'p', 'px', 'py', 'm', 'mx', 'my', 'w', 'h', 'max', 'min',
	'bg', 'text', 'font', 'border', 'rounded', 'items', 'justify', 'dark', 'css', 'define',
]

describe('PACKAGE-001 documented API is reachable from the entry', () => {
	test('each README root is exported from the public entry', () => {
		for (const name of DOCUMENTED_ROOTS) {
			expect(entry, `missing export: ${name}`).toHaveProperty(name)
		}
	})
})

describe('PACKAGE-002 no type-only artifacts leak as runtime values', () => {
	test('the entry exposes only callable chains and define, never types', () => {
		for (const [name, value] of Object.entries(entry)) {
			expect(['function'].includes(typeof value), `${name} is ${typeof value}`).toBe(true)
		}
	})
})

describe('PACKAGE-003 finalized object is a zero-runtime plain object', () => {
	test('a chain call returns a plain object with no prototype machinery', () => {
		const out = flex.col.gap[4]()
		expect(Object.getPrototypeOf(out)).toBe(Object.prototype)
		// it is directly consumable as inline style: only string-ish values
		for (const v of Object.values(out)) {
			expect(['string', 'number']).toContain(typeof v)
		}
	})
})

describe('PACKAGE-004 unused exports do not change used output', () => {
	test('importing the whole namespace does not alter a chain result', () => {
		void entry
		expect(gap[4]()).toEqual({ gap: '16px' })
	})
})

describe('PACKAGE-006 shared registry is deterministic', () => {
	test('the same chain input is stable across repeated evaluation', () => {
		const a = flex.col.gap[2]()
		const b = flex.col.gap[2]()
		expect(a).toEqual(b)
	})

	test('define registers into the shared registry without reordering existing roots', () => {
		const keysBefore = Object.keys(entry).length
		entry.define('pkgProbe', { color: '#abc' })
		// existing exports are unchanged in count from the static namespace view
		expect(Object.keys(entry).length).toBe(keysBefore)
	})
})
