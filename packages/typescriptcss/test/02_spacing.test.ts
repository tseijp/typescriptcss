import { describe, expect, test } from 'vitest'
import * as _ from '../src'
// Generated mechanically from docs/02_spacing/*.mdx — chain() returns a style object.
// Unimplemented utilities return undefined and stay RED until added to src.

describe('padding', () => {
        test("padding['1px']", () => {
                expect(_.padding['1px']()).toEqual({ padding: '1px' })
        })
        test("px['1px']", () => {
                expect(_.px['1px']()).toEqual({ paddingInline: '1px' })
        })
        test("py['1px']", () => {
                expect(_.py['1px']()).toEqual({ paddingBlock: '1px' })
        })
        test("ps['1px']", () => {
                expect(_.ps['1px']()).toEqual({ paddingInlineStart: '1px' })
        })
        test("pe['1px']", () => {
                expect(_.pe['1px']()).toEqual({ paddingInlineEnd: '1px' })
        })
        test("pt['1px']", () => {
                expect(_.pt['1px']()).toEqual({ paddingBlockStart: '1px' })
        })
        test("pb['1px']", () => {
                expect(_.pb['1px']()).toEqual({ paddingBlockEnd: '1px' })
        })
        test("pr['1px']", () => {
                expect(_.pr['1px']()).toEqual({ paddingRight: '1px' })
        })
        test("pl['1px']", () => {
                expect(_.pl['1px']()).toEqual({ paddingLeft: '1px' })
        })
})

describe('margin', () => {
        test('margin.auto', () => {
                expect(_.margin.auto()).toEqual({ margin: 'auto' })
        })
        test("margin['1px']", () => {
                expect(_.margin['1px']()).toEqual({ margin: '1px' })
        })
        test("margin['-1px']", () => {
                expect(_.margin['-1px']()).toEqual({ margin: '-1px' })
        })
        test('mx.auto', () => {
                expect(_.mx.auto()).toEqual({ marginInline: 'auto' })
        })
        test("mx['1px']", () => {
                expect(_.mx['1px']()).toEqual({ marginInline: '1px' })
        })
        test("mx['-1px']", () => {
                expect(_.mx['-1px']()).toEqual({ marginInline: '-1px' })
        })
        test('my.auto', () => {
                expect(_.my.auto()).toEqual({ marginBlock: 'auto' })
        })
        test("my['1px']", () => {
                expect(_.my['1px']()).toEqual({ marginBlock: '1px' })
        })
        test("my['-1px']", () => {
                expect(_.my['-1px']()).toEqual({ marginBlock: '-1px' })
        })
        test('ms.auto', () => {
                expect(_.ms.auto()).toEqual({ marginInlineStart: 'auto' })
        })
        test("ms['1px']", () => {
                expect(_.ms['1px']()).toEqual({ marginInlineStart: '1px' })
        })
        test("ms['-1px']", () => {
                expect(_.ms['-1px']()).toEqual({ marginInlineStart: '-1px' })
        })
        test('me.auto', () => {
                expect(_.me.auto()).toEqual({ marginInlineEnd: 'auto' })
        })
        test("me['1px']", () => {
                expect(_.me['1px']()).toEqual({ marginInlineEnd: '1px' })
        })
        test("me['-1px']", () => {
                expect(_.me['-1px']()).toEqual({ marginInlineEnd: '-1px' })
        })
        test('mt.auto', () => {
                expect(_.mt.auto()).toEqual({ marginBlockStart: 'auto' })
        })
        test("mt['1px']", () => {
                expect(_.mt['1px']()).toEqual({ marginBlockStart: '1px' })
        })
        test("mt['-1px']", () => {
                expect(_.mt['-1px']()).toEqual({ marginBlockStart: '-1px' })
        })
        test('mb.auto', () => {
                expect(_.mb.auto()).toEqual({ marginBlockEnd: 'auto' })
        })
        test("mb['1px']", () => {
                expect(_.mb['1px']()).toEqual({ marginBlockEnd: '1px' })
        })
        test("mb['-1px']", () => {
                expect(_.mb['-1px']()).toEqual({ marginBlockEnd: '-1px' })
        })
        test('mr.auto', () => {
                expect(_.mr.auto()).toEqual({ marginRight: 'auto' })
        })
        test("mr['1px']", () => {
                expect(_.mr['1px']()).toEqual({ marginRight: '1px' })
        })
        test("mr['-1px']", () => {
                expect(_.mr['-1px']()).toEqual({ marginRight: '-1px' })
        })
        test('ml.auto', () => {
                expect(_.ml.auto()).toEqual({ marginLeft: 'auto' })
        })
        test("ml['1px']", () => {
                expect(_.ml['1px']()).toEqual({ marginLeft: '1px' })
        })
        test("ml['-1px']", () => {
                expect(_.ml['-1px']()).toEqual({ marginLeft: '-1px' })
        })
})
