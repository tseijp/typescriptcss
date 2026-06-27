import { describe, expect, test } from 'vitest'
import { bg, p } from '../src'

// Chapter 19 — VARIANT FAMILIES (hover / focus / group / peer / before / … ).
//
// MECE scope: suites 00–13 cover unconditional `utility -> declaration` pairs and
// suite 18 covers value-reader acceptance. This file owns the orthogonal axis
// those suites never touch: prefixing a declaration with a *variant* so it turns
// into a *conditional* declaration — a nested selector or at-rule whose body
// carries the guarded property. Every variant family is enumerated with
// `test.each`; there is no representative-sample shortcut.
//
// Variants are NOT implemented. The trap (called out in the brief) is the greedy
// color reader / key-echo fallback: `bg.hover` collapses to a flat
// {background:'hover'} (then {background:'#000'} after a follow-up read), and a
// permissive `toBeTypeOf('object')` would wrongly accept that. The contract below
// rejects it outright: a variant MUST emit a conditional-declaration *structure*
// — at least one at-rule key (`@…`) or nested-selector key (`:`/`&`/`[`/`>`/`*`
// or a descendant combinator) whose value is a nested style object holding the
// guarded declaration — and the guarded `prop:value` MUST NOT leak flat to the
// top level. No optional chaining, no `?? fallback`, no `as any` to swallow the
// gap: the chains are read directly so the unimplemented variants fail honestly.
// Because no variant exists, every case here is RED.

/** A conditional key is an at-rule (`@…`) or a nested-selector fragment. */
const CONDITIONAL_KEY = /^@|[&:[>*]|\s/

const isStyleObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)

/** All conditional (selector / at-rule) entries whose value is a nested style object. */
function conditionalEntries(style: Record<string, unknown>): Array<[string, Record<string, unknown>]> {
        return Object.entries(style).filter(([k, v]) => CONDITIONAL_KEY.test(k) && isStyleObject(v)) as Array<[string, Record<string, unknown>]>
}

/** Recursively search nested conditional style objects for an exact prop:value declaration. */
function declaredNested(style: Record<string, unknown>, prop: string, value: string): boolean {
        return conditionalEntries(style).some(([, nested]) => nested[prop] === value || declaredNested(nested, prop, value))
}

/**
 * The variant contract. `style` must:
 *   1. be a plain style object,
 *   2. expose at least one conditional (selector / at-rule) key -> nested object,
 *   3. carry the guarded `prop: value` *inside* a conditional, not flat,
 *   4. NOT expose `prop` as a flat top-level declaration (the greedy-reader trap).
 */
function expectVariant(style: unknown, prop: string, value: string): void {
        expect(isStyleObject(style)).toBe(true)
        const s = style as Record<string, unknown>
        expect(conditionalEntries(s).length).toBeGreaterThan(0)
        expect(s[prop]).not.toBe(value) // guarded declaration must never be flat at the top level
        expect(declaredNested(s, prop, value)).toBe(true)
}

// family -> [variant names …]. Each variant is exercised once on the color path
// (bg -> greedy color reader / greedy-trap) and once on the numeric path (p ->
// numeric reader / key-echo fallback) so both reader code paths are covered for
// every family. Names are spelled in the chain-friendly camelCase a TS DSL would
// expose (focusVisible, groupHover, ariaChecked, …).
const FAMILIES: Record<string, string[]> = {
        interaction: ['hover', 'focus', 'active', 'visited', 'focusVisible', 'focusWithin', 'target'],
        structure: ['first', 'last', 'only', 'odd', 'even', 'empty', 'firstChild', 'lastChild', 'firstOfType', 'lastOfType', 'onlyOfType', 'nthChild', 'nthLast'],
        form: ['disabled', 'enabled', 'checked', 'indeterminate', 'default', 'required', 'optional', 'valid', 'invalid', 'inRange', 'outOfRange', 'readOnly', 'readWrite', 'placeholderShown', 'autofill'],
        relational: ['group', 'peer', 'groupHover', 'peerHover', 'groupFocus', 'peerFocus', 'groupActive', 'peerChecked', 'has'],
        pseudoElement: ['before', 'after', 'placeholder', 'selection', 'marker', 'file', 'backdrop', 'firstLine', 'firstLetter'],
        child: ['child', 'descendant', 'sibling', 'adjacent'],
        // NB: bare `sm`/`md` already exist as inline-if() media *utilities* (suite 00 +
        // the runtime mediaRule). The responsive *variant-as-nested-at-rule* contract
        // here uses distinct breakpoint-variant names that carry no runtime rule.
        viewport: ['lg', 'xl', 'xl2', 'maxSm', 'maxMd', 'maxLg'],
        container: ['atSm', 'atMd', 'atLg', 'container'],
        // NB: `dark` as the implemented light-dark() pairing is owned by suite 22; the
        // `prefers-color-scheme` *conditional* variants are the unit here, so `dark`
        // is intentionally excluded to avoid double-purposing it.
        preference: ['light', 'motionReduce', 'motionSafe', 'contrastMore', 'contrastLess', 'forcedColors', 'prefersDark'],
        device: ['portrait', 'landscape', 'print', 'screen', 'pointerFine', 'pointerCoarse', 'anyPointerFine'],
        feature: ['supports', 'rtl', 'ltr'],
        attribute: ['ariaChecked', 'ariaExpanded', 'ariaSelected', 'ariaDisabled', 'ariaPressed', 'dataActive', 'dataOpen'],
        state: ['open', 'closed', 'modal'],
        arbitrary: ['min', 'max', 'aria', 'data', 'supportsArbitrary'],
}

for (const [family, variants] of Object.entries(FAMILIES)) {
        describe(`variant family: ${family}`, () => {
                // color path: bg.<variant>.bg['#000'] must guard background:'#000' inside a conditional.
                test.each(variants)(`bg.%s guards a color declaration in a conditional`, (variant) => {
                        const chain = (bg as Record<string, any>)[variant]
                        expect(chain).toBeDefined()
                        expectVariant(chain.bg['#000'](), 'background', '#000')
                })
                // numeric path: p.<variant>.p[4] must guard padding:'16px' inside a conditional.
                test.each(variants)(`p.%s guards a length declaration in a conditional`, (variant) => {
                        const chain = (p as Record<string, any>)[variant]
                        expect(chain).toBeDefined()
                        expectVariant(chain.p[4](), 'padding', '16px')
                })
        })
}
