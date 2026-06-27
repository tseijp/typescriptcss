import { describe, expect, test } from 'vitest'
import * as _ from '../src'
// Generated mechanically from docs/07_effects/*.mdx — chain() returns a style object.
// Unimplemented utilities return undefined and stay RED until added to src.

describe('box-shadow', () => {
        test('shadow[4]', () => {
                expect(_.shadow[4]()).toEqual({ boxShadow: '0 1px rgb(0 0 0 / 0.05)' })
        })
        test("shadow['0 0 #0000']", () => {
                expect(_.shadow['0 0 #0000']()).toEqual({ boxShadow: '0 0 #0000' })
        })
})

describe('text-shadow', () => {
        test('text.shadow[4]', () => {
                expect(_.text.shadow[4]()).toEqual({ textShadow: '0px 1px 0px rgb(0 0 0 / 0.15)' })
        })
        test('text.shadow.none', () => {
                expect(_.text.shadow.none()).toEqual({ textShadow: 'none' })
        })
})

describe('opacity', () => {
        test('opacity[4]', () => {
                expect(_.opacity[4]()).toEqual({ opacity: '4%' })
        })
})

describe('mix-blend-mode', () => {
        test('mix.blend.normal', () => {
                expect(_.mix.blend.normal()).toEqual({ mixBlendMode: 'normal' })
        })
        test('mix.blend.multiply', () => {
                expect(_.mix.blend.multiply()).toEqual({ mixBlendMode: 'multiply' })
        })
        test('mix.blend.screen', () => {
                expect(_.mix.blend.screen()).toEqual({ mixBlendMode: 'screen' })
        })
        test('mix.blend.overlay', () => {
                expect(_.mix.blend.overlay()).toEqual({ mixBlendMode: 'overlay' })
        })
        test('mix.blend.darken', () => {
                expect(_.mix.blend.darken()).toEqual({ mixBlendMode: 'darken' })
        })
        test('mix.blend.lighten', () => {
                expect(_.mix.blend.lighten()).toEqual({ mixBlendMode: 'lighten' })
        })
        test("mix.blend['color-dodge']", () => {
                expect(_.mix.blend['color-dodge']()).toEqual({ mixBlendMode: 'color-dodge' })
        })
        test("mix.blend['color-burn']", () => {
                expect(_.mix.blend['color-burn']()).toEqual({ mixBlendMode: 'color-burn' })
        })
        test("mix.blend['hard-light']", () => {
                expect(_.mix.blend['hard-light']()).toEqual({ mixBlendMode: 'hard-light' })
        })
        test("mix.blend['soft-light']", () => {
                expect(_.mix.blend['soft-light']()).toEqual({ mixBlendMode: 'soft-light' })
        })
        test('mix.blend.difference', () => {
                expect(_.mix.blend.difference()).toEqual({ mixBlendMode: 'difference' })
        })
        test('mix.blend.exclusion', () => {
                expect(_.mix.blend.exclusion()).toEqual({ mixBlendMode: 'exclusion' })
        })
        test('mix.blend.hue', () => {
                expect(_.mix.blend.hue()).toEqual({ mixBlendMode: 'hue' })
        })
        test('mix.blend.saturation', () => {
                expect(_.mix.blend.saturation()).toEqual({ mixBlendMode: 'saturation' })
        })
        test('mix.blend.color', () => {
                expect(_.mix.blend.color()).toEqual({ mixBlendMode: 'color' })
        })
        test('mix.blend.luminosity', () => {
                expect(_.mix.blend.luminosity()).toEqual({ mixBlendMode: 'luminosity' })
        })
        test("mix.blend['plus-darker']", () => {
                expect(_.mix.blend['plus-darker']()).toEqual({ mixBlendMode: 'plus-darker' })
        })
        test("mix.blend['plus-lighter']", () => {
                expect(_.mix.blend['plus-lighter']()).toEqual({ mixBlendMode: 'plus-lighter' })
        })
})

