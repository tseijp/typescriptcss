import { describe, expect, test } from 'vitest'
import * as _ from '../src'
// Generated mechanically from docs/04_typography/*.mdx — chain() returns a style object.
// Unimplemented utilities return undefined and stay RED until added to src.

describe('font-family', () => {
        test('font.sans', () => {
                expect(_.font.sans()).toEqual({ fontFamily: "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'" })
        })
        test('font.serif', () => {
                expect(_.font.serif()).toEqual({ fontFamily: "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif" })
        })
        test('font.mono', () => {
                expect(_.font.mono()).toEqual({ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" })
        })
        test('font[4]', () => {
                expect(_.font[4]()).toEqual({ fontFamily: 'var(4)' })
        })
})

describe('font-size', () => {
        test('text.base', () => {
                expect(_.text.base()).toEqual({ fontSize: '1rem (16px)' })
        })
        test('text[4]', () => {
                expect(_.text[4]()).toEqual({ fontSize: 'var(4)' })
        })
})

describe('font-smoothing', () => {
        test('antialiased', () => {
                expect(_.antialiased()).toEqual({ WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' })
        })
        test('subpixel.antialiased', () => {
                expect(_.subpixel.antialiased()).toEqual({ WebkitFontSmoothing: 'auto', MozOsxFontSmoothing: 'auto' })
        })
})

describe('font-style', () => {
        test('italic', () => {
                expect(_.italic()).toEqual({ fontStyle: 'italic' })
        })
        test('normal', () => {
                expect(_.normal()).toEqual({ fontStyle: 'normal' })
        })
})

describe('font-weight', () => {
        test("font['100']", () => {
                expect(_.font['100']()).toEqual({ fontWeight: '100' })
        })
        test("font['200']", () => {
                expect(_.font['200']()).toEqual({ fontWeight: '200' })
        })
        test("font['300']", () => {
                expect(_.font['300']()).toEqual({ fontWeight: '300' })
        })
        test("font['400']", () => {
                expect(_.font['400']()).toEqual({ fontWeight: '400' })
        })
        test("font['500']", () => {
                expect(_.font['500']()).toEqual({ fontWeight: '500' })
        })
        test("font['600']", () => {
                expect(_.font['600']()).toEqual({ fontWeight: '600' })
        })
        test("font['700']", () => {
                expect(_.font['700']()).toEqual({ fontWeight: '700' })
        })
        test("font['800']", () => {
                expect(_.font['800']()).toEqual({ fontWeight: '800' })
        })
        test("font['900']", () => {
                expect(_.font['900']()).toEqual({ fontWeight: '900' })
        })
})

describe('font-stretch', () => {
        test("font.stretch['ultra-condensed']", () => {
                expect(_.font.stretch['ultra-condensed']()).toEqual({ fontStretch: 'ultra-condensed' })
        })
        test("font.stretch['extra-condensed']", () => {
                expect(_.font.stretch['extra-condensed']()).toEqual({ fontStretch: 'extra-condensed' })
        })
        test('font.stretch.condensed', () => {
                expect(_.font.stretch.condensed()).toEqual({ fontStretch: 'condensed' })
        })
        test("font.stretch['semi-condensed']", () => {
                expect(_.font.stretch['semi-condensed']()).toEqual({ fontStretch: 'semi-condensed' })
        })
        test('font.stretch.normal', () => {
                expect(_.font.stretch.normal()).toEqual({ fontStretch: 'normal' })
        })
        test("font.stretch['semi-expanded']", () => {
                expect(_.font.stretch['semi-expanded']()).toEqual({ fontStretch: 'semi-expanded' })
        })
        test('font.stretch.expanded', () => {
                expect(_.font.stretch.expanded()).toEqual({ fontStretch: 'expanded' })
        })
        test("font.stretch['extra-expanded']", () => {
                expect(_.font.stretch['extra-expanded']()).toEqual({ fontStretch: 'extra-expanded' })
        })
        test("font.stretch['ultra-expanded']", () => {
                expect(_.font.stretch['ultra-expanded']()).toEqual({ fontStretch: 'ultra-expanded' })
        })
        test('font.stretch[4]', () => {
                expect(_.font.stretch[4]()).toEqual({ fontStretch: '50%' })
        })
})

describe('font-variant-numeric', () => {
        test('ordinal', () => {
                expect(_.ordinal()).toEqual({ fontVariantNumeric: 'ordinal' })
        })
        test('slashedZero', () => {
                expect(_.slashedZero()).toEqual({ fontVariantNumeric: 'slashed-zero' })
        })
        test('liningNums', () => {
                expect(_.liningNums()).toEqual({ fontVariantNumeric: 'lining-nums' })
        })
        test('oldstyleNums', () => {
                expect(_.oldstyleNums()).toEqual({ fontVariantNumeric: 'oldstyle-nums' })
        })
        test('proportionalNums', () => {
                expect(_.proportionalNums()).toEqual({ fontVariantNumeric: 'proportional-nums' })
        })
        test('tabularNums', () => {
                expect(_.tabularNums()).toEqual({ fontVariantNumeric: 'tabular-nums' })
        })
        test('diagonalFractions', () => {
                expect(_.diagonalFractions()).toEqual({ fontVariantNumeric: 'diagonal-fractions' })
        })
        test('stackedFractions', () => {
                expect(_.stackedFractions()).toEqual({ fontVariantNumeric: 'stacked-fractions' })
        })
})

describe('font-feature-settings', () => {
        test('font.features[4]', () => {
                expect(_.font.features[4]()).toEqual({ fontFeatureSettings: '4' })
        })
})

describe('letter-spacing', () => {
        test('tracking.tighter', () => {
                expect(_.tracking.tighter()).toEqual({ letterSpacing: '-0.05em' })
        })
        test('tracking.tight', () => {
                expect(_.tracking.tight()).toEqual({ letterSpacing: '-0.025em' })
        })
        test('tracking.normal', () => {
                expect(_.tracking.normal()).toEqual({ letterSpacing: '0em' })
        })
        test('tracking.wide', () => {
                expect(_.tracking.wide()).toEqual({ letterSpacing: '0.025em' })
        })
        test('tracking.wider', () => {
                expect(_.tracking.wider()).toEqual({ letterSpacing: '0.05em' })
        })
        test('tracking.widest', () => {
                expect(_.tracking.widest()).toEqual({ letterSpacing: '0.1em' })
        })
        test('tracking[4]', () => {
                expect(_.tracking[4]()).toEqual({ letterSpacing: 'var(4)' })
        })
})

describe('line-clamp', () => {
        test('line.clamp[4]', () => {
                expect(_.line.clamp[4]()).toEqual({ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '4' })
        })
        test('line.clamp.none', () => {
                expect(_.line.clamp.none()).toEqual({ overflow: 'visible', display: 'block', WebkitBoxOrient: 'horizontal', WebkitLineClamp: 'unset' })
        })
})

describe('line-height', () => {
        test("leading['1']", () => {
                expect(_.leading['1']()).toEqual({ lineHeight: '1' })
        })
})

describe('list-style-image', () => {
        test('list.image[4]', () => {
                expect(_.list.image[4]()).toEqual({ listStyleImage: '4' })
        })
        test('list.image.none', () => {
                expect(_.list.image.none()).toEqual({ listStyleImage: 'none' })
        })
})

describe('list-style-position', () => {
        test('list.inside', () => {
                expect(_.list.inside()).toEqual({ listStylePosition: 'inside' })
        })
        test('list.outside', () => {
                expect(_.list.outside()).toEqual({ listStylePosition: 'outside' })
        })
})

describe('list-style-type', () => {
        test('list.disc', () => {
                expect(_.list.disc()).toEqual({ listStyleType: 'disc' })
        })
        test('list.decimal', () => {
                expect(_.list.decimal()).toEqual({ listStyleType: 'decimal' })
        })
        test('list.none', () => {
                expect(_.list.none()).toEqual({ listStyleType: 'none' })
        })
        test('list[4]', () => {
                expect(_.list[4]()).toEqual({ listStyleType: 'var(4)' })
        })
})

describe('text-align', () => {
        test('text.left', () => {
                expect(_.text.left()).toEqual({ textAlign: 'left' })
        })
        test('text.center', () => {
                expect(_.text.center()).toEqual({ textAlign: 'center' })
        })
        test('text.right', () => {
                expect(_.text.right()).toEqual({ textAlign: 'right' })
        })
        test('text.justify', () => {
                expect(_.text.justify()).toEqual({ textAlign: 'justify' })
        })
        test('text.start', () => {
                expect(_.text.start()).toEqual({ textAlign: 'start' })
        })
        test('text.end', () => {
                expect(_.text.end()).toEqual({ textAlign: 'end' })
        })
})

describe('color', () => {
        test('color.inherit', () => {
                expect(_.color.inherit()).toEqual({ color: 'inherit' })
        })
        test('color.currentColor', () => {
                expect(_.color.currentColor()).toEqual({ color: 'currentColor' })
        })
        test('color.transparent', () => {
                expect(_.color.transparent()).toEqual({ color: 'transparent' })
        })
})

describe('text-decoration-line', () => {
        test('underline', () => {
                expect(_.underline()).toEqual({ textDecorationLine: 'underline' })
        })
        test('overline', () => {
                expect(_.overline()).toEqual({ textDecorationLine: 'overline' })
        })
        test('lineThrough', () => {
                expect(_.lineThrough()).toEqual({ textDecorationLine: 'line-through' })
        })
        test('none', () => {
                expect(_.none()).toEqual({ textDecorationLine: 'none' })
        })
})

describe('text-decoration-color', () => {
        test('decoration.inherit', () => {
                expect(_.decoration.inherit()).toEqual({ textDecorationColor: 'inherit' })
        })
        test('decoration.currentColor', () => {
                expect(_.decoration.currentColor()).toEqual({ textDecorationColor: 'currentColor' })
        })
        test('decoration.transparent', () => {
                expect(_.decoration.transparent()).toEqual({ textDecorationColor: 'transparent' })
        })
        test('decoration[4]', () => {
                expect(_.decoration[4]()).toEqual({ textDecorationColor: 'var(4)' })
        })
})

describe('text-decoration-style', () => {
        test('decoration.solid', () => {
                expect(_.decoration.solid()).toEqual({ textDecorationStyle: 'solid' })
        })
        test('decoration.double', () => {
                expect(_.decoration.double()).toEqual({ textDecorationStyle: 'double' })
        })
        test('decoration.dotted', () => {
                expect(_.decoration.dotted()).toEqual({ textDecorationStyle: 'dotted' })
        })
        test('decoration.dashed', () => {
                expect(_.decoration.dashed()).toEqual({ textDecorationStyle: 'dashed' })
        })
        test('decoration.wavy', () => {
                expect(_.decoration.wavy()).toEqual({ textDecorationStyle: 'wavy' })
        })
})

describe('text-decoration-thickness', () => {
        test("decoration['from-font']", () => {
                expect(_.decoration['from-font']()).toEqual({ textDecorationThickness: 'from-font' })
        })
        test('decoration.auto', () => {
                expect(_.decoration.auto()).toEqual({ textDecorationThickness: 'auto' })
        })
})

describe('text-underline-offset', () => {
        test('underline.offset[4]', () => {
                expect(_.underline.offset[4]()).toEqual({ textUnderlineOffset: '4px' })
        })
        test('underline.offset.auto', () => {
                expect(_.underline.offset.auto()).toEqual({ textUnderlineOffset: 'auto' })
        })
})

describe('text-transform', () => {
        test('uppercase', () => {
                expect(_.uppercase()).toEqual({ textTransform: 'uppercase' })
        })
        test('lowercase', () => {
                expect(_.lowercase()).toEqual({ textTransform: 'lowercase' })
        })
        test('capitalize', () => {
                expect(_.capitalize()).toEqual({ textTransform: 'capitalize' })
        })
})

describe('text-overflow', () => {
        test('truncate', () => {
                expect(_.truncate()).toEqual({ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' })
        })
        test('text.ellipsis', () => {
                expect(_.text.ellipsis()).toEqual({ textOverflow: 'ellipsis' })
        })
        test('text.clip', () => {
                expect(_.text.clip()).toEqual({ textOverflow: 'clip' })
        })
})

describe('text-wrap', () => {
        test('text.wrap', () => {
                expect(_.text.wrap()).toEqual({ textWrap: 'wrap' })
        })
        test('text.nowrap', () => {
                expect(_.text.nowrap()).toEqual({ textWrap: 'nowrap' })
        })
        test('text.balance', () => {
                expect(_.text.balance()).toEqual({ textWrap: 'balance' })
        })
        test('text.pretty', () => {
                expect(_.text.pretty()).toEqual({ textWrap: 'pretty' })
        })
})

describe('text-indent', () => {
        test("indent['1px']", () => {
                expect(_.indent['1px']()).toEqual({ textIndent: '1px' })
        })
        test("indent['-1px']", () => {
                expect(_.indent['-1px']()).toEqual({ textIndent: '-1px' })
        })
})

describe('tab-size', () => {
        test('tab[4]', () => {
                expect(_.tab[4]()).toEqual({ tabSize: '4' })
        })
})

describe('vertical-align', () => {
        test('align.baseline', () => {
                expect(_.align.baseline()).toEqual({ verticalAlign: 'baseline' })
        })
        test('align.top', () => {
                expect(_.align.top()).toEqual({ verticalAlign: 'top' })
        })
        test('align.middle', () => {
                expect(_.align.middle()).toEqual({ verticalAlign: 'middle' })
        })
        test('align.bottom', () => {
                expect(_.align.bottom()).toEqual({ verticalAlign: 'bottom' })
        })
        test("align['text-top']", () => {
                expect(_.align['text-top']()).toEqual({ verticalAlign: 'text-top' })
        })
        test("align['text-bottom']", () => {
                expect(_.align['text-bottom']()).toEqual({ verticalAlign: 'text-bottom' })
        })
        test('align.sub', () => {
                expect(_.align.sub()).toEqual({ verticalAlign: 'sub' })
        })
        test('align.super', () => {
                expect(_.align.super()).toEqual({ verticalAlign: 'super' })
        })
        test('align[4]', () => {
                expect(_.align[4]()).toEqual({ verticalAlign: 'var(4)' })
        })
})

describe('white-space', () => {
        test('whitespace.normal', () => {
                expect(_.whitespace.normal()).toEqual({ whiteSpace: 'normal' })
        })
        test('whitespace.nowrap', () => {
                expect(_.whitespace.nowrap()).toEqual({ whiteSpace: 'nowrap' })
        })
        test('whitespace.pre', () => {
                expect(_.whitespace.pre()).toEqual({ whiteSpace: 'pre' })
        })
        test("whitespace['pre-line']", () => {
                expect(_.whitespace['pre-line']()).toEqual({ whiteSpace: 'pre-line' })
        })
        test("whitespace['pre-wrap']", () => {
                expect(_.whitespace['pre-wrap']()).toEqual({ whiteSpace: 'pre-wrap' })
        })
        test("whitespace['break-spaces']", () => {
                expect(_.whitespace['break-spaces']()).toEqual({ whiteSpace: 'break-spaces' })
        })
})

describe('word-break', () => {
        test('break.normal', () => {
                expect(_.break.normal()).toEqual({ wordBreak: 'normal' })
        })
        test("break['break-all']", () => {
                expect(_.break['break-all']()).toEqual({ wordBreak: 'break-all' })
        })
        test("break['keep-all']", () => {
                expect(_.break['keep-all']()).toEqual({ wordBreak: 'keep-all' })
        })
})

describe('overflow-wrap', () => {
        test("wrap['break-word']", () => {
                expect(_.wrap['break-word']()).toEqual({ overflowWrap: 'break-word' })
        })
        test('wrap.anywhere', () => {
                expect(_.wrap.anywhere()).toEqual({ overflowWrap: 'anywhere' })
        })
        test('wrap.normal', () => {
                expect(_.wrap.normal()).toEqual({ overflowWrap: 'normal' })
        })
})

describe('hyphens', () => {
        test('hyphens.none', () => {
                expect(_.hyphens.none()).toEqual({ hyphens: 'none' })
        })
        test('hyphens.manual', () => {
                expect(_.hyphens.manual()).toEqual({ hyphens: 'manual' })
        })
        test('hyphens.auto', () => {
                expect(_.hyphens.auto()).toEqual({ hyphens: 'auto' })
        })
})

describe('content', () => {
        test('content[4]', () => {
                expect(_.content[4]()).toEqual({ content: '4' })
        })
        test('content.none', () => {
                expect(_.content.none()).toEqual({ content: 'none' })
        })
})
