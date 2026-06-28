import { describe, expect, test } from 'vitest'
import * as _ from '../src'
// Generated mechanically from docs/12_interactivity/*.mdx — chain() returns a style object.
// Unimplemented utilities return undefined and stay RED until added to src.

describe('accent-color', () => {
        test('accent.inherit', () => {
                expect(_.accent.inherit()).toEqual({ accentColor: 'inherit' })
        })
        test('accent.current', () => {
                expect(_.accent.current()).toEqual({ accentColor: 'currentColor' })
        })
        test('accent.transparent', () => {
                expect(_.accent.transparent()).toEqual({ accentColor: 'transparent' })
        })
        test('accent[4]', () => {
                expect(_.accent[4]()).toEqual({ accentColor: 'var(4)' })
        })
})

describe('appearance', () => {
        test('appearance.none', () => {
                expect(_.appearance.none()).toEqual({ appearance: 'none' })
        })
        test('appearance.auto', () => {
                expect(_.appearance.auto()).toEqual({ appearance: 'auto' })
        })
})

describe('caret-color', () => {
        test('caret.inherit', () => {
                expect(_.caret.inherit()).toEqual({ caretColor: 'inherit' })
        })
        test('caret.current', () => {
                expect(_.caret.current()).toEqual({ caretColor: 'currentColor' })
        })
        test('caret.transparent', () => {
                expect(_.caret.transparent()).toEqual({ caretColor: 'transparent' })
        })
        test('caret[4]', () => {
                expect(_.caret[4]()).toEqual({ caretColor: '4' })
        })
})

describe('color-scheme', () => {
        test('scheme.normal', () => {
                expect(_.scheme.normal()).toEqual({ colorScheme: 'normal' })
        })
        test('scheme.dark', () => {
                expect(_.scheme.dark()).toEqual({ colorScheme: 'dark' })
        })
        test('scheme.light', () => {
                expect(_.scheme.light()).toEqual({ colorScheme: 'light' })
        })
        test('scheme.light.dark', () => {
                expect(_.scheme.light.dark()).toEqual({ colorScheme: 'light dark' })
        })
        test('scheme.only.dark', () => {
                expect(_.scheme.only.dark()).toEqual({ colorScheme: 'only dark' })
        })
        test('scheme.only.light', () => {
                expect(_.scheme.only.light()).toEqual({ colorScheme: 'only light' })
        })
})

