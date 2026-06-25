import { describe, it, expect } from 'vitest'
import * as t from '../src/index.ts'

const lib = t as unknown as Record<string, unknown>
const any = t as unknown as Record<string, any>

const VARIANTS: Array<[string, string[]]> = [
        ['VAR-INTERACTION', ['hover', 'focus', 'focusWithin', 'focusVisible', 'active', 'visited', 'target']],
        ['VAR-STRUCTURE', ['first', 'last', 'only', 'odd', 'even', 'firstOfType', 'lastOfType', 'onlyOfType', 'nth', 'empty']],
        ['VAR-FORM', ['disabled', 'enabled', 'checked', 'indeterminate', 'required', 'optional', 'valid', 'invalid', 'placeholderShown', 'readOnly', 'autofill']],
        ['VAR-RELATIONAL', ['has', 'not', 'group', 'peer', 'groupHas', 'peerHas', 'inert']],
        ['VAR-PSEUDOELEMENT', ['before', 'after', 'firstLetter', 'firstLine', 'marker', 'selection', 'placeholder', 'backdrop']],
        ['VAR-CHILD', ['child', 'descendant']],
        ['VAR-VIEWPORT', ['lg', 'xl']],
        ['VAR-CONTAINER', ['container']],
        ['VAR-PREFERENCE', ['motionSafe', 'motionReduce', 'contrastMore', 'contrastLess', 'forcedColors']],
        ['VAR-DEVICE', ['portrait', 'landscape', 'print']],
        ['VAR-FEATURE', ['supports', 'startingStyle']],
        ['VAR-ATTRIBUTE', ['aria', 'data', 'rtl', 'ltr', 'open']],
        ['VAR-ARBITRARY', ['selector', 'variant']],
]

describe('Variant families are unimplemented (RED ledger)', () => {
        for (const [family, names] of VARIANTS) {
                for (const name of names) {
                        it(`[RED unsupported ${family}] ${name} is not a public variant`, () => {
                                expect(lib[name]).toBeUndefined()
                        })
                }
        }
})

describe('VAR-INTERACTION hover is the first undischarged variant contract', () => {
        it.fails('[RED unsupported] hover.bg[..] should expose a hover-conditional declaration', () => {
                const out = any.hover.bg['#000']()
                expect(JSON.stringify(out)).toContain('hover')
        })
})

describe('STACK-001 variant ordering contract is undefined while variants are unimplemented', () => {
        it.fails('[RED unsupported] stacking hover and focus should be order-sensitive in the selector', () => {
                const a = any.hover.focus.bg['#000']()
                const b = any.focus.hover.bg['#000']()
                expect(a).not.toEqual(b)
        })
})

describe('STACK-002 dark stacks with viewport as a logical AND (only dark is implemented)', () => {
        it('dark composes with a breakpoint on the same color (partial support)', () => {
                const out = t.sm.bg['#fff'].dark.bg['#000']()
                expect(out.colorScheme).toBe('light dark')
                expect(String(out.background)).toContain('light-dark(')
        })
})
