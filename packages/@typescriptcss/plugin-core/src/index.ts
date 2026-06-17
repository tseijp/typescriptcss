import { writeFileSync } from 'node:fs'
import { cwd } from 'node:process'
import { createUnplugin } from 'unplugin'
import { parse } from './parse'
import { load } from './evaluate'
import { klass } from './hash'
import { createSheet } from './sheet'
import type { Edit, Loaded, Options, Resolved, Sheet, Span } from './types'
export type { Options } from './types'
const defaults: Resolved = { target: 'head', minify: true, root: cwd(), runtime: 'typescriptcss', out: 'app/tcss.css', include: /\.[mc]?tsx?$/, exclude: /node_modules/ }
const resolve = (options: Options): Resolved => Object.assign({}, defaults, options)
const names = (sheet: Sheet, loaded: Loaded, span: Span): string => {
        const split = loaded.run(span.expr)
        sheet.add({ span, head: split.head, file: split.file, klass: '' })
        const head = Object.keys(split.head).length ? klass(split.head) : ''
        const file = Object.keys(split.file).length ? klass(split.file) : ''
        return [head, file].filter(Boolean).join(' ')
}
const edits = (sheet: Sheet, loaded: Loaded, span: Span): Edit[] => {
        const cls = names(sheet, loaded, span)
        if (span.cls === undefined) return [{ start: span.start, end: span.end, text: `className={'${cls}'}` }]
        return [
                { start: span.start, end: span.end, text: '' },
                { start: span.clsStart as number, end: span.clsEnd as number, text: `className={'${cls} ' + (${span.cls})}` },
        ]
}
const rewrite = (code: string, id: string, sheet: Sheet, loaded: Loaded): string => {
        const all = parse(code, id).flatMap((span) => edits(sheet, loaded, span)).sort((a, b) => b.start - a.start)
        return all.reduce((acc, edit) => acc.slice(0, edit.start) + edit.text + acc.slice(edit.end), code)
}
const flush = (config: Resolved, sheet: Sheet) => {
        const css = [sheet.head(), sheet.file()].filter(Boolean).join('\n')
        const path = config.out.startsWith('/') ? config.out : `${config.root}/${config.out}`
        writeFileSync(path, css)
}
export const unplugin = createUnplugin((raw: Options = {}) => {
        const config = resolve(raw)
        const sheet = createSheet(config.minify)
        let loaded: Loaded
        const skip = (id: string) => !config.include.test(id) || config.exclude.test(id)
        return {
                name: '@typescriptcss/plugin-core',
                enforce: 'pre',
                async transform(code: string, id: string) {
                        if (skip(id)) return undefined
                        if (!loaded) loaded = await load(config.runtime)
                        const out = rewrite(code, id, sheet, loaded)
                        flush(config, sheet)
                        return { code: out, map: null }
                },
                vite: { transformIndexHtml: () => [{ tag: 'style', attrs: { 'data-tcss': '' }, children: sheet.head(), injectTo: 'head' }] },
        }
})
export const vite = unplugin.vite
export const rollup = unplugin.rollup
export const webpack = unplugin.webpack
export const esbuild = unplugin.esbuild
export const rspack = unplugin.rspack
export const farm = unplugin.farm
export default unplugin
