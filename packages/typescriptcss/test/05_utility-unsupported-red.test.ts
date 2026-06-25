import { describe, it, expect } from 'vitest'
import * as t from '../src/index.ts'

const lib = t as unknown as Record<string, undefined | ((...a: unknown[]) => Record<string, unknown>)>

const ABSENT: Array<[string, string]> = [
        ['UTIL-LAYOUT', 'aspect'],
        ['UTIL-LAYOUT', 'columns'],
        ['UTIL-LAYOUT', 'box'],
        ['UTIL-LAYOUT', 'float'],
        ['UTIL-LAYOUT', 'clear'],
        ['UTIL-LAYOUT', 'isolation'],
        ['UTIL-LAYOUT', 'object'],
        ['UTIL-LAYOUT', 'overscroll'],
        ['UTIL-LAYOUT', 'visible'],
        ['UTIL-LAYOUT', 'z'],
        ['UTIL-FLEXGRID', 'basis'],
        ['UTIL-FLEXGRID', 'grow'],
        ['UTIL-FLEXGRID', 'shrink'],
        ['UTIL-FLEXGRID', 'order'],
        ['UTIL-FLEXGRID', 'rows'],
        ['UTIL-FLEXGRID', 'rowStart'],
        ['UTIL-FLEXGRID', 'self'],
        ['UTIL-SPACING', 'space'],
        ['UTIL-SIZING', 'container'],
        ['UTIL-TYPOGRAPHY', 'leadingTrim'],
        ['UTIL-TYPOGRAPHY', 'list'],
        ['UTIL-TYPOGRAPHY', 'underline'],
        ['UTIL-TYPOGRAPHY', 'uppercase'],
        ['UTIL-TYPOGRAPHY', 'truncate'],
        ['UTIL-TYPOGRAPHY', 'indent'],
        ['UTIL-TYPOGRAPHY', 'align'],
        ['UTIL-TYPOGRAPHY', 'whitespace'],
        ['UTIL-TYPOGRAPHY', 'break'],
        ['UTIL-TYPOGRAPHY', 'hyphens'],
        ['UTIL-BACKGROUND', 'from'],
        ['UTIL-BACKGROUND', 'via'],
        ['UTIL-BACKGROUND', 'to'],
        ['UTIL-BACKGROUND', 'gradient'],
        ['UTIL-BORDER', 'outline'],
        ['UTIL-BORDER', 'divide'],
        ['UTIL-BORDER', 'ring'],
        ['UTIL-EFFECT', 'shadow'],
        ['UTIL-EFFECT', 'opacity'],
        ['UTIL-EFFECT', 'mix'],
        ['UTIL-MASK', 'mask'],
        ['UTIL-FILTER', 'blur'],
        ['UTIL-FILTER', 'brightness'],
        ['UTIL-FILTER', 'contrast'],
        ['UTIL-FILTER', 'grayscale'],
        ['UTIL-FILTER', 'invert'],
        ['UTIL-FILTER', 'saturate'],
        ['UTIL-FILTER', 'sepia'],
        ['UTIL-FILTER', 'backdrop'],
        ['UTIL-TABLE', 'caption'],
        ['UTIL-MOTION', 'transition'],
        ['UTIL-MOTION', 'duration'],
        ['UTIL-MOTION', 'ease'],
        ['UTIL-MOTION', 'delay'],
        ['UTIL-MOTION', 'animate'],
        ['UTIL-TRANSFORM', 'rotate'],
        ['UTIL-TRANSFORM', 'scale'],
        ['UTIL-TRANSFORM', 'skew'],
        ['UTIL-TRANSFORM', 'transform'],
        ['UTIL-TRANSFORM', 'perspective'],
        ['UTIL-TRANSFORM', 'origin'],
        ['UTIL-INTERACTION', 'cursor'],
        ['UTIL-INTERACTION', 'select'],
        ['UTIL-INTERACTION', 'resize'],
        ['UTIL-INTERACTION', 'snap'],
        ['UTIL-INTERACTION', 'touch'],
        ['UTIL-INTERACTION', 'appearance'],
        ['UTIL-INTERACTION', 'accent'],
        ['UTIL-INTERACTION', 'caret'],
        ['UTIL-INTERACTION', 'scheme'],
        ['UTIL-INTERACTION', 'will'],
        ['UTIL-SVG', 'fill'],
        ['UTIL-SVG', 'stroke'],
        ['UTIL-ACCESSIBILITY', 'sr'],
        ['UTIL-ACCESSIBILITY', 'forced'],
]

describe('UTIL unsupported families have no dedicated root utility (RED ledger)', () => {
        for (const [family, name] of ABSENT) {
                it(`[RED unsupported ${family}] ${name} is not a public utility`, () => {
                        expect(lib[name]).toBeUndefined()
                })
        }
})

describe('UTIL-EFFECT opacity is a Tailwind family that is currently unimplemented', () => {
        it.fails('[RED unsupported] opacity[50] should yield opacity:0.5', () => {
                expect((t as unknown as Record<string, Record<number, () => Record<string, unknown>>>).opacity[50]()).toEqual({ opacity: '0.5' })
        })
})

describe('UTIL-FILTER blur is a Tailwind family that is currently unimplemented', () => {
        it.fails('[RED unsupported] blur[4] should yield filter:blur(...)', () => {
                expect((t as unknown as Record<string, Record<number, () => Record<string, unknown>>>).blur[4]()).toEqual({ filter: 'blur(4px)' })
        })
})

describe('UTIL-EFFECT shadow is a Tailwind family that is currently unimplemented', () => {
        it.fails('[RED unsupported] shadow should yield a boxShadow declaration', () => {
                const out = (t as unknown as Record<string, () => Record<string, unknown>>).shadow()
                expect('boxShadow' in out).toBe(true)
        })
})
