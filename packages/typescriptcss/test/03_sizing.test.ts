import { describe, expect, test } from 'vitest'
import * as _ from '../src'
// Generated mechanically from docs/03_sizing/*.mdx — chain() returns a style object.
// Unimplemented utilities return undefined and stay RED until added to src.

describe('width', () => {
        test('width.auto', () => {
                expect(_.w.auto()).toEqual({ width: 'auto' })
        })
        test("width['1px']", () => {
                expect(_.w['1px']()).toEqual({ width: '1px' })
        })
        test("width['100%']", () => {
                expect(_.w['100%']()).toEqual({ width: '100%' })
        })
        test("width['100vw']", () => {
                expect(_.w['100vw']()).toEqual({ width: '100vw' })
        })
        test("width['100dvw']", () => {
                expect(_.w['100dvw']()).toEqual({ width: '100dvw' })
        })
        test("width['100dvh']", () => {
                expect(_.w['100dvh']()).toEqual({ width: '100dvh' })
        })
        test("width['100lvw']", () => {
                expect(_.w['100lvw']()).toEqual({ width: '100lvw' })
        })
        test("width['100lvh']", () => {
                expect(_.w['100lvh']()).toEqual({ width: '100lvh' })
        })
        test("width['100svw']", () => {
                expect(_.w['100svw']()).toEqual({ width: '100svw' })
        })
        test("width['100svh']", () => {
                expect(_.w['100svh']()).toEqual({ width: '100svh' })
        })
        test("width['min-content']", () => {
                expect(_.w['min-content']()).toEqual({ width: 'min-content' })
        })
        test("width['max-content']", () => {
                expect(_.w['max-content']()).toEqual({ width: 'max-content' })
        })
        test("width['fit-content']", () => {
                expect(_.w['fit-content']()).toEqual({ width: 'fit-content' })
        })
        test('size.auto', () => {
                expect(_.size.auto()).toEqual({ width: 'auto', height: 'auto' })
        })
        test('size.px', () => {
                expect(_.size.px()).toEqual({ width: '1px', height: '1px' })
        })
        test('size.full', () => {
                expect(_.size.full()).toEqual({ width: '100%', height: '100%' })
        })
        test('size.dvw', () => {
                expect(_.size.dvw()).toEqual({ width: '100dvw', height: '100dvw' })
        })
        test('size.dvh', () => {
                expect(_.size.dvh()).toEqual({ width: '100dvh', height: '100dvh' })
        })
        test('size.lvw', () => {
                expect(_.size.lvw()).toEqual({ width: '100lvw', height: '100lvw' })
        })
        test('size.lvh', () => {
                expect(_.size.lvh()).toEqual({ width: '100lvh', height: '100lvh' })
        })
        test('size.svw', () => {
                expect(_.size.svw()).toEqual({ width: '100svw', height: '100svw' })
        })
        test('size.svh', () => {
                expect(_.size.svh()).toEqual({ width: '100svh', height: '100svh' })
        })
        test('size.min', () => {
                expect(_.size.min()).toEqual({ width: 'min-content', height: 'min-content' })
        })
        test('size.max', () => {
                expect(_.size.max()).toEqual({ width: 'max-content', height: 'max-content' })
        })
        test('size.fit', () => {
                expect(_.size.fit()).toEqual({ width: 'fit-content', height: 'fit-content' })
        })
})

