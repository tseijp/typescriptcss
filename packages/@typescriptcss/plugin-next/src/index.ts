import { unplugin } from '@typescriptcss/plugin-core/src'
import type { Options } from '@typescriptcss/plugin-core/src/types'
export const createTCSS =
        (options: Options = {}) =>
        (config: any = {}) => ({
                ...config,
                webpack: (webpack: any, ctx: any) => {
                        webpack.plugins = webpack.plugins || []
                        webpack.plugins.push(unplugin.webpack(options))
                        return config.webpack ? config.webpack(webpack, ctx) : webpack
                },
        })

export default createTCSS;
