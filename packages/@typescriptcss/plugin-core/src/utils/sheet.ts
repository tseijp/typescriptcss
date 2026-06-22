import hash from '@emotion/hash'
import { transform } from 'lightningcss'
import type { CssAsset, CssBlock, CssTarget, TypescriptcssOptions } from '../types.ts'
import { createStyleTools } from './style.ts'
export const createSheet = (options: TypescriptcssOptions = {}) => {
        const tools = createStyleTools()
        const head = new Map<string, CssBlock>()
        const file = new Map<string, CssBlock>()
        const compact = (css: string) => {
                if (!css || options.minify === false) return css
                return transform({ code: Buffer.from(css), filename: options.fileName ?? 'typescriptcss.css', minify: true }).code.toString()
        }
        const raw = (blocks: Map<string, CssBlock>) => [...blocks.entries()].map(([name, block]) => tools.rule(name, block)).join('')
        const render = (blocks: Map<string, CssBlock>) => compact(raw(blocks))
        const emitClass = (block: CssBlock, target: Exclude<CssTarget, 'inline'>) => {
                const name = `${options.classPrefix ?? 'tcss'}-${hash(tools.stable(block))}`
                if (target === 'head') head.set(name, block)
                if (target === 'file') file.set(name, block)
                return name
        }
        const asset = (): CssAsset | null => {
                const source = render(file)
                if (!source) return null
                return { fileName: options.fileName ?? 'typescriptcss.css', source }
        }
        const clear = () => {
                head.clear()
                file.clear()
        }
        const rules = () => [...new Map([...head, ...file]).entries()].map(([name, block]) => compact(tools.rule(name, block)))
        return { emitClass, head: () => render(head), file: asset, css: () => compact(`${raw(head)}${raw(file)}`), rules, clear }
}
