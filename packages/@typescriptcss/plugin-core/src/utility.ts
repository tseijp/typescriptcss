import { ChainPart, CssBlock, RuntimeStyle } from './types'
type Reader = (key: string, state: State) => State | null
type Entry = (state: State) => State
type State = { block: CssBlock; dark?: boolean; greedy?: boolean; media?: string; read?: Reader; scope?: string }
const x4 = (key: string) => `${Number(key) * 4}px`
const isNum = (key: string) => Number.isFinite(Number(key))
const px = (key: string) => (key === 'full' ? '100%' : key === 'screen' ? '100vw' : key === 'dvh' ? '100dvh' : x4(key))
const clone = (block: CssBlock): CssBlock => ({ base: { ...block.base }, media: Object.fromEntries(Object.entries(block.media).map(([key, value]) => [key, { ...value }])) })
const put = (state: State, css: RuntimeStyle, scope?: string): State => {
        const block = clone(state.block)
        const target = state.media ? (block.media[state.media] = { ...(block.media[state.media] ?? {}) }) : block.base
        Object.assign(target, css)
        const media = state.media && (scope || !Object.keys(css).length) ? state.media : undefined
        return { block, dark: state.dark, media, scope }
}
const set =
        (css: RuntimeStyle, scope?: string): Entry =>
        (state) =>
                put(state, css, scope)
const read =
        (fn: (key: string, state: State) => RuntimeStyle | null, greedy = false): Entry =>
        (state) => ({ ...state, greedy, read: (key, next) => {
                const css = fn(key, next)
                if (!css) return null
                return put(next, css)
        } })
