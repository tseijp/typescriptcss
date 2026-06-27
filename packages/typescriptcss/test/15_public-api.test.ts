import { describe, expect, test } from 'vitest'
import * as _ from '../src'
import { assertNoLeakedMarkers, isPlainStyle } from './_helpers.ts'

// 15 — Public API *contract* (protocol level).
//
// MECE boundary: files 00–13 pin individual feature -> CSS mappings. This file
// asserts the cross-cutting behaviours TRUE OF EVERY chain regardless of which
// feature it encodes — the finished value is a plain enumerable style object,
// call-argument merge semantics, fork independence + snapshot freshness, define()
// registration, native CSS fallback, css() pass-through, JSON serializability.
//
// Per _REDESIGN.md: the implemented-root list is enumerated MECHANICALLY (every
// runtime export, not a representative sample) so the protocol is checked on the
// whole surface. The protocol guarantees themselves hold on implemented infra
// (mostly GREEN). The native-fallback section then enumerates the full set of
// documented-but-unimplemented utility roots with their correct Tailwind output;
// because those roots are absent the bare verbatim fallback cannot produce the
// right value and the cases fail loudly (RED) — no `?.`/`?? fallback`/`as any`.

// Every runtime root exported from src/index.ts (the `define` factory excluded),
// paired with its simplest legal single call and the exact object it must yield.
// This is the complete public root surface, enumerated — not sampled.
const rootCalls: Array<[string, () => Record<string, unknown>, Record<string, unknown>]> = [
        ['absolute', () => _.absolute(), { position: 'absolute' }],
        ['auto.cols[2]', () => _.auto.cols[2](), { gridAutoColumns: '8px' }],
        ['bg.red', () => _.bg.red(), { background: 'red' }],
        ['block', () => _.block(), { display: 'block' }],
        ['border', () => _.border(), { borderStyle: 'solid', borderWidth: '1px' }],
        ['col[2]', () => _.col[2](), { gridColumn: 'span 2 / span 2' }],
        ['colStart[2]', () => _.colStart[2](), { gridColumnStart: 2 }],
        ['cols[3]', () => _.cols[3](), { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }],
        ['content.center', () => _.content.center(), { alignContent: 'center' }],
        ['css', () => _.css(), {}],
        ['dark', () => _.dark(), {}],
        ['flex', () => _.flex(), { display: 'flex' }],
        ['flow.row', () => _.flow.row(), { gridAutoFlow: 'row' }],
        ['font.bold', () => _.font.bold(), { fontWeight: 700 }],
        ['gap[4]', () => _.gap[4](), { gap: '16px' }],
        ['grid', () => _.grid(), { display: 'grid' }],
        ['h[4]', () => _.h[4](), { height: '16px' }],
        ['hidden', () => _.hidden(), { display: 'none' }],
        ['inline', () => _.inline(), { display: 'inline' }],
        ['inlineBlock', () => _.inlineBlock(), { display: 'inline-block' }],
        ['inlineFlex', () => _.inlineFlex(), { display: 'inline-flex' }],
        ['inset[0]', () => _.inset[0](), { inset: '0px' }],
        ['items.center', () => _.items.center(), { alignItems: 'center' }],
        ['justify.center', () => _.justify.center(), { justifyContent: 'center' }],
        ['leading[4]', () => _.leading[4](), { lineHeight: '16px' }],
        ['left[4]', () => _.left[4](), { left: '16px' }],
        ['m[4]', () => _.m[4](), { margin: '16px' }],
        ['max.w[4]', () => _.max.w[4](), { maxWidth: '16px' }],
        ['mb[4]', () => _.mb[4](), { marginBottom: '16px' }],
        ['md', () => _.md(), {}],
        ['min.h[4]', () => _.min.h[4](), { minHeight: '16px' }],
        ['ml[4]', () => _.ml[4](), { marginLeft: '16px' }],
        ['mr[4]', () => _.mr[4](), { marginRight: '16px' }],
        ['mt[4]', () => _.mt[4](), { marginTop: '16px' }],
        ['mx[4]', () => _.mx[4](), { marginLeft: '16px', marginRight: '16px' }],
        ['my[4]', () => _.my[4](), { marginBottom: '16px', marginTop: '16px' }],
        ['overflow.hidden', () => _.overflow.hidden(), { overflow: 'hidden' }],
        ['p[4]', () => _.p[4](), { padding: '16px' }],
        ['pb[4]', () => _.pb[4](), { paddingBottom: '16px' }],
        ['pl[4]', () => _.pl[4](), { paddingLeft: '16px' }],
        ['pr[4]', () => _.pr[4](), { paddingRight: '16px' }],
        ['pt[4]', () => _.pt[4](), { paddingTop: '16px' }],
        ['px[4]', () => _.px[4](), { paddingLeft: '16px', paddingRight: '16px' }],
        ['py[4]', () => _.py[4](), { paddingBottom: '16px', paddingTop: '16px' }],
        ['place.items.center', () => _.place.items.center(), { placeItems: 'center' }],
        ['pointer.events.none', () => _.pointer.events.none(), { pointerEvents: 'none' }],
        ['relative', () => _.relative(), { position: 'relative' }],
        ['rounded', () => _.rounded(), { borderRadius: '4px' }],
        ['size[4]', () => _.size[4](), { height: '16px', width: '16px' }],
        ['sm', () => _.sm(), {}],
        ['table', () => _.table(), { display: 'table' }],
        ['text.base', () => _.text.base(), { fontSize: '16px', lineHeight: '24px' }],
        ['top[4]', () => _.top[4](), { top: '16px' }],
        ['tracking.tight', () => _.tracking.tight(), { letterSpacing: '-0.025em' }],
        ['translate.x[4]', () => _.translate.x[4](), { transform: 'translateX(16px)' }],
        ['w[4]', () => _.w[4](), { width: '16px' }],
]

