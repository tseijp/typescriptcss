import { createTypescriptcssProcessor, TypescriptcssOptions } from '@typescriptcss/plugin-core/src'
type LoaderContext = {
        resourcePath: string
        async?: () => ((error: any, code?: string, map?: any) => void) | undefined
        emitFile?: (name: string, source: string) => void
        getOptions?: () => TypescriptcssOptions
}
export default function loader(this: LoaderContext, code: string) {
        const options = this.getOptions?.() ?? {}
        const processor = createTypescriptcssProcessor(options)
        const result = processor.transform(code, this.resourcePath)
        const asset = processor.file()
        const head = processor.head()
        const source = [head, asset?.source].filter(Boolean).join('')
        if (source && this.emitFile) this.emitFile(asset?.fileName ?? options.fileName ?? 'typescriptcss.css', source)
        const callback = this.async?.()
        if (callback) return callback(null, result?.code ?? code, result?.map ?? null)
        return result?.code ?? code
}
