import { describe, test, expectTypeOf } from 'vitest'
import { flex, gap, p, px, bg, text, font, border, rounded, col, cols, size, w, h, max, min, items, justify, translate, left, top, inset, leading, m, mx, overflow, relative, absolute, sm, dark, define } from '../src'
import type { Chain } from '../src/types'

// 23 — Type surface (section J: TYPE-001..009), checked by `tsc` under vitest
// `--typecheck`.
//
// MECE boundary: every runtime file (00..22, 24..26) pins value -> CSS at
// runtime. This file is the *type oracle*. A correct chain must type-check; an
// illegal utility/value combination must be a type error *at the offending
// position*. Each negative therefore sits directly behind a
// `// @ts-expect-error`.
//
// Per _REDESIGN.md rule 4, a type hole is NOT hidden. Where the published
// types in src/types.ts are too loose to reject a combination the chapter
// claims is illegal, the `// @ts-expect-error` finds nothing to suppress and
// `tsc` fails the line with TS2578 ("Unused '@ts-expect-error' directive").
// Those sites are tagged `// [RED type-gap]` and are the documented holes
// (chiefly the open `Values = { [k: string]: Chain }` index that color / native
// families inherit). They stay RED until the types tighten. Escaping the
// assertion with `as any`, or relaxing the assertion to make the line pass, is
// forbidden (_REDESIGN.md: "型エラーは未実装機能の指標").
//
// One ID -> one responsibility, no overlap with the runtime files.

// ---------------------------------------------------------------------------
// TYPE-001 — root utility positives: a well-formed chain is a `Chain` and the
// editor can keep completing the next segment. Covers every shape of root the
// surface exposes: static, scope word, numeric scale, nested object, axis,
// color, length, screen, position.
// ---------------------------------------------------------------------------
describe('TYPE-001: root utility positives', () => {
        test('static / scope / scale / nested / axis / color roots are Chains', () => {
                expectTypeOf(flex).toExtend<Chain>()
                expectTypeOf(flex.col).toExtend<Chain>()
                expectTypeOf(gap[4]).toExtend<Chain>()
                expectTypeOf(col.span[2]).toExtend<Chain>()
                expectTypeOf(translate.x).toExtend<Chain>()
                expectTypeOf(bg.red).toExtend<Chain>()
        })
        test('length / screen / position roots complete to Chains', () => {
                expectTypeOf(w[4]).toExtend<Chain>()
                expectTypeOf(w.full).toExtend<Chain>()
                expectTypeOf(h.screen).toExtend<Chain>()
                expectTypeOf(size[4]).toExtend<Chain>()
                expectTypeOf(left[4]).toExtend<Chain>()
                expectTypeOf(top.dvh).toExtend<Chain>()
                expectTypeOf(inset[4]).toExtend<Chain>()
                expectTypeOf(max.w[4]).toExtend<Chain>()
                expectTypeOf(min.h.full).toExtend<Chain>()
        })
        test('word-scoped roots expose their words and keep completing', () => {
                expectTypeOf(items.center).toExtend<Chain>()
                expectTypeOf(justify.between).toExtend<Chain>()
                expectTypeOf(justify.items.center).toExtend<Chain>()
                expectTypeOf(overflow.hidden).toExtend<Chain>()
                expectTypeOf(font.bold).toExtend<Chain>()
                expectTypeOf(text.base).toExtend<Chain>()
                expectTypeOf(mx.auto).toExtend<Chain>()
                expectTypeOf(rounded.full).toExtend<Chain>()
                expectTypeOf(border.collapse).toExtend<Chain>()
                expectTypeOf(cols.subgrid).toExtend<Chain>()
        })
        test('a Chain keeps completing into deeper utilities', () => {
                expectTypeOf(flex.col.items).toBeObject()
                expectTypeOf(flex.col.items.center).toExtend<Chain>()
        })
})

// ---------------------------------------------------------------------------
// TYPE-002 — category violation: a member of a foreign category must be
// rejected even though the runtime has a greedy/native fallback that would
// happily resolve it. This is where the open color index leaks.
// ---------------------------------------------------------------------------
describe('TYPE-002: category violations rejected', () => {
        test('`bg.flex` — a layout word is not a color', () => {
                // [RED type-gap] `bg: Color`, and `Color extends Values` whose
                // `[k: string]: Chain` index accepts any word, so the type cannot reject
                // `flex`. The runtime even mis-swallows it as `{ background: 'flex' }`.
                // @ts-expect-error — `flex` is not a color token
                void bg.flex
        })
        test('`text.grid` — a layout word is not a color/size token', () => {
                // [RED type-gap] same open-index hole on `text: Scale & Color & {...}`.
                // @ts-expect-error — `grid` is not a text color/size token
                void text.grid
        })
        test('`bg.hover` — a variant word is not a color', () => {
                // [RED type-gap] the open color index also swallows variant words, so the
                // surface cannot distinguish a pseudo from a hue.
                // @ts-expect-error — `hover` is a variant, not a color token
                void bg.hover
        })
        test('`font.wrap` — a flex word is not a weight/family', () => {
                // `font: Scale & { bold; medium; normal; sans; semibold }` is closed (no
                // open string index), so the foreign word is a genuine, position-accurate
                // error and the directive is consumed.
                // @ts-expect-error — `wrap` is not a font member
                void font.wrap
        })
        test('`overflow.col` — a flex word is not an overflow keyword', () => {
                // `overflow: { auto; hidden; scroll; visible }` is a closed object literal
                // -> genuine rejection.
                // @ts-expect-error — `col` is not an overflow member
                void overflow.col
        })
})

