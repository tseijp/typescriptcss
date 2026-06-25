import { describe, it, expectTypeOf } from 'vitest'
import { flex, font, p, m, bg, text, w, define } from '../src/index.ts'
import type { Chain } from '../src/types.ts'

describe('TYPE-001 positive root utilities type-check', () => {
        it('canonical chains compile and finalize to a CSS object', () => {
                expectTypeOf(flex.col.gap[4].p[6]()).toBeObject()
                expectTypeOf(font.bold()).toBeObject()
                expectTypeOf(text.center()).toBeObject()
                expectTypeOf(bg['#0b1120']()).toBeObject()
                expectTypeOf(w.full()).toBeObject()
                expectTypeOf(flex.col).toMatchTypeOf<Chain>()
        })
})

describe('TYPE-002 category mismatch is rejected on keyword utilities', () => {
        it('font keyword domain rejects an unrelated keyword', () => {
                // @ts-expect-error font has no `wrap` keyword (numeric scale + weight/family only)
                font.wrap
        })
        it('font rejects a non-numeric, non-keyword string index', () => {
                // @ts-expect-error font is a numeric scale, `abc` is not a valid key
                font['abc']
        })
})

describe('TYPE-003 value domain mismatch on numeric scale utilities', () => {
        it('padding scale rejects a string key', () => {
                // @ts-expect-error p is a numeric scale; a non-numeric string is not indexable
                p['abc']
        })
        it('margin scale rejects a keyword', () => {
                // @ts-expect-error m has no `center` keyword
                m.center
        })
})

describe('TYPE-005 call argument contract', () => {
        it('accepts plain objects, nullish, and false', () => {
                expectTypeOf(p[2]({ color: 'red' }, null, undefined, false)).toBeObject()
        })
        it('rejects a primitive argument', () => {
                // @ts-expect-error a number is not a valid style argument
                p[2](5)
        })
        it('rejects a string argument', () => {
                // @ts-expect-error a string is not a valid style argument
                p[2]('red')
        })
})

describe('TYPE-006 define generic boundary', () => {
        it('define returns the requested chain type without leaking', () => {
                const brand = define<typeof flex>('typeBrand', { color: 'red' })
                expectTypeOf(brand).toMatchTypeOf<typeof flex>()
                expectTypeOf(brand()).toBeObject()
        })
})

describe('TYPE-009 escape hatches are not counted as API guarantees', () => {
        it('any bypasses the contract (documented, not a guarantee)', () => {
                const escape = bg as any
                expectTypeOf(escape.literally.anything).toBeAny()
        })
})

describe('TYPE-GAP color utilities have an open string index (documented permissiveness)', () => {
        it('bg.flex is NOT rejected because Color carries a string index signature', () => {
                expectTypeOf(bg.flex).toMatchTypeOf<Chain>()
        })
})
