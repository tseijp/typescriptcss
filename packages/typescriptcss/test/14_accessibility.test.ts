import { describe, expect, test } from 'vitest'
import * as _ from '../src'

// UTIL-ACCESSIBILITY — screen-reader visibility and forced-color-adjust.
// Tailwind exposes `sr-only` / `not-sr-only` and `forced-color-adjust-*`.
// These have no namespace in src yet. The chain root is called directly (no
// optional-chaining guard) so an unimplemented utility throws / mismatches and
// the case is honestly RED, exactly like the 00–13 suites. The gap stays
// counted in the family ledger instead of being hidden behind `?.`.

describe('screen-reader visibility', () => {
        test('sr.only collapses the element to an a11y-only box', () => {
                expect(_.sr.only()).toEqual({
                        position: 'absolute',
                        width: '1px',
                        height: '1px',
                        padding: '0',
                        margin: '-1px',
                        overflow: 'hidden',
                        clip: 'rect(0, 0, 0, 0)',
                        whiteSpace: 'nowrap',
                        borderWidth: '0',
                })
        })

        test('notSr.only restores the element to the visible flow', () => {
                expect(_.notSr.only()).toEqual({
                        position: 'static',
                        width: 'auto',
                        height: 'auto',
                        padding: '0',
                        margin: '0',
                        overflow: 'visible',
                        clip: 'auto',
                        whiteSpace: 'normal',
                })
        })
})

describe('forced-color-adjust', () => {
        test('forcedColorAdjust.auto', () => {
                expect((_ as any).forcedColorAdjust.auto()).toEqual({ forcedColorAdjust: 'auto' })
        })

        test('forcedColorAdjust.none', () => {
                expect((_ as any).forcedColorAdjust.none()).toEqual({ forcedColorAdjust: 'none' })
        })
})
