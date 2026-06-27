import { describe, expect, test } from 'vitest'
import * as tw from '../src'
import { assertNoLeakedMarkers, isPlainStyle, pick, rng, styleEqual } from './_helpers.ts'

// 25 — Section L: Fuzzing and property-based exploration (FUZZ-001..007).
//
// This chapter owns the property-based invariants of the runtime chain. Fixed
// single-utility mappings live in 00..13; the worked composition examples live
// in 21. Here every assertion is a law that must hold for *every* generated
// chain, never the output of one specific chain. Seeds are fixed (via _helpers
// `rng` / `pick`, per _REDESIGN.md) so each case is reproducible, and every
// failure message embeds its seed and the generated chain so a red case is
// replayable.
//
// The chain API is used directly (no `tw('...')` string API).
//
// Fail-rate calibration (_REDESIGN.md rules 1 & 5). The mechanically-generated
// chapters 00..13 are ~95% RED because most of the Tailwind surface is
// unimplemented. A fuzzer drawing only implemented utilities would be
// artificially all-GREEN and hide that gap. So FUZZ-004 draws from a pool that
// MIXES implemented and unimplemented utilities *and* variants, each pinned to
// its correct tailwind-compatible expectation. Implemented draws converge to
// GREEN; unimplemented draws read an `undefined` root, so the access throws and
// the case goes RED — the throw is never caught and the expectation is never
// weakened (rule 3). The structural laws (001..003, 005..007) run on the
// implemented subset, since order / last-write / no-leak are only well-defined
// once a utility actually emits a declaration.

const tn = tw as any
const NUMS = [0, 1, 2, 3, 4, 5, 6, 7] as const
const COLORS = ['red', 'blue', '#fff', 'currentColor', 'transparent'] as const

// A picked segment: how to extend a chain plus the single declaration it owns.
// Every segment in the pool writes a *distinct* CSS property, so any ordering of
// the pool is meaning-preserving (the premise of FUZZ-001).
interface Seg {
        label: string
        decl: Record<string, string>
        at: (c: any) => any
}

function randomSegs(next: () => number): Seg[] {
        const p = pick(next, NUMS),
                m = pick(next, NUMS),
                g = pick(next, NUMS)
        const w = pick(next, NUMS),
                h = pick(next, NUMS),
                r = pick(next, NUMS)
        const bg = pick(next, COLORS),
                tc = pick(next, COLORS)
        return [
                { label: `p[${p}]`, decl: { padding: `${p * 4}px` }, at: (c) => c.p[p] },
                { label: `m[${m}]`, decl: { margin: `${m * 4}px` }, at: (c) => c.m[m] },
                { label: `gap[${g}]`, decl: { gap: `${g * 4}px` }, at: (c) => c.gap[g] },
                { label: `w[${w}]`, decl: { width: `${w * 4}px` }, at: (c) => c.w[w] },
                { label: `h[${h}]`, decl: { height: `${h * 4}px` }, at: (c) => c.h[h] },
                { label: `rounded[${r}]`, decl: { borderRadius: `${r * 4}px` }, at: (c) => c.rounded[r] },
                { label: `bg[${bg}]`, decl: { background: bg }, at: (c) => c.bg[bg] },
                { label: `text[${tc}]`, decl: { color: tc }, at: (c) => c.text[tc] },
        ]
}

function shuffle<T>(next: () => number, items: T[]): T[] {
        const a = items.slice()
        for (let i = a.length - 1; i > 0; i--) {
                const j = Math.floor(next() * (i + 1))
                ;[a[i], a[j]] = [a[j], a[i]]
        }
        return a
}

// Apply segments left-to-right from the module namespace and finalize.
function run(segs: Seg[]): Record<string, unknown> {
        let c: any = tw
        for (const s of segs) c = s.at(c)
        return c()
}

