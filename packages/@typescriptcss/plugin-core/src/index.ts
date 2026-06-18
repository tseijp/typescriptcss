import type { TypescriptcssOptions } from './types.ts'
import { createFilter } from './utils/filter.ts'
import { createSheet } from './utils/sheet.ts'
import { createTransformer } from './utils/transform.ts'
export const createTypescriptcssProcessor = (options: TypescriptcssOptions = {}) => {
        const filter = createFilter(options)
        const sheet = createSheet(options)
        const transformModule = createTransformer(options, sheet.emitClass)
        const transform = (code: string, id: string) => {
                if (!filter(id)) return null
                const result = transformModule(code, id)
                if (!result) return null
                return { ...result, css: sheet.css() }
        }
        return { transform, head: sheet.head, file: sheet.file, css: sheet.css, clear: sheet.clear }
}
export const typescriptcss = createTypescriptcssProcessor
export type { CssAsset, CssBlock, CssTarget, RuntimeStyle, TransformResult, TypescriptcssOptions, TypescriptcssOutput } from './types.ts'