describe('cursor', () => {
        test('cursor.auto', () => {
                expect(_.cursor.auto()).toEqual({ cursor: 'auto' })
        })
        test('cursor.default', () => {
                expect(_.cursor.default()).toEqual({ cursor: 'default' })
        })
        test('cursor.pointer', () => {
                expect(_.cursor.pointer()).toEqual({ cursor: 'pointer' })
        })
        test('cursor.wait', () => {
                expect(_.cursor.wait()).toEqual({ cursor: 'wait' })
        })
        test('cursor.text', () => {
                expect(_.cursor.text()).toEqual({ cursor: 'text' })
        })
        test('cursor.move', () => {
                expect(_.cursor.move()).toEqual({ cursor: 'move' })
        })
        test('cursor.help', () => {
                expect(_.cursor.help()).toEqual({ cursor: 'help' })
        })
        test('cursor.not.allowed', () => {
                expect(_.cursor.not.allowed()).toEqual({ cursor: 'not-allowed' })
        })
        test('cursor.none', () => {
                expect(_.cursor.none()).toEqual({ cursor: 'none' })
        })
        test('cursor.context.menu', () => {
                expect(_.cursor.context.menu()).toEqual({ cursor: 'context-menu' })
        })
        test('cursor.progress', () => {
                expect(_.cursor.progress()).toEqual({ cursor: 'progress' })
        })
        test('cursor.cell', () => {
                expect(_.cursor.cell()).toEqual({ cursor: 'cell' })
        })
        test('cursor.crosshair', () => {
                expect(_.cursor.crosshair()).toEqual({ cursor: 'crosshair' })
        })
        test('cursor.vertical.text', () => {
                expect(_.cursor.vertical.text()).toEqual({ cursor: 'vertical-text' })
        })
        test('cursor.alias', () => {
                expect(_.cursor.alias()).toEqual({ cursor: 'alias' })
        })
        test('cursor.copy', () => {
                expect(_.cursor.copy()).toEqual({ cursor: 'copy' })
        })
        test('cursor.no.drop', () => {
                expect(_.cursor.no.drop()).toEqual({ cursor: 'no-drop' })
        })
        test('cursor.grab', () => {
                expect(_.cursor.grab()).toEqual({ cursor: 'grab' })
        })
        test('cursor.grabbing', () => {
                expect(_.cursor.grabbing()).toEqual({ cursor: 'grabbing' })
        })
        test('cursor.all.scroll', () => {
                expect(_.cursor.all.scroll()).toEqual({ cursor: 'all-scroll' })
        })
        test('cursor.col.resize', () => {
                expect(_.cursor.col.resize()).toEqual({ cursor: 'col-resize' })
        })
        test('cursor.row.resize', () => {
                expect(_.cursor.row.resize()).toEqual({ cursor: 'row-resize' })
        })
        test('cursor.n.resize', () => {
                expect(_.cursor.n.resize()).toEqual({ cursor: 'n-resize' })
        })
        test('cursor.e.resize', () => {
                expect(_.cursor.e.resize()).toEqual({ cursor: 'e-resize' })
        })
        test('cursor.s.resize', () => {
                expect(_.cursor.s.resize()).toEqual({ cursor: 's-resize' })
        })
        test('cursor.w.resize', () => {
                expect(_.cursor.w.resize()).toEqual({ cursor: 'w-resize' })
        })
        test('cursor.ne.resize', () => {
                expect(_.cursor.ne.resize()).toEqual({ cursor: 'ne-resize' })
        })
        test('cursor.nw.resize', () => {
                expect(_.cursor.nw.resize()).toEqual({ cursor: 'nw-resize' })
        })
        test('cursor.se.resize', () => {
                expect(_.cursor.se.resize()).toEqual({ cursor: 'se-resize' })
        })
        test('cursor.sw.resize', () => {
                expect(_.cursor.sw.resize()).toEqual({ cursor: 'sw-resize' })
        })
        test('cursor.ew.resize', () => {
                expect(_.cursor.ew.resize()).toEqual({ cursor: 'ew-resize' })
        })
        test('cursor.ns.resize', () => {
                expect(_.cursor.ns.resize()).toEqual({ cursor: 'ns-resize' })
        })
        test('cursor.nesw.resize', () => {
                expect(_.cursor.nesw.resize()).toEqual({ cursor: 'nesw-resize' })
        })
        test('cursor.nwse.resize', () => {
                expect(_.cursor.nwse.resize()).toEqual({ cursor: 'nwse-resize' })
        })
        test('cursor.zoom.in', () => {
                expect(_.cursor.zoom.in()).toEqual({ cursor: 'zoom-in' })
        })
        test('cursor.zoom.out', () => {
                expect(_.cursor.zoom.out()).toEqual({ cursor: 'zoom-out' })
        })
        test('cursor[4]', () => {
                expect(_.cursor[4]()).toEqual({ cursor: 'var(4)' })
        })
})

describe('field-sizing', () => {
        test('field.sizing.fixed', () => {
                expect(_.field.sizing.fixed()).toEqual({ fieldSizing: 'fixed' })
        })
        test('field.sizing.content', () => {
                expect(_.field.sizing.content()).toEqual({ fieldSizing: 'content' })
        })
})

describe('pointer-events', () => {
        test('pointer.events.auto', () => {
                expect(_.pointer.events.auto()).toEqual({ pointerEvents: 'auto' })
        })
        test('pointer.events.none', () => {
                expect(_.pointer.events.none()).toEqual({ pointerEvents: 'none' })
        })
})

describe('resize', () => {
        test('resize.none', () => {
                expect(_.resize.none()).toEqual({ resize: 'none' })
        })
        test('resize', () => {
                expect(_.resize()).toEqual({ resize: 'both' })
        })
        test('resize.y', () => {
                expect(_.resize.y()).toEqual({ resize: 'vertical' })
        })
        test('resize.x', () => {
                expect(_.resize.x()).toEqual({ resize: 'horizontal' })
        })
})

describe('scroll-behavior', () => {
        test('scroll.auto', () => {
                expect(_.scroll.auto()).toEqual({ scrollBehavior: 'auto' })
        })
        test('scroll.smooth', () => {
                expect(_.scroll.smooth()).toEqual({ scrollBehavior: 'smooth' })
        })
})

describe('scrollbar-color', () => {
        test('scrollbar.thumb.inherit', () => {
                expect(_.scrollbar.thumb.inherit()).toEqual({ scrollbarColor: 'inherit' })
        })
        test('scrollbar.thumb.current', () => {
                expect(_.scrollbar.thumb.current()).toEqual({ scrollbarColor: 'currentColor' })
        })
        test('scrollbar.thumb.transparent', () => {
                expect(_.scrollbar.thumb.transparent()).toEqual({ scrollbarColor: 'transparent' })
        })
        test('scrollbar.thumb[4]', () => {
                expect(_.scrollbar.thumb[4]()).toEqual({ scrollbarColor: '4' })
        })
        test('scrollbar.track[4]', () => {
                expect(_.scrollbar.track[4]()).toEqual({ scrollbarColor: '4' })
        })
})

