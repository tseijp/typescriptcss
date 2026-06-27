import { describe, expect, test } from 'vitest'
import * as tw from '../src'
import { flex, bg, text, font, css, dark, sm, md, define } from '../src'
import { isPlainStyle, assertNoLeakedMarkers } from './_helpers.ts'

// 26 — PACKAGE-001..006: the published surface of `typescriptcss`.
//
// MECE boundary: every other file pins a feature -> CSS mapping. This file
// ignores what each utility *means* and instead audits the package as a
// shippable artifact:
//   PACKAGE-001  the README-documented API is importable from the entry.
//   PACKAGE-002  type-only information never leaks into runtime values
//                (every export is a callable, nothing is a bare type tag).
//   PACKAGE-003  a finalized chain is a plain, zero-runtime object
//                (Object.prototype, only string|number leaves).
//   PACKAGE-004  unused exports do not perturb a finalized result.
//   PACKAGE-005  the root registry is deterministic across re-imports.
//   PACKAGE-006  define() registers a custom root onto the shared registry.
//
// Per _REDESIGN.md rule 5, this chapter is one of the documented low-fail
// exceptions: it asserts language-level / packaging invariants of the
// *implemented* runtime, not unimplemented Tailwind features, so GREEN is
// correct here. (Feature coverage lives in 00..25.)

// The full named-export surface of src/index.ts. `define` is the only export
// that is a plain factory function; all others are chain proxies (also typeof
// 'function'). Anything missing here would surface as `undefined` and fail.
const ROOTS = ['absolute', 'auto', 'bg', 'block', 'border', 'cols', 'col', 'colStart', 'content', 'css', 'dark', 'flex', 'flow', 'font', 'gap', 'grid', 'h', 'hidden', 'inline', 'inlineBlock', 'inlineFlex', 'inset', 'items', 'justify', 'leading', 'left', 'm', 'max', 'mb', 'min', 'ml', 'mr', 'mt', 'mx', 'my', 'overflow', 'p', 'pb', 'pl', 'pr', 'pt', 'px', 'py', 'place', 'pointer', 'relative', 'rounded', 'size', 'sm', 'table', 'text', 'tracking', 'top', 'translate', 'w', 'md', 'define'] as const

// API names the README explicitly tells users to import and call.
const README_API = ['flex', 'text', 'bg', 'font', 'css', 'dark', 'sm', 'md', 'define'] as const

describe('PACKAGE-001: README-documented API is importable from the entry', () => {
        test.each(README_API)('%s is exported and defined', (name) => {
                expect((tw as Record<string, unknown>)[name]).toBeDefined()
        })
        test('named imports resolve to the same references as the namespace', () => {
                expect(flex).toBe(tw.flex)
                expect(bg).toBe(tw.bg)
                expect(text).toBe(tw.text)
                expect(font).toBe(tw.font)
                expect(css).toBe(tw.css)
                expect(dark).toBe(tw.dark)
                expect(sm).toBe(tw.sm)
                expect(md).toBe(tw.md)
                expect(define).toBe(tw.define)
        })
        test('the README hero chain composes and finalizes to a plain object', () => {
                const style = (flex.col.items.center.gap as any)[4].p[6]()
                expect(isPlainStyle(style)).toBe(true)
                expect(style).toMatchObject({ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '24px' })
        })
})

describe('PACKAGE-002: no type-only information leaks into runtime values', () => {
        test.each(ROOTS)('%s is a callable value (not a type tag)', (name) => {
                expect(typeof (tw as Record<string, unknown>)[name]).toBe('function')
        })
        test('the namespace exposes exactly the known roots (no stray runtime exports)', () => {
                const exported = Object.keys(tw).sort()
                expect(exported).toEqual([...ROOTS].sort())
        })
        test('no exported value is a bare object/string masquerading as a type', () => {
                for (const name of ROOTS) {
                        const value = (tw as Record<string, unknown>)[name]
                        expect(typeof value).not.toBe('object')
                        expect(typeof value).not.toBe('string')
                        expect(value).not.toBeNull()
                }
        })
})

describe('PACKAGE-003: finalized objects are plain, zero-runtime style maps', () => {
        const samples: Array<[string, () => Record<string, unknown>]> = [
                ['flex.col', () => flex.col()],
                ['bg color', () => (bg as any).red()],
                ['text size', () => (text as any)[4]()],
                ['font weight', () => (font as any)[600]()],
                ['define static', () => define<any>('pkgPlain', { color: 'red' })()],
        ]
        test.each(samples)('%s -> Object.prototype, enumerable, no markers', (_n, fn) => {
                const style = fn()
                expect(isPlainStyle(style)).toBe(true)
                expect(Object.getPrototypeOf(style)).toBe(Object.prototype)
                expect(assertNoLeakedMarkers(style)).toEqual([])
        })
        test.each(samples)('%s -> only string|number leaves (no functions/proxies)', (_n, fn) => {
                for (const v of Object.values(fn())) expect(['string', 'number'].includes(typeof v)).toBe(true)
        })
        test('a finalized object is a fresh snapshot, not the internal state', () => {
                const a = flex.col()
                const b = flex.col()
                expect(a).toEqual(b)
                expect(a).not.toBe(b)
        })
})

describe('PACKAGE-004: unused exports do not perturb a finalized result', () => {
        test('touching unrelated roots does not change a chain output', () => {
                const before = flex.col()
                void tw.grid
                void tw.absolute
                void (tw as any).rounded.full
                expect(flex.col()).toEqual(before)
        })
        test('two unrelated chains finalize independently', () => {
                expect(flex.col()).toEqual({ display: 'flex', flexDirection: 'column' })
                expect((bg as any).red()).toEqual({ background: 'red' })
        })
})

describe('PACKAGE-005: the root registry is deterministic', () => {
        test('repeated finalizations of the same chain are byte-equal', () => {
                const runs = Array.from({ length: 5 }, () => (flex.col.gap as any)[4]())
                for (const r of runs) expect(r).toEqual(runs[0])
        })
        test('a re-imported namespace yields identical references (module is a singleton)', async () => {
                const again = await import('../src')
                expect(again.flex).toBe(tw.flex)
                expect(again.define).toBe(tw.define)
        })
})

describe('PACKAGE-006: define() registers a custom root onto the shared registry', () => {
        test('define is a function', () => expect(typeof define).toBe('function'))
        test('a defined static root finalizes to its css', () => {
                expect(define<any>('pkgSticky', { position: 'sticky', top: '0' })()).toEqual({ position: 'sticky', top: '0' })
        })
        test('a defined root composes with a built-in root via the shared registry', () => {
                const brand = define<any>('pkgBrand', { background: 'rebeccapurple' })
                expect(brand.flex()).toEqual({ background: 'rebeccapurple', display: 'flex' })
        })
        test('a defined root accepts call-time args like any chain', () => {
                expect(define<any>('pkgCard', { display: 'block' })({ color: 'red' })).toEqual({ display: 'block', color: 'red' })
        })
})
