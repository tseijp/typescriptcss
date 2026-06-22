import { createTypescriptcssProcessor } from '@typescriptcss/plugin-core/src'
import type { TypescriptcssOptions } from '@typescriptcss/plugin-core/src'
type RollupPlugin = Record<string, any>
export const typescriptcss = (options: TypescriptcssOptions = {}): RollupPlugin => {
        const output = options.output === 'inline' ? 'inline' : 'file'
        const processor = createTypescriptcssProcessor({ ...options, output })
        return {
                name: 'typescriptcss:rollup',
                buildStart: processor.clear,
                transform: (code: string, id: string) => processor.transform(code, id),
                generateBundle(this: any) {
                        const asset = processor.file()
                        if (!asset) return
                        this.emitFile({ type: 'asset', fileName: asset.fileName, source: asset.source })
                },
        }
}
export default typescriptcss
