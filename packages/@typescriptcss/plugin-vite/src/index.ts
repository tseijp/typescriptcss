import { createTypescriptcssProcessor, TypescriptcssOptions } from '@typescriptcss/plugin-core/src'
type VitePlugin = Record<string, any>
export const typescriptcss = (options: TypescriptcssOptions = {}): VitePlugin => {
        const processor = createTypescriptcssProcessor(options)
        return {
                name: 'typescriptcss:vite',
                enforce: 'pre',
                transform: (code: string, id: string) => processor.transform(code, id),
                generateBundle(this: any) {
                        const asset = processor.file()
                        if (!asset) return
                        this.emitFile({ type: 'asset', fileName: asset.fileName, source: asset.source })
                },
                transformIndexHtml: () => {
                        const css = processor.head()
                        if (!css) return []
                        return [{ tag: 'style', attrs: { 'data-typescriptcss': '' }, children: css, injectTo: 'head' }]
                },
        }
}
export default typescriptcss
