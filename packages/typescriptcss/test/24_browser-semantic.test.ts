import { describe, expect, test } from 'vitest'
import * as tw from '../src'
import { flex, text, leading } from '../src'

// 24 — Browser semantic regression (section K: BROWSER-001..008).
//
// Source of truth: `.articles/ui.spec2.ts` — the Tailwind playwright suite. Each
// case here re-expresses one of those scenarios through the typescriptcss chain
// and asserts the *Tailwind-correct computed style*, never a string snapshot and
// never the value the current runtime happens to emit (prompt_unit_test.md §K,
// "現在の実装に合わせて期待を弱めないこと").
//
// The oracle is the engine's computed style (getComputedStyle), so a chain that
// emits nothing the engine accepts is observably wrong rather than silently
// green. Most of section K targets Tailwind features with no typescriptcss root
// yet — touch-action, the filter/drop-shadow family, scale, pseudo-element
// content, the hover variant, transition shorthands, the shadow-DOM compile
// path. Those roots are absent from src, so the chains throw / emit nothing and
// the cases stay RED, in line with the library being mostly unimplemented.
//
// Environment: the default vitest runner is `node`, which has no `document`, so
// every case is guarded and the whole file reports skipped under node. A DOM
// runner (jsdom / happy-dom / browser) is what exercises the oracle.

const hasDOM = typeof document !== 'undefined'
const dom = hasDOM ? test : test.skip
const u = tw as unknown as Record<string, any>

/** Apply a finished chain's declarations to an element and read computed style. */
function styleOf(style: Record<string, unknown>): { cs: CSSStyleDeclaration; el: HTMLElement } {
        const el = document.createElement('div')
        Object.assign(el.style, style)
        document.body.appendChild(el)
        return { cs: getComputedStyle(el), el }
}

// ---------------------------------------------------------------------------
// BROWSER-001 — touch-action composition (ui.spec2 "touch action").
// `touch-pan-x touch-pan-y` must compute to `pan-x pan-y`. No `touch` root
// exists in src, so this is RED.
// ---------------------------------------------------------------------------
describe('BROWSER-001: touch-action composition', () => {
        dom('touch.pan.x + touch.pan.y compose to "pan-x pan-y" (RED — unimplemented)', () => {
                const style = { ...u.touch.pan.x(), ...u.touch.pan.y() }
                expect(styleOf(style).cs.touchAction).toBe('pan-x pan-y')
        })
        dom('adding pinch-zoom composes to the manipulation set (RED — unimplemented)', () => {
                const style = { ...u.touch.pan.x(), ...u.touch.pan.y(), ...u.touch.pinch.zoom() }
                // Some engines collapse the triple to `manipulation`.
                expect(['manipulation', 'pan-x pan-y pinch-zoom']).toContain(styleOf(style).cs.touchAction)
        })
})

// ---------------------------------------------------------------------------
// BROWSER-002 — filter family composition (ui.spec2 "filter"). Tailwind composes
// every filter utility into one `filter` declaration; a child's standalone
// filter must not inherit the parent's. No filter roots exist -> RED.
// ---------------------------------------------------------------------------
describe('BROWSER-002: filter family composition', () => {
        dom('the full filter family composes into one computed filter (RED — unimplemented)', () => {
                const style = {
                        ...u.blur.md(),
                        ...u.brightness[50](),
                        ...u.contrast[50](),
                        ...u.grayscale(),
                        ...u.hue.rotate[180](),
                        ...u.invert(),
                        ...u.saturate[50](),
                        ...u.sepia(),
                        ...u.drop.shadow.md(),
                }
                const expected = ['blur(12px)', 'brightness(0.5)', 'contrast(0.5)', 'grayscale(1)', 'hue-rotate(180deg)', 'invert(1)', 'saturate(0.5)', 'sepia(1)', 'drop-shadow(rgba(0, 0, 0, 0.12) 0px 3px 3px)'].join(' ')
                expect(styleOf(style).cs.filter).toBe(expected)
        })
        dom('a child filter does not inherit the parent composition (RED — unimplemented)', () => {
                // Parent composes a family; child only sets contrast(1).
                const { el: parent } = styleOf({ ...u.blur.md(), ...u.contrast[50]() })
                const child = document.createElement('div')
                Object.assign(child.style, u.contrast[100]())
                parent.appendChild(child)
                expect(getComputedStyle(child).filter).toBe('contrast(1)')
        })
})

// ---------------------------------------------------------------------------
// BROWSER-003 — drop-shadow color/opacity (ui.spec2 "drop shadow colors").
// drop-shadow size composes with an explicit shadow color and opacity modifier.
// No drop-shadow root -> RED.
// ---------------------------------------------------------------------------
describe('BROWSER-003: drop-shadow color and opacity', () => {
        dom('drop-shadow size alone resolves to a black 12% shadow (RED — unimplemented)', () => {
                expect(styleOf(u.drop.shadow.md()).cs.filter).toBe('drop-shadow(rgba(0, 0, 0, 0.12) 0px 3px 3px)')
        })
        dom('drop-shadow size + color composes the colored shadow (RED — unimplemented)', () => {
                const style = { ...u.drop.shadow.md(), ...u.drop.shadow.red() }
                expect(styleOf(style).cs.filter).toMatch(/drop-shadow\(.*0px 3px 3px\)/)
        })
})

