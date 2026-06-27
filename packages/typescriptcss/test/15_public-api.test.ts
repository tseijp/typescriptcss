import { describe, expect, test } from 'vitest'
import * as tw from '../src'
import { flex, gap, p, px, bg, text, font, border, rounded, col, cols, size, w, max, min, css, dark, sm, md, items, justify, overflow, mx, translate, left } from '../src'
import { assertNoLeakedMarkers, isPlainStyle } from './_helpers.ts'

// 15 — Public API *contract* (protocol level).
//
// MECE boundary: files 00–13 already pin individual feature -> CSS mappings.
// This file asserts the cross-cutting behaviours that are TRUE OF EVERY chain
// regardless of which feature it encodes:
//   - the finished value is always a plain enumerable style object,
//   - call-argument merge semantics (order, falsy filtering, override),
//   - fork independence + snapshot freshness of returned objects,
//   - define() registration of custom roots,
//   - native CSS fallback for unknown props,
//   - css() pass-through marker,
//   - JSON serializability.
// No single feature's value table is re-asserted here; we sample roots only to
// exercise the protocol.

// A representative cross-section of implemented chains, one per grammar shape.
const chains: Array<[string, () => Record<string, unknown>]> = [
        ['static root', () => flex()],
        ['scoped word', () => flex.col()],
        ['scale reader', () => (gap as any)[4]()],
        ['multi-prop scale', () => (px as any)[2]()],
        ['greedy color', () => (bg as any).red()],
        ['text size word', () => text.base()],
        ['numeric weight', () => (font as any)[600]()],
        ['stateful reader (border)', () => border()],
        ['default + reader (rounded)', () => rounded()],
        ['nested scope (col.span)', () => (col.span as any)[2]()],
        ['columns reader', () => (cols as any)[3]()],
        ['paired length (size)', () => (size as any)[4]()],
        ['length keyword', () => w.full()],
        ['two-level scope (max.w)', () => (max.w as any)[4]()],
        ['align scope', () => items.center()],
        ['position reader', () => (left as any)[4]()],
        ['axis scope (translate.x)', () => (translate.x as any)[4]()],
]

describe('CONTRACT: every finished value is a plain style object', () => {
        test.each(chains)('%s -> plain object', (_n, fn) => {
                const style = fn()
                expect(isPlainStyle(style)).toBe(true)
                expect(Object.getPrototypeOf(style)).toBe(Object.prototype)
        })
        test.each(chains)('%s -> no leaked internal markers', (_n, fn) => {
                expect(assertNoLeakedMarkers(fn())).toEqual([])
        })
        test.each(chains)('%s -> only string|number values', (_n, fn) => {
                for (const v of Object.values(fn())) expect(['string', 'number'].includes(typeof v)).toBe(true)
        })
})

describe('CONTRACT: a chain (pre-call) is a callable function', () => {
        test('root is callable', () => expect(typeof flex).toBe('function'))
        test('a deep segment is callable', () => expect(typeof flex.col.items).toBe('function'))
        test('a scale-read segment is callable', () => expect(typeof (gap as any)[4]).toBe('function'))
})

describe('CONTRACT: call-argument merge semantics', () => {
        test('object arg merges into the accumulated css', () => {
                expect(flex({ color: 'red' })).toEqual({ display: 'flex', color: 'red' })
        })
        test('args merge left-to-right', () => {
                expect(flex.col({ a: '1' } as any, { b: '2' } as any)).toEqual({ display: 'flex', flexDirection: 'column', a: '1', b: '2' })
        })
        test('later arg overrides earlier arg on the same key', () => {
                expect(flex({ color: 'red' }, { color: 'blue' })).toEqual({ display: 'flex', color: 'blue' })
        })
        test('an arg overrides the chain-accumulated value on the same key', () => {
                expect(flex({ display: 'grid' } as any)).toEqual({ display: 'grid' })
        })
        test('null / false / undefined args are filtered out', () => {
                expect(flex.col(null as any, false as any, undefined)).toEqual({ display: 'flex', flexDirection: 'column' })
        })
        test('zero args yields exactly the accumulated css', () => {
                expect(flex.col()).toEqual({ display: 'flex', flexDirection: 'column' })
        })
})