describe('min-width', () => {
        test('min.w.auto', () => {
                expect(_.min.w.auto()).toEqual({ minWidth: 'auto' })
        })
        test("min.w['1px']", () => {
                expect(_.min.w['1px']()).toEqual({ minWidth: '1px' })
        })
        test("min.w['100%']", () => {
                expect(_.min.w['100%']()).toEqual({ minWidth: '100%' })
        })
        test("min.w['100vw']", () => {
                expect(_.min.w['100vw']()).toEqual({ minWidth: '100vw' })
        })
        test("min.w['100dvw']", () => {
                expect(_.min.w['100dvw']()).toEqual({ minWidth: '100dvw' })
        })
        test("min.w['100dvh']", () => {
                expect(_.min.w['100dvh']()).toEqual({ minWidth: '100dvh' })
        })
        test("min.w['100lvw']", () => {
                expect(_.min.w['100lvw']()).toEqual({ minWidth: '100lvw' })
        })
        test("min.w['100lvh']", () => {
                expect(_.min.w['100lvh']()).toEqual({ minWidth: '100lvh' })
        })
        test("min.w['100svw']", () => {
                expect(_.min.w['100svw']()).toEqual({ minWidth: '100svw' })
        })
        test("min.w['100svh']", () => {
                expect(_.min.w['100svh']()).toEqual({ minWidth: '100svh' })
        })
        test("min.w['min-content']", () => {
                expect(_.min.w['min-content']()).toEqual({ minWidth: 'min-content' })
        })
        test("min.w['max-content']", () => {
                expect(_.min.w['max-content']()).toEqual({ minWidth: 'max-content' })
        })
        test("min.w['fit-content']", () => {
                expect(_.min.w['fit-content']()).toEqual({ minWidth: 'fit-content' })
        })
})

describe('max-width', () => {
        test('max.w.none', () => {
                expect(_.max.w.none()).toEqual({ maxWidth: 'none' })
        })
        test("max.w['1px']", () => {
                expect(_.max.w['1px']()).toEqual({ maxWidth: '1px' })
        })
        test("max.w['100%']", () => {
                expect(_.max.w['100%']()).toEqual({ maxWidth: '100%' })
        })
        test("max.w['100dvw']", () => {
                expect(_.max.w['100dvw']()).toEqual({ maxWidth: '100dvw' })
        })
        test("max.w['100dvh']", () => {
                expect(_.max.w['100dvh']()).toEqual({ maxWidth: '100dvh' })
        })
        test("max.w['100lvw']", () => {
                expect(_.max.w['100lvw']()).toEqual({ maxWidth: '100lvw' })
        })
        test("max.w['100lvh']", () => {
                expect(_.max.w['100lvh']()).toEqual({ maxWidth: '100lvh' })
        })
        test("max.w['100svw']", () => {
                expect(_.max.w['100svw']()).toEqual({ maxWidth: '100svw' })
        })
        test("max.w['100svh']", () => {
                expect(_.max.w['100svh']()).toEqual({ maxWidth: '100svh' })
        })
        test("max.w['100vw']", () => {
                expect(_.max.w['100vw']()).toEqual({ maxWidth: '100vw' })
        })
        test("max.w['min-content']", () => {
                expect(_.max.w['min-content']()).toEqual({ maxWidth: 'min-content' })
        })
        test("max.w['max-content']", () => {
                expect(_.max.w['max-content']()).toEqual({ maxWidth: 'max-content' })
        })
        test("max.w['fit-content']", () => {
                expect(_.max.w['fit-content']()).toEqual({ maxWidth: 'fit-content' })
        })
        test.skip('container', () => {
                expect(_.container()).toEqual({
                        width: '100%',
                        '@media (width >= 40rem)': { maxWidth: '40rem' },
                        '@media (width >= 48rem)': { maxWidth: '48rem' },
                        '@media (width >= 64rem)': { maxWidth: '64rem' },
                        '@media (width >= 80rem)': { maxWidth: '80rem' },
                        '@media (width >= 96rem)': { maxWidth: '96rem' },
                })
        })
})

