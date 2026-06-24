// Shared fixtures and oracles for the typescriptcss unit suite.
//
// The product under test is the runtime chain only (src/index.ts). These
// helpers implement the *independent* invariants required by PROMPT.md so the
// suite never just copies the current implementation output back as the
// expected value:
//
//   - metamorphic:  meaning-preserving transforms compare equal to each other.
//   - structural:   the returned value is always a plain enumerable CSS object.
//   - seeded fuzz:  reproducible pseudo-random chains.

import type { Chain } from '../src/types.ts'

/** Mulberry32 — tiny deterministic PRNG so fuzz cases are reproducible. */
export function rng(seed: number): () => number {
	let a = seed >>> 0
	return () => {
		a |= 0
		a = (a + 0x6d2b79f5) | 0
		let t = Math.imul(a ^ (a >>> 15), 1 | a)
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296
	}
}

export function pick<T>(next: () => number, items: readonly T[]): T {
	return items[Math.floor(next() * items.length)]
}

/**
 * A finished style object is a plain object whose own enumerable values are all
 * primitives or strings — never a function, Proxy, or nested chain metadata.
 * This is the structural oracle that backs API-001 / FUZZ-003 / PROXY-003.
 */
export function isPlainStyle(value: unknown): value is Record<string, unknown> {
	if (typeof value !== 'object' || value === null) return false
	if (typeof value === 'function') return false
	const proto = Object.getPrototypeOf(value)
	if (proto !== Object.prototype && proto !== null) return false
	return true
}

export function assertNoLeakedMarkers(style: Record<string, unknown>): string[] {
	const leaks: string[] = []
	for (const [k, v] of Object.entries(style)) {
		if (typeof v === 'function') leaks.push(`function@${k}`)
		if (typeof v === 'object' && v !== null) leaks.push(`object@${k}`)
		if (v === undefined) leaks.push(`undefined@${k}`)
		if (v === null) leaks.push(`null@${k}`)
		if (typeof v === 'string' && v.includes('[object Object]')) leaks.push(`stringified-object@${k}`)
		// Internal State fields must never surface as CSS properties.
		if (k === 'read' || k === 'greedy' || k === 'scope' || k === 'dark' || k === 'media' || k === 'css') leaks.push(`metadata@${k}`)
	}
	return leaks
}

/** Apply a list of segment readers to a fresh chain, in order. */
export type Segment = (c: Chain) => Chain

export function build(root: Chain, segments: Segment[]): Chain {
	return segments.reduce((c, seg) => seg(c), root)
}
