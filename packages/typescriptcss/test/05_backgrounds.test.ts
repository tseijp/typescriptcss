import { describe, expect, test } from 'vitest'
import * as _ from '../src'
// Generated mechanically from docs/05_backgrounds/*.mdx — chain() returns a style object.
// Unimplemented utilities return undefined and stay RED until added to src.

describe('background-attachment', () => {
        test('bg.fixed', () => {
                expect(_.bg.fixed()).toEqual({ backgroundAttachment: 'fixed' })
        })
        test('bg.local', () => {
                expect(_.bg.local()).toEqual({ backgroundAttachment: 'local' })
        })
        test('bg.scroll', () => {
                expect(_.bg.scroll()).toEqual({ backgroundAttachment: 'scroll' })
        })
})

describe('background-clip', () => {
        test('bg.clip.border', () => {
                expect(_.bg.clip.border()).toEqual({ backgroundClip: 'border-box' })
        })
        test('bg.clip.padding', () => {
                expect(_.bg.clip.padding()).toEqual({ backgroundClip: 'padding-box' })
        })
        test('bg.clip.content', () => {
                expect(_.bg.clip.content()).toEqual({ backgroundClip: 'content-box' })
        })
        test('bg.clip.text', () => {
                expect(_.bg.clip.text()).toEqual({ backgroundClip: 'text' })
        })
})

describe('background-color', () => {
        test('bg.inherit', () => {
                expect(_.bg.inherit()).toEqual({ backgroundColor: 'inherit' })
        })
        test('bg.current', () => {
                expect(_.bg.current()).toEqual({ backgroundColor: 'currentColor' })
        })
        test('bg.transparent', () => {
                expect(_.bg.transparent()).toEqual({ backgroundColor: 'transparent' })
        })
        test('bg[4]', () => {
                expect(_.bg[4]()).toEqual({ backgroundColor: '4' })
        })
})

describe('background-image', () => {
        test('bg.none', () => {
                expect(_.bg.none()).toEqual({ backgroundImage: 'none' })
        })
})

describe('background-origin', () => {
        test('bg.origin.border', () => {
                expect(_.bg.origin.border()).toEqual({ backgroundOrigin: 'border-box' })
        })
        test('bg.origin.padding', () => {
                expect(_.bg.origin.padding()).toEqual({ backgroundOrigin: 'padding-box' })
        })
        test('bg.origin.content', () => {
                expect(_.bg.origin.content()).toEqual({ backgroundOrigin: 'content-box' })
        })
})

describe('background-position', () => {
        test('bg.position.top.left', () => {
                expect(_.bg.position.top.left()).toEqual({ backgroundPosition: 'top left' })
        })
        test('bg.position.top', () => {
                expect(_.bg.position.top()).toEqual({ backgroundPosition: 'top' })
        })
        test('bg.position.top.right', () => {
                expect(_.bg.position.top.right()).toEqual({ backgroundPosition: 'top right' })
        })
        test('bg.position.left', () => {
                expect(_.bg.position.left()).toEqual({ backgroundPosition: 'left' })
        })
        test('bg.position.center', () => {
                expect(_.bg.position.center()).toEqual({ backgroundPosition: 'center' })
        })
        test('bg.position.right', () => {
                expect(_.bg.position.right()).toEqual({ backgroundPosition: 'right' })
        })
        test('bg.position.bottom.left', () => {
                expect(_.bg.position.bottom.left()).toEqual({ backgroundPosition: 'bottom left' })
        })
        test('bg.position.bottom', () => {
                expect(_.bg.position.bottom()).toEqual({ backgroundPosition: 'bottom' })
        })
        test('bg.position.bottom.right', () => {
                expect(_.bg.position.bottom.right()).toEqual({ backgroundPosition: 'bottom right' })
        })
        test('bg.position[4]', () => {
                expect(_.bg.position[4]()).toEqual({ backgroundPosition: '4' })
        })
})

describe('background-repeat', () => {
        test('bg.repeat.repeat', () => {
                expect(_.bg.repeat.repeat()).toEqual({ backgroundRepeat: 'repeat' })
        })
        test('bg.repeat.x', () => {
                expect(_.bg.repeat.x()).toEqual({ backgroundRepeat: 'repeat-x' })
        })
        test('bg.repeat.y', () => {
                expect(_.bg.repeat.y()).toEqual({ backgroundRepeat: 'repeat-y' })
        })
        test('bg.repeat.space', () => {
                expect(_.bg.repeat.space()).toEqual({ backgroundRepeat: 'space' })
        })
        test('bg.repeat.round', () => {
                expect(_.bg.repeat.round()).toEqual({ backgroundRepeat: 'round' })
        })
        test("bg.repeat['no-repeat']", () => {
                expect(_.bg.repeat['no-repeat']()).toEqual({ backgroundRepeat: 'no-repeat' })
        })
})

describe('background-size', () => {
        test('bg.auto', () => {
                expect(_.bg.auto()).toEqual({ backgroundSize: 'auto' })
        })
        test('bg.cover', () => {
                expect(_.bg.cover()).toEqual({ backgroundSize: 'cover' })
        })
        test('bg.contain', () => {
                expect(_.bg.contain()).toEqual({ backgroundSize: 'contain' })
        })
        test('bg.size[4]', () => {
                expect(_.bg.size[4]()).toEqual({ backgroundSize: '16px' })
        })
})
