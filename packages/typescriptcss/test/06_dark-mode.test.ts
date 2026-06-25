import { describe, it, expect } from 'vitest'
import { bg, text, border, dark } from '../src/index.ts'

const key = <T>(c: T, k: string) => (c as unknown as Record<string, () => Record<string, unknown>>)[k]()

describe('DARK-001 light then dark compiles to one light-dark() pair', () => {
        it('bg light + dark', () => {
                const out = bg['#fff'].dark.bg['#0b1120']()
                expect(out).toEqual({ background: 'light-dark(#fff, #0b1120)', colorScheme: 'light dark' })
        })
        it('full README pairing for bg and text', () => {
                const out = bg['#fff'].dark.bg['#0b1120'].text['#111'].dark.text['#f8fafc']()
                expect(out).toEqual({
                        background: 'light-dark(#fff, #0b1120)',
                        colorScheme: 'light dark',
                        color: 'light-dark(#111, #f8fafc)',
                })
        })
})

describe('DARK-002 dark without a base color falls back to initial, not an invalid value', () => {
        it('bg dark with no prior bg uses initial', () => {
                const out = dark.bg['#0b1120']()
                expect(out).toEqual({ background: 'light-dark(initial, #0b1120)', colorScheme: 'light dark' })
        })
})

describe('DARK-003 color property families that support dark', () => {
        it('background supports dark', () => {
                expect(bg['#fff'].dark.bg['#000']().background).toBe('light-dark(#fff, #000)')
        })
        it('text color supports dark', () => {
                expect(text['#111'].dark.text['#fff']().color).toBe('light-dark(#111, #fff)')
        })
        it('[RED unsupported] border color does not yet support dark pairing', () => {
                const out = key(border, '#111')
                const out2 = border['#111'].dark.border['#fff']?.() as Record<string, unknown> | undefined
                expect(out.borderColor).toBe('#111')
                expect(out2?.borderColor).not.toBe('light-dark(#111, #fff)')
        })
})

describe('DARK-004 dark affects only the next color utility and does not leak', () => {
        it('a non-color utility after a dark pair is unaffected', () => {
                const out = bg['#fff'].dark.bg['#0b1120'].text['#111']()
                expect(out.background).toBe('light-dark(#fff, #0b1120)')
                expect(out.color).toBe('#111')
        })
        it('a single dark only pairs the immediately following color', () => {
                const out = dark.bg['#000'].text['#fff']()
                expect(out.background).toBe('light-dark(initial, #000)')
                expect(out.color).toBe('#fff')
        })
})

describe('DARK GRAMMAR collision: text greedily swallows a literal dark segment', () => {
        it('text.dark consumes "dark" as a color value rather than enabling dark mode', () => {
                const out = text.dark.text['#fff']()
                expect(out.color).toBe('#fff')
                const swallowed = (text as unknown as Record<string, () => Record<string, unknown>>).dark()
                expect(swallowed).toEqual({ color: 'dark' })
        })
})
