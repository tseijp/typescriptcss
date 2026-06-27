import { describe, expect, test } from 'vitest'
import * as _ from '../src'
// Generated mechanically from docs/11_transforms/*.mdx — chain() returns a style object.
// Unimplemented utilities return undefined and stay RED until added to src.

describe('backface-visibility', () => {
        test('backface.hidden', () => {
                expect(_.backface.hidden()).toEqual({ backfaceVisibility: 'hidden' })
        })
        test('backface.visible', () => {
                expect(_.backface.visible()).toEqual({ backfaceVisibility: 'visible' })
        })
})

describe('perspective', () => {
        test('perspective.dramatic', () => {
                expect(_.perspective.dramatic()).toEqual({ perspective: '100px' })
        })
        test('perspective.near', () => {
                expect(_.perspective.near()).toEqual({ perspective: '300px' })
        })
        test('perspective.normal', () => {
                expect(_.perspective.normal()).toEqual({ perspective: '500px' })
        })
        test('perspective.midrange', () => {
                expect(_.perspective.midrange()).toEqual({ perspective: '800px' })
        })
        test('perspective.distant', () => {
                expect(_.perspective.distant()).toEqual({ perspective: '1200px' })
        })
        test('perspective.none', () => {
                expect(_.perspective.none()).toEqual({ perspective: 'none' })
        })
        test('perspective[4]', () => {
                expect(_.perspective[4]()).toEqual({ perspective: 'var(4)' })
        })
})

describe('perspective-origin', () => {
        test('perspective.origin.center', () => {
                expect(_.perspective.origin.center()).toEqual({ perspectiveOrigin: 'center' })
        })
        test('perspective.origin.top', () => {
                expect(_.perspective.origin.top()).toEqual({ perspectiveOrigin: 'top' })
        })
        test('perspective.origin.top.right', () => {
                expect(_.perspective.origin.top.right()).toEqual({ perspectiveOrigin: 'top right' })
        })
        test('perspective.origin.right', () => {
                expect(_.perspective.origin.right()).toEqual({ perspectiveOrigin: 'right' })
        })
        test('perspective.origin.bottom.right', () => {
                expect(_.perspective.origin.bottom.right()).toEqual({ perspectiveOrigin: 'bottom right' })
        })
        test('perspective.origin.bottom', () => {
                expect(_.perspective.origin.bottom()).toEqual({ perspectiveOrigin: 'bottom' })
        })
        test('perspective.origin.bottom.left', () => {
                expect(_.perspective.origin.bottom.left()).toEqual({ perspectiveOrigin: 'bottom left' })
        })
        test('perspective.origin.left', () => {
                expect(_.perspective.origin.left()).toEqual({ perspectiveOrigin: 'left' })
        })
        test('perspective.origin.top.left', () => {
                expect(_.perspective.origin.top.left()).toEqual({ perspectiveOrigin: 'top left' })
        })
        test('perspective.origin[4]', () => {
                expect(_.perspective.origin[4]()).toEqual({ perspectiveOrigin: 'var(4)' })
        })
})

describe('rotate', () => {
        test('rotate.none', () => {
                expect(_.rotate.none()).toEqual({ rotate: 'none' })
        })
        test('rotate[4]', () => {
                expect(_.rotate[4]()).toEqual({ rotate: '4deg' })
        })
})

describe('scale', () => {
        test('scale.none', () => {
                expect(_.scale.none()).toEqual({ scale: 'none' })
        })
        test('scale[4]', () => {
                expect(_.scale[4]()).toEqual({ scale: '4% 4%' })
        })
})

describe('skew', () => {
        test('skew[4]', () => {
                expect(_.skew[4]()).toEqual({ transform: 'skewX(4deg) skewY(4deg)' })
        })
        test('skew.x[4]', () => {
                expect(_.skew.x[4]()).toEqual({ transform: 'skewX(4deg))' })
        })
        test('skew.y[4]', () => {
                expect(_.skew.y[4]()).toEqual({ transform: 'skewY(4deg)' })
        })
})

describe('transform', () => {
        test('transform[4]', () => {
                expect(_.transform[4]()).toEqual({ transform: 'var(4)' })
        })
        test('transform.none', () => {
                expect(_.transform.none()).toEqual({ transform: 'none' })
        })
})

describe('transform-origin', () => {
        test('origin.center', () => {
                expect(_.origin.center()).toEqual({ transformOrigin: 'center' })
        })
        test('origin.top', () => {
                expect(_.origin.top()).toEqual({ transformOrigin: 'top' })
        })
        test('origin.top.right', () => {
                expect(_.origin.top.right()).toEqual({ transformOrigin: 'top right' })
        })
        test('origin.right', () => {
                expect(_.origin.right()).toEqual({ transformOrigin: 'right' })
        })
        test('origin.bottom.right', () => {
                expect(_.origin.bottom.right()).toEqual({ transformOrigin: 'bottom right' })
        })
        test('origin.bottom', () => {
                expect(_.origin.bottom()).toEqual({ transformOrigin: 'bottom' })
        })
        test('origin.bottom.left', () => {
                expect(_.origin.bottom.left()).toEqual({ transformOrigin: 'bottom left' })
        })
        test('origin.left', () => {
                expect(_.origin.left()).toEqual({ transformOrigin: 'left' })
        })
        test('origin.top.left', () => {
                expect(_.origin.top.left()).toEqual({ transformOrigin: 'top left' })
        })
        test('origin[4]', () => {
                expect(_.origin[4]()).toEqual({ transformOrigin: 'var(4)' })
        })
})

describe('transform-style', () => {
        test("transform['3d']", () => {
                expect(_.transform['3d']()).toEqual({ transformStyle: 'preserve-3d' })
        })
        test('transform.flat', () => {
                expect(_.transform.flat()).toEqual({ transformStyle: 'flat' })
        })
})

describe('translate', () => {
        test('translate.full', () => {
                expect(_.translate.full()).toEqual({ translate: '100% 100%' })
        })
        test('translate.px', () => {
                expect(_.translate.px()).toEqual({ translate: '1px 1px' })
        })
        test('translate.none', () => {
                expect(_.translate.none()).toEqual({ translate: 'none' })
        })
})

describe('zoom', () => {
        test('zoom[4]', () => {
                expect(_.zoom[4]()).toEqual({ zoom: '4%' })
        })
})
