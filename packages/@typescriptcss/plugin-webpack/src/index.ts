import { unplugin } from '@typescriptcss/plugin-core/src'
import type { Options } from '@typescriptcss/plugin-core/src/types'
export const typescriptcss = (options: Options = {}) => unplugin.webpack(options)
export default typescriptcss