// FUZZ-001 — independent utilities in any order are meaning-equal.
describe('FUZZ-001 independent-utility order is irrelevant', () => {
        test('every permutation is style-equal to the canonical order', () => {
                for (let seed = 1; seed <= 100; seed++) {
                        const next = rng(seed)
                        const pool = randomSegs(next)
                        const canonical = run(pool)
                        // Several independent shuffles must all collapse to the same meaning.
                        for (let p = 0; p < 4; p++) {
                                const perm = shuffle(next, pool)
                                expect(styleEqual(canonical, run(perm)), `seed=${seed} order=${perm.map((s) => s.label).join('.')}`).toBe(true)
                        }
                }
        })

        test('the finalized object is exactly the union of the distinct decls', () => {
                for (let seed = 200; seed <= 260; seed++) {
                        const next = rng(seed)
                        const pool = randomSegs(next)
                        const expected = Object.assign({}, ...pool.map((s) => s.decl))
                        expect(styleEqual(run(shuffle(next, pool)), expected), `seed=${seed}`).toBe(true)
                }
        })
})

// FUZZ-002 — a run over the same property resolves to the last write.
describe('FUZZ-002 same-property chain is last-write-wins', () => {
        test('a run of p[..] collapses to the final padding', () => {
                for (let seed = 300; seed <= 360; seed++) {
                        const next = rng(seed)
                        const len = 1 + Math.floor(next() * 6)
                        const vals = Array.from({ length: len }, () => pick(next, NUMS))
                        let c: any = tw
                        for (const v of vals) c = c.p[v]
                        expect(c(), `seed=${seed} vals=${vals.join(',')}`).toEqual({ padding: `${vals[len - 1] * 4}px` })
                }
        })

        test('a repeated prop interleaved with a distinct prop keeps the last write', () => {
                for (let seed = 400; seed <= 450; seed++) {
                        const next = rng(seed)
                        const a = pick(next, NUMS),
                                mid = pick(next, NUMS),
                                b = pick(next, NUMS)
                        expect(tn.p[a].m[mid].p[b](), `seed=${seed} p[${a}].m[${mid}].p[${b}]`).toEqual({ padding: `${b * 4}px`, margin: `${mid * 4}px` })
                }
        })
})

// FUZZ-003 — finalized object never carries structural garbage.
describe('FUZZ-003 finalized object is a clean plain style map', () => {
        test('mixed numeric/keyword/color chains yield only string leaves', () => {
                for (let seed = 500; seed <= 570; seed++) {
                        const next = rng(seed)
                        const pool = randomSegs(next)
                        const got = run(shuffle(next, pool))
                        expect(isPlainStyle(got), `seed=${seed}`).toBe(true)
                        const leaks = assertNoLeakedMarkers(got)
                        expect(leaks, `seed=${seed} leaks=${leaks.join(',')}`).toEqual([])
                        for (const [k, v] of Object.entries(got)) {
                                expect(typeof v, `seed=${seed} key=${k}`).toBe('string')
                                expect(String(v).includes('[object Object]'), `seed=${seed} key=${k}`).toBe(false)
                        }
                }
        })

        test('length keywords (full/screen/dvh) never emit undefined/null', () => {
                for (let seed = 600; seed <= 640; seed++) {
                        const next = rng(seed)
                        const kw = pick(next, ['full', 'screen', 'dvh'] as const)
                        const got = tn.w[kw].bg[pick(next, COLORS)]() as Record<string, unknown>
                        expect(assertNoLeakedMarkers(got), `seed=${seed} kw=${kw}`).toEqual([])
                }
        })
})

// FUZZ-004 — grammar generation over a MIXED implemented/unimplemented surface,
// covering both utilities and variants. Each spec pins a chain access to its
// correct tailwind-compatible declaration (oracle values mirror the
// mechanically-generated chapters, independent of the current runtime).
// Implemented surface -> GREEN; unimplemented surface -> the root is `undefined`
// so the access throws -> RED. The classification always converges to the
// ledger state; it is never caught or relaxed.
interface Spec {
        label: string
        run: () => Record<string, unknown>
        expected: Record<string, string>
}