describe('background-blend-mode', () => {
        test('bg.blend.normal', () => {
                expect(_.bg.blend.normal()).toEqual({ backgroundBlendMode: 'normal' })
        })
        test('bg.blend.multiply', () => {
                expect(_.bg.blend.multiply()).toEqual({ backgroundBlendMode: 'multiply' })
        })
        test('bg.blend.screen', () => {
                expect(_.bg.blend.screen()).toEqual({ backgroundBlendMode: 'screen' })
        })
        test('bg.blend.overlay', () => {
                expect(_.bg.blend.overlay()).toEqual({ backgroundBlendMode: 'overlay' })
        })
        test('bg.blend.darken', () => {
                expect(_.bg.blend.darken()).toEqual({ backgroundBlendMode: 'darken' })
        })
        test('bg.blend.lighten', () => {
                expect(_.bg.blend.lighten()).toEqual({ backgroundBlendMode: 'lighten' })
        })
        test("bg.blend['color-dodge']", () => {
                expect(_.bg.blend['color-dodge']()).toEqual({ backgroundBlendMode: 'color-dodge' })
        })
        test("bg.blend['color-burn']", () => {
                expect(_.bg.blend['color-burn']()).toEqual({ backgroundBlendMode: 'color-burn' })
        })
        test("bg.blend['hard-light']", () => {
                expect(_.bg.blend['hard-light']()).toEqual({ backgroundBlendMode: 'hard-light' })
        })
        test("bg.blend['soft-light']", () => {
                expect(_.bg.blend['soft-light']()).toEqual({ backgroundBlendMode: 'soft-light' })
        })
        test('bg.blend.difference', () => {
                expect(_.bg.blend.difference()).toEqual({ backgroundBlendMode: 'difference' })
        })
        test('bg.blend.exclusion', () => {
                expect(_.bg.blend.exclusion()).toEqual({ backgroundBlendMode: 'exclusion' })
        })
        test('bg.blend.hue', () => {
                expect(_.bg.blend.hue()).toEqual({ backgroundBlendMode: 'hue' })
        })
        test('bg.blend.saturation', () => {
                expect(_.bg.blend.saturation()).toEqual({ backgroundBlendMode: 'saturation' })
        })
        test('bg.blend.color', () => {
                expect(_.bg.blend.color()).toEqual({ backgroundBlendMode: 'color' })
        })
        test('bg.blend.luminosity', () => {
                expect(_.bg.blend.luminosity()).toEqual({ backgroundBlendMode: 'luminosity' })
        })
})

describe('mask-clip', () => {
        test("mask.clip['border-box']", () => {
                expect(_.mask.clip['border-box']()).toEqual({ maskClip: 'border-box' })
        })
        test("mask.clip['padding-box']", () => {
                expect(_.mask.clip['padding-box']()).toEqual({ maskClip: 'padding-box' })
        })
        test("mask.clip['content-box']", () => {
                expect(_.mask.clip['content-box']()).toEqual({ maskClip: 'content-box' })
        })
        test("mask.clip['fill-box']", () => {
                expect(_.mask.clip['fill-box']()).toEqual({ maskClip: 'fill-box' })
        })
        test("mask.clip['stroke-box']", () => {
                expect(_.mask.clip['stroke-box']()).toEqual({ maskClip: 'stroke-box' })
        })
        test("mask.clip['view-box']", () => {
                expect(_.mask.clip['view-box']()).toEqual({ maskClip: 'view-box' })
        })
        test("mask.clip['no-clip']", () => {
                expect(_.mask.clip['no-clip']()).toEqual({ maskClip: 'no-clip' })
        })
})

describe('mask-composite', () => {
        test('mask.add', () => {
                expect(_.mask.add()).toEqual({ maskComposite: 'add' })
        })
        test('mask.subtract', () => {
                expect(_.mask.subtract()).toEqual({ maskComposite: 'subtract' })
        })
        test('mask.intersect', () => {
                expect(_.mask.intersect()).toEqual({ maskComposite: 'intersect' })
        })
        test('mask.exclude', () => {
                expect(_.mask.exclude()).toEqual({ maskComposite: 'exclude' })
        })
})

describe('mask-image', () => {
        test('mask[4]', () => {
                expect(_.mask[4]()).toEqual({ maskImage: '4' })
        })
        test('mask.none', () => {
                expect(_.mask.none()).toEqual({ maskImage: 'none' })
        })
        test('mask.radial[4]', () => {
                expect(_.mask.radial[4]()).toEqual({ maskImage: 'radial-gradient(4)' })
        })
})

