import { TypescriptcssOptions } from '@typescriptcss/plugin-core/src'
type NextConfig = Record<string, any>
const loader = new URL('./loader.js', import.meta.url).pathname
const withDefault = (options: TypescriptcssOptions): TypescriptcssOptions => ({ output: 'inline', ...options })
export const typescriptcss =
        (options: TypescriptcssOptions = {}) =>
        (config: NextConfig = {}): NextConfig => ({
                ...config,
                webpack: (webpackConfig: any, context: any) => {
                        webpackConfig.module = webpackConfig.module ?? {}
                        webpackConfig.module.rules = [...(webpackConfig.module.rules ?? []), { enforce: 'pre', test: /\.[cm]?[jt]sx?$/, exclude: /node_modules/, use: [{ loader, options: withDefault(options) }] }]
                        if (config.webpack) return config.webpack(webpackConfig, context)
                        return webpackConfig
                },
        })
export default typescriptcss
