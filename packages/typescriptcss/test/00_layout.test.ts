import { describe, expect, test } from 'vitest'
import * as _ from '../src'
// Generated mechanically from docs/00_layout/*.mdx — chain() returns a style object.
// Unimplemented utilities return undefined and stay RED until added to src.

describe('aspect-ratio', () => {
        test('aspect[4]', () => {
                expect(_.aspect[4]()).toEqual({ aspectRatio: '16 / 9' })
        })
        test("aspect['1 / 1']", () => {
                expect(_.aspect['1 / 1']()).toEqual({ aspectRatio: '1 / 1' })
        })
        test('aspect.video', () => {
                expect(_.aspect.video()).toEqual({ aspectRatio: '16 / 9' })
        })
        test('aspect.auto', () => {
                expect(_.aspect.auto()).toEqual({ aspectRatio: 'auto' })
        })
})

describe('columns', () => {
        test('columns[4]', () => {
                expect(_.columns[4]()).toEqual({ columns: '4' })
        })
        test('columns.auto', () => {
                expect(_.columns.auto()).toEqual({ columns: 'auto' })
        })
})

describe('break-after', () => {
        test('break.after.auto', () => {
                expect(_.break.after.auto()).toEqual({ breakAfter: 'auto' })
        })
        test('break.after.avoid', () => {
                expect(_.break.after.avoid()).toEqual({ breakAfter: 'avoid' })
        })
        test('break.after.all', () => {
                expect(_.break.after.all()).toEqual({ breakAfter: 'all' })
        })
        test("break.after['avoid-page']", () => {
                expect(_.break.after['avoid-page']()).toEqual({ breakAfter: 'avoid-page' })
        })
        test('break.after.page', () => {
                expect(_.break.after.page()).toEqual({ breakAfter: 'page' })
        })
        test('break.after.left', () => {
                expect(_.break.after.left()).toEqual({ breakAfter: 'left' })
        })
        test('break.after.right', () => {
                expect(_.break.after.right()).toEqual({ breakAfter: 'right' })
        })
        test('break.after.column', () => {
                expect(_.break.after.column()).toEqual({ breakAfter: 'column' })
        })
})

describe('break-before', () => {
        test('break.before.auto', () => {
                expect(_.break.before.auto()).toEqual({ breakBefore: 'auto' })
        })
        test('break.before.avoid', () => {
                expect(_.break.before.avoid()).toEqual({ breakBefore: 'avoid' })
        })
        test('break.before.all', () => {
                expect(_.break.before.all()).toEqual({ breakBefore: 'all' })
        })
        test("break.before['avoid-page']", () => {
                expect(_.break.before['avoid-page']()).toEqual({ breakBefore: 'avoid-page' })
        })
        test('break.before.page', () => {
                expect(_.break.before.page()).toEqual({ breakBefore: 'page' })
        })
        test('break.before.left', () => {
                expect(_.break.before.left()).toEqual({ breakBefore: 'left' })
        })
        test('break.before.right', () => {
                expect(_.break.before.right()).toEqual({ breakBefore: 'right' })
        })
        test('break.before.column', () => {
                expect(_.break.before.column()).toEqual({ breakBefore: 'column' })
        })
})

describe('break-inside', () => {
        test('break.inside.auto', () => {
                expect(_.break.inside.auto()).toEqual({ breakInside: 'auto' })
        })
        test('break.inside.avoid', () => {
                expect(_.break.inside.avoid()).toEqual({ breakInside: 'avoid' })
        })
        test("break.inside['avoid-page']", () => {
                expect(_.break.inside['avoid-page']()).toEqual({ breakInside: 'avoid-page' })
        })
        test("break.inside['avoid-column']", () => {
                expect(_.break.inside['avoid-column']()).toEqual({ breakInside: 'avoid-column' })
        })
})

describe('box-decoration-break', () => {
        test('box.decoration.clone', () => {
                expect(_.box.decoration.clone()).toEqual({ boxDecorationBreak: 'clone' })
        })
        test('box.decoration.slice', () => {
                expect(_.box.decoration.slice()).toEqual({ boxDecorationBreak: 'slice' })
        })
})