describe('mask-mode', () => {
        test('mask.alpha', () => {
                expect(_.mask.alpha()).toEqual({ maskMode: 'alpha' })
        })
        test('mask.luminance', () => {
                expect(_.mask.luminance()).toEqual({ maskMode: 'luminance' })
        })
        test("mask['match-source']", () => {
                expect(_.mask['match-source']()).toEqual({ maskMode: 'match-source' })
        })
})

describe('mask-origin', () => {
        test("mask.origin['border-box']", () => {
                expect(_.mask.origin['border-box']()).toEqual({ maskOrigin: 'border-box' })
        })
        test("mask.origin['padding-box']", () => {
                expect(_.mask.origin['padding-box']()).toEqual({ maskOrigin: 'padding-box' })
        })
        test("mask.origin['content-box']", () => {
                expect(_.mask.origin['content-box']()).toEqual({ maskOrigin: 'content-box' })
        })
        test("mask.origin['fill-box']", () => {
                expect(_.mask.origin['fill-box']()).toEqual({ maskOrigin: 'fill-box' })
        })
        test("mask.origin['stroke-box']", () => {
                expect(_.mask.origin['stroke-box']()).toEqual({ maskOrigin: 'stroke-box' })
        })
        test("mask.origin['view-box']", () => {
                expect(_.mask.origin['view-box']()).toEqual({ maskOrigin: 'view-box' })
        })
})

describe('mask-position', () => {
        test("mask.position['top left']", () => {
                expect(_.mask.position['top left']()).toEqual({ maskPosition: 'top left' })
        })
        test('mask.position.top', () => {
                expect(_.mask.position.top()).toEqual({ maskPosition: 'top' })
        })
        test("mask.position['top right']", () => {
                expect(_.mask.position['top right']()).toEqual({ maskPosition: 'top right' })
        })
        test('mask.position.left', () => {
                expect(_.mask.position.left()).toEqual({ maskPosition: 'left' })
        })
        test('mask.position.center', () => {
                expect(_.mask.position.center()).toEqual({ maskPosition: 'center' })
        })
        test('mask.position.right', () => {
                expect(_.mask.position.right()).toEqual({ maskPosition: 'right' })
        })
        test("mask.position['bottom left']", () => {
                expect(_.mask.position['bottom left']()).toEqual({ maskPosition: 'bottom left' })
        })
        test('mask.position.bottom', () => {
                expect(_.mask.position.bottom()).toEqual({ maskPosition: 'bottom' })
        })
        test("mask.position['bottom right']", () => {
                expect(_.mask.position['bottom right']()).toEqual({ maskPosition: 'bottom right' })
        })
        test('mask.position[4]', () => {
                expect(_.mask.position[4]()).toEqual({ maskPosition: 'var(4)' })
        })
})

describe('mask-repeat', () => {
        test('mask.repeat.repeat', () => {
                expect(_.mask.repeat.repeat()).toEqual({ maskRepeat: 'repeat' })
        })
        test("mask.repeat['no-repeat']", () => {
                expect(_.mask.repeat['no-repeat']()).toEqual({ maskRepeat: 'no-repeat' })
        })
        test("mask.repeat['repeat-x']", () => {
                expect(_.mask.repeat['repeat-x']()).toEqual({ maskRepeat: 'repeat-x' })
        })
        test("mask.repeat['repeat-y']", () => {
                expect(_.mask.repeat['repeat-y']()).toEqual({ maskRepeat: 'repeat-y' })
        })
        test('mask.repeat.space', () => {
                expect(_.mask.repeat.space()).toEqual({ maskRepeat: 'space' })
        })
        test('mask.repeat.round', () => {
                expect(_.mask.repeat.round()).toEqual({ maskRepeat: 'round' })
        })
})

describe('mask-size', () => {
        test('mask.auto', () => {
                expect(_.mask.auto()).toEqual({ maskSize: 'auto' })
        })
        test('mask.cover', () => {
                expect(_.mask.cover()).toEqual({ maskSize: 'cover' })
        })
        test('mask.contain', () => {
                expect(_.mask.contain()).toEqual({ maskSize: 'contain' })
        })
        test('mask.size[4]', () => {
                expect(_.mask.size[4]()).toEqual({ maskSize: 'var(4)' })
        })
})
