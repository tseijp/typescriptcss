import { createTypescriptcssProcessor } from '@typescriptcss/plugin-core/src'
import type { TypescriptcssOptions } from '@typescriptcss/plugin-core/src'
type LoaderContext = {
        resourcePath: string
        async?: () => ((error: any, code?: string, map?: any) => void) | undefined
        getOptions?: () => TypescriptcssOptions
}
export default function loader(this: LoaderContext, code: string) {
        const options = this.getOptions?.() ?? {}
        const processor = createTypescriptcssProcessor(options)
        const result = processor.transform(code, this.resourcePath)
        const output = result?.code ?? code
        const callback = this.async?.()
        if (callback) return callback(null, output, result?.map ?? null)
        return output
}