const numeric = (fn: (key: string) => RuntimeStyle): Entry => read((key) => (isNum(key) ? fn(key) : null))
const length = (prop: string): Entry => read((key) => (isNum(key) || key === 'full' || key === 'screen' || key === 'dvh' ? { [prop]: px(key) } : null))
const space = (...props: string[]): Entry => numeric((key) => Object.fromEntries(props.map((prop) => [prop, x4(key)])))
const color = (prop: string): Entry => read((key, state) => {
        if (!state.dark) return { [prop]: key }
        const base = state.block.base[prop] ?? 'initial'
        return { colorScheme: 'light dark', [prop]: `light-dark(${base}, ${key})` }
}, true)
const side = (...props: string[]): Entry => set(Object.fromEntries(props.flatMap((prop) => [[`${prop}Width`, '1px'], [`${prop}Style`, 'solid']])))
const scoped: Record<string, Record<string, Entry>> = {
        border: { b: side('borderBottom'), collapse: set({ borderCollapse: 'collapse' }), l: side('borderLeft'), r: side('borderRight'), t: side('borderTop'), x: side('borderLeft', 'borderRight'), y: side('borderBottom', 'borderTop') },
        flex: { col: set({ flexDirection: 'column' }), nowrap: set({ flexWrap: 'nowrap' }), row: set({ flexDirection: 'row' }), wrap: set({ flexWrap: 'wrap' }) },
        font: { bold: set({ fontWeight: 700 }), medium: set({ fontWeight: 500 }), normal: set({ fontWeight: 400 }), sans: set({ fontFamily: 'Arial, Helvetica, sans-serif' }), semibold: set({ fontWeight: 600 }) },
        items: { center: set({ alignItems: 'center' }), end: set({ alignItems: 'flex-end' }), start: set({ alignItems: 'flex-start' }), stretch: set({ alignItems: 'stretch' }) },
        justify: { between: set({ justifyContent: 'space-between' }), center: set({ justifyContent: 'center' }), end: set({ justifyContent: 'flex-end' }), start: set({ justifyContent: 'flex-start' }) },
        max: { h: length('maxHeight'), w: length('maxWidth') },
        min: { h: length('minHeight'), w: length('minWidth') },
        mx: { auto: set({ marginLeft: 'auto', marginRight: 'auto' }) },
        my: { auto: set({ marginBottom: 'auto', marginTop: 'auto' }) },
        overflow: { auto: set({ overflow: 'auto' }), hidden: set({ overflow: 'hidden' }), scroll: set({ overflow: 'scroll' }), visible: set({ overflow: 'visible' }) },
        rounded: { full: set({ borderRadius: '9999px' }) },
        table: { auto: set({ tableLayout: 'auto' }), fixed: set({ tableLayout: 'fixed' }) },
        text: { base: set({ fontSize: '16px', lineHeight: '24px' }), center: set({ textAlign: 'center' }), left: set({ textAlign: 'left' }), right: set({ textAlign: 'right' }), sm: set({ fontSize: '14px', lineHeight: '20px' }), xs: set({ fontSize: '12px', lineHeight: '16px' }) },
        tracking: { tight: set({ letterSpacing: '-0.025em' }) },
}
const root: Record<string, Entry> = {
        bg: color('background'),
        block: set({ display: 'block' }),
        border: (state) => ({ ...put(state, { borderStyle: 'solid', borderWidth: '1px' }, 'border'), read: (key, next) => put(next, { borderColor: key }) }),
        css: (state) => state,
        dark: (state) => ({ ...state, dark: true }),
        flex: (state) => ({ ...put(state, { display: 'flex' }, 'flex'), read: (key, next) => (isNum(key) ? put(next, { flex: Number(key) }, 'flex') : null) }),
        font: (state) => ({ ...numeric((key) => ({ fontWeight: Number(key) }))(state), scope: 'font' }),
        gap: space('gap'),
        grid: set({ display: 'grid' }),
        h: length('height'),
        hidden: set({ display: 'none' }),
        inline: set({ display: 'inline' }),
        inlineBlock: set({ display: 'inline-block' }),
        items: set({}, 'items'),
        justify: set({}, 'justify'),
        leading: space('lineHeight'),
        m: space('margin'),
        max: set({}, 'max'),
        mb: space('marginBottom'),
        md: (state) => ({ ...state, media: '768px' }),
        min: set({}, 'min'),
        ml: space('marginLeft'),
        mr: space('marginRight'),
        mt: space('marginTop'),
        mx: (state) => ({ ...space('marginLeft', 'marginRight')(state), scope: 'mx' }),
        my: (state) => ({ ...space('marginBottom', 'marginTop')(state), scope: 'my' }),
        overflow: set({}, 'overflow'),
        p: space('padding'),
        pb: space('paddingBottom'),
        pl: space('paddingLeft'),
        pr: space('paddingRight'),
        pt: space('paddingTop'),
        px: space('paddingLeft', 'paddingRight'),
        py: space('paddingBottom', 'paddingTop'),
        rounded: (state) => ({ ...put(state, { borderRadius: '4px' }, 'rounded'), read: (key, next) => (isNum(key) ? put(next, { borderRadius: x4(key) }, 'rounded') : null) }),
        size: read((key) => (isNum(key) || key === 'full' || key === 'screen' || key === 'dvh' ? { height: px(key), width: px(key) } : null)),
        sm: (state) => ({ ...state, media: '640px' }),
        table: set({ display: 'table' }, 'table'),
        text: (state) => ({ ...state, greedy: true, scope: 'text', read: (key, next) => (isNum(key) ? put(next, { fontSize: x4(key) }) : color('color')(next).read?.(key, next) ?? null) }),
        tracking: set({}, 'tracking'),
        w: length('width'),
}
const resolveName = (state: State, key: string): State | null => {
        const local = state.scope ? scoped[state.scope]?.[key] : undefined
        if (local) return local(state)
        const greedy = state.greedy ? state.read?.(key, state) : undefined
        if (greedy) return greedy
        const entry = root[key]
        if (entry) return entry(state)
        const next = state.read?.(key, state)
        if (next) return next
        return { ...state, greedy: true, read: (value, current) => put(current, { [key]: value }) }
}
export const evaluateChain = (parts: ChainPart[]): CssBlock | null => {
        let state: State = { block: { base: {}, media: {} } }
        for (const part of parts) {
                const next = part.type === 'name' ? resolveName(state, part.value) : state.read?.(part.value, state) ?? resolveName(state, part.value)
                if (!next) return null
                state = next
        }
        return state.block
}
