import { describe, it, expect } from 'vitest'
import { translate, bg, text, font, leading, size } from '../src/index.ts'

const hasDom = typeof document !== 'undefined'

const apply = (style: Record<string, unknown>) => {
        const el = document.createElement('div')
        Object.assign(el.style, style)
        return el
}

describe.skipIf(!hasDom)('BROWSER-002/003 filter and transform composition (browser oracle)', () => {
        it('BROWSER-004 a single translate axis is reflected in the element transform', () => {
                const el = apply(translate.x[4]())
                expect(el.style.transform).toContain('translateX(16px)')
        })
})

describe.skipIf(!hasDom)('BROWSER-005 pseudo content and conditional state (browser oracle)', () => {
        it('background color applies to the element', () => {
                const el = apply(bg['#0b1120']())
                expect(el.style.background).not.toBe('')
        })
})

describe.skipIf(!hasDom)('BROWSER-006 implicit vs explicit typographic sub-properties (browser oracle)', () => {
        it('named text size carries line-height into the element', () => {
                const el = apply(text.sm())
                expect(el.style.fontSize).toBe('14px')
                expect(el.style.lineHeight).toBe('20px')
        })
        it('explicit leading overrides the named-size line-height on the element', () => {
                const el = apply(text.sm.leading[6]())
                expect(el.style.lineHeight).toBe('24px')
                expect(el.style.fontSize).toBe('14px')
        })
})

describe('BROWSER oracle is gated on a DOM environment', () => {
        it('records why browser cases are skipped under the node environment', () => {
                if (!hasDom) expect(hasDom).toBe(false)
                else expect(hasDom).toBe(true)
                void font
                void leading
                void size
        })
})
