import { createTypescriptcssProcessor, TypescriptcssOptions } from '@typescriptcss/plugin-core/src'
type RollupPlugin = Record<string, any>
export const typescriptcss = (options: TypescriptcssOptions = {}): RollupPlugin => {
        const processor = createTypescriptcssProcessor(options)
        return {
                name: 'typescriptcss:rollup',
                transform: (code: string, id: string) => processor.transform(code, id),
                generateBundle(this: any) {
                        const asset = processor.file()
                        if (!asset) return
                        this.emitFile({ type: 'asset', fileName: asset.fileName, source: asset.source })
                },
        }
}
export default typescriptcss
