import { Rule, RuntimeStyle, State, Argument, Chain } from './types'
const root: State = { css: {} }
const rules: Record<string, Rule> = Object.create(null)
const scoped: Record<string, Record<string, Rule>> = Object.create(null)
const wrap = (state: State, css: RuntimeStyle) => {
        if (!state.media) return css
        return Object.fromEntries(Object.entries(css).map(([key, value]) => [key, `if(media(width >= ${state.media}): ${value}; else: ${state.css[key] ?? 'unset'})`]))
}
export const x4 = (key: string) => `${Number(key) * 4}px`
export const px = (key: string) => (key === 'full' ? '100%' : key === 'screen' ? '100vw' : key === 'dvh' ? '100dvh' : x4(key))
export const isNum = (key: string) => Number.isFinite(Number(key))
export const merge = (state: State, css: RuntimeStyle, scope?: string): State => ({ css: Object.assign({}, state.css, wrap(state, css)), media: state.media && (scope || !Object.keys(css).length) ? state.media : undefined, scope })
export const set =
        (css: RuntimeStyle, scope?: string): Rule =>
        (state) =>
                merge(state, css, scope)
export const read =
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
const chain = (state: State): Chain =>
        new Proxy((...styles: Argument[]) => Object.assign({}, state.css, ...(styles.filter(Boolean) as RuntimeStyle[])), {
                apply: (_target, _this, styles: Argument[]) => Object.assign({}, state.css, ...(styles.filter(Boolean) as RuntimeStyle[])),
                get: (_target, prop) => resolve(state, prop),
        }) as Chain
const resolve = (state: State, prop: string | symbol) => {
        const key = typeof prop === 'symbol' ? '' : prop
        if (!key || key === 'then') return undefined
        const local = state.scope ? scoped[state.scope]?.[key] : undefined
        if (local) return chain(local(state, key))
        const greedy = state.greedy ? state.read?.(key) : undefined
        if (greedy) return chain(greedy)
        const rule = rules[key]
        if (rule) return chain(rule(state, key))
        const next = state.read?.(key)
        if (next) return chain(next)
        return chain(read((value) => ({ [key]: value }), true)(state, key))
}
export const token = <T>(name: string, rule: Rule): T => {
        rules[name] = rule
        return chain(rule(root, name)) as T
}
export const scope = (name: string, entries: Record<string, Rule>) => {
        scoped[name] = Object.assign(scoped[name] ?? Object.create(null), entries)
}
export const passthrough: Rule = (state) => state
export const splitter: Rule = (state) => merge(state, { '--tcss-split': Object.keys(state.css).join(',') || ' ' })
export const numeric = (fn: (key: string) => RuntimeStyle): Rule => read((key) => (isNum(key) ? fn(key) : undefined))
export const length = (prop: string): Rule => read((key) => (isNum(key) || key === 'full' || key === 'screen' || key === 'dvh' ? { [prop]: px(key) } : undefined))
export const color = (prop: string): Rule => read((key, state) => (state.dark ? { colorScheme: 'light dark', [prop]: `light-dark(${state.css[prop] ?? 'initial'}, ${key})` } : { [prop]: key }), true)
export const space = (...props: string[]): Rule => numeric((key) => Object.fromEntries(props.map((prop) => [prop, x4(key)])))
export const dark: Rule = (state) => ({ ...state, dark: true })
export const media =
        (value: string): Rule =>
        (state) => ({ ...state, media: value })
export const withScope =
        (scopeName: string, rule: Rule): Rule =>
        (state) => ({ ...rule(state, scopeName), scope: scopeName })
export const side = (...props: string[]): Rule =>
        set(
                Object.fromEntries(
                        props.flatMap((prop) => [
                                [`${prop}Width`, '1px'],
                                [`${prop}Style`, 'solid'],
                        ]),
                ),
        )
