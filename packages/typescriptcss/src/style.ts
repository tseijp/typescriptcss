import { Rule, RuntimeStyle, State, Argument, Chain } from './types'
const root: State = { css: {} }
const rules: Record<string, Rule> = Object.create(null)
const scoped: Record<string, Record<string, Rule>> = Object.create(null)
export const x4 = (key: string) => `${Number(key) * 4}px`
export const px = (key: string) => (key === 'full' ? '100%' : key === 'screen' ? '100vw' : key === 'dvh' ? '100dvh' : x4(key))
export const isNum = (key: string) => Number.isFinite(Number(key))
export const merge = (state: State, css: RuntimeStyle, scope?: string): State => ({ css: Object.assign({}, state.css, css), scope })
export const set =
        (css: RuntimeStyle, scope?: string): Rule =>
        (state) =>
                merge(state, css, scope)
export const read =
        (fn: (key: string) => RuntimeStyle | undefined, greedy = false): Rule =>
        (state) => ({
                css: state.css,
                greedy,
                read: (key) => {
                        const css = fn(key)
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
        if (key === 'css') return state.css
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
export const numeric = (fn: (key: string) => RuntimeStyle): Rule => read((key) => (isNum(key) ? fn(key) : undefined))
export const length = (prop: string): Rule => read((key) => (isNum(key) || key === 'full' || key === 'screen' || key === 'dvh' ? { [prop]: px(key) } : undefined))
export const color = (prop: string): Rule => read((key) => ({ [prop]: key }), true)
export const space = (...props: string[]): Rule => numeric((key) => Object.fromEntries(props.map((prop) => [prop, x4(key)])))
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
