import { fileURLToPath } from 'node:url'
import type { TypescriptcssOptions } from '@typescriptcss/plugin-core/src'
type NextConfig = Record<string, any>
type LoaderOptions = TypescriptcssOptions & { inlineOnly?: boolean; stylesheet?: boolean }
const extension = import.meta.url.endsWith('.cjs') ? '.cjs' : '.js'
const loader = fileURLToPath(new URL(`./loader${extension}`, import.meta.url))
const jsonOptions = (options: TypescriptcssOptions, root: string) => {
        const value: Record<string, string | boolean> = { output: options.output ?? 'head', root: options.root ?? root }
        if (options.classPrefix !== undefined) value.classPrefix = options.classPrefix
        if (options.fileName !== undefined) value.fileName = options.fileName
        if (options.minify !== undefined) value.minify = options.minify
        return value
}
const turboRule = (options: TypescriptcssOptions, root: string, as: string, type: string) => {
        const values = jsonOptions(options, root)
        return { condition: { not: 'foreign' }, loaders: [{ loader, options: { ...values, stylesheet: true } }], as, type }
}
const appendRule = (current: any, rule: any) => [...(current ? (Array.isArray(current) ? current : [current]) : []), rule]
const withHead = (config: NextConfig, output: TypescriptcssOptions['output']) => {
        if (output !== undefined && output !== 'head') return config
        return { ...config, experimental: { ...(config.experimental ?? {}), inlineCss: true } }
}
const withRule = (config: any, options: LoaderOptions) => {
        config.module = config.module ?? {}
        config.module.rules = [...(config.module.rules ?? []), { enforce: 'pre', test: /\.[cm]?[jt]sx?$/, exclude: /node_modules/, use: [{ loader, options }] }]
        return config
}
const withTurbo = (config: NextConfig, options: TypescriptcssOptions, root: string) => {
        const current = config.turbopack?.rules ?? {}
        const rules = {
                ...current,
                '*.js': appendRule(current['*.js'], turboRule(options, root, '*.js', 'ecmascript')),
                '*.jsx': appendRule(current['*.jsx'], turboRule(options, root, '*.jsx', 'ecmascript')),
                '*.ts': appendRule(current['*.ts'], turboRule(options, root, '*.ts', 'typescript')),
                '*.tsx': appendRule(current['*.tsx'], turboRule(options, root, '*.tsx', 'typescript')),
        }
        return {
                ...config,
                turbopack: {
                        ...(config.turbopack ?? {}),
                        rules,
                },
        }
}
const withWebpack = (config: NextConfig, options: TypescriptcssOptions, next: NextConfig): NextConfig => ({
        ...next,
        webpack: (webpackConfig: any, context: any) => {
                const root = context?.dir ?? process.cwd()
                const value = withRule(webpackConfig, { ...jsonOptions(options, root), inlineOnly: true, output: 'inline' })
                if (config.webpack) return config.webpack(value, context)
                return value
        },
})
const typescriptcss =
        (options: TypescriptcssOptions = {}) =>
        (config: NextConfig = {}): NextConfig =>
                withWebpack(config, options, withTurbo(withHead(config, options.output), options, options.root ?? process.cwd()))
export default typescriptcss
