import { Argument, Media, Rule, RuntimeStyle, State } from './types'
const groups: Record<string, RuntimeStyle> = Object.create(null)
let text = ''
let node: HTMLStyleElement | undefined
const hash = (value: string) => {
        let out = 5381
        for (let i = 0; i < value.length; i += 1) out = ((out << 5) + out) ^ value.charCodeAt(i)
        return (out >>> 0).toString(36)
}
const join = (media: Media[]) => media.map((entry) => entry.query).join(' and ')
const name = (query: string, prop: string, value: string | number | undefined) => `--tscss-${hash(`${query}:${prop}:${String(value)}`)}`
const ref = (key: string, fallback: string | number | undefined) => (fallback === undefined ? `var(${key})` : `var(${key}, ${fallback})`)
const emptyRef = (value: string | number | undefined) => typeof value === 'string' && value.startsWith('var(--tscss-') && !value.includes(',')
const fill = (value: string | number | undefined, fallback: string | number | undefined) => (fallback === undefined || !emptyRef(value) ? value : `${String(value).slice(0, -1)}, ${fallback})`)
const rule = (query: string, values: RuntimeStyle) => `@media ${query}{:root{${Object.entries(values)
        .map(([key, value]) => `${key}:${value};`)
        .join('')}}}`
const render = () => Object.entries(groups).map(([query, values]) => rule(query, values)).join('')
const flush = () => {
        if (typeof document === 'undefined') return
        if (!document.head) return
        if (!node) {
                node = document.createElement('style')
                node.setAttribute('data-typescriptcss', '')
                document.head.appendChild(node)
        }
        if (node.textContent === text) return
        node.textContent = text
}
const commit = () => {
        const next = render()
        if (next === text) return
        text = next
        flush()
}
const put = (query: string, key: string, value: string | number | undefined) => {
        groups[query] = Object.assign(groups[query] ?? Object.create(null), { [key]: value })
        commit()
}
export const applyMedia = (state: State, css: RuntimeStyle, scope?: string): State => {
        if (!state.media?.length) return { css: Object.assign({}, state.css, css), scope }
        const query = join(state.media)
        const next = Object.fromEntries(
                Object.entries(css).map(([prop, value]) => {
                        const key = name(query, prop, value)
                        put(query, key, value)
                        return [prop, ref(key, state.css[prop])]
                }),
        )
        return { css: Object.assign({}, state.css, next), scope, media: state.media }
}
export const compose = (base: RuntimeStyle, styles: Argument[]) =>
        styles.filter(Boolean).reduce(
                (next, style) =>
                        Object.assign(
                                next,
                                Object.fromEntries(Object.entries(style as RuntimeStyle).map(([prop, value]) => [prop, fill(value, next[prop])])),
                        ),
                Object.assign({}, base),
        )
export const variant =
        (entry: Media): Rule =>
        (state) => ({
                ...state,
                media: [...(state.media ?? []), entry],
        })
