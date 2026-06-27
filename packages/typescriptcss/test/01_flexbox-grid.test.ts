import { describe, expect, test } from 'vitest'
import * as _ from '../src'
// Generated mechanically from docs/01_flexbox-grid/*.mdx — chain() returns a style object.
// Unimplemented utilities return undefined and stay RED until added to src.

describe('flex-basis', () => {
        test('basis[4]', () => {
                expect(_.basis.full()).toEqual({ flexBasis: '16px' })
        })
        test('basis.full', () => {
                expect(_.basis.full()).toEqual({ flexBasis: '100%' })
        })
        test('basis.auto', () => {
                expect(_.basis.auto()).toEqual({ flexBasis: 'auto' })
        })
})

describe('flex-direction', () => {
        test('flex.row', () => {
                expect(_.flex.row()).toEqual({ flexDirection: 'row' })
        })
        test('flex.row.reverse', () => {
                expect(_.flex.row.reverse()).toEqual({ flexDirection: 'row-reverse' })
        })
        test('flex.col', () => {
                expect(_.flex.col()).toEqual({ flexDirection: 'column' })
        })
        test('flex.column.reverse', () => {
                expect(_.flex.col.reverse()).toEqual({ flexDirection: 'column-reverse' })
        })
})

describe('flex-wrap', () => {
        test('flex.nowrap', () => {
                expect(_.flex.nowrap()).toEqual({ flexWrap: 'nowrap' })
        })
        test('flex.wrap', () => {
                expect(_.flex.wrap()).toEqual({ flexWrap: 'wrap' })
        })
        test('flex.wrap.reverse', () => {
                expect(_.flex.wrap.reverse()).toEqual({ flexWrap: 'wrap-reverse' })
        })
})

describe('flex', () => {
        test('flex[4]', () => {
                expect(_.flex[4]()).toEqual({ flex: '4' })
        })
        test('flex.auto', () => {
                expect(_.flex.auto()).toEqual({ flex: 'auto' })
        })
        test('flex.initial', () => {
                expect(_.flex.initial()).toEqual({ flex: '0 auto' })
        })
        test('flex.none', () => {
                expect(_.flex.none()).toEqual({ flex: 'none' })
        })
})

describe('flex-grow', () => {
        test('grow', () => {
                expect(_.grow()).toEqual({ flexGrow: '1' })
        })
        test('grow[4]', () => {
                expect(_.grow[4]()).toEqual({ flexGrow: '4' })
        })
})

describe('flex-shrink', () => {
        test('shrink', () => {
                expect(_.shrink()).toEqual({ flexShrink: '1' })
        })
        test('shrink[4]', () => {
                expect(_.shrink[4]()).toEqual({ flexShrink: '4' })
        })
})

describe('order', () => {
        test('order[4]', () => {
                expect(_.order[4]()).toEqual({ order: '4' })
        })
        test('order.first', () => {
                expect(_.order.first()).toEqual({ order: '-9999' })
        })
        test('order.last', () => {
                expect(_.order.last()).toEqual({ order: '9999' })
        })
        test('order.none', () => {
                expect(_.order.none()).toEqual({ order: '0' })
        })
})