describe('CONTRACT: every implemented root resolves to a plain style object', () => {
        test.each(rootCalls)('%s -> plain object', (_n, fn) => {
                const style = fn()
                expect(isPlainStyle(style)).toBe(true)
                expect(Object.getPrototypeOf(style)).toBe(Object.prototype)
        })
        test.each(rootCalls)('%s -> no leaked internal markers', (_n, fn) => {
                expect(assertNoLeakedMarkers(fn())).toEqual([])
        })
        test.each(rootCalls)('%s -> only string|number values', (_n, fn) => {
                for (const v of Object.values(fn())) expect(['string', 'number'].includes(typeof v)).toBe(true)
        })
        test.each(rootCalls)('%s -> exact Tailwind value', (_n, fn, expected) => {
                expect(fn()).toEqual(expected)
        })
})

describe('CONTRACT: a chain (pre-call) is a callable function', () => {
        test('root is callable', () => expect(typeof _.flex).toBe('function'))
        test('a deep segment is callable', () => expect(typeof _.flex.col.items).toBe('function'))
        test('a scale-read segment is callable', () => expect(typeof _.gap[4]).toBe('function'))
})

describe('CONTRACT: call-argument merge semantics', () => {
        test('object arg merges into the accumulated css', () => {
                expect(_.flex({ color: 'red' })).toEqual({ display: 'flex', color: 'red' })
        })
        test('args merge left-to-right', () => {
                expect(_.flex.col({ a: '1' }, { b: '2' })).toEqual({ display: 'flex', flexDirection: 'column', a: '1', b: '2' })
        })
        test('later arg overrides earlier arg on the same key', () => {
                expect(_.flex({ color: 'red' }, { color: 'blue' })).toEqual({ display: 'flex', color: 'blue' })
        })
        test('an arg overrides the chain-accumulated value on the same key', () => {
                expect(_.flex({ display: 'grid' })).toEqual({ display: 'grid' })
        })
        test('null / false / undefined args are filtered out', () => {
                expect(_.flex.col(null, false, undefined)).toEqual({ display: 'flex', flexDirection: 'column' })
        })
        test('zero args yields exactly the accumulated css', () => {
                expect(_.flex.col()).toEqual({ display: 'flex', flexDirection: 'column' })
        })
})

describe('CONTRACT: returned objects are fresh snapshots (no aliasing)', () => {
        test('two calls of the same chain are equal but not identical', () => {
                const c = _.flex.col
                const a = c()
                const b = c()
                expect(a).toEqual(b)
                expect(a).not.toBe(b)
        })
        test('mutating a result does not affect later calls', () => {
                const r = _.flex.col() as Record<string, unknown>
                r.display = 'mutated'
                delete r.flexDirection
                expect(_.flex.col()).toEqual({ display: 'flex', flexDirection: 'column' })
        })
        test('a passed-in arg object is not retained/mutated by the chain', () => {
                const arg = { color: 'red' }
                const out = _.flex(arg) as Record<string, unknown>
                expect(out).not.toBe(arg)
                out.color = 'blue'
                expect(arg).toEqual({ color: 'red' })
        })
})

describe('CONTRACT: fork independence (shared prefix does not bleed)', () => {
        test('two leaves of a shared prefix are independent', () => {
                const prefix = _.flex.col
                expect(prefix.gap[4]()).toEqual({ display: 'flex', flexDirection: 'column', gap: '16px' })
                expect(prefix.gap[8]()).toEqual({ display: 'flex', flexDirection: 'column', gap: '32px' })
        })
        test('sibling words off one root do not share state', () => {
                expect(_.flex.col()).toEqual({ display: 'flex', flexDirection: 'column' })
                expect(_.flex.row()).toEqual({ display: 'flex', flexDirection: 'row' })
        })
        test('reading a deep chain does not retroactively alter a shallower one', () => {
                const shallow = _.flex()
                void _.flex.col.items.center
                expect(_.flex()).toEqual(shallow)
        })
})