describe('height', () => {
        test('height.auto', () => {
                expect(_.h.auto()).toEqual({ height: 'auto' })
        })
        test("height['1px']", () => {
                expect(_.h['1px']()).toEqual({ height: '1px' })
        })
        test("height['100%']", () => {
                expect(_.h['100%']()).toEqual({ height: '100%' })
        })
        test("height['100vh']", () => {
                expect(_.h['100vh']()).toEqual({ height: '100vh' })
        })
        test("height['100dvh']", () => {
                expect(_.h['100dvh']()).toEqual({ height: '100dvh' })
        })
        test("height['100dvw']", () => {
                expect(_.h['100dvw']()).toEqual({ height: '100dvw' })
        })
        test("height['100lvh']", () => {
                expect(_.h['100lvh']()).toEqual({ height: '100lvh' })
        })
        test("height['100lvw']", () => {
                expect(_.h['100lvw']()).toEqual({ height: '100lvw' })
        })
        test("height['100svh']", () => {
                expect(_.h['100svh']()).toEqual({ height: '100svh' })
        })
        test("height['100svw']", () => {
                expect(_.h['100svw']()).toEqual({ height: '100svw' })
        })
        test("height['min-content']", () => {
                expect(_.h['min-content']()).toEqual({ height: 'min-content' })
        })
        test("height['max-content']", () => {
                expect(_.h['max-content']()).toEqual({ height: 'max-content' })
        })
        test("height['fit-content']", () => {
                expect(_.h['fit-content']()).toEqual({ height: 'fit-content' })
        })
        test("height['1lh']", () => {
                expect(_.h['1lh']()).toEqual({ height: '1lh' })
        })
})

describe('min-height', () => {
        test("min.h['1px']", () => {
                expect(_.min.h['1px']()).toEqual({ minHeight: '1px' })
        })
        test("min.h['100%']", () => {
                expect(_.min.h['100%']()).toEqual({ minHeight: '100%' })
        })
        test("min.h['100vh']", () => {
                expect(_.min.h['100vh']()).toEqual({ minHeight: '100vh' })
        })
        test("min.h['100dvh']", () => {
                expect(_.min.h['100dvh']()).toEqual({ minHeight: '100dvh' })
        })
        test("min.h['100dvw']", () => {
                expect(_.min.h['100dvw']()).toEqual({ minHeight: '100dvw' })
        })
        test("min.h['100lvh']", () => {
                expect(_.min.h['100lvh']()).toEqual({ minHeight: '100lvh' })
        })
        test("min.h['100lvw']", () => {
                expect(_.min.h['100lvw']()).toEqual({ minHeight: '100lvw' })
        })
        test("min.h['100svw']", () => {
                expect(_.min.h['100svw']()).toEqual({ minHeight: '100svw' })
        })
        test("min.h['100svh']", () => {
                expect(_.min.h['100svh']()).toEqual({ minHeight: '100svh' })
        })
        test('min.h.auto', () => {
                expect(_.min.h.auto()).toEqual({ minHeight: 'auto' })
        })
        test("min.h['min-content']", () => {
                expect(_.min.h['min-content']()).toEqual({ minHeight: 'min-content' })
        })
        test("min.h['max-content']", () => {
                expect(_.min.h['max-content']()).toEqual({ minHeight: 'max-content' })
        })
        test("min.h['fit-content']", () => {
                expect(_.min.h['fit-content']()).toEqual({ minHeight: 'fit-content' })
        })
        test("min.h['1lh']", () => {
                expect(_.min.h['1lh']()).toEqual({ minHeight: '1lh' })
        })
})

describe('max-height', () => {
        test('max.h.none', () => {
                expect(_.max.h.none()).toEqual({ maxHeight: 'none' })
        })
        test("max.h['1px']", () => {
                expect(_.max.h['1px']()).toEqual({ maxHeight: '1px' })
        })
        test("max.h['100%']", () => {
                expect(_.max.h['100%']()).toEqual({ maxHeight: '100%' })
        })
        test("max.h['100vh']", () => {
                expect(_.max.h['100vh']()).toEqual({ maxHeight: '100vh' })
        })
        test("max.h['100dvh']", () => {
                expect(_.max.h['100dvh']()).toEqual({ maxHeight: '100dvh' })
        })
        test("max.h['100dvw']", () => {
                expect(_.max.h['100dvw']()).toEqual({ maxHeight: '100dvw' })
        })
        test("max.h['100lvh']", () => {
                expect(_.max.h['100lvh']()).toEqual({ maxHeight: '100lvh' })
        })
        test("max.h['100lvw']", () => {
                expect(_.max.h['100lvw']()).toEqual({ maxHeight: '100lvw' })
        })
        test("max.h['100svh']", () => {
                expect(_.max.h['100svh']()).toEqual({ maxHeight: '100svh' })
        })
        test("max.h['100svw']", () => {
                expect(_.max.h['100svw']()).toEqual({ maxHeight: '100svw' })
        })
        test("max.h['min-content']", () => {
                expect(_.max.h['min-content']()).toEqual({ maxHeight: 'min-content' })
        })
        test("max.h['max-content']", () => {
                expect(_.max.h['max-content']()).toEqual({ maxHeight: 'max-content' })
        })
        test("max.h['fit-content']", () => {
                expect(_.max.h['fit-content']()).toEqual({ maxHeight: 'fit-content' })
        })
        test("max.h['1lh']", () => {
                expect(_.max.h['1lh']()).toEqual({ maxHeight: '1lh' })
        })
})