// Implemented utilities — exported from src/index.ts. These converge to GREEN.
const IMPLEMENTED: Spec[] = [
        { label: 'p[4]', run: () => tw.p[4](), expected: { padding: '16px' } },
        { label: 'm[2]', run: () => tw.m[2](), expected: { margin: '8px' } },
        { label: 'gap[3]', run: () => tw.gap[3](), expected: { gap: '12px' } },
        { label: 'w[8]', run: () => tw.w[8](), expected: { width: '32px' } },
        { label: 'h[8]', run: () => tw.h[8](), expected: { height: '32px' } },
        { label: 'rounded.full', run: () => tw.rounded.full(), expected: { borderRadius: '9999px' } },
        { label: 'bg.red', run: () => tn.bg.red(), expected: { background: 'red' } },
        { label: 'grid', run: () => tw.grid(), expected: { display: 'grid' } },
        { label: 'block', run: () => tw.block(), expected: { display: 'block' } },
        { label: 'hidden', run: () => tw.hidden(), expected: { display: 'none' } },
        { label: 'relative', run: () => tw.relative(), expected: { position: 'relative' } },
        { label: 'absolute', run: () => tw.absolute(), expected: { position: 'absolute' } },
]

// Unimplemented utilities — referenced by the docs/oracle but NOT exported.
// Each `run` throws on the `undefined` root, so the case goes RED; expectations
// are the correct tailwind values mirrored from 00..13's mechanical oracle.
const UNIMPLEMENTED_UTIL: Spec[] = [
        { label: 'aspect[4]', run: () => tn.aspect[4](), expected: { aspectRatio: '16 / 9' } },
        { label: 'columns[4]', run: () => tn.columns[4](), expected: { columns: '4' } },
        { label: 'break.after.page', run: () => tn.break.after.page(), expected: { breakAfter: 'page' } },
        { label: "box['border-box']", run: () => tn.box['border-box'](), expected: { boxSizing: 'border-box' } },
        { label: 'display.flex', run: () => tn.display.flex(), expected: { display: 'flex' } },
        { label: 'float.left', run: () => tn.float.left(), expected: { float: 'left' } },
        { label: 'clear.both', run: () => tn.clear.both(), expected: { clear: 'both' } },
        { label: 'isolation.isolate', run: () => tn.isolation.isolate(), expected: { isolation: 'isolate' } },
        { label: 'object.cover', run: () => tn.object.cover(), expected: { objectFit: 'cover' } },
        { label: 'overscroll.contain', run: () => tn.overscroll.contain(), expected: { overscrollBehavior: 'contain' } },
        { label: 'position.sticky', run: () => tn.position.sticky(), expected: { position: 'sticky' } },
        { label: 'visibility.hidden', run: () => tn.visibility.hidden(), expected: { visibility: 'hidden' } },
        { label: 'z[4]', run: () => tn.z[4](), expected: { zIndex: '4' } },
        { label: 'scale[4]', run: () => tn.scale[4](), expected: { transform: 'scale(4)' } },
        { label: 'shadow.lg', run: () => tn.shadow.lg(), expected: { boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' } },
        { label: 'rotate[45]', run: () => tn.rotate[45](), expected: { transform: 'rotate(45deg)' } },
        { label: 'blur.md', run: () => tn.blur.md(), expected: { filter: 'blur(12px)' } },
        { label: 'fill.none', run: () => tn.fill.none(), expected: { fill: 'none' } },
]

// Unimplemented variants — the whole variant surface (Section E) is unbuilt, so
// these roots are `undefined` and every case is RED. Expected values are the
// utility result the variant must scope (the runtime contract precedes the
// selector mechanism, per the doc's variant note).
const UNIMPLEMENTED_VARIANT: Spec[] = [
        { label: 'hover.bg.red', run: () => tn.hover.bg.red(), expected: { background: 'red' } },
        { label: 'focus.text.blue', run: () => tn.focus.text.blue(), expected: { color: 'blue' } },
        { label: 'first.p[4]', run: () => tn.first.p[4](), expected: { padding: '16px' } },
        { label: 'disabled.m[2]', run: () => tn.disabled.m[2](), expected: { margin: '8px' } },
        { label: 'group.gap[4]', run: () => tn.group.gap[4](), expected: { gap: '16px' } },
        { label: 'peer.flex', run: () => tn.peer.flex(), expected: { display: 'flex' } },
]

const UNIMPLEMENTED: Spec[] = [...UNIMPLEMENTED_UTIL, ...UNIMPLEMENTED_VARIANT]
const POOL: Spec[] = [...IMPLEMENTED, ...UNIMPLEMENTED]

describe('FUZZ-004 grammar generation converges to the ledger state', () => {
        // A seeded permutation exercises every spec exactly once in a reproducible
        // random order — implemented -> GREEN, unimplemented -> RED — so the
        // chapter's fail rate tracks the ~95%-unimplemented surface.
        for (const spec of shuffle(rng(2025), POOL))
                test(`${spec.label} -> ${JSON.stringify(spec.expected)}`, () => {
                        expect(spec.run()).toEqual(spec.expected)
                })

        // The generated pool must keep the unimplemented (RED) cases a majority — a
        // guard that this fuzzer never silently drifts into all-GREEN and stops
        // tracking the unimplemented surface (_REDESIGN.md rule 5).
        test('pool keeps an unimplemented (RED) majority', () => {
                expect(UNIMPLEMENTED.length).toBeGreaterThan(POOL.length / 2)
        })
})

// FUZZ-005 — reserved words, Unicode, escapes and long strings cause neither
// prototype pollution, hang, nor truncation.
const RESERVED = ['constructor', 'prototype', '__proto__', 'toString', 'hasOwnProperty'] as const
const EXOTIC = ['héllo', '日本語', 'a\\b', 'a"b', 'a\nb', 'a/*c*/b', 'x'.repeat(4096)] as const

describe('FUZZ-005 reserved/exotic strings are handled safely', () => {
        test('reserved word as a color value resolves to a plain declaration', () => {
                for (const word of RESERVED) {
                        const got = tn.bg[word]() as Record<string, unknown>
                        expect(got, `word=${word}`).toEqual({ background: word })
                        expect(assertNoLeakedMarkers(got), `word=${word}`).toEqual([])
                }
        })

        test('reserved word as an inline-arg key never corrupts the prototype', () => {
                const proto = Object.getPrototypeOf({})
                for (const word of RESERVED) {
                        const got = tw.p[4]({ [word]: 'X' } as any) as Record<string, unknown>
                        expect(got.padding, `word=${word}`).toBe('16px')
                        expect(Object.getPrototypeOf(got), `word=${word} result prototype`).toBe(Object.prototype)
                        expect(Object.getPrototypeOf({}), `word=${word} global pollution`).toBe(proto)
                        // Ordinary words round-trip as own data; __proto__ is a safe [[Set]] no-op.
                        if (word !== '__proto__') expect((got as any)[word], `word=${word}`).toBe('X')
                }
        })

        test('exotic strings survive the chain access and serialization round-trip', () => {
                for (const s of EXOTIC) {
                        const got = tn.bg[s]() as Record<string, unknown>
                        const tag = s.length > 32 ? `len=${s.length}` : JSON.stringify(s)
                        // The value is preserved verbatim — never truncated, split or stringified.
                        expect(got.background, `value ${tag}`).toBe(s)
                        expect(assertNoLeakedMarkers(got), `value ${tag}`).toEqual([])
                }
        })

        test('a long reserved-word chain terminates promptly (no hang / recursion blowup)', () => {
                const start = Date.now()
                let c: any = tw.css // a real chain root; the module namespace has no .constructor chain
                for (let i = 0; i < 1000; i++) c = c[RESERVED[i % RESERVED.length]]
                expect(isPlainStyle(c())).toBe(true)
                expect(Date.now() - start, 'possible hang').toBeLessThan(2000)
        })
})

// FUZZ-006 — sharing, branching and re-using a chain: one case never alters
// another.
describe('FUZZ-006 shared chains do not cross-contaminate', () => {
        test('two tails off a shared flex.col prefix keep only their own decls', () => {
                for (let seed = 700; seed <= 760; seed++) {
                        const next = rng(seed)
                        const base = tw.flex.col // shared prefix: display:flex; flexDirection:column
                        const p = pick(next, NUMS),
                                m = pick(next, NUMS)
                        const ra = (base as any).p[p]() as Record<string, unknown>
                        const rb = (base as any).m[m]() as Record<string, unknown>
                        expect(ra, `seed=${seed} A`).toEqual({ display: 'flex', flexDirection: 'column', padding: `${p * 4}px` })
                        expect(rb, `seed=${seed} B`).toEqual({ display: 'flex', flexDirection: 'column', margin: `${m * 4}px` })
                        expect('margin' in ra, `seed=${seed} A leaked margin`).toBe(false)
                        expect('padding' in rb, `seed=${seed} B leaked padding`).toBe(false)
                }
        })

        test('re-finalizing the same chain is idempotent and non-aliased', () => {
                for (let seed = 800; seed <= 830; seed++) {
                        const next = rng(seed)
                        const chain = tn.p[pick(next, NUMS)]
                        const r1 = chain() as Record<string, unknown>
                        const r2 = chain() as Record<string, unknown>
                        expect(r1, `seed=${seed}`).toEqual(r2)
                        expect(r1, `seed=${seed} aliased`).not.toBe(r2)
                        r1.padding = 'MUTATED'
                        expect((chain() as Record<string, unknown>).padding, `seed=${seed}`).not.toBe('MUTATED')
                }
        })
})

// FUZZ-007 — inline-arg plain-object merge follows a left-to-right reference
// model (later object wins on a conflicting key; falsy args are skipped).
describe('FUZZ-007 inline-arg merge matches the reference model', () => {
        test('arbitrary arg sequences equal Object.assign over the base', () => {
                const KEYS = ['padding', 'margin', 'gap', 'color', 'background'] as const
                const VALS = ['1px', '2px', '3px', 'red', 'blue'] as const
                for (let seed = 900; seed <= 970; seed++) {
                        const next = rng(seed)
                        const count = 1 + Math.floor(next() * 5)
                        const args = Array.from({ length: count }, () => {
                                const obj: Record<string, string> = {}
                                const fields = 1 + Math.floor(next() * 3)
                                for (let f = 0; f < fields; f++) obj[pick(next, KEYS)] = pick(next, VALS)
                                return obj
                        })
                        const got = tw.p[4](...(args as any[])) as Record<string, unknown>
                        const expected = Object.assign({ padding: '16px' }, ...args)
                        expect(styleEqual(got, expected), `seed=${seed} args=${JSON.stringify(args)}`).toBe(true)
                }
        })

        test('falsy args are skipped and never inject undefined/null', () => {
                for (let seed = 1000; seed <= 1030; seed++) {
                        const next = rng(seed)
                        const real = { color: pick(next, ['red', 'blue'] as const) }
                        const got = tw.p[4](null as any, false as any, undefined, real, false as any) as Record<string, unknown>
                        expect(got, `seed=${seed}`).toEqual({ padding: '16px', ...real })
                        expect(assertNoLeakedMarkers(got), `seed=${seed}`).toEqual([])
                }
        })
})
