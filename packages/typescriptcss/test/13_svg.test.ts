import { describe, expect, test } from 'vitest'
import * as _ from '../src'
// Generated mechanically from docs/13_svg/*.mdx — chain() returns a style object.
// Unimplemented utilities return undefined and stay RED until added to src.

describe('fill', () => {
        test('fill.none', () => {
                expect(_.fill.none()).toEqual({ fill: 'none' })
        })
        test('fill.inherit', () => {
                expect(_.fill.inherit()).toEqual({ fill: 'inherit' })
        })
        test('fill.current', () => {
                expect(_.fill.current()).toEqual({ fill: 'currentColor' })
        })
        test('fill.transparent', () => {
                expect(_.fill.transparent()).toEqual({ fill: 'transparent' })
        })
        test('fill[4]', () => {
                expect(_.fill[4]()).toEqual({ fill: '4' })
        })
})

describe('stroke', () => {
        test('stroke.none', () => {
                expect(_.stroke.none()).toEqual({ stroke: 'none' })
        })
        test('stroke.inherit', () => {
                expect(_.stroke.inherit()).toEqual({ stroke: 'inherit' })
        })
        test('stroke.current', () => {
                expect(_.stroke.current()).toEqual({ stroke: 'currentColor' })
        })
        test('stroke.transparent', () => {
                expect(_.stroke.transparent()).toEqual({ stroke: 'transparent' })
        })
        test('stroke[4]', () => {
                expect(_.stroke[4]()).toEqual({ stroke: '4' })
        })
})
