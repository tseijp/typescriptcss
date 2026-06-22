import type { TypescriptcssOptions } from '../types.ts'
export const createFilter = (options: TypescriptcssOptions = {}) => {
        const match = (value: RegExp | ((id: string) => boolean) | undefined, id: string) => {
                if (!value) return false
                if (value instanceof RegExp) value.lastIndex = 0
                if (value instanceof RegExp) return value.test(id)
                return value(id)
        }
        return (id: string) => {
                if (match(options.exclude, id)) return false
                if (!options.include) return true
                return match(options.include, id)
        }
}