describe('grid-template-columns', () => {
        test('grid.cols[4]', () => {
                expect(_.grid.cols[4]()).toEqual({ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' })
        })
        test('grid.cols.none', () => {
                expect(_.grid.cols.none()).toEqual({ gridTemplateColumns: 'none' })
        })
        test('grid.cols.subgrid', () => {
                expect(_.grid.cols.subgrid()).toEqual({ gridTemplateColumns: 'subgrid' })
        })
})

describe('grid-column', () => {
        test('col.span[4]', () => {
                expect(_.col.span[4]()).toEqual({ gridColumn: 'span 4 / span 4' })
        })
        test('col.span.full', () => {
                expect(_.col.span.full()).toEqual({ gridColumn: '1 / -1' })
        })
        test('col.start[4]', () => {
                expect(_.col.start[4]()).toEqual({ gridColumnStart: '4' })
        })
        test('col.start.auto', () => {
                expect(_.col.start.auto()).toEqual({ gridColumnStart: 'auto' })
        })
        test('col.end[4]', () => {
                expect(_.col.end[4]()).toEqual({ gridColumnEnd: '4' })
        })
        test('col.end.auto', () => {
                expect(_.col.end.auto()).toEqual({ gridColumnEnd: 'auto' })
        })
        test('col.auto', () => {
                expect(_.col.auto()).toEqual({ gridColumn: 'auto' })
        })
        test('col[4]', () => {
                expect(_.col[4]()).toEqual({ gridColumn: '4' })
        })
})

describe('grid-template-rows', () => {
        test('grid.rows[4]', () => {
                expect(_.grid.rows[4]()).toEqual({ gridTemplateRows: 'repeat(4, minmax(0, 1fr))' })
        })
        test('grid.rows.none', () => {
                expect(_.grid.rows.none()).toEqual({ gridTemplateRows: 'none' })
        })
        test('grid.rows.subgrid', () => {
                expect(_.grid.rows.subgrid()).toEqual({ gridTemplateRows: 'subgrid' })
        })
})

describe('grid-row', () => {
        test('row.span[4]', () => {
                expect(_.row.span[4]()).toEqual({ gridRow: 'span 4 / span 4' })
        })
        test('row.full', () => {
                expect(_.row.full()).toEqual({ gridRow: '1 / -1' })
        })
        test('row.start[4]', () => {
                expect(_.row.start[4]()).toEqual({ gridRowStart: '4' })
        })
        test('row.start.auto', () => {
                expect(_.row.start.auto()).toEqual({ gridRowStart: 'auto' })
        })
        test('row.end[4]', () => {
                expect(_.row.end[4]()).toEqual({ gridRowEnd: '4' })
        })
        test('row.end.auto', () => {
                expect(_.row.end.auto()).toEqual({ gridRowEnd: 'auto' })
        })
        test('row.auto', () => {
                expect(_.row.auto()).toEqual({ gridRow: 'auto' })
        })
        test('row[4]', () => {
                expect(_.row[4]()).toEqual({ gridRow: '4' })
        })
})

describe('grid-auto-flow', () => {
        test('grid.flow.row', () => {
                expect(_.grid.flow.row()).toEqual({ gridAutoFlow: 'row' })
        })
        test('grid.flow.column', () => {
                expect(_.grid.flow.column()).toEqual({ gridAutoFlow: 'column' })
        })
        test('grid.flow.dense', () => {
                expect(_.grid.flow.dense()).toEqual({ gridAutoFlow: 'dense' })
        })
        test('grid.flow.row.dense', () => {
                expect(_.grid.flow.row.dense()).toEqual({ gridAutoFlow: 'row dense' })
        })
        test('grid.flow.column.dense', () => {
                expect(_.grid.flow.column.dense()).toEqual({ gridAutoFlow: 'column dense' })
        })
})

describe('grid-auto-columns', () => {
        test('auto.cols.auto', () => {
                expect(_.auto.cols.auto()).toEqual({ gridAutoColumns: 'auto' })
        })
        test('auto.cols.min', () => {
                expect(_.auto.cols.min()).toEqual({ gridAutoColumns: 'min-content' })
        })
        test('auto.cols.max', () => {
                expect(_.auto.cols.max()).toEqual({ gridAutoColumns: 'max-content' })
        })
        test('auto.cols.fr', () => {
                expect(_.auto.cols.fr()).toEqual({ gridAutoColumns: 'minmax(0, 1fr)' })
        })
        test('auto.cols[4]', () => {
                expect(_.auto.cols[4]()).toEqual({ gridAutoColumns: '4' })
        })
})

describe('grid-auto-rows', () => {
        test('auto.rows.auto', () => {
                expect(_.auto.rows.auto()).toEqual({ gridAutoRows: 'auto' })
        })
        test('auto.rows.min', () => {
                expect(_.auto.rows.min()).toEqual({ gridAutoRows: 'min-content' })
        })
        test('auto.rows.max', () => {
                expect(_.auto.rows.max()).toEqual({ gridAutoRows: 'max-content' })
        })
        test('auto.rows.fr', () => {
                expect(_.auto.rows.fr()).toEqual({ gridAutoRows: 'minmax(0, 1fr)' })
        })
        test('auto.rows[4]', () => {
                expect(_.auto.rows[4]()).toEqual({ gridAutoRows: '4' })
        })
})

describe('gap', () => {
        test('gap[4]', () => {
                expect(_.gap(4)).toEqual({ gap: '16px' })
        })
        test('gap[4]', () => {
                expect(_.gap.x(4)).toEqual({ columnGap: '16px' })
        })
        test('gap[4]', () => {
                expect(_.gap.y(4)).toEqual({ rowGap: '16px' })
        })
})

describe('justify-content', () => {
        test('justify.start', () => {
                expect(_.justify.start()).toEqual({ justifyContent: 'flex-start' })
        })
        test('justify.end', () => {
                expect(_.justify.end()).toEqual({ justifyContent: 'flex-end' })
        })
        test('justify.end.safe', () => {
                expect(_.justify.end.safe()).toEqual({ justifyContent: 'safe flex-end' })
        })
        test('justify.center', () => {
                expect(_.justify.center()).toEqual({ justifyContent: 'center' })
        })
        test('justify.center.safe', () => {
                expect(_.justify.center.safe()).toEqual({ justifyContent: 'safe center' })
        })
        test('justify.between', () => {
                expect(_.justify.between()).toEqual({ justifyContent: 'space-between' })
        })
        test('justify.around', () => {
                expect(_.justify.around()).toEqual({ justifyContent: 'space-around' })
        })
        test('justify.evenly', () => {
                expect(_.justify.evenly()).toEqual({ justifyContent: 'space-evenly' })
        })
        test('justify.stretch', () => {
                expect(_.justify.stretch()).toEqual({ justifyContent: 'stretch' })
        })
        test('justify.baseline', () => {
                expect(_.justify.baseline()).toEqual({ justifyContent: 'baseline' })
        })
        test('justify.normal', () => {
                expect(_.justify.normal()).toEqual({ justifyContent: 'normal' })
        })
})

describe('justify-items', () => {
        test('justify.items.start', () => {
                expect(_.justify.items.start()).toEqual({ justifyItems: 'start' })
        })
        test('justify.items.end', () => {
                expect(_.justify.items.end()).toEqual({ justifyItems: 'end' })
        })
        test('justify.items.end.safe', () => {
                expect(_.justify.items.end.safe()).toEqual({ justifyItems: 'safe end' })
        })
        test('justify.items.center', () => {
                expect(_.justify.items.center()).toEqual({ justifyItems: 'center' })
        })
        test('justify.items.center.safe', () => {
                expect(_.justify.items.center.safe()).toEqual({ justifyItems: 'safe center' })
        })
        test('justify.items.stretch', () => {
                expect(_.justify.items.stretch()).toEqual({ justifyItems: 'stretch' })
        })
        test('justify.items.normal', () => {
                expect(_.justify.items.normal()).toEqual({ justifyItems: 'normal' })
        })
})

describe('justify-self', () => {
        test('justify.self.auto', () => {
                expect(_.justify.self.auto()).toEqual({ justifySelf: 'auto' })
        })
        test('justify.self.start', () => {
                expect(_.justify.self.start()).toEqual({ justifySelf: 'start' })
        })
        test('justify.self.center', () => {
                expect(_.justify.self.center()).toEqual({ justifySelf: 'center' })
        })
        test('justify.self.center.safe', () => {
                expect(_.justify.self.center.safe()).toEqual({ justifySelf: 'safe center' })
        })
        test('justify.self.end', () => {
                expect(_.justify.self.end()).toEqual({ justifySelf: 'end' })
        })
        test('justify.self.end.safe', () => {
                expect(_.justify.self.end.safe()).toEqual({ justifySelf: 'safe end' })
        })
        test('justify.self.stretch', () => {
                expect(_.justify.self.stretch()).toEqual({ justifySelf: 'stretch' })
        })
})

describe('align-content', () => {
        test('content.normal', () => {
                expect(_.content.normal()).toEqual({ alignContent: 'normal' })
        })
        test('content.center', () => {
                expect(_.content.center()).toEqual({ alignContent: 'center' })
        })
        test('content.start', () => {
                expect(_.content.start()).toEqual({ alignContent: 'flex-start' })
        })
        test('content.end', () => {
                expect(_.content.end()).toEqual({ alignContent: 'flex-end' })
        })
        test('content.between', () => {
                expect(_.content.between()).toEqual({ alignContent: 'space-between' })
        })
        test('content.around', () => {
                expect(_.content.around()).toEqual({ alignContent: 'space-around' })
        })
        test('content.evenly', () => {
                expect(_.content.evenly()).toEqual({ alignContent: 'space-evenly' })
        })
        test('content.baseline', () => {
                expect(_.content.baseline()).toEqual({ alignContent: 'baseline' })
        })
        test('content.stretch', () => {
                expect(_.content.stretch()).toEqual({ alignContent: 'stretch' })
        })
})

describe('align-items', () => {
        test('items.start', () => {
                expect(_.items.start()).toEqual({ alignItems: 'flex-start' })
        })
        test('items.end', () => {
                expect(_.items.end()).toEqual({ alignItems: 'flex-end' })
        })
        test('items.end.safe', () => {
                expect(_.items.end.safe()).toEqual({ alignItems: 'safe flex-end' })
        })
        test('items.center', () => {
                expect(_.items.center()).toEqual({ alignItems: 'center' })
        })
        test('items.center.safe', () => {
                expect(_.items.center.safe()).toEqual({ alignItems: 'safe center' })
        })
        test('items.baseline', () => {
                expect(_.items.baseline()).toEqual({ alignItems: 'baseline' })
        })
        test('items.baseline.last', () => {
                expect(_.items.baseline.last()).toEqual({ alignItems: 'last baseline' })
        })
        test('items.stretch', () => {
                expect(_.items.stretch()).toEqual({ alignItems: 'stretch' })
        })
})

describe('align-self', () => {
        test('self.auto', () => {
                expect(_.self.auto()).toEqual({ alignSelf: 'auto' })
        })
        test('self.start', () => {
                expect(_.self.start()).toEqual({ alignSelf: 'flex-start' })
        })
        test('self.end', () => {
                expect(_.self.end()).toEqual({ alignSelf: 'flex-end' })
        })
        test('self.end', () => {
                expect(_.self.end()).toEqual({ alignSelf: 'safe flex-end' })
        })
        test('self.center', () => {
                expect(_.self.center()).toEqual({ alignSelf: 'center' })
        })
        test('self.center', () => {
                expect(_.self.center()).toEqual({ alignSelf: 'safe center' })
        })
        test('self.stretch', () => {
                expect(_.self.stretch()).toEqual({ alignSelf: 'stretch' })
        })
        test('self.baseline', () => {
                expect(_.self.baseline()).toEqual({ alignSelf: 'baseline' })
        })
        test('self.baseline.last', () => {
                expect(_.self.baseline.last()).toEqual({ alignSelf: 'last baseline' })
        })
})

describe('place-content', () => {
        test('place.content.center', () => {
                expect(_.place.content.center()).toEqual({ placeContent: 'center' })
        })
        test('place.content.center.safe', () => {
                expect(_.place.content.center.safe()).toEqual({ placeContent: 'safe center' })
        })
        test('place.content.start', () => {
                expect(_.place.content.start()).toEqual({ placeContent: 'start' })
        })
        test('place.content.end', () => {
                expect(_.place.content.end()).toEqual({ placeContent: 'end' })
        })
        test('place.content.end.safe', () => {
                expect(_.place.content.end.safe()).toEqual({ placeContent: 'safe end' })
        })
        test('place.content.between', () => {
                expect(_.place.content.between()).toEqual({ placeContent: 'space-between' })
        })
        test('place.content.around', () => {
                expect(_.place.content.around()).toEqual({ placeContent: 'space-around' })
        })
        test('place.content.evenly', () => {
                expect(_.place.content.evenly()).toEqual({ placeContent: 'space-evenly' })
        })
        test('place.content.baseline', () => {
                expect(_.place.content.baseline()).toEqual({ placeContent: 'baseline' })
        })
        test('place.content.stretch', () => {
                expect(_.place.content.stretch()).toEqual({ placeContent: 'stretch' })
        })
})

describe('place-items', () => {
        test('place.items.start', () => {
                expect(_.place.items.start()).toEqual({ placeItems: 'start' })
        })
        test('place.items.end', () => {
                expect(_.place.items.end()).toEqual({ placeItems: 'end' })
        })
        test('place.items.end.safe', () => {
                expect(_.place.items.end.safe()).toEqual({ placeItems: 'safe end' })
        })
        test('place.items.center', () => {
                expect(_.place.items.center()).toEqual({ placeItems: 'center' })
        })
        test('place.items.center.safe', () => {
                expect(_.place.items.center.safe()).toEqual({ placeItems: 'safe center' })
        })
        test('place.items.baseline', () => {
                expect(_.place.items.baseline()).toEqual({ placeItems: 'baseline' })
        })
        test('place.items.stretch', () => {
                expect(_.place.items.stretch()).toEqual({ placeItems: 'stretch' })
        })
})

describe('place-self', () => {
        test('place.self.auto', () => {
                expect(_.place.self.auto()).toEqual({ placeSelf: 'auto' })
        })
        test('place.self.start', () => {
                expect(_.place.self.start()).toEqual({ placeSelf: 'start' })
        })
        test('place.self.end', () => {
                expect(_.place.self.end()).toEqual({ placeSelf: 'end' })
        })
        test('place.self.end.safe', () => {
                expect(_.place.self.end.safe()).toEqual({ placeSelf: 'safe end' })
        })
        test('place.self.center', () => {
                expect(_.place.self.center()).toEqual({ placeSelf: 'center' })
        })
        test('place.self.center.safe', () => {
                expect(_.place.self.center.safe()).toEqual({ placeSelf: 'safe center' })
        })
        test('place.self.stretch', () => {
                expect(_.place.self.stretch()).toEqual({ placeSelf: 'stretch' })
        })
})
