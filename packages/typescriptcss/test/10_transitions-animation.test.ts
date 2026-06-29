import { describe, expect, test } from 'vitest'
import * as _ from '../src'
// Generated mechanically from docs/10_transitions-animation/*.mdx — chain() returns a style object.
// Unimplemented utilities return undefined and stay RED until added to src.

describe('transition-property', () => {
        test('transition.all', () => {
                expect(_.transition.all()).toEqual({ transitionProperty: 'all', transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)', transitionDuration: '150ms' })
        })
        test('transition.opacity', () => {
                expect(_.transition.opacity()).toEqual({ transitionProperty: 'opacity', transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)', transitionDuration: '150ms' })
        })
        test('transition.shadow', () => {
                expect(_.transition.shadow()).toEqual({ transitionProperty: 'box-shadow', transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)', transitionDuration: '150ms' })
        })
        test('transition.transform', () => {
                expect(_.transition.transform()).toEqual({ transitionProperty: 'transform, translate, scale, rotate', transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)', transitionDuration: '150ms' })
        })
        test('transition.none', () => {
                expect(_.transition.none()).toEqual({ transitionProperty: 'none' })
        })
        test('transition[4]', () => {
                expect(_.transition[4]()).toEqual({ transitionProperty: '4', transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)', transitionDuration: '150ms' })
        })
})

describe('transition-behavior', () => {
        test('transition.normal', () => {
                expect(_.transition.normal()).toEqual({ transitionBehavior: 'normal' })
        })
        test('transition.discrete', () => {
                expect(_.transition.discrete()).toEqual({ transitionBehavior: 'allow-discrete' })
        })
})

describe('transition-duration', () => {
        test('duration[4]', () => {
                expect(_.duration[4]()).toEqual({ transitionDuration: '4ms' })
        })
        test('duration.initial', () => {
                expect(_.duration.initial()).toEqual({ transitionDuration: 'initial' })
        })
})

describe('transition-timing-function', () => {
        test('ease.linear', () => {
                expect(_.ease.linear()).toEqual({ transitionTimingFunction: 'linear' })
        })
        test('ease.in', () => {
                expect(_.ease.in()).toEqual({ transitionTimingFunction: 'cubic-bezier(0.4, 0, 1, 1)' })
        })
        test('ease.out', () => {
                expect(_.ease.out()).toEqual({ transitionTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)' })
        })
        test('ease.in.out', () => {
                expect(_.ease.in.out()).toEqual({ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' })
        })
        test('ease.initial', () => {
                expect(_.ease.initial()).toEqual({ transitionTimingFunction: 'initial' })
        })
        test('ease[4]', () => {
                expect(_.ease[4]()).toEqual({ transitionTimingFunction: 'var(4)' })
        })
})

describe('transition-delay', () => {
        test('delay[4]', () => {
                expect(_.delay[4]()).toEqual({ transitionDelay: '4ms' })
        })
})

describe('animation', () => {
        test('animate.spin', () => {
                expect(_.animate.spin()).toEqual({ animation: 'spin 1s linear infinite' })
        })
        test('animate.ping', () => {
                expect(_.animate.ping()).toEqual({ animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite' })
        })
        test('animate.pulse', () => {
                expect(_.animate.pulse()).toEqual({ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' })
        })
        test('animate.bounce', () => {
                expect(_.animate.bounce()).toEqual({ animation: 'bounce 1s infinite' })
        })
        test('animate.none', () => {
                expect(_.animate.none()).toEqual({ animation: 'none' })
        })
        test('animate[4]', () => {
                expect(_.animate[4]()).toEqual({ animation: 'var(4)' })
        })
})
