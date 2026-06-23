import { color, dark as dark_, isNum, length, media, merge, numeric, px as px_, read, scope, set, side, space, splitter, token, withScope, x4 } from './utils.ts'
import type { RuntimeStyle, Chain, Utility } from './types.ts'
scope('flex', { col: set({ flexDirection: 'column' }), nowrap: set({ flexWrap: 'nowrap' }), row: set({ flexDirection: 'row' }), wrap: set({ flexWrap: 'wrap' }) })
scope('items', { center: set({ alignItems: 'center' }), end: set({ alignItems: 'flex-end' }), start: set({ alignItems: 'flex-start' }), stretch: set({ alignItems: 'stretch' }) })
scope('justify', { between: set({ justifyContent: 'space-between' }), center: set({ justifyContent: 'center' }), end: set({ justifyContent: 'flex-end' }), start: set({ justifyContent: 'flex-start' }) })
scope('max', { h: length('maxHeight'), w: length('maxWidth') })
scope('min', { h: length('minHeight'), w: length('minWidth') })
scope('mx', { auto: set({ marginLeft: 'auto', marginRight: 'auto' }) })
scope('my', { auto: set({ marginBottom: 'auto', marginTop: 'auto' }) })
scope('overflow', { auto: set({ overflow: 'auto' }), hidden: set({ overflow: 'hidden' }), scroll: set({ overflow: 'scroll' }), visible: set({ overflow: 'visible' }) })
scope('table', { auto: set({ tableLayout: 'auto' }), fixed: set({ tableLayout: 'fixed' }) })
scope('text', { base: set({ fontSize: '16px', lineHeight: '24px' }), center: set({ textAlign: 'center' }), left: set({ textAlign: 'left' }), right: set({ textAlign: 'right' }), sm: set({ fontSize: '14px', lineHeight: '20px' }), xs: set({ fontSize: '12px', lineHeight: '16px' }) })
scope('tracking', { tight: set({ letterSpacing: '-0.025em' }) })
scope('font', { bold: set({ fontWeight: 700 }), medium: set({ fontWeight: 500 }), normal: set({ fontWeight: 400 }), sans: set({ fontFamily: 'Arial, Helvetica, sans-serif' }), semibold: set({ fontWeight: 600 }) })
scope('border', { b: side('borderBottom'), collapse: set({ borderCollapse: 'collapse' }), l: side('borderLeft'), r: side('borderRight'), t: side('borderTop'), x: side('borderLeft', 'borderRight'), y: side('borderBottom', 'borderTop') })
scope('rounded', { full: set({ borderRadius: '9999px' }) })
export const bg = token<Utility['bg']>('bg', color('background'))
export const block = token<Utility['block']>('block', set({ display: 'block' }))
export const border = token<Utility['border']>('border', (state) => {
        const next = merge(state, { borderStyle: 'solid', borderWidth: '1px' }, 'border')
        return { ...next, read: (key) => merge(next, { borderColor: key }) }
})
scope('cols', { subgrid: set({ gridTemplateColumns: 'subgrid' }) })
export const cols = token<Utility['cols']>(
        'cols',
        withScope(
                'cols',
                read((key) => ({ gridTemplateColumns: isNum(key) ? `repeat(${Number(key)}, minmax(0, 1fr))` : key })),
        ),
)
scope('col', { full: set({ gridColumn: '1 / -1' }) })
export const col = token<Utility['col']>(
        'col',
        withScope(
                'col',
                numeric((key) => ({ gridColumn: `span ${key} / span ${key}` })),
        ),
)
export const colStart = token<Utility['colStart']>(
        'colStart',
        numeric((key) => ({ gridColumnStart: Number(key) })),
)
export const css = token<Utility['css']>('css', splitter)
export const dark = token<Utility['dark']>('dark', dark_)
export const flex = token<Utility['flex']>('flex', (state) => {
        const next = merge(state, { display: 'flex' }, 'flex')
        return { ...next, read: (key) => (isNum(key) ? merge(next, { flex: Number(key) }, 'flex') : undefined) }
})
export const font = token<Utility['font']>(
        'font',
        withScope(
                'font',
                numeric((key) => ({ fontWeight: Number(key) })),
        ),
)
scope('gap', { x: space('columnGap'), y: space('rowGap') })
export const gap = token<Utility['gap']>('gap', withScope('gap', space('gap')))
export const grid = token<Utility['grid']>('grid', set({ display: 'grid' }))
export const h = token<Utility['h']>('h', length('height'))
export const hidden = token<Utility['hidden']>('hidden', set({ display: 'none' }))
export const inline = token<Utility['inline']>('inline', set({ display: 'inline' }))
export const inlineBlock = token<Utility['inlineBlock']>('inlineBlock', set({ display: 'inline-block' }))
export const items = token<Utility['items']>('items', set({}, 'items'))
export const justify = token<Utility['justify']>('justify', set({}, 'justify'))
export const leading = token<Utility['leading']>('leading', space('lineHeight'))
export const m = token<Utility['m']>('m', space('margin'))
export const max = token<Utility['max']>('max', set({}, 'max'))
export const mb = token<Utility['mb']>('mb', space('marginBottom'))
export const min = token<Utility['min']>('min', set({}, 'min'))
export const ml = token<Utility['ml']>('ml', space('marginLeft'))
export const mr = token<Utility['mr']>('mr', space('marginRight'))
export const mt = token<Utility['mt']>('mt', space('marginTop'))
export const mx = token<Utility['mx']>('mx', withScope('mx', space('marginLeft', 'marginRight')))
export const my = token<Utility['my']>('my', withScope('my', space('marginBottom', 'marginTop')))
export const overflow = token<Utility['overflow']>('overflow', set({}, 'overflow'))
export const p = token<Utility['p']>('p', space('padding'))
export const pb = token<Utility['pb']>('pb', space('paddingBottom'))
export const pl = token<Utility['pl']>('pl', space('paddingLeft'))
export const pr = token<Utility['pr']>('pr', space('paddingRight'))
export const pt = token<Utility['pt']>('pt', space('paddingTop'))
export const px = token<Utility['px']>('px', space('paddingLeft', 'paddingRight'))
export const py = token<Utility['py']>('py', space('paddingBottom', 'paddingTop'))
export const rounded = token<Utility['rounded']>('rounded', (state) => ({ css: Object.assign({}, state.css, { borderRadius: '4px' }), scope: 'rounded', read: (key) => (isNum(key) ? merge(state, { borderRadius: x4(key) }, 'rounded') : undefined) }))
export const size = token<Utility['size']>(
        'size',
        read((key) => (isNum(key) || key === 'full' || key === 'screen' || key === 'dvh' ? { height: px_(key), width: px_(key) } : undefined)),
)
export const sm = token<Utility['sm']>('sm', media('640px'))
export const table = token<Utility['table']>('table', set({ display: 'table' }, 'table'))
export const text = token<Utility['text']>('text', (state) => ({ css: state.css, dark: state.dark, greedy: true, media: state.media, scope: 'text', read: (key) => (isNum(key) ? merge(state, { fontSize: x4(key) }) : merge(state, { color: state.dark ? `light-dark(${state.css.color ?? 'initial'}, ${key})` : key })) }))
export const tracking = token<Utility['tracking']>('tracking', set({}, 'tracking'))
export const w = token<Utility['w']>('w', length('width'))
export const md = token<Utility['md']>('md', media('768px'))
export const define = <T = Chain>(name: string, css: RuntimeStyle, scopeName?: string): T => token<T>(name, set(css, scopeName))
