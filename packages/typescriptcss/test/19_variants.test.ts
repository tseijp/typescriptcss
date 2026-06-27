import { describe, expect, test } from 'vitest'
import { bg, p } from '../src'

// 19 — variant families (hover / focus / group / peer / before / media / … ).
//
// Scope (MECE): suites 00–13 cover unconditional utility/key pairs and suite 18
// covers value-reader acceptance. This file covers the orthogonal axis those
// suites never touch: prefixing a declaration with a *variant* so it becomes a
// conditional declaration (a nested selector or at-rule), one case per variant
// across every variant family.
//
// Variants are NOT implemented. The danger called out in the brief is that the
// greedy color reader / key-echo fallback turns `bg.hover` into a flat
// {background:'hover'} (or {background:'#000'} after a follow-up), which a loose
// `toBeTypeOf('object')` would wrongly pass. The contract below rejects that: a
// variant MUST produce a conditional-declaration *structure* — at least one
// at-rule (key starts with '@') or nested-selector key (':', '&', '[', '>', '*',
// or a descendant combinator) whose value is a nested style object that carries
// the guarded declaration — and the guarded declaration MUST NOT leak to the top
// level as a flat property. Because variants are unimplemented these are RED.

const CONDITIONAL_KEY = /^@|[&:[>*]|\s/

const isStyleObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)

/** All conditional (selector / at-rule) entries whose value is a nested style object. */
function conditionalEntries(style: Record<string, unknown>): Array<[string, Record<string, unknown>]> {
        return Object.entries(style).filter(([k, v]) => CONDITIONAL_KEY.test(k) && isStyleObject(v)) as Array<[string, Record<string, unknown>]>
}

/** Recursively search nested style objects for an exact prop:value declaration. */
function declaredNested(style: Record<string, unknown>, prop: string, value: string): boolean {
        return conditionalEntries(style).some(([, nested]) => nested[prop] === value || declaredNested(nested, prop, value))
}

/**
 * The variant contract. `style` must:
 *   1. be a plain style object,
 *   2. expose at least one conditional (selector/at-rule) key → nested object,
 *   3. carry the guarded `prop: value` *inside* a conditional, not flat,
 *   4. NOT expose `prop` as a flat top-level declaration (the greedy-reader trap).
 */
function expectVariant(style: unknown, prop: string, value: string): void {
        expect(isStyleObject(style)).toBe(true)
        const s = style as Record<string, unknown>
        expect(conditionalEntries(s).length).toBeGreaterThan(0)
        expect(s[prop]).not.toBe(value) // guarded declaration must not be flat at top level
        expect(declaredNested(s, prop, value)).toBe(true)
}

// family → [variant names …]. Each variant is exercised once via bg (color
// reader / greedy-trap path) plus a couple via p (numeric reader / echo-fallback
// path) so both reader code paths are covered per family.
const FAMILIES: Record<string, string[]> = {
        interaction: ['hover', 'focus', 'active', 'visited', 'focusVisible', 'focusWithin', 'target'],
        structure: ['first', 'last', 'only', 'odd', 'even', 'empty', 'firstOfType', 'lastOfType', 'onlyOfType'],
        form: ['disabled', 'enabled', 'checked', 'indeterminate', 'required', 'optional', 'valid', 'invalid', 'readOnly', 'placeholderShown', 'autofill'],
        relational: ['group', 'peer', 'groupHover', 'peerHover', 'groupFocus', 'peerFocus', 'has'],
        pseudoElement: ['before', 'after', 'placeholder', 'selection', 'marker', 'file', 'backdrop', 'firstLine', 'firstLetter'],
        child: ['child', 'descendant'],
        // NB: bare `sm`/`md` exist as inline-if() media *utilities* (see suite 00 and
        // the runtime mediaRule); the responsive *variant-as-nested-at-rule* contract
        // below uses distinct breakpoint-variant names that have no runtime rule.
        viewport: ['lg', 'xl', 'xl2', 'maxSm', 'maxMd'],
        container: ['atSm', 'atMd', 'atLg', 'container'],
        // NB: `dark` as the implemented light-dark() pairing lives in 18; here the
        // `prefers-color-scheme` *conditional* variants are the unit, so `dark` is
        // intentionally excluded to avoid double-purposing it.
        preference: ['light', 'motionReduce', 'motionSafe', 'contrastMore', 'contrastLess', 'forcedColors', 'prefersDark'],
        device: ['portrait', 'landscape', 'print', 'pointerFine', 'pointerCoarse'],
        feature: ['supports', 'rtl', 'ltr'],
        attribute: ['ariaChecked', 'ariaExpanded', 'ariaSelected', 'ariaDisabled', 'dataActive'],
        arbitrary: ['min', 'max', 'aria', 'data'],
}

for (const [family, variants] of Object.entries(FAMILIES)) {
        describe(`variant family: ${family}`, () => {
                // color path: bg.<variant>.bg['#000'] must guard background:'#000'.
                test.each(variants)(`bg.%s guards a color declaration`, (variant) => {
                        const chain = (bg as Record<string, any>)[variant]
                        expect(chain).toBeDefined()
                        expectVariant(chain.bg['#000'](), 'background', '#000')
                })
                // numeric path: p.<variant>.p[4] must guard padding:'16px'.
                test.each(variants)(`p.%s guards a length declaration`, (variant) => {
                        const chain = (p as Record<string, any>)[variant]
                        expect(chain).toBeDefined()
                        expectVariant(chain.p[4](), 'padding', '16px')
                })
        })
}
