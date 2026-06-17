import { blockClass, blockCss, blockKey, compactCss } from './css'
import { transformSource } from './transform'
import { CssAsset, CssBlock, TypescriptcssOptions } from './types'
const match = (value: RegExp | ((id: string) => boolean) | undefined, id: string) => {
        if (!value) return false
        if (value instanceof RegExp) return value.test(id)
        return value(id)
}
const allowed = (options: TypescriptcssOptions, id: string) => {
        if (match(options.exclude, id)) return false
        if (!options.include) return true
        return match(options.include, id)
}
export const createTypescriptcssProcessor = (options: TypescriptcssOptions = {}) => {
        const prefix = options.classPrefix ?? 'tcss'
        const fileName = options.fileName ?? 'typescriptcss.css'
        const names = new Map<string, string>()
        const head = new Map<string, CssBlock>()
        const file = new Map<string, CssBlock>()
        const emitClass = (block: CssBlock, target: 'file' | 'head') => {
                const key = blockKey(block)
                const name = names.get(key) ?? blockClass(prefix, block)
                names.set(key, name)
                if (target === 'file') file.set(name, block)
                if (target === 'head') head.set(name, block)
                return name
        }
        const sheet = (blocks: Map<string, CssBlock>) => compactCss([...blocks.entries()].map(([name, block]) => blockCss(name, block)).join(''), options)
        return {
                transform: (code: string, id: string) => {
                        if (!allowed(options, id)) return null
                        return transformSource(code, id, { emitClass, options })
                },
                head: () => sheet(head),
                file: (): CssAsset | null => {
                        const source = sheet(file)
                        if (!source) return null
                        return { fileName, source }
                },
                clear: () => {
                        names.clear()
                        head.clear()
                        file.clear()
                },
        }
}
export const typescriptcss = createTypescriptcssProcessor
