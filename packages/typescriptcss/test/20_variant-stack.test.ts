import { describe, expect, test } from 'vitest'
import { bg, p } from '../src'

// Chapter 20 — VARIANT STACKING: composing two or more variants on one declaration.
//
// MECE scope: suite 19 exercises each variant once in isolation. This file owns
// the orthogonal *composition* axis — how multiple variants combine into a single
// guarded declaration: nesting order, logical-AND semantics, relational nesting,
// pseudo-element placement, idempotent de-duplication, and deep (3+) stacks. No
// single-variant case from 19 is repeated.
//
// Variants (and therefore stacks) are unimplemented, so every case is RED. The
// contract is strict for the same greedy-reader reason as suite 19: a stack of N
// variants must produce N *nested* conditional levels carrying the guarded
// declaration at the bottom — never a flat property echoed by the greedy color
// reader / key fallback. Chains are read directly; no `?.` / `??` / `as any`
// masks the missing implementation.

const CONDITIONAL_KEY = /^@|[&:[>*]|\s/

const isStyleObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)

function conditionalEntries(style: Record<string, unknown>): Array<[string, Record<string, unknown>]> {
        return Object.entries(style).filter(([k, v]) => CONDITIONAL_KEY.test(k) && isStyleObject(v)) as Array<[string, Record<string, unknown>]>
}

/** Max depth of nested conditional style objects (a single guard = depth 1). */
function conditionalDepth(style: Record<string, unknown>): number {
        const entries = conditionalEntries(style)
        if (entries.length === 0) return 0
        return 1 + Math.max(...entries.map(([, nested]) => conditionalDepth(nested)))
}

/** Collect the chain of conditional keys along the deepest guarded path. */
function conditionalKeyPath(style: Record<string, unknown>): string[] {
        const entries = conditionalEntries(style)
        if (entries.length === 0) return []
        let best: string[] = []
        for (const [k, nested] of entries) {
                const path = [k, ...conditionalKeyPath(nested)]
                if (path.length > best.length) best = path
        }
        return best
}

function declaredNested(style: Record<string, unknown>, prop: string, value: string): boolean {
        return conditionalEntries(style).some(([, nested]) => nested[prop] === value || declaredNested(nested, prop, value))
}

/**
 * A stack of `depth` variants must nest `depth` conditional levels deep, guard the
 * declaration at the bottom, and never leak the declaration to the top level.
 */
function expectStack(style: unknown, prop: string, value: string, depth: number): void {
        expect(isStyleObject(style)).toBe(true)
        const s = style as Record<string, unknown>
        expect(s[prop]).not.toBe(value) // never flat
        expect(declaredNested(s, prop, value)).toBe(true)
        expect(conditionalDepth(s)).toBeGreaterThanOrEqual(depth)
}

// --- logical-AND: two variants nest into two conditional levels ----------------

const TWO_STACK_COLOR: Array<[string, string]> = [
        ['hover', 'focus'],
        ['focus', 'active'],
        ['disabled', 'checked'],
        ['first', 'last'],
        ['hover', 'disabled'],
        ['checked', 'hover'],
]

const TWO_STACK_LENGTH: Array<[string, string]> = [
        ['hover', 'focus'],
        ['disabled', 'checked'],
        ['focus', 'visited'],
        ['odd', 'hover'],
        ['required', 'invalid'],
]

describe('stack — two variants nest as a logical AND', () => {
        test.each(TWO_STACK_COLOR)('bg.%s.%s guards a color under two nested conditions', (a, b) => {
                expectStack((bg as any)[a][b].bg['#000'](), 'background', '#000', 2)
        })
        test.each(TWO_STACK_LENGTH)('p.%s.%s guards a length under two nested conditions', (a, b) => {
                expectStack((p as any)[a][b].p[4](), 'padding', '16px', 2)
        })
})

// --- order significance: a..b and b..a both nest two deep, outer guards differ -

const ORDER_PAIRS: Array<[string, string]> = [
        ['hover', 'focus'],
        ['md', 'hover'],
        ['first', 'hover'],
        ['disabled', 'checked'],
]

