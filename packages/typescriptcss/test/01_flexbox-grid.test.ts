import { describe, expect, test } from 'vitest'
import * as _ from '../src'
// Generated mechanically from docs/01_flexbox-grid/*.mdx — chain() returns a style object.
// Unimplemented utilities return undefined and stay RED until added to src.

describe('flex-basis', () => {
        test("basis['100%']", () => {
                expect(_.basis['100%']()).toEqual({ flexBasis: '100%' })
        })
        test('basis.auto', () => {
                expect(_.basis.auto()).toEqual({ flexBasis: 'auto' })
        })
})

describe('flex-direction', () => {
        test('flex.row', () => {
                expect(_.flex.row()).toEqual({ flexDirection: 'row' })
        })
        test("flex['row-reverse']", () => {
                expect(_.flex['row-reverse']()).toEqual({ flexDirection: 'row-reverse' })
        })
        test('flex.column', () => {
                expect(_.flex.column()).toEqual({ flexDirection: 'column' })
        })
        test("flex['column-reverse']", () => {
                expect(_.flex['column-reverse']()).toEqual({ flexDirection: 'column-reverse' })
        })
})

describe('flex-wrap', () => {
        test('flex.nowrap', () => {
                expect(_.flex.nowrap()).toEqual({ flexWrap: 'nowrap' })
        })
        test('flex.wrap', () => {
                expect(_.flex.wrap()).toEqual({ flexWrap: 'wrap' })
        })
        test("flex['wrap-reverse']", () => {
                expect(_.flex['wrap-reverse']()).toEqual({ flexWrap: 'wrap-reverse' })
        })
})

describe('flex', () => {
        test('flex[4]', () => {
                expect(_.flex[4]()).toEqual({ flex: '4' })
        })
        test('flex.auto', () => {
                expect(_.flex.auto()).toEqual({ flex: 'auto' })
        })
        test("flex['0 auto']", () => {
                expect(_.flex['0 auto']()).toEqual({ flex: '0 auto' })
        })
        test('flex.none', () => {
                expect(_.flex.none()).toEqual({ flex: 'none' })
        })
})

describe('flex-grow', () => {
        test("grow['1']", () => {
                expect(_.grow['1']()).toEqual({ flexGrow: '1' })
        })
        test('grow[4]', () => {
                expect(_.grow[4]()).toEqual({ flexGrow: '4' })
        })
})

describe('flex-shrink', () => {
        test("shrink['1']", () => {
                expect(_.shrink['1']()).toEqual({ flexShrink: '1' })
        })
        test('shrink[4]', () => {
                expect(_.shrink[4]()).toEqual({ flexShrink: '4' })
        })
})