describe('inline-size', () => {
        test('inline[4]', () => {
                expect(_.inline[4]()).toEqual({ inlineSize: '16px' })
        })
        test('inline.auto', () => {
                expect(_.inline.auto()).toEqual({ inlineSize: 'auto' })
        })
        test("inline['1px']", () => {
                expect(_.inline['1px']()).toEqual({ inlineSize: '1px' })
        })
        test("inline['100%']", () => {
                expect(_.inline['100%']()).toEqual({ inlineSize: '100%' })
        })
        test("inline['100vw']", () => {
                expect(_.inline['100vw']()).toEqual({ inlineSize: '100vw' })
        })
        test("inline['100dvw']", () => {
                expect(_.inline['100dvw']()).toEqual({ inlineSize: '100dvw' })
        })
        test("inline['100dvh']", () => {
                expect(_.inline['100dvh']()).toEqual({ inlineSize: '100dvh' })
        })
        test("inline['100lvw']", () => {
                expect(_.inline['100lvw']()).toEqual({ inlineSize: '100lvw' })
        })
        test("inline['100lvh']", () => {
                expect(_.inline['100lvh']()).toEqual({ inlineSize: '100lvh' })
        })
        test("inline['100svw']", () => {
                expect(_.inline['100svw']()).toEqual({ inlineSize: '100svw' })
        })
        test("inline['100svh']", () => {
                expect(_.inline['100svh']()).toEqual({ inlineSize: '100svh' })
        })
        test("inline['min-content']", () => {
                expect(_.inline['min-content']()).toEqual({ inlineSize: 'min-content' })
        })
        test("inline['max-content']", () => {
                expect(_.inline['max-content']()).toEqual({ inlineSize: 'max-content' })
        })
        test("inline['fit-content']", () => {
                expect(_.inline['fit-content']()).toEqual({ inlineSize: 'fit-content' })
        })
})

describe('min-inline-size', () => {
        test('min.inline[4]', () => {
                expect(_.min.inline[4]()).toEqual({ minInlineSize: '16px' })
        })
        test('min.inline.auto', () => {
                expect(_.min.inline.auto()).toEqual({ minInlineSize: 'auto' })
        })
        test("min.inline['1px']", () => {
                expect(_.min.inline['1px']()).toEqual({ minInlineSize: '1px' })
        })
        test("min.inline['100%']", () => {
                expect(_.min.inline['100%']()).toEqual({ minInlineSize: '100%' })
        })
        test("min.inline['100vw']", () => {
                expect(_.min.inline['100vw']()).toEqual({ minInlineSize: '100vw' })
        })
        test("min.inline['100dvw']", () => {
                expect(_.min.inline['100dvw']()).toEqual({ minInlineSize: '100dvw' })
        })
        test("min.inline['100dvh']", () => {
                expect(_.min.inline['100dvh']()).toEqual({ minInlineSize: '100dvh' })
        })
        test("min.inline['100lvw']", () => {
                expect(_.min.inline['100lvw']()).toEqual({ minInlineSize: '100lvw' })
        })
        test("min.inline['100lvh']", () => {
                expect(_.min.inline['100lvh']()).toEqual({ minInlineSize: '100lvh' })
        })
        test("min.inline['100svw']", () => {
                expect(_.min.inline['100svw']()).toEqual({ minInlineSize: '100svw' })
        })
        test("min.inline['100svh']", () => {
                expect(_.min.inline['100svh']()).toEqual({ minInlineSize: '100svh' })
        })
        test("min.inline['min-content']", () => {
                expect(_.min.inline['min-content']()).toEqual({ minInlineSize: 'min-content' })
        })
        test("min.inline['max-content']", () => {
                expect(_.min.inline['max-content']()).toEqual({ minInlineSize: 'max-content' })
        })
        test("min.inline['fit-content']", () => {
                expect(_.min.inline['fit-content']()).toEqual({ minInlineSize: 'fit-content' })
        })
})

