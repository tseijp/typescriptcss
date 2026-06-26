import { describe, expect, test } from 'vitest'
import * as tw from '../src'
import { p, gap, bg } from '../src'

// Chapter K — browser-semantic regression.
// Computed-style oracles (not string snapshots). Gated on a DOM: under `node`
// these skip. They observe composition/cascade meaning that a plain object
// cannot prove. Families with no utility surface (filter, transform, scale)
// are honestly RED rather than guarded away.

const hasDOM = typeof document !== 'undefined'
const dom = hasDOM ? test : test.skip

function computed(style: Record<string, any>): CSSStyleDeclaration {
	const el = document.createElement('div')
	Object.assign(el.style, style)
	document.body.appendChild(el)
	return getComputedStyle(el)
}

describe('BROWSER-001 touch-action composition', () => {
	dom('pan-x pan-y compose into a touch-action value', () => {
		const cs = computed((tw as any).touch['pan-x pan-y']())
		expect(cs.touchAction).toBe('pan-x pan-y')
	})
})

describe('BROWSER-002 filter family on a single element', () => {
	dom('combined filters apply to the element', () => {
		const cs = computed((tw as any).blur[4].brightness[110]())
		expect(cs.filter).toContain('blur')
	})
})

describe('BROWSER-004 scale percentage vs number', () => {
	dom('computed scale survives a percentage input', () => {
		const cs = computed((tw as any).scale[110]())
		expect(cs.scale).not.toBe('')
	})
})

describe('BROWSER-006 font-size sub-property override', () => {
	dom('explicit leading overrides size-implied line-height in computed style', () => {
		const cs = computed(tw.text.base.leading[10]())
		expect(cs.lineHeight).toBe('40px')
	})
})

describe('BROWSER independent spacing cascade', () => {
	dom('padding and gap resolve independently in computed style', () => {
		const cs = computed(p[4].gap[2]())
		expect(cs.padding).toBe('16px')
	})
})

describe('BROWSER background color computed', () => {
	dom('a hex background resolves to an rgb computed color', () => {
		const cs = computed(bg['#000000']())
		expect(cs.backgroundColor).toBe('rgb(0, 0, 0)')
	})
})