describe('order', () => {
        test('order[4]', () => {
                expect(_.order[4]()).toEqual({ order: '4' })
        })
        test("order['-9999']", () => {
                expect(_.order['-9999']()).toEqual({ order: '-9999' })
        })
        test("order['9999']", () => {
                expect(_.order['9999']()).toEqual({ order: '9999' })
        })
        test("order['0']", () => {
                expect(_.order['0']()).toEqual({ order: '0' })
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
        test("col['1 / -1']", () => {
                expect(_.col['1 / -1']()).toEqual({ gridColumn: '1 / -1' })
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
        test("row['1 / -1']", () => {
                expect(_.row['1 / -1']()).toEqual({ gridRow: '1 / -1' })
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
        test("grid.flow['row dense']", () => {
                expect(_.grid.flow['row dense']()).toEqual({ gridAutoFlow: 'row dense' })
        })
        test("grid.flow['column dense']", () => {
                expect(_.grid.flow['column dense']()).toEqual({ gridAutoFlow: 'column dense' })
        })
})

describe('grid-auto-columns', () => {
        test('auto.cols.auto', () => {
                expect(_.auto.cols.auto()).toEqual({ gridAutoColumns: 'auto' })
        })
        test("auto.cols['min-content']", () => {
                expect(_.auto.cols['min-content']()).toEqual({ gridAutoColumns: 'min-content' })
        })
        test("auto.cols['max-content']", () => {
                expect(_.auto.cols['max-content']()).toEqual({ gridAutoColumns: 'max-content' })
        })
        test("auto.cols['minmax(0, 1fr)']", () => {
                expect(_.auto.cols['minmax(0, 1fr)']()).toEqual({ gridAutoColumns: 'minmax(0, 1fr)' })
        })
        test('auto.cols[4]', () => {
                expect(_.auto.cols[4]()).toEqual({ gridAutoColumns: 'var(4)' })
        })
})

describe('grid-auto-rows', () => {
        test('auto.rows.auto', () => {
                expect(_.auto.rows.auto()).toEqual({ gridAutoRows: 'auto' })
        })
        test("auto.rows['min-content']", () => {
                expect(_.auto.rows['min-content']()).toEqual({ gridAutoRows: 'min-content' })
        })
        test("auto.rows['max-content']", () => {
                expect(_.auto.rows['max-content']()).toEqual({ gridAutoRows: 'max-content' })
        })
        test("auto.rows['minmax(0, 1fr)']", () => {
                expect(_.auto.rows['minmax(0, 1fr)']()).toEqual({ gridAutoRows: 'minmax(0, 1fr)' })
        })
        test('auto.rows[4]', () => {
                expect(_.auto.rows[4]()).toEqual({ gridAutoRows: 'var(4)' })
        })
})

describe('justify-content', () => {
        test("justify['flex-start']", () => {
                expect(_.justify['flex-start']()).toEqual({ justifyContent: 'flex-start' })
        })
        test("justify['flex-end']", () => {
                expect(_.justify['flex-end']()).toEqual({ justifyContent: 'flex-end' })
        })
        test("justify['safe flex-end']", () => {
                expect(_.justify['safe flex-end']()).toEqual({ justifyContent: 'safe flex-end' })
        })
        test('justify.center', () => {
                expect(_.justify.center()).toEqual({ justifyContent: 'center' })
        })
        test("justify['safe center']", () => {
                expect(_.justify['safe center']()).toEqual({ justifyContent: 'safe center' })
        })
        test("justify['space-be_een']", () => {
                expect(_.justify['space-be_een']()).toEqual({ justifyContent: 'space-be_een' })
        })
        test("justify['space-around']", () => {
                expect(_.justify['space-around']()).toEqual({ justifyContent: 'space-around' })
        })
        test("justify['space-evenly']", () => {
                expect(_.justify['space-evenly']()).toEqual({ justifyContent: 'space-evenly' })
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
        test("justify.items['safe end']", () => {
                expect(_.justify.items['safe end']()).toEqual({ justifyItems: 'safe end' })
        })
        test('justify.items.center', () => {
                expect(_.justify.items.center()).toEqual({ justifyItems: 'center' })
        })
        test("justify.items['safe center']", () => {
                expect(_.justify.items['safe center']()).toEqual({ justifyItems: 'safe center' })
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
        test("justify.self['safe center']", () => {
                expect(_.justify.self['safe center']()).toEqual({ justifySelf: 'safe center' })
        })
        test('justify.self.end', () => {
                expect(_.justify.self.end()).toEqual({ justifySelf: 'end' })
        })
        test("justify.self['safe end']", () => {
                expect(_.justify.self['safe end']()).toEqual({ justifySelf: 'safe end' })
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
        test("content['flex-start']", () => {
                expect(_.content['flex-start']()).toEqual({ alignContent: 'flex-start' })
        })
        test("content['flex-end']", () => {
                expect(_.content['flex-end']()).toEqual({ alignContent: 'flex-end' })
        })
        test("content['space-be_een']", () => {
                expect(_.content['space-be_een']()).toEqual({ alignContent: 'space-be_een' })
        })
        test("content['space-around']", () => {
                expect(_.content['space-around']()).toEqual({ alignContent: 'space-around' })
        })
        test("content['space-evenly']", () => {
                expect(_.content['space-evenly']()).toEqual({ alignContent: 'space-evenly' })
        })
        test('content.baseline', () => {
                expect(_.content.baseline()).toEqual({ alignContent: 'baseline' })
        })
        test('content.stretch', () => {
                expect(_.content.stretch()).toEqual({ alignContent: 'stretch' })
        })
})

describe('align-items', () => {
        test("items['flex-start']", () => {
                expect(_.items['flex-start']()).toEqual({ alignItems: 'flex-start' })
        })
        test("items['flex-end']", () => {
                expect(_.items['flex-end']()).toEqual({ alignItems: 'flex-end' })
        })
        test("items['safe flex-end']", () => {
                expect(_.items['safe flex-end']()).toEqual({ alignItems: 'safe flex-end' })
        })
        test('items.center', () => {
                expect(_.items.center()).toEqual({ alignItems: 'center' })
        })
        test("items['safe center']", () => {
                expect(_.items['safe center']()).toEqual({ alignItems: 'safe center' })
        })
        test('items.baseline', () => {
                expect(_.items.baseline()).toEqual({ alignItems: 'baseline' })
        })
        test("items['last baseline']", () => {
                expect(_.items['last baseline']()).toEqual({ alignItems: 'last baseline' })
        })
        test('items.stretch', () => {
                expect(_.items.stretch()).toEqual({ alignItems: 'stretch' })
        })
})

describe('align-self', () => {
        test('self.auto', () => {
                expect(_.self.auto()).toEqual({ alignSelf: 'auto' })
        })
        test("self['flex-start']", () => {
                expect(_.self['flex-start']()).toEqual({ alignSelf: 'flex-start' })
        })
        test("self['flex-end']", () => {
                expect(_.self['flex-end']()).toEqual({ alignSelf: 'flex-end' })
        })
        test("self['safe flex-end']", () => {
                expect(_.self['safe flex-end']()).toEqual({ alignSelf: 'safe flex-end' })
        })
        test('self.center', () => {
                expect(_.self.center()).toEqual({ alignSelf: 'center' })
        })
        test("self['safe center']", () => {
                expect(_.self['safe center']()).toEqual({ alignSelf: 'safe center' })
        })
        test('self.stretch', () => {
                expect(_.self.stretch()).toEqual({ alignSelf: 'stretch' })
        })
        test('self.baseline', () => {
                expect(_.self.baseline()).toEqual({ alignSelf: 'baseline' })
        })
        test("self['last baseline']", () => {
                expect(_.self['last baseline']()).toEqual({ alignSelf: 'last baseline' })
        })
})

describe('place-content', () => {
        test('place.content.center', () => {
                expect(_.place.content.center()).toEqual({ placeContent: 'center' })
        })
        test("place.content['safe center']", () => {
                expect(_.place.content['safe center']()).toEqual({ placeContent: 'safe center' })
        })
        test('place.content.start', () => {
                expect(_.place.content.start()).toEqual({ placeContent: 'start' })
        })
        test('place.content.end', () => {
                expect(_.place.content.end()).toEqual({ placeContent: 'end' })
        })
        test("place.content['safe end']", () => {
                expect(_.place.content['safe end']()).toEqual({ placeContent: 'safe end' })
        })
        test("place.content['space-be_een']", () => {
                expect(_.place.content['space-be_een']()).toEqual({ placeContent: 'space-be_een' })
        })
        test("place.content['space-around']", () => {
                expect(_.place.content['space-around']()).toEqual({ placeContent: 'space-around' })
        })
        test("place.content['space-evenly']", () => {
                expect(_.place.content['space-evenly']()).toEqual({ placeContent: 'space-evenly' })
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
        test("place.items['safe end']", () => {
                expect(_.place.items['safe end']()).toEqual({ placeItems: 'safe end' })
        })
        test('place.items.center', () => {
                expect(_.place.items.center()).toEqual({ placeItems: 'center' })
        })
        test("place.items['safe center']", () => {
                expect(_.place.items['safe center']()).toEqual({ placeItems: 'safe center' })
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
        test("place.self['safe end']", () => {
                expect(_.place.self['safe end']()).toEqual({ placeSelf: 'safe end' })
        })
        test('place.self.center', () => {
                expect(_.place.self.center()).toEqual({ placeSelf: 'center' })
        })
        test("place.self['safe center']", () => {
                expect(_.place.self['safe center']()).toEqual({ placeSelf: 'safe center' })
        })
        test('place.self.stretch', () => {
                expect(_.place.self.stretch()).toEqual({ placeSelf: 'stretch' })
        })
})
