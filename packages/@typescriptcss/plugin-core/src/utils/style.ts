import type { CssBlock, RuntimeStyle } from '../types.ts'
export const createStyleTools = () => {
        const mediaValue = /^if\(media\(width >= ([^)]+)\): (.*); else: (.*)\)$/
        const clean = (style: RuntimeStyle) => Object.fromEntries(Object.entries(style).filter(([, value]) => value !== undefined && value !== null && value !== ''))
        const kebab = (key: string) => (key.startsWith('--') ? key : key.replace(/[A-Z]/g, (value) => `-${value.toLowerCase()}`))
        const stable = (value: any): string => {
                if (!value || typeof value !== 'object') return JSON.stringify(value)
                const entries = Object.entries(value).filter(([, item]) => item !== undefined).sort(([left], [right]) => left.localeCompare(right))
                return `{${entries.map(([key, item]) => `${JSON.stringify(key)}:${stable(item)}`).join(',')}}`
        }
        const body = (style: RuntimeStyle) => Object.entries(clean(style)).map(([key, value]) => `${kebab(key)}:${String(value)}`).join(';')
        const assign = (out: CssBlock, key: string, value: any) => {
                const found = typeof value === 'string' ? mediaValue.exec(value) : null
                if (!found) return out.base[key] = value
                const [, query, next, prev] = found
                if (prev !== 'unset') out.base[key] = prev
                out.media[query] = { ...(out.media[query] ?? {}), [key]: next }
        }
        const block = (style: RuntimeStyle): CssBlock => {
                const out: CssBlock = { base: {}, media: {} }
                for (const [key, value] of Object.entries(clean(style))) assign(out, key, value)
                return out
        }
        const empty = (value: CssBlock) => !body(value.base) && !Object.values(value.media).some((style) => !!body(style))
        const rule = (className: string, value: CssBlock) => {
                const base = body(value.base) ? `.${className}{${body(value.base)}}` : ''
                const media = Object.entries(value.media).map(([query, style]) => body(style) ? `@media (min-width:${query}){.${className}{${body(style)}}}` : '').join('')
                return `${base}${media}`
        }
        return { block, clean, empty, rule, stable }
}
