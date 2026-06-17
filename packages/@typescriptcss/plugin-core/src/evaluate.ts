import { Loaded, Split, Style } from './types'
const MARK = '--tcss-split'
const omit = (css: Style, keys: Set<string>): Style =>
        Object.fromEntries(Object.entries(css).filter(([key]) => keys.has(key)))
const split = (css: Style): Split => {
        const mark = css[MARK]
        if (mark === undefined) return { head: css, file: {} }
        const heads = new Set(String(mark).split(',').filter(Boolean))
        const all = Object.keys(css).filter((key) => key !== MARK)
        const headKeys = new Set(all.filter((key) => heads.has(key)))
        const fileKeys = new Set(all.filter((key) => !heads.has(key)))
        return { head: omit(css, headKeys), file: omit(css, fileKeys) }
}
const ident = /^[A-Za-z_$][A-Za-z0-9_$]*$/
const reserved = new Set(['default', 'do', 'if', 'in', 'for', 'let', 'new', 'try', 'var', 'case', 'else', 'enum', 'null', 'this', 'true', 'void', 'with', 'class', 'const', 'false', 'super', 'throw', 'while', 'yield', 'delete', 'export', 'import', 'return', 'switch', 'typeof', '__esModule'])
export const load = async (runtime: string): Promise<Loaded> => {
        const mod: any = await import(runtime)
        const flat = Object.assign({}, mod && mod.default, mod)
        const names = Object.keys(flat).filter((name) => ident.test(name) && !reserved.has(name))
        const values = names.map((name) => flat[name])
        const run = (expr: string) => split(new Function(...names, `return (${expr})`)(...values))
        return { run }
}