describe('max-inline-size', () => {
        test('max.inline[4]', () => {
                expect(_.max.inline[4]()).toEqual({ maxInlineSize: '16px' })
        })
        test('max.inline.auto', () => {
                expect(_.max.inline.auto()).toEqual({ maxInlineSize: 'none' })
        })
        test("max.inline['1px']", () => {
                expect(_.max.inline['1px']()).toEqual({ maxInlineSize: '1px' })
        })
        test("max.inline['100%']", () => {
                expect(_.max.inline['100%']()).toEqual({ maxInlineSize: '100%' })
        })
        test("max.inline['100dvw']", () => {
                expect(_.max.inline['100dvw']()).toEqual({ maxInlineSize: '100dvw' })
        })
        test("max.inline['100dvh']", () => {
                expect(_.max.inline['100dvh']()).toEqual({ maxInlineSize: '100dvh' })
        })
        test("max.inline['100lvw']", () => {
                expect(_.max.inline['100lvw']()).toEqual({ maxInlineSize: '100lvw' })
        })
        test("max.inline['100lvh']", () => {
                expect(_.max.inline['100lvh']()).toEqual({ maxInlineSize: '100lvh' })
        })
        test("max.inline['100svw']", () => {
                expect(_.max.inline['100svw']()).toEqual({ maxInlineSize: '100svw' })
        })
        test("max.inline['100svh']", () => {
                expect(_.max.inline['100svh']()).toEqual({ maxInlineSize: '100svh' })
        })
        test("max.inline['100vw']", () => {
                expect(_.max.inline['100vw']()).toEqual({ maxInlineSize: '100vw' })
        })
        test("max.inline['min-content']", () => {
                expect(_.max.inline['min-content']()).toEqual({ maxInlineSize: 'min-content' })
        })
        test("max.inline['max-content']", () => {
                expect(_.max.inline['max-content']()).toEqual({ maxInlineSize: 'max-content' })
        })
        test("max.inline['fit-content']", () => {
                expect(_.max.inline['fit-content']()).toEqual({ maxInlineSize: 'fit-content' })
        })
})

describe('block-size', () => {
        test('block[4]', () => {
                expect(_.block[4]()).toEqual({ blockSize: '16px' })
        })
        test('block.auto', () => {
                expect(_.block.auto()).toEqual({ blockSize: 'auto' })
        })
        test("block['100vh']", () => {
                expect(_.block['100vh']()).toEqual({ blockSize: '100vh' })
        })
        test("block['1lh']", () => {
                expect(_.block['1lh']()).toEqual({ blockSize: '1lh' })
        })
})

describe('min-block-size', () => {
        test('min.block[4]', () => {
                expect(_.min.block[4]()).toEqual({ minBlockSize: '16px' })
        })
        test('min.block.auto', () => {
                expect(_.min.block.auto()).toEqual({ minBlockSize: 'auto' })
        })
        test("min.block['100vh']", () => {
                expect(_.min.block['100vh']()).toEqual({ minBlockSize: '100vh' })
        })
        test("min.block['1lh']", () => {
                expect(_.min.block['1lh']()).toEqual({ minBlockSize: '1lh' })
        })
})

describe('max-block-size', () => {
        test('max.block[4]', () => {
                expect(_.max.block[4]()).toEqual({ maxBlockSize: '16px' })
        })
        test('max.block.none', () => {
                expect(_.max.block.none()).toEqual({ maxBlockSize: 'none' })
        })
        test("max.block['100vh']", () => {
                expect(_.max.block['100vh']()).toEqual({ maxBlockSize: '100vh' })
        })
        test("max.block['1lh']", () => {
                expect(_.max.block['1lh']()).toEqual({ maxBlockSize: '1lh' })
        })
})
