import hash from '@emotion/hash'
import { transform } from 'lightningcss'
import { CssBlock, RuntimeStyle, TypescriptcssOptions } from './types'
const stable = (value: any): string => {
        if (!value || typeof value !== 'object') return JSON.stringify(value)
        const keys = Object.keys(value).sort()
        return `{${keys.map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}`
}
const kebab = (key: string) => key.replace(/[A-Z]/g, (value) => `-${value.toLowerCase()}`)
const body = (style: RuntimeStyle) => Object.entries(style).map(([key, value]) => `${kebab(key)}:${String(value)}`).join(';')
const media = (className: string, query: string, style: RuntimeStyle) => `@media (min-width:${query}){.${className}{${body(style)}}}`
export const emptyBlock = (block: CssBlock) => !Object.keys(block.base).length && !Object.keys(block.media).length
export const blockKey = (block: CssBlock) => stable(block)
export const blockClass = (prefix: string, block: CssBlock) => `${prefix}-${hash(blockKey(block))}`
export const blockCss = (className: string, block: CssBlock) => {
        const base = Object.keys(block.base).length ? `.${className}{${body(block.base)}}` : ''
        const screens = Object.entries(block.media).map(([query, style]) => media(className, query, style)).join('')
        return `${base}${screens}`
}
export const inlineCss = (block: CssBlock) => block.base
export const hasMedia = (block: CssBlock) => !!Object.keys(block.media).length
export const compactCss = (css: string, options: TypescriptcssOptions) => {
        if (!css || options.minify === false) return css
        return transform({ code: Buffer.from(css), filename: 'typescriptcss.css', minify: true }).code.toString()
}
