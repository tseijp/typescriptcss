import { createTypescriptcssProcessor } from '@typescriptcss/plugin-core/src'
import type { TypescriptcssOptions } from '@typescriptcss/plugin-core/src'
type VitePlugin = Record<string, any>
export const typescriptcss = (options: TypescriptcssOptions = {}): VitePlugin => {
        const processor = createTypescriptcssProcessor(options)
        let base = '/'
        return {
                name: 'typescriptcss:vite',
                enforce: 'pre',
                buildStart: processor.clear,
                configResolved: (config: any) => base = config.base,
                configureServer: (server: any) => server.middlewares.use((request: any, response: any, next: () => void) => {
                        const asset = processor.file()
                        const path = `${base}${options.fileName ?? 'typescriptcss.css'}`
                        if (!asset || request.url?.split('?')[0] !== path) return next()
                        response.setHeader('Content-Type', 'text/css')
                        response.end(asset.source)
                }),
                transform: (code: string, id: string) => processor.transform(code, id),
                generateBundle(this: any) {
                        const asset = processor.file()
                        if (!asset) return
                        this.emitFile({ type: 'asset', fileName: asset.fileName, source: asset.source })
                },
                transformIndexHtml: () => {
                        const css = processor.head()
                        const asset = processor.file()
                        const style = css ? [{ tag: 'style', attrs: { 'data-typescriptcss': '' }, children: css, injectTo: 'head' }] : []
                        const link = asset ? [{ tag: 'link', attrs: { rel: 'stylesheet', href: `${base}${asset.fileName}` }, injectTo: 'head' }] : []
                        return [...style, ...link]
                },
        }
}
export default typescriptcss