describe('CONTRACT: define() registers a custom root', () => {
        test('define is a function', () => expect(typeof _.define).toBe('function'))
        test('a static defined root returns its css and is a plain object', () => {
                const r = _.define<(...a: unknown[]) => Record<string, unknown>>('apiStickyTop', { position: 'sticky', top: '0' })()
                expect(r).toEqual({ position: 'sticky', top: '0' })
                expect(isPlainStyle(r)).toBe(true)
        })
        test('a defined root composes with built-in roots', () => {
                const brand = _.define<typeof _.flex>('apiBrandBg', { background: 'rebeccapurple' })
                expect(brand.flex()).toEqual({ background: 'rebeccapurple', display: 'flex' })
        })
        test('a defined root accepts call-time args like any chain', () => {
                const r = _.define<(...a: unknown[]) => Record<string, unknown>>('apiCard', { display: 'block' })({ color: 'red' })
                expect(r).toEqual({ display: 'block', color: 'red' })
        })
})

describe('CONTRACT: native CSS fallback echoes an unknown property verbatim', () => {
        // resolve()'s terminal branch turns an unknown segment into a CSS key whose
        // value is taken verbatim from the next segment (no scaling, no transform).
        test('unknown prop after a static root becomes a CSS key fed by the next segment', () => {
                expect(_.relative.zIndex['10']()).toEqual({ position: 'relative', zIndex: '10' })
        })
        test('two independent fallbacks accumulate', () => {
                expect(_.absolute.cursor.pointer.userSelect.none()).toEqual({ position: 'absolute', cursor: 'pointer', userSelect: 'none' })
        })
        test('fallback value is taken verbatim (no scaling)', () => {
                expect(_.block.opacity['0.5']()).toEqual({ display: 'block', opacity: '0.5' })
        })
})

describe('CONTRACT: documented utility roots that are NOT implemented', () => {
        // These roots are part of the documented surface but are absent from
        // src/index.ts. Reading them throws (undefined root) — the verbatim native
        // fallback cannot synthesise the correct Tailwind declaration, so every case
        // fails loudly. Roots are read directly; no suppression.
        const missing: Array<[string, () => Record<string, unknown>, Record<string, unknown>]> = [
                ['aspect.square', () => (_ as typeof _ & { aspect: { square: typeof _.flex } }).aspect.square(), { aspectRatio: '1 / 1' }],
                ['aspect.video', () => (_ as typeof _ & { aspect: { video: typeof _.flex } }).aspect.video(), { aspectRatio: '16 / 9' }],
                ['opacity[50]', () => (_ as typeof _ & { opacity: { [k: number]: typeof _.flex } }).opacity[50](), { opacity: '0.5' }],
                ['z[10]', () => (_ as typeof _ & { z: { [k: number]: typeof _.flex } }).z[10](), { zIndex: '10' }],
                ['order[2]', () => (_ as typeof _ & { order: { [k: number]: typeof _.flex } }).order[2](), { order: '2' }],
                ['scale[50]', () => (_ as typeof _ & { scale: { [k: number]: typeof _.flex } }).scale[50](), { scale: '0.5' }],
                ['rotate[45]', () => (_ as typeof _ & { rotate: { [k: number]: typeof _.flex } }).rotate[45](), { rotate: '45deg' }],
                ['blur.sm', () => (_ as typeof _ & { blur: { sm: typeof _.flex } }).blur.sm(), { filter: 'blur(4px)' }],
                ['shadow.md', () => (_ as typeof _ & { shadow: { md: typeof _.flex } }).shadow.md(), { boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }],
                ['fill.red', () => (_ as typeof _ & { fill: { red: typeof _.flex } }).fill.red(), { fill: 'red' }],
                ['columns[3]', () => (_ as typeof _ & { columns: { [k: number]: typeof _.flex } }).columns[3](), { columns: '3' }],
        ]
        test.each(missing)('%s should emit %o (root unimplemented -> RED)', (_n, fn, expected) => {
                expect(fn()).toEqual(expected)
        })
})

describe('CONTRACT: css() pass-through marker', () => {
        test('css() with no args is empty', () => expect(_.css()).toEqual({}))
        test('css(obj) returns a copy of the object', () => {
                const arg = { color: 'red' }
                const out = _.css(arg)
                expect(out).toEqual({ color: 'red' })
                expect(out).not.toBe(arg)
        })
        test('css merges multiple args', () => expect(_.css({ a: '1' }, { b: '2' })).toEqual({ a: '1', b: '2' }))
})

describe('CONTRACT: JSON serializability of finished values', () => {
        test.each(rootCalls)('%s round-trips through JSON', (_n, fn) => {
                const style = fn()
                expect(JSON.parse(JSON.stringify(style))).toEqual(style)
        })
        test('dark/media variants are still JSON-serializable plain objects', () => {
                const d = _.bg['#fff'].dark.bg['#000']()
                const s = _.sm.flex()
                const mp = _.md.p[4]()
                for (const v of [d, s, mp]) {
                        expect(isPlainStyle(v)).toBe(true)
                        expect(JSON.parse(JSON.stringify(v))).toEqual(v)
                }
        })
})