describe('CONTRACT: returned objects are fresh snapshots (no aliasing)', () => {
        test('two calls of the same chain are equal but not identical', () => {
                const c = flex.col
                const a = c()
                const b = c()
                expect(a).toEqual(b)
                expect(a).not.toBe(b)
        })
        test('mutating a result does not affect later calls', () => {
                const r = flex.col() as Record<string, unknown>
                r.display = 'mutated'
                delete r.flexDirection
                expect(flex.col()).toEqual({ display: 'flex', flexDirection: 'column' })
        })
        test('a passed-in arg object is not retained/mutated by the chain', () => {
                const arg = { color: 'red' }
                const out = flex(arg) as Record<string, unknown>
                expect(out).not.toBe(arg)
                out.color = 'blue'
                expect(arg).toEqual({ color: 'red' })
        })
})

describe('CONTRACT: fork independence (shared prefix does not bleed)', () => {
        test('two leaves of a shared prefix are independent', () => {
                const prefix = flex.col
                expect((prefix.gap as any)[4]()).toEqual({ display: 'flex', flexDirection: 'column', gap: '16px' })
                expect((prefix.gap as any)[8]()).toEqual({ display: 'flex', flexDirection: 'column', gap: '32px' })
        })
        test('sibling words off one root do not share state', () => {
                expect(flex.col()).toEqual({ display: 'flex', flexDirection: 'column' })
                expect(flex.row()).toEqual({ display: 'flex', flexDirection: 'row' })
        })
        test('reading a deep chain does not retroactively alter a shallower one', () => {
                const shallow = flex()
                void (flex.col.items.center as any)
                expect(flex()).toEqual(shallow)
        })
})

describe('CONTRACT: define() registers a custom root', () => {
        test('define is a function', () => expect(typeof tw.define).toBe('function'))
        test('a static defined root returns its css and is a plain object', () => {
                const r = tw.define<any>('apiStickyTop', { position: 'sticky', top: '0' })()
                expect(r).toEqual({ position: 'sticky', top: '0' })
                expect(isPlainStyle(r)).toBe(true)
        })
        test('a defined root composes with built-in roots', () => {
                const brand = tw.define<any>('apiBrandBg', { background: 'rebeccapurple' })
                expect(brand.flex()).toEqual({ background: 'rebeccapurple', display: 'flex' })
        })
        test('a defined root accepts call-time args like any chain', () => {
                const r = tw.define<any>('apiCard', { display: 'block' })({ color: 'red' })
                expect(r).toEqual({ display: 'block', color: 'red' })
        })
})

describe('CONTRACT: native CSS fallback for unknown props', () => {
        test('unknown prop after a static root becomes a CSS key fed by the next segment', () => {
                expect((tw.relative as any).zIndex['10']()).toEqual({ position: 'relative', zIndex: '10' })
        })
        test('two independent fallbacks accumulate', () => {
                expect((tw.absolute as any).cursor.pointer.userSelect.none()).toEqual({ position: 'absolute', cursor: 'pointer', userSelect: 'none' })
        })
        test('fallback value is taken verbatim (no scaling)', () => {
                expect((tw.block as any).opacity['0.5']()).toEqual({ display: 'block', opacity: '0.5' })
        })
})

describe('CONTRACT: css() pass-through marker', () => {
        test('css() with no args is empty', () => expect(css()).toEqual({}))
        test('css(obj) returns a copy of the object', () => {
                const arg = { color: 'red' }
                const out = css(arg)
                expect(out).toEqual({ color: 'red' })
                expect(out).not.toBe(arg)
        })
        test('css merges multiple args', () => expect(css({ a: '1' } as any, { b: '2' } as any)).toEqual({ a: '1', b: '2' }))
})

describe('CONTRACT: JSON serializability of finished values', () => {
        test.each(chains)('%s round-trips through JSON', (_n, fn) => {
                const style = fn()
                expect(JSON.parse(JSON.stringify(style))).toEqual(style)
        })
        test('dark/media variants are still JSON-serializable plain objects', () => {
                const d = (dark as any).bg.red()
                const s = (sm as any).flex()
                const mp = (md as any).p[4]()
                for (const v of [d, s, mp]) {
                        expect(isPlainStyle(v)).toBe(true)
                        expect(JSON.parse(JSON.stringify(v))).toEqual(v)
                }
        })
})

describe('CONTRACT: roots that share a token still return distinct objects', () => {
        // mx and justify both expose words; calling them must not cross-contaminate.
        test('mx.auto and justify.between are isolated', () => {
                expect(mx.auto()).toEqual({ marginLeft: 'auto', marginRight: 'auto' })
                expect(justify.between()).toEqual({ justifyContent: 'space-between' })
        })
        test('overflow.auto and p[4] are isolated', () => {
                expect(overflow.auto()).toEqual({ overflow: 'auto' })
                expect((p as any)[4]()).toEqual({ padding: '16px' })
        })
})
