import { createTypescriptcssProcessor } from '@typescriptcss/share/src'
export default function loader(code) {
        const options = this.getOptions?.() ?? {}
        const processor = createTypescriptcssProcessor(options, options.inlineOnly ? 'inline' : 'file')
        const result = processor.transform(code, this.resourcePath)
        const output = result?.code ?? code
        const imports = result?.rules.map((rule) => `import ${JSON.stringify(`data:text/css,${encodeURIComponent(rule)}`)} with { turbopackModuleType: "css" }`) ?? []
        const source = options.stylesheet && imports.length ? `${output}\n${imports.join('\n')}` : output
        const callback = this.async?.()
        if (callback) return callback(null, source, result?.map ?? null)
        return source
}
