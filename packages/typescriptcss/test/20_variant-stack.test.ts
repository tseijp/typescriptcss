import { describe, expect, test } from 'vitest'
import { bg, p } from '../src'

// 20 — variant *stacking*: composing two or more variants on one declaration.
//
// Scope (MECE): suite 19 covers each variant once in isolation. This file covers
// the orthogonal composition axis — how multiple variants combine into a single
// guarded declaration: their nesting order, logical-AND semantics, relational
// nesting, pseudo-element placement, idempotent de-duplication, and deep stacks.
// No single-variant case from 19 is repeated here.
//
// Variants (and therefore stacks) are unimplemented, so these are RED. The
// contract is strict for the same greedy-reader reason as suite 19: a stack must
// produce *nested* conditional structure carrying the guarded declaration, never
// a flat property echoed by the greedy color reader / key fallback.

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
 * A stack of `depth` variants must nest `depth` conditional levels deep, guard
 * the declaration at the bottom, and never leak the declaration to the top.
 */
function expectStack(style: unknown, prop: string, value: string, depth: number): void {
        expect(isStyleObject(style)).toBe(true)
        const s = style as Record<string, unknown>
        expect(s[prop]).not.toBe(value) // never flat
        expect(declaredNested(s, prop, value)).toBe(true)
        expect(conditionalDepth(s)).toBeGreaterThanOrEqual(depth)
}

describe('stack — two variants nest as logical AND', () => {
        test('bg.hover.focus guards under two nested conditions', () => {
                expectStack((bg as any).hover.focus.bg['#000'](), 'background', '#000', 2)
        })
        test('p.hover.focus guards a length under two conditions', () => {
                expectStack((p as any).hover.focus.p[4](), 'padding', '16px', 2)
        })
        test('p.disabled.checked nests two form conditions', () => {
                expectStack((p as any).disabled.checked.p[4](), 'padding', '16px', 2)
        })
})

describe('stack — order is preserved in the nesting', () => {
        // Two different orders of the same two variants must both nest two deep, and
        // each must place its outermost guard first (order-significant, not merged).
        test('bg.hover.focus outer guard differs from bg.focus.hover', () => {
                const a = conditionalKeyPath((bg as any).hover.focus.bg['#000']() as Record<string, unknown>)
                const b = conditionalKeyPath((bg as any).focus.hover.bg['#000']() as Record<string, unknown>)
                expect(a.length).toBe(2)
                expect(b.length).toBe(2)
                expect(a[0]).not.toBe(b[0]) // outermost guard reflects first-applied variant
        })
        test('p.md.hover differs from p.hover.md in outer guard', () => {
                const a = conditionalKeyPath((p as any).md.hover.p[4]() as Record<string, unknown>)
                const b = conditionalKeyPath((p as any).hover.md.p[4]() as Record<string, unknown>)
                expect(a.length).toBe(2)
                expect(b.length).toBe(2)
                expect(a[0]).not.toBe(b[0])
        })
})

describe('stack — relational variant nesting (group / peer)', () => {
        test('bg.group.hover guards under a relational + interaction nest', () => {
                expectStack((bg as any).group.hover.bg['#000'](), 'background', '#000', 2)
        })
        test('p.peer.focus guards under a relational + interaction nest', () => {
                expectStack((p as any).peer.focus.p[4](), 'padding', '16px', 2)
        })
        test('bg.group.hover.focus nests three relational/interaction levels', () => {
                expectStack((bg as any).group.hover.focus.bg['#000'](), 'background', '#000', 3)
        })
})

describe('stack — pseudo-element ordering (element last)', () => {
        // A pseudo-element must sit at the innermost level so the declaration applies
        // to the generated box under the outer state condition.
        test('bg.hover.before nests interaction then pseudo-element', () => {
                const style = (bg as any).hover.before.bg['#000']() as Record<string, unknown>
                expectStack(style, 'background', '#000', 2)
                const path = conditionalKeyPath(style)
                expect(path[path.length - 1]).toMatch(/::?(before|after)/) // pseudo-element innermost
        })
        test('p.focus.after nests interaction then pseudo-element', () => {
                expectStack((p as any).focus.after.p[4](), 'padding', '16px', 2)
        })
})

describe('stack — duplicate variant is idempotent', () => {
        // Repeating the same variant must not deepen the nest beyond one level for it.
        test('bg.hover.hover collapses to a single hover guard', () => {
                const once = conditionalKeyPath((bg as any).hover.bg['#000']() as Record<string, unknown>)
                const twice = conditionalKeyPath((bg as any).hover.hover.bg['#000']() as Record<string, unknown>)
                expect(once.length).toBe(1) // a single variant produces exactly one guard
                expect(twice).toEqual(once) // repeating it adds nothing
        })
        test('p.focus.focus collapses to a single focus guard', () => {
                const once = conditionalKeyPath((p as any).focus.p[4]() as Record<string, unknown>)
                const twice = conditionalKeyPath((p as any).focus.focus.p[4]() as Record<string, unknown>)
                expect(once.length).toBe(1)
                expect(twice).toEqual(once)
        })
})

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
})