// ---------------------------------------------------------------------------
// TYPE-003 — value-domain violation rejected at position: a color string on a
// numeric scale, a number on a color-only slot, an unknown word on a keyword
// slot, a non-screen word on a Screen slot.
// ---------------------------------------------------------------------------
describe('TYPE-003: value-domain violations', () => {
        test('a numeric scale yields a Chain at numeric keys (positive)', () => {
                expectTypeOf(p[4]).toExtend<Chain>()
                expectTypeOf(px[2]).toExtend<Chain>()
                expectTypeOf(m[8]).toExtend<Chain>()
                expectTypeOf(leading[6]).toExtend<Chain>()
        })
        test('a color string is rejected on a numeric scale', () => {
                // `m: Scale = { [k: number]: Chain }` — no string index -> genuine error.
                // @ts-expect-error — color string is not a numeric scale key
                void m.crimson
        })
        test('a color string is rejected on a multi-prop numeric scale', () => {
                // @ts-expect-error — `px` is Scale only; no color member
                void px.crimson
        })
        test('a number is (not) rejected on a color-only slot', () => {
                // [RED type-gap] `Color` resolves a numeric literal key through its open
                // string index, so a number is wrongly accepted where only colors are valid.
                // @ts-expect-error — bg has no numeric scale domain
                void bg[4]
        })
        test('an unknown word is rejected on a keyword-only slot', () => {
                // `items: Align = { center; end; start; stretch }` -> genuine rejection.
                // @ts-expect-error — `middle` is not an Align keyword
                void items.middle
        })
        test('a non-screen word is rejected on a Screen slot', () => {
                // `w: Screen = Scale & { full; screen; dvh }` -> genuine rejection.
                // @ts-expect-error — `auto` is not a Screen token
                void w.auto
        })
})

// ---------------------------------------------------------------------------
// TYPE-004 — arbitrary native property: an unknown-but-valid CSS property
// becomes a typed `Native` segment; the value-type correspondence is the gap.
// ---------------------------------------------------------------------------
describe('TYPE-004: native CSS property fallback', () => {
        test('a CSS property with no utility resolves via Native (positive)', () => {
                // `zIndex` / `cursor` are CSSStyleDeclaration props absent from Utility, so
                // `Native` maps them to a readable value scope.
                expectTypeOf(relative.zIndex).toBeObject()
                expectTypeOf(relative.zIndex['10']).toExtend<Chain>()
                expectTypeOf(absolute.cursor.pointer).toExtend<Chain>()
        })
        test('a Native value slot is not type-narrowed to the property domain', () => {
                // [RED type-gap] `Native[K] = Values = { [k: string]: Chain }`, so a value
                // that is illegal for `zIndex` (an integer-only property) still type-checks.
                // @ts-expect-error — `auto` is not a valid z-index value
                void relative.zIndex.auto
        })
        test('a non-existent CSS property is rejected by the Native map', () => {
                // `notarealprop` is not a key of CSSStyleDeclaration, so it is absent from
                // `Native` and from every utility scope -> genuine rejection.
                // @ts-expect-error — not a CSS property
                void relative.notarealprop
        })
})

// ---------------------------------------------------------------------------
// TYPE-005 — call-argument contract: a chain accepts style objects and the
// nullish / false sentinels; a primitive or `true` is rejected.
// ---------------------------------------------------------------------------
describe('TYPE-005: call argument contract', () => {
        test('accepts an object, null, undefined, false, and zero args (positive)', () => {
                expectTypeOf(gap[4]).toBeCallableWith({ color: 'red' })
                expectTypeOf(gap[4]).toBeCallableWith(null)
                expectTypeOf(gap[4]).toBeCallableWith(undefined)
                expectTypeOf(gap[4]).toBeCallableWith(false)
                expectTypeOf(flex).toBeCallableWith()
                expectTypeOf(flex.col).toBeCallableWith({ a: '1' }, null, false, undefined, { b: '2' })
        })
        test('a primitive string argument is rejected', () => {
                // `Argument = RuntimeStyle | null | undefined | false`; a string is none.
                // @ts-expect-error — string is not a valid call argument
                flex('not-a-style')
        })
        test('a number argument is rejected', () => {
                // @ts-expect-error — number is not a valid call argument
                flex(42)
        })
        test('`true` is rejected (only `false` is a valid sentinel)', () => {
                // @ts-expect-error — only `false` is accepted, not `true`
                flex(true)
        })
})