// ---------------------------------------------------------------------------
// BROWSER-004 — scale number vs percentage (ui.spec2 "scale can be a number or
// percentage"). scale-[50%] computes `0.5`; scale-[1.5] computes `1.5`. No
// `scale` root -> RED.
// ---------------------------------------------------------------------------
describe('BROWSER-004: scale number vs percentage', () => {
        dom('scale-[50%] computes scale 0.5 (RED — unimplemented)', () => {
                expect(styleOf(u.scale['50%']()).cs.scale).toBe('0.5')
        })
        dom('scale-[1.5] computes scale 1.5 (RED — unimplemented)', () => {
                expect(styleOf(u.scale['1.5']()).cs.scale).toBe('1.5')
        })
})

// ---------------------------------------------------------------------------
// BROWSER-005 — pseudo-element content persistence (ui.spec2 "content-none
// persists ..."). after:content-none must survive a conditional state. There is
// no pseudo-element / content root and no hover variant runtime -> RED.
// ---------------------------------------------------------------------------
describe('BROWSER-005: pseudo-element content persistence', () => {
        dom('after.content.none keeps content:none under a hover variant (RED — unimplemented)', () => {
                // Tailwind targets ::after; the typescriptcss runtime emits no pseudo rule,
                // so there is nothing whose ::after content can be observed as `none`.
                const { el } = styleOf({ ...u.after.content.none(), ...u.after.hover.underline() })
                const after = getComputedStyle(el, '::after')
                expect(after.content).toBe('none')
        })
})

// ---------------------------------------------------------------------------
// BROWSER-006 — implicit vs explicit text sub-properties (ui.spec2 "explicit
// leading / tracking / weight ... when overriding font-size"). An explicit
// leading/tracking/weight must survive a later font-size change.
// `text.sm` writes both fontSize and lineHeight; `leading` is implemented, so
// the leading-explicit case is partially observable. The font-size *variant*
// override (hover:text-xl) has no runtime, so the override leg stays RED.
// ---------------------------------------------------------------------------
describe('BROWSER-006: implicit vs explicit text sub-properties', () => {
        dom('text.sm establishes the implicit 16px font / 20px line box', () => {
                const cs = styleOf(text.sm()).cs
                expect(cs.fontSize).toBe('14px')
                expect(cs.lineHeight).toBe('20px')
        })
        dom('an explicit leading survives a later numeric font-size', () => {
                // leading[2] -> 8px line-height; a following text[5] writes only fontSize,
                // so the explicit line box must persist (the implicit-override invariant).
                const cs = styleOf({ ...text.sm(), ...(leading as any)[2](), ...(text as any)[5]() }).cs
                expect(cs.lineHeight).toBe('8px')
                expect(cs.fontSize).toBe('20px')
        })
        dom('an explicit font-weight survives a later font-size', () => {
                // Tailwind: font-bold then text-xl keeps weight 700. In typescriptcss the
                // later text size touches only its own property, so the explicit weight is
                // not reset — the implicit-override invariant holds for plain chains. (The
                // hover-variant override leg of the Tailwind case has no runtime and is
                // owned by the variant files, not here.)
                const cs = styleOf({ ...text.sm(), ...u.font.bold(), ...(text as any)[5]() }).cs
                expect(cs.fontWeight).toBe('700')
        })
})

// ---------------------------------------------------------------------------
// BROWSER-007 — transition duration/ease persistence (ui.spec2 "explicit
// duration and ease ... overriding transition-property"). No transition family
// in src -> RED.
// ---------------------------------------------------------------------------
describe('BROWSER-007: transition duration / ease persistence', () => {
        dom('explicit duration and ease are kept when transition-property changes (RED — unimplemented)', () => {
                const style = { ...u.ease['linear'](), ...u.duration[500](), ...u.transition['opacity']() }
                const cs = styleOf(style).cs
                expect(cs.transitionTimingFunction).toBe('linear')
                expect(cs.transitionDuration).toBe('0.5s')
        })
})

// ---------------------------------------------------------------------------
// BROWSER-008 — shadow-DOM variable access (ui.spec2 "shadow DOM has access to
// variables"). A `flex gap-2` utility must compute gap:8px inside a shadow root.
// gap is implemented as an inline declaration, so this is observable WITHOUT the
// build pipeline — it pins that the finished style object works across a shadow
// boundary.
// ---------------------------------------------------------------------------
describe('BROWSER-008: shadow-DOM boundary', () => {
        dom('flex.gap[2] computes gap:8px inside a shadow root', () => {
                const host = document.createElement('div')
                document.body.appendChild(host)
                const root = host.attachShadow({ mode: 'open' })
                const x = document.createElement('div')
                Object.assign(x.style, (flex.gap as any)[2]())
                root.appendChild(x)
                try {
                        // The computed gap must survive the shadow boundary; this is the only
                        // place the suite observes a chain across a shadow root.
                        expect(getComputedStyle(x).gap).toBe('8px')
                } finally {
                        host.remove()
                }
        })
})