describe('scrollbar-width', () => {
        test('scrollbar.auto', () => {
                expect(_.scrollbar.auto()).toEqual({ scrollbarWidth: 'auto' })
        })
        test('scrollbar.thin', () => {
                expect(_.scrollbar.thin()).toEqual({ scrollbarWidth: 'thin' })
        })
        test('scrollbar.none', () => {
                expect(_.scrollbar.none()).toEqual({ scrollbarWidth: 'none' })
        })
})

describe('scrollbar-gutter', () => {
        test('scrollbar.gutter.auto', () => {
                expect(_.scrollbar.gutter.auto()).toEqual({ scrollbarGutter: 'auto' })
        })
        test('scrollbar.gutter.stable', () => {
                expect(_.scrollbar.gutter.stable()).toEqual({ scrollbarGutter: 'stable' })
        })
        test('scrollbar.gutter.both', () => {
                expect(_.scrollbar.gutter.both()).toEqual({ scrollbarGutter: 'stable both-edges' })
        })
})

describe('scroll-snap-align', () => {
        test('snap.start', () => {
                expect(_.snap.start()).toEqual({ scrollSnapAlign: 'start' })
        })
        test('snap.end', () => {
                expect(_.snap.end()).toEqual({ scrollSnapAlign: 'end' })
        })
        test('snap.center', () => {
                expect(_.snap.center()).toEqual({ scrollSnapAlign: 'center' })
        })
        test('snap.align.none', () => {
                expect(_.snap.align.none()).toEqual({ scrollSnapAlign: 'none' })
        })
})

describe('scroll-snap-stop', () => {
        test('snap.normal', () => {
                expect(_.snap.normal()).toEqual({ scrollSnapStop: 'normal' })
        })
        test('snap.always', () => {
                expect(_.snap.always()).toEqual({ scrollSnapStop: 'always' })
        })
})

describe('scroll-snap-type', () => {
        test('snap.none', () => {
                expect(_.snap.none()).toEqual({ scrollSnapType: 'none' })
        })
})

describe('touch-action', () => {
        test('touch.auto', () => {
                expect(_.touch.auto()).toEqual({ touchAction: 'auto' })
        })
        test('touch.none', () => {
                expect(_.touch.none()).toEqual({ touchAction: 'none' })
        })
        test('touch.pan.x', () => {
                expect(_.touch.pan.x()).toEqual({ touchAction: 'pan-x' })
        })
        test('touch.pan.left', () => {
                expect(_.touch.pan.left()).toEqual({ touchAction: 'pan-left' })
        })
        test('touch.pan.right', () => {
                expect(_.touch.pan.right()).toEqual({ touchAction: 'pan-right' })
        })
        test('touch.pan.y', () => {
                expect(_.touch.pan.y()).toEqual({ touchAction: 'pan-y' })
        })
        test('touch.pan.up', () => {
                expect(_.touch.pan.up()).toEqual({ touchAction: 'pan-up' })
        })
        test('touch.pan.down', () => {
                expect(_.touch.pan.down()).toEqual({ touchAction: 'pan-down' })
        })
        test('touch.pinch.zoom', () => {
                expect(_.touch.pinch.zoom()).toEqual({ touchAction: 'pinch-zoom' })
        })
        test('touch.manipulation', () => {
                expect(_.touch.manipulation()).toEqual({ touchAction: 'manipulation' })
        })
})

describe('user-select', () => {
        test('select.none', () => {
                expect(_.select.none()).toEqual({ userSelect: 'none' })
        })
        test('select.text', () => {
                expect(_.select.text()).toEqual({ userSelect: 'text' })
        })
        test('select.all', () => {
                expect(_.select.all()).toEqual({ userSelect: 'all' })
        })
        test('select.auto', () => {
                expect(_.select.auto()).toEqual({ userSelect: 'auto' })
        })
})

describe('will-change', () => {
        test('will.change.auto', () => {
                expect(_.will.change.auto()).toEqual({ willChange: 'auto' })
        })
        test('will.change.scroll', () => {
                expect(_.will.change.scroll()).toEqual({ willChange: 'scroll-position' })
        })
        test('will.change.contents', () => {
                expect(_.will.change.contents()).toEqual({ willChange: 'contents' })
        })
        test('will.change.transform', () => {
                expect(_.will.change.transform()).toEqual({ willChange: 'transform' })
        })
        test('will.change[4]', () => {
                expect(_.will.change[4]()).toEqual({ willChange: 'var(4)' })
        })
})