describe('box-sizing', () => {
        test("box['border-box']", () => {
                expect(_.box['border-box']()).toEqual({ boxSizing: 'border-box' })
        })
        test("box['content-box']", () => {
                expect(_.box['content-box']()).toEqual({ boxSizing: 'content-box' })
        })
})

describe('display', () => {
        test('display.inline', () => {
                expect(_.display.inline()).toEqual({ display: 'inline' })
        })
        test('display.block', () => {
                expect(_.display.block()).toEqual({ display: 'block' })
        })
        test("display['inline-block']", () => {
                expect(_.display['inline-block']()).toEqual({ display: 'inline-block' })
        })
        test("display['flow-root']", () => {
                expect(_.display['flow-root']()).toEqual({ display: 'flow-root' })
        })
        test('display.flex', () => {
                expect(_.display.flex()).toEqual({ display: 'flex' })
        })
        test("display['inline-flex']", () => {
                expect(_.display['inline-flex']()).toEqual({ display: 'inline-flex' })
        })
        test('display.grid', () => {
                expect(_.display.grid()).toEqual({ display: 'grid' })
        })
        test("display['inline-grid']", () => {
                expect(_.display['inline-grid']()).toEqual({ display: 'inline-grid' })
        })
        test('display.contents', () => {
                expect(_.display.contents()).toEqual({ display: 'contents' })
        })
        test('display.table', () => {
                expect(_.display.table()).toEqual({ display: 'table' })
        })
        test("display['inline-table']", () => {
                expect(_.display['inline-table']()).toEqual({ display: 'inline-table' })
        })
        test("display['table-caption']", () => {
                expect(_.display['table-caption']()).toEqual({ display: 'table-caption' })
        })
        test("display['table-cell']", () => {
                expect(_.display['table-cell']()).toEqual({ display: 'table-cell' })
        })
        test("display['table-column']", () => {
                expect(_.display['table-column']()).toEqual({ display: 'table-column' })
        })
        test("display['table-column-group']", () => {
                expect(_.display['table-column-group']()).toEqual({ display: 'table-column-group' })
        })
        test("display['table-footer-group']", () => {
                expect(_.display['table-footer-group']()).toEqual({ display: 'table-footer-group' })
        })
        test("display['table-header-group']", () => {
                expect(_.display['table-header-group']()).toEqual({ display: 'table-header-group' })
        })
        test("display['table-row-group']", () => {
                expect(_.display['table-row-group']()).toEqual({ display: 'table-row-group' })
        })
        test("display['table-row']", () => {
                expect(_.display['table-row']()).toEqual({ display: 'table-row' })
        })
        test("display['list-item']", () => {
                expect(_.display['list-item']()).toEqual({ display: 'list-item' })
        })
        test('display.none', () => {
                expect(_.display.none()).toEqual({ display: 'none' })
        })
        test('sr.only', () => {
                expect(_.sr.only()).toEqual({ position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px', overflow: 'hidden', clipPath: 'inset(50%)', whiteSpace: 'nowrap', borderWidth: '0' })
        })
        test('not.sr.only', () => {
                expect(_.not.sr.only()).toEqual({ position: 'static', width: 'auto', height: 'auto', padding: '0', margin: '0', overflow: 'visible', clipPath: 'none', whiteSpace: 'normal' })
        })
})

describe('float', () => {
        test('float.right', () => {
                expect(_.float.right()).toEqual({ float: 'right' })
        })
        test('float.left', () => {
                expect(_.float.left()).toEqual({ float: 'left' })
        })
        test("float['inline-start']", () => {
                expect(_.float['inline-start']()).toEqual({ float: 'inline-start' })
        })
        test("float['inline-end']", () => {
                expect(_.float['inline-end']()).toEqual({ float: 'inline-end' })
        })
        test('float.none', () => {
                expect(_.float.none()).toEqual({ float: 'none' })
        })
})

describe('clear', () => {
        test('clear.left', () => {
                expect(_.clear.left()).toEqual({ clear: 'left' })
        })
        test('clear.right', () => {
                expect(_.clear.right()).toEqual({ clear: 'right' })
        })
        test('clear.both', () => {
                expect(_.clear.both()).toEqual({ clear: 'both' })
        })
        test("clear['inline-start']", () => {
                expect(_.clear['inline-start']()).toEqual({ clear: 'inline-start' })
        })
        test("clear['inline-end']", () => {
                expect(_.clear['inline-end']()).toEqual({ clear: 'inline-end' })
        })
        test('clear.none', () => {
                expect(_.clear.none()).toEqual({ clear: 'none' })
        })
})

describe('isolation', () => {
        test('isolation.isolate', () => {
                expect(_.isolation.isolate()).toEqual({ isolation: 'isolate' })
        })
        test('isolation.auto', () => {
                expect(_.isolation.auto()).toEqual({ isolation: 'auto' })
        })
})

describe('object-fit', () => {
        test('object.contain', () => {
                expect(_.object.contain()).toEqual({ objectFit: 'contain' })
        })
        test('object.cover', () => {
                expect(_.object.cover()).toEqual({ objectFit: 'cover' })
        })
        test('object.fill', () => {
                expect(_.object.fill()).toEqual({ objectFit: 'fill' })
        })
        test('object.none', () => {
                expect(_.object.none()).toEqual({ objectFit: 'none' })
        })
        test("object['scale-down']", () => {
                expect(_.object['scale-down']()).toEqual({ objectFit: 'scale-down' })
        })
})

describe('object-position', () => {
        test("object['top left']", () => {
                expect(_.object['top left']()).toEqual({ objectPosition: 'top left' })
        })
        test('object.top', () => {
                expect(_.object.top()).toEqual({ objectPosition: 'top' })
        })
        test("object['top right']", () => {
                expect(_.object['top right']()).toEqual({ objectPosition: 'top right' })
        })
        test('object.left', () => {
                expect(_.object.left()).toEqual({ objectPosition: 'left' })
        })
        test('object.center', () => {
                expect(_.object.center()).toEqual({ objectPosition: 'center' })
        })
        test('object.right', () => {
                expect(_.object.right()).toEqual({ objectPosition: 'right' })
        })
        test("object['bottom left']", () => {
                expect(_.object['bottom left']()).toEqual({ objectPosition: 'bottom left' })
        })
        test('object.bottom', () => {
                expect(_.object.bottom()).toEqual({ objectPosition: 'bottom' })
        })
        test("object['bottom right']", () => {
                expect(_.object['bottom right']()).toEqual({ objectPosition: 'bottom right' })
        })
        test('object[4]', () => {
                expect(_.object[4]()).toEqual({ objectPosition: '4' })
        })
})

describe('overflow', () => {
        test('overflow.auto', () => {
                expect(_.overflow.auto()).toEqual({ overflow: 'auto' })
        })
        test('overflow.hidden', () => {
                expect(_.overflow.hidden()).toEqual({ overflow: 'hidden' })
        })
        test('overflow.clip', () => {
                expect(_.overflow.clip()).toEqual({ overflow: 'clip' })
        })
        test('overflow.visible', () => {
                expect(_.overflow.visible()).toEqual({ overflow: 'visible' })
        })
        test('overflow.scroll', () => {
                expect(_.overflow.scroll()).toEqual({ overflow: 'scroll' })
        })
        test('overflow.x.auto', () => {
                expect(_.overflow.x.auto()).toEqual({ overflowX: 'auto' })
        })
        test('overflow.y.auto', () => {
                expect(_.overflow.y.auto()).toEqual({ overflowY: 'auto' })
        })
        test('overflow.x.hidden', () => {
                expect(_.overflow.x.hidden()).toEqual({ overflowX: 'hidden' })
        })
        test('overflow.y.hidden', () => {
                expect(_.overflow.y.hidden()).toEqual({ overflowY: 'hidden' })
        })
        test('overflow.x.clip', () => {
                expect(_.overflow.x.clip()).toEqual({ overflowX: 'clip' })
        })
        test('overflow.y.clip', () => {
                expect(_.overflow.y.clip()).toEqual({ overflowY: 'clip' })
        })
        test('overflow.x.visible', () => {
                expect(_.overflow.x.visible()).toEqual({ overflowX: 'visible' })
        })
        test('overflow.y.visible', () => {
                expect(_.overflow.y.visible()).toEqual({ overflowY: 'visible' })
        })
        test('overflow.x.scroll', () => {
                expect(_.overflow.x.scroll()).toEqual({ overflowX: 'scroll' })
        })
        test('overflow.y.scroll', () => {
                expect(_.overflow.y.scroll()).toEqual({ overflowY: 'scroll' })
        })
})

describe('overscroll-behavior', () => {
        test('overscroll.auto', () => {
                expect(_.overscroll.auto()).toEqual({ overscrollBehavior: 'auto' })
        })
        test('overscroll.contain', () => {
                expect(_.overscroll.contain()).toEqual({ overscrollBehavior: 'contain' })
        })
        test('overscroll.none', () => {
                expect(_.overscroll.none()).toEqual({ overscrollBehavior: 'none' })
        })
        test('overscroll.x.auto', () => {
                expect(_.overscroll.x.auto()).toEqual({ overscrollBehaviorX: 'auto' })
        })
        test('overscroll.x.contain', () => {
                expect(_.overscroll.x.contain()).toEqual({ overscrollBehaviorX: 'contain' })
        })
        test('overscroll.x.none', () => {
                expect(_.overscroll.x.none()).toEqual({ overscrollBehaviorX: 'none' })
        })
        test('overscroll.y.auto', () => {
                expect(_.overscroll.y.auto()).toEqual({ overscrollBehaviorY: 'auto' })
        })
        test('overscroll.y.contain', () => {
                expect(_.overscroll.y.contain()).toEqual({ overscrollBehaviorY: 'contain' })
        })
        test('overscroll.y.none', () => {
                expect(_.overscroll.y.none()).toEqual({ overscrollBehaviorY: 'none' })
        })
})

describe('position', () => {
        test('position.static', () => {
                expect(_.position.static()).toEqual({ position: 'static' })
        })
        test('position.fixed', () => {
                expect(_.position.fixed()).toEqual({ position: 'fixed' })
        })
        test('position.absolute', () => {
                expect(_.position.absolute()).toEqual({ position: 'absolute' })
        })
        test('position.relative', () => {
                expect(_.position.relative()).toEqual({ position: 'relative' })
        })
        test('position.sticky', () => {
                expect(_.position.sticky()).toEqual({ position: 'sticky' })
        })
})

describe('top / right / bottom / left', () => {
        test("inset['1px']", () => {
                expect(_.inset['1px']()).toEqual({ inset: '1px' })
        })
        test("inset['-1px']", () => {
                expect(_.inset['-1px']()).toEqual({ inset: '-1px' })
        })
        test("inset['100%']", () => {
                expect(_.inset['100%']()).toEqual({ inset: '100%' })
        })
        test("inset['-100%']", () => {
                expect(_.inset['-100%']()).toEqual({ inset: '-100%' })
        })
        test('inset.auto', () => {
                expect(_.inset.auto()).toEqual({ inset: 'auto' })
        })
        test("inset.x['1px']", () => {
                expect(_.inset.x['1px']()).toEqual({ insetInline: '1px' })
        })
        test("inset.x['-1px']", () => {
                expect(_.inset.x['-1px']()).toEqual({ insetInline: '-1px' })
        })
        test("inset.x['100%']", () => {
                expect(_.inset.x['100%']()).toEqual({ insetInline: '100%' })
        })
        test("inset.x['-100%']", () => {
                expect(_.inset.x['-100%']()).toEqual({ insetInline: '-100%' })
        })
        test('inset.x.auto', () => {
                expect(_.inset.x.auto()).toEqual({ insetInline: 'auto' })
        })
        test("inset.y['1px']", () => {
                expect(_.inset.y['1px']()).toEqual({ insetBlock: '1px' })
        })
        test("inset.y['-1px']", () => {
                expect(_.inset.y['-1px']()).toEqual({ insetBlock: '-1px' })
        })
        test("inset.y['100%']", () => {
                expect(_.inset.y['100%']()).toEqual({ insetBlock: '100%' })
        })
        test("inset.y['-100%']", () => {
                expect(_.inset.y['-100%']()).toEqual({ insetBlock: '-100%' })
        })
        test('inset.y.auto', () => {
                expect(_.inset.y.auto()).toEqual({ insetBlock: 'auto' })
        })
        test("start['1px']", () => {
                expect(_.start['1px']()).toEqual({ insetInlineStart: '1px' })
        })
        test("start['-1px']", () => {
                expect(_.start['-1px']()).toEqual({ insetInlineStart: '-1px' })
        })
        test("start['100%']", () => {
                expect(_.start['100%']()).toEqual({ insetInlineStart: '100%' })
        })
        test("start['-100%']", () => {
                expect(_.start['-100%']()).toEqual({ insetInlineStart: '-100%' })
        })
        test('start.auto', () => {
                expect(_.start.auto()).toEqual({ insetInlineStart: 'auto' })
        })
        test("end['1px']", () => {
                expect(_.end['1px']()).toEqual({ insetInlineEnd: '1px' })
        })
        test("end['-1px']", () => {
                expect(_.end['-1px']()).toEqual({ insetInlineEnd: '-1px' })
        })
        test("end['100%']", () => {
                expect(_.end['100%']()).toEqual({ insetInlineEnd: '100%' })
        })
        test("end['-100%']", () => {
                expect(_.end['-100%']()).toEqual({ insetInlineEnd: '-100%' })
        })
        test('end.auto', () => {
                expect(_.end.auto()).toEqual({ insetInlineEnd: 'auto' })
        })
        test("top['1px']", () => {
                expect(_.top['1px']()).toEqual({ insetBlockStart: '1px' })
        })
        test("top['-1px']", () => {
                expect(_.top['-1px']()).toEqual({ insetBlockStart: '-1px' })
        })
        test("top['100%']", () => {
                expect(_.top['100%']()).toEqual({ insetBlockStart: '100%' })
        })
        test("top['-100%']", () => {
                expect(_.top['-100%']()).toEqual({ insetBlockStart: '-100%' })
        })
        test('top.auto', () => {
                expect(_.top.auto()).toEqual({ insetBlockStart: 'auto' })
        })
        test("bottom['1px']", () => {
                expect(_.bottom['1px']()).toEqual({ insetBlockEnd: '1px' })
        })
        test("bottom['-1px']", () => {
                expect(_.bottom['-1px']()).toEqual({ insetBlockEnd: '-1px' })
        })
        test("bottom['100%']", () => {
                expect(_.bottom['100%']()).toEqual({ insetBlockEnd: '100%' })
        })
        test("bottom['-100%']", () => {
                expect(_.bottom['-100%']()).toEqual({ insetBlockEnd: '-100%' })
        })
        test('bottom.auto', () => {
                expect(_.bottom.auto()).toEqual({ insetBlockEnd: 'auto' })
        })
        test("right['1px']", () => {
                expect(_.right['1px']()).toEqual({ right: '1px' })
        })
        test("right['-1px']", () => {
                expect(_.right['-1px']()).toEqual({ right: '-1px' })
        })
        test("right['100%']", () => {
                expect(_.right['100%']()).toEqual({ right: '100%' })
        })
        test("right['-100%']", () => {
                expect(_.right['-100%']()).toEqual({ right: '-100%' })
        })
        test('right.auto', () => {
                expect(_.right.auto()).toEqual({ right: 'auto' })
        })
        test("left['1px']", () => {
                expect(_.left['1px']()).toEqual({ left: '1px' })
        })
        test("left['-1px']", () => {
                expect(_.left['-1px']()).toEqual({ left: '-1px' })
        })
        test("left['100%']", () => {
                expect(_.left['100%']()).toEqual({ left: '100%' })
        })
        test("left['-100%']", () => {
                expect(_.left['-100%']()).toEqual({ left: '-100%' })
        })
        test('left.auto', () => {
                expect(_.left.auto()).toEqual({ left: 'auto' })
        })
})

describe('visibility', () => {
        test('visibility.visible', () => {
                expect(_.visibility.visible()).toEqual({ visibility: 'visible' })
        })
        test('visibility.hidden', () => {
                expect(_.visibility.hidden()).toEqual({ visibility: 'hidden' })
        })
        test('visibility.collapse', () => {
                expect(_.visibility.collapse()).toEqual({ visibility: 'collapse' })
        })
})

describe('z-index', () => {
        test('z[4]', () => {
                expect(_.z[4]()).toEqual({ zIndex: '4' })
        })
        test('z.auto', () => {
                expect(_.z.auto()).toEqual({ zIndex: 'auto' })
        })
})