// ---------------------------------------------------------------------------
// TYPE-006 — `define<T>` boundary: inference defaults to Chain, an explicit
// type sets the exact result, and the custom type must not leak foreign
// members. The runtime arg types (name: string, css: RuntimeStyle) are pinned.
// ---------------------------------------------------------------------------
describe('TYPE-006: define generic boundary', () => {
        test('inference defaults the result to Chain (positive)', () => {
                const custom = define('typeDefDefault', { display: 'block' })
                expectTypeOf(custom).toExtend<Chain>()
                expectTypeOf(custom).toBeCallableWith({ color: 'red' })
                expectTypeOf(custom).toBeCallableWith(null)
        })
        test('an explicit type parameter sets the exact result type (positive)', () => {
                type CustomRoot = { brand: Chain }
                const custom = define<CustomRoot>('typeDefWidened', { color: 'rebeccapurple' })
                expectTypeOf(custom).toEqualTypeOf<CustomRoot>()
                expectTypeOf(custom.brand).toExtend<Chain>()
        })
        test('the explicit type does not admit foreign members', () => {
                type CustomRoot = { brand: Chain }
                const custom = define<CustomRoot>('typeDefConstrained', { color: 'red' })
                // @ts-expect-error — `accent` is not a member of CustomRoot
                void custom.accent
        })
        test('the registration name must be a string', () => {
                // @ts-expect-error — name must be a string
                void define(123, { display: 'block' })
        })
        test('the css argument must be a runtime style object', () => {
                // @ts-expect-error — a string is not a RuntimeStyle (Record<string, any>)
                void define('typeDefBadCss', 'not-a-style')
        })
})

// ---------------------------------------------------------------------------
// TYPE-007 — utility domain after a variant segment: a breakpoint / dark
// segment is a Chain, so the utilities that follow keep their type domain and
// still enforce it.
// ---------------------------------------------------------------------------
describe('TYPE-007: utility domain survives a variant', () => {
        test('utilities after a breakpoint keep their domain (positive)', () => {
                expectTypeOf(sm.flex).toExtend<Chain>()
                expectTypeOf(sm.flex.col).toExtend<Chain>()
                expectTypeOf(sm.gap[4]).toExtend<Chain>()
                expectTypeOf(sm.p[6]).toExtend<Chain>()
        })
        test('utilities after `dark` keep their color domain (positive)', () => {
                expectTypeOf(dark.bg.red).toExtend<Chain>()
                expectTypeOf(dark.text.white).toExtend<Chain>()
        })
        test('the numeric-scale domain is still enforced after a variant', () => {
                // `sm.m` is `Scale` again; a color word is still out of domain.
                // @ts-expect-error — color string is not a numeric scale key after `sm`
                void sm.m.crimson
        })
        test('the keyword domain is still enforced after a breakpoint', () => {
                // `md.items` is `Align` again; an unknown word stays rejected.
                // @ts-expect-error — `middle` is not an Align keyword after `sm`
                void sm.items.middle
        })
})

// ---------------------------------------------------------------------------
// TYPE-008 — value origin: a literal, an `as const`, and a widened binding must
// not change acceptance for a slot. The open color index already accepts any
// string (positives + one documented gap); the numeric scale must still reject
// a `string`-typed index even though the runtime would coerce it.
// ---------------------------------------------------------------------------
describe('TYPE-008: value origin invariance', () => {
        test('a widened `string` and an `as const` color resolve the same (positive)', () => {
                const widened: string = 'red'
                const literal = 'red' as const
                expectTypeOf(bg[widened]).toExtend<Chain>()
                expectTypeOf(bg[literal]).toExtend<Chain>()
        })
        test('a numeric value as a const resolves a numeric scale (positive)', () => {
                const n = 4 as const
                expectTypeOf(p[n]).toExtend<Chain>()
                expectTypeOf(gap[n]).toExtend<Chain>()
        })
        test('value origin does not let a string index a numeric scale', () => {
                const s = '4'
                // `p: Scale` keys on `number`; a `string` value is not a valid index even
                // though its runtime would coerce.
                // @ts-expect-error — string value is not a numeric scale key
                void p[s]
        })
})

// ---------------------------------------------------------------------------
// TYPE-009 — escape-hatch boundary: `any` bypasses the surface (documented, not
// a guarantee), but `unknown`-typed keys must not silently satisfy a
// constrained slot, and a finalized chain return is a concrete object, never
// callable / never `any`.
// ---------------------------------------------------------------------------
describe('TYPE-009: any / unknown / never boundary', () => {
        test('an `any`-typed key bypasses the surface (documented, not a guarantee)', () => {
                const k = {} as any
                // `any` defeats the index constraint; this is the escape hatch, not safety.
                expectTypeOf(p[k]).toExtend<Chain>()
        })
        test('an `unknown`-typed key is rejected by a numeric scale', () => {
                const k: unknown = {}
                // @ts-expect-error — `unknown` cannot index a numeric scale
                void p[k]
        })
        test('a chain return value is not `any` (it is an object, not callable)', () => {
                // A finished chain returns the concrete CSS object type, never `any`; if it
                // were `any`, this negative could not hold.
                // @ts-expect-error — the result is an object, not callable
                flex()()
        })
})