describe('stack — order is preserved in the nesting (not merged)', () => {
        test.each(ORDER_PAIRS)('bg.%s.%s outer guard differs from the reversed order', (a, b) => {
                const ab = conditionalKeyPath((bg as any)[a][b].bg['#000']() as Record<string, unknown>)
                const ba = conditionalKeyPath((bg as any)[b][a].bg['#000']() as Record<string, unknown>)
                expect(ab.length).toBe(2)
                expect(ba.length).toBe(2)
                expect(ab[0]).not.toBe(ba[0]) // outermost guard reflects the first-applied variant
        })
})

// --- relational nesting (group / peer) ----------------------------------------

describe('stack — relational variant nesting (group / peer)', () => {
        const REL_COLOR: Array<[string, string]> = [
                ['group', 'hover'],
                ['group', 'focus'],
                ['peer', 'checked'],
        ]
        const REL_LENGTH: Array<[string, string]> = [
                ['peer', 'focus'],
                ['group', 'active'],
        ]
        test.each(REL_COLOR)('bg.%s.%s guards under a relational + state nest', (a, b) => {
                expectStack((bg as any)[a][b].bg['#000'](), 'background', '#000', 2)
        })
        test.each(REL_LENGTH)('p.%s.%s guards under a relational + state nest', (a, b) => {
                expectStack((p as any)[a][b].p[4](), 'padding', '16px', 2)
        })
        test('bg.group.hover.focus nests three relational/interaction levels', () => {
                expectStack((bg as any).group.hover.focus.bg['#000'](), 'background', '#000', 3)
        })
})

// --- pseudo-element ordering: element guard is innermost -----------------------

describe('stack — pseudo-element ordering (element guard innermost)', () => {
        const PSEUDO_PAIRS: Array<[string, string]> = [
                ['hover', 'before'],
                ['focus', 'after'],
                ['disabled', 'before'],
        ]
        test.each(PSEUDO_PAIRS)('bg.%s.%s nests state then pseudo-element (element last)', (state, pseudo) => {
                const style = (bg as any)[state][pseudo].bg['#000']() as Record<string, unknown>
                expectStack(style, 'background', '#000', 2)
                const path = conditionalKeyPath(style)
                expect(path[path.length - 1]).toMatch(/::?(before|after)/) // pseudo-element sits innermost
        })
})

// --- idempotency: repeating a variant must not deepen the nest -----------------

describe('stack — duplicate variant is idempotent', () => {
        const DUP_COLOR = ['hover', 'focus', 'disabled']
        const DUP_LENGTH = ['focus', 'checked']
        test.each(DUP_COLOR)('bg.%s.%s collapses to a single guard', (v) => {
                const once = conditionalKeyPath((bg as any)[v].bg['#000']() as Record<string, unknown>)
                const twice = conditionalKeyPath((bg as any)[v][v].bg['#000']() as Record<string, unknown>)
                expect(once.length).toBe(1) // a single variant produces exactly one guard
                expect(twice).toEqual(once) // repeating it adds nothing
        })
        test.each(DUP_LENGTH)('p.%s.%s collapses to a single guard', (v) => {
                const once = conditionalKeyPath((p as any)[v].p[4]() as Record<string, unknown>)
                const twice = conditionalKeyPath((p as any)[v][v].p[4]() as Record<string, unknown>)
                expect(once.length).toBe(1)
                expect(twice).toEqual(once)
        })
})

// --- deep stacks (3+ variants) ------------------------------------------------

describe('stack — deep stacks (3+ variants)', () => {
        test('bg.group.hover.dark.before nests four levels', () => {
                expectStack((bg as any).group.hover.dark.before.bg['#000'](), 'background', '#000', 4)
        })
        test('p.md.hover.focus.disabled nests four levels', () => {
                expectStack((p as any).md.hover.focus.disabled.p[4](), 'padding', '16px', 4)
        })
        test('bg.peer.checked.first.before nests four levels', () => {
                expectStack((bg as any).peer.checked.first.before.bg['#000'](), 'background', '#000', 4)
        })
        test('p.lg.group.hover.focus.after nests five levels', () => {
                expectStack((p as any).lg.group.hover.focus.after.p[4](), 'padding', '16px', 5)
        })
})
