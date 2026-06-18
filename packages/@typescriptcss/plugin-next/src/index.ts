import { fileURLToPath } from 'node:url'
import type { TypescriptcssOptions } from '@typescriptcss/plugin-core/src'
type NextConfig = Record<string, any>
const loader = fileURLToPath(new URL('./loader.ts', import.meta.url))
const jsonOptions = (options: TypescriptcssOptions, root: string) => {
        const value: Record<string, string | boolean> = { output: options.output ?? 'head', root: options.root ?? root }
        if (options.classPrefix !== undefined) value.classPrefix = options.classPrefix
        if (options.fileName !== undefined) value.fileName = options.fileName
        if (options.minify !== undefined) value.minify = options.minify
        return value
}
const turboRule = (options: TypescriptcssOptions, root: string) => ({
        condition: { not: { path: /node_modules/ } },
        loaders: [{ loader, options: jsonOptions(options, root) }],
})
const withRule = (config: any, options: TypescriptcssOptions) => {
        config.module = config.module ?? {}
        config.module.rules = [...(config.module.rules ?? []), { enforce: 'pre', test: /\.[cm]?[jt]sx?$/, exclude: /node_modules/, use: [{ loader, options }] }]
        return config
}
const withTurbo = (config: NextConfig, options: TypescriptcssOptions, root: string) => {
        const rule = turboRule(options, root)
        return {
                ...config,
                turbopack: {
                        ...(config.turbopack ?? {}),
                        rules: {
                                ...(config.turbopack?.rules ?? {}),
                                '*.js': rule,
                                '*.jsx': rule,
                                '*.ts': rule,
                                '*.tsx': rule,
                        },
                },
        }
}
export const typescriptcss =
        (options: TypescriptcssOptions = {}) =>
        (config: NextConfig = {}): NextConfig => {
                const root = options.root ?? process.cwd()
                const next = withTurbo(config, options, root)
                return {
                        ...next,
                        webpack: (webpackConfig: any, context: any) => {
                                const root = context?.dir ?? process.cwd()
                                const value = withRule(webpackConfig, jsonOptions(options, root))
                                if (config.webpack) return config.webpack(value, context)
                                return value
                        },
                }
        }
export default typescriptcss
