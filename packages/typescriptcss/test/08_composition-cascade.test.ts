import { describe, it, expect } from 'vitest'
import { bg, p, m, flex, gap, text, translate, font, leading } from '../src/index.ts'
import { styleEqual } from './_helpers.ts'

const num = <T>(c: T, k: number) => (c as unknown as Record<number, () => Record<string, unknown>>)[k]()

describe('COMPOSE-003 transform composition', () => {
        it('[RED bug] translateX and translateY do not compose; the later overwrites the former', () => {
                const out = translate.x[4].translate.y[4]()
                expect(out.transform).toBe('translateY(16px)')
        })
        it('observed: a single translate axis is correct', () => {
                expect(translate.x[4]()).toEqual({ transform: 'translateX(16px)' })
        })
})

describe('COMPOSE-005..007 font-size implicit sub-properties', () => {
        it('named text size carries an implicit line-height', () => {
                expect(text.sm()).toEqual({ fontSize: '14px', lineHeight: '20px' })
        })
        it('a later explicit leading overrides the named-size implicit line-height, size kept', () => {
                const out = text.sm.leading[6]()
                expect(out.lineHeight).toBe('24px')
                expect(out.fontSize).toBe('14px')
        })
        it('numeric text size does NOT emit an implicit line-height', () => {
                const out = num(text, 4)
                expect('lineHeight' in out).toBe(false)
        })
})

describe('COMPOSE-009 same-property override is last-write-wins and deterministic', () => {
        it('two bg writes keep the last', () => {
                expect(bg['#fff'].bg['#000']()).toEqual({ background: '#000' })
        })
        it('reordering two writes to the same property flips the winner', () => {
                const a = bg['#fff'].bg['#000']()
                const b = bg['#000'].bg['#fff']()
                expect(a.background).toBe('#000')
                expect(b.background).toBe('#fff')
        })
        it('GRAMMAR limitation: flex direction cannot be overridden once set (scope drops after the first keyword)', () => {
                expect(flex.col.row()).toEqual({ display: 'flex', flexDirection: 'column' })
                expect(flex.row.col()).toEqual({ display: 'flex', flexDirection: 'row' })
        })
})

describe('COMPOSE-010 independent properties commute', () => {
        it('p[2].m[2] equals m[2].p[2]', () => {
                expect(styleEqual(p[2].m[2](), m[2].p[2]())).toBe(true)
        })
        it('all permutations of three independent utilities are meaning-equal', () => {
                const target = { display: 'flex', gap: '16px', padding: '8px' }
                const perms = [flex.gap[4].p[2](), flex.p[2].gap[4](), gap[4].flex.p[2](), gap[4].p[2].flex(), p[2].flex.gap[4](), p[2].gap[4].flex()]
                for (const out of perms) expect(out).toEqual(target)
        })
})

describe('COMPOSE-011 important / prefix surface', () => {
        it('[RED unsupported] no important modifier exists; values carry no !important', () => {
                const out = bg['#fff']()
                expect(String(out.background)).not.toContain('!important')
        })
        it('font / leading imports kept honest', () => {
                expect(typeof font).toBe('function')
                expect(typeof leading).toBe('function')
        })
})
