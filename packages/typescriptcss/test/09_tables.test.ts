import { describe, expect, test } from 'vitest'
import * as _ from '../src'
// Generated mechanically from docs/09_tables/*.mdx — chain() returns a style object.
// Unimplemented utilities return undefined and stay RED until added to src.

describe('border-collapse', () => {
        test('border.collapse', () => {
                expect(_.border.collapse()).toEqual({ borderCollapse: 'collapse' })
        })
        test('border.separate', () => {
                expect(_.border.separate()).toEqual({ borderCollapse: 'separate' })
        })
})

describe('table-layout', () => {
        test('table.auto', () => {
                expect(_.table.auto()).toEqual({ tableLayout: 'auto' })
        })
        test('table.fixed', () => {
                expect(_.table.fixed()).toEqual({ tableLayout: 'fixed' })
        })
})

describe('caption-side', () => {
        test('caption.top', () => {
                expect(_.caption.top()).toEqual({ captionSide: 'top' })
        })
        test('caption.bottom', () => {
                expect(_.caption.bottom()).toEqual({ captionSide: 'bottom' })
        })
})
