import type { Argument, Chain, Rule, RuntimeStyle, State } from './types.ts'

type Entry = RuntimeStyle | Rule

const root: State = { css: {} }
const rules: Record<string, Rule> = Object.create(null)
const scoped: Record<string, Record<string, Rule>> = Object.create(null)
const toRule = (entry: Entry, scopeName?: string): Rule => (typeof entry === 'function' ? entry : styleRule(entry, scopeName))
const wrapped = (state: State, css: RuntimeStyle) => {
        if (!state.media) return css
        return Object.fromEntries(Object.entries(css).map(([key, value]) => [key, `if(media(width >= ${state.media}): ${value}; else: ${state.css[key] ?? 'unset'})`]))
}
const merge = (state: State, css: RuntimeStyle, scopeName?: string): State => ({
        css: Object.assign({}, state.css, wrapped(state, css)),
        media: state.media && (scopeName || !Object.keys(css).length) ? state.media : undefined,
        scope: scopeName,
})
const chain = (state: State): Chain =>
        new Proxy((...styles: Argument[]) => Object.assign({}, state.css, ...(styles.filter(Boolean) as RuntimeStyle[])), {
                apply: (_target, _this, styles: Argument[]) => Object.assign({}, state.css, ...(styles.filter(Boolean) as RuntimeStyle[])),
                get: (_target, prop) => resolve(state, prop),
        }) as Chain
const resolve = (state: State, prop: string | symbol) => {
        const key = typeof prop === 'symbol' ? '' : prop
        if (!key || key === 'then') return undefined
        const local = state.scope ? scoped[state.scope]?.[key] : undefined
        if (local) return chain(local(state))
        const greedy = state.greedy ? state.read?.(key) : undefined
        if (greedy) return chain(greedy)
        const rule = rules[key]
        if (rule) return chain(rule(state))
        const next = state.read?.(key)
        if (next) return chain(next)
        return chain(readRule((value) => ({ [key]: value }), true)(state))
}

export const x4 = (key: string) => `${Number(key) * 4}px`
export const pxValue = (key: string) => (key === 'full' ? '100%' : key === 'screen' ? '100vw' : key === 'dvh' ? '100dvh' : x4(key))
export const isNum = (key: string) => Number.isFinite(Number(key))
export const styleRule =
        (css: RuntimeStyle, scopeName?: string): Rule =>
        (state) =>
                merge(state, css, scopeName)
export const readRule =
        (fn: (key: string, state: State) => RuntimeStyle | undefined, greedy = false): Rule =>
        (state) => ({
                css: state.css,
                dark: state.dark,
                greedy,
                media: state.media,
                read: (key) => {
                        const css = fn(key, state)
                        if (!css) return undefined
                        return merge(state, css)
                },
        })
export const utility = <T>(name: string, entry: Entry, scopeName?: string): T => {
        const rule = toRule(entry, scopeName)
        rules[name] = rule
        return chain(rule(root)) as T
}
export const group = (name: string, entries: Record<string, Entry>) => {
        const current = scoped[name] ?? Object.create(null)
        for (const [key, entry] of Object.entries(entries)) current[key] = toRule(entry)
        scoped[name] = current
}
export const values = (prop: string, entries: Record<string, string | number>): Record<string, RuntimeStyle> => Object.fromEntries(Object.entries(entries).map(([key, value]) => [key, { [prop]: value }]))
export const scopedRule =
        (scopeName: string, entry: Entry): Rule =>
        (state) => ({ ...toRule(entry)(state), scope: scopeName })
export const numericRule = (fn: (key: string) => RuntimeStyle): Rule => readRule((key) => (isNum(key) ? fn(key) : undefined))
export const scaleRule = (...props: string[]): Rule => numericRule((key) => Object.fromEntries(props.map((prop) => [prop, x4(key)])))
export const lengthRule = (prop: string): Rule => readRule((key) => (isNum(key) || key === 'full' || key === 'screen' || key === 'dvh' ? { [prop]: pxValue(key) } : undefined))
export const colorRule = (prop: string): Rule => readRule((key, state) => (state.dark ? { colorScheme: 'light dark', [prop]: `light-dark(${state.css[prop] ?? 'initial'}, ${key})` } : { [prop]: key }), true)
export const positionRule = (prop: string): Rule => readRule((key) => ({ [prop]: isNum(key) ? x4(key) : key }))
export const translateRule = (axis: 'X' | 'Y'): Rule => readRule((key) => ({ transform: `translate${axis}(${isNum(key) ? x4(key) : key})` }))
export const mediaRule =
        (value: string): Rule =>
        (state) => ({ ...state, media: value })
export const darkRule: Rule = (state) => ({ ...state, dark: true })
export const splitRule: Rule = (state) => state
export const flexRule: Rule = (state) => {
        const next = merge(state, { display: 'flex' }, 'flex')
        return { ...next, read: (key) => (isNum(key) ? merge(next, { flex: Number(key) }, 'flex') : undefined) }
}
export const borderRule: Rule = (state) => {
        const hasSide = Object.keys(state.css).some((key) => /^border(?:Bottom|Left|Right|Top)(?:Style|Width)$/.test(key))
        const next = merge(state, hasSide ? {} : { borderStyle: 'solid', borderWidth: '1px' }, 'border')
        return { ...next, read: (key) => merge(next, { borderColor: key }) }
}
export const borderSideRule =
        (...props: string[]): Rule =>
        (state) => {
                const css = { ...state.css }
                delete css.borderStyle
                delete css.borderWidth
                for (const prop of props) {
                        css[`${prop}Style`] = 'solid'
                        css[`${prop}Width`] = '1px'
                }
                const next = { ...state, css, scope: undefined }
                return { ...next, read: (key) => (isNum(key) ? merge(next, Object.fromEntries(props.map((prop) => [`${prop}Width`, `${Number(key)}px`]))) : undefined) }
        }
export const columnsRule: Rule = readRule((key) => ({ gridTemplateColumns: isNum(key) ? `repeat(${Number(key)}, minmax(0, 1fr))` : key }))
export const columnRule: Rule = numericRule((key) => ({ gridColumn: `span ${key} / span ${key}` }))
export const roundedRule: Rule = (state) => ({ ...merge(state, { borderRadius: '4px' }, 'rounded'), read: (key) => (isNum(key) ? merge(state, { borderRadius: x4(key) }, 'rounded') : undefined) })
export const sizeRule: Rule = readRule((key) => (isNum(key) || key === 'full' || key === 'screen' || key === 'dvh' ? { height: pxValue(key), width: pxValue(key) } : undefined))
export const textRule: Rule = (state) => ({
        css: state.css,
        dark: state.dark,
        greedy: true,
        media: state.media,
        scope: 'text',
        read: (key) => (isNum(key) ? merge(state, { fontSize: x4(key) }) : merge(state, { color: state.dark ? `light-dark(${state.css.color ?? 'initial'}, ${key})` : key })),
})
