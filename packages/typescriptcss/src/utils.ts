import type { Argument, Chain, Rule, RuntimeStyle, State } from './types.ts'
type Entry = RuntimeStyle | Rule
const root: State = { css: {} }
const rules: Record<string, Rule> = Object.create(null)
const scoped: Record<string, Record<string, Rule>> = Object.create(null)
const controlKeys = new Set<string>()
const toRule = (entry: Entry, scopeName?: string): Rule => {
        if (typeof entry === 'function' && scopeName) return (state) => ({ ...(entry as Rule)(state), scope: scopeName })
        if (typeof entry === 'function') return entry as Rule
        return styleRule(entry, scopeName)
}
const wrapValue = (state: State, key: string, value: any) => (state.wraps ?? []).reduceRight((next, wrap) => `if(${wrap}: ${next}; else: ${state.css[key] ?? 'unset'})`, value)
const wrapped = (state: State, css: RuntimeStyle) => Object.fromEntries(Object.entries(css).map(([key, value]) => [key, wrapValue(state, key, value)]))
const merge = (state: State, css: RuntimeStyle, scopeName?: string): State => {
        const keepWraps = scopeName || !Object.keys(css).length ? state.wraps : undefined
        return { css: Object.assign({}, state.css, wrapped(state, css)), dark: state.dark, scope: scopeName, wraps: keepWraps }
}
const chain = (state: State): Chain =>
        new Proxy((...styles: Argument[]) => Object.assign({}, state.css, ...(styles.filter(Boolean) as RuntimeStyle[])), {
                apply: (_target, _this, styles: Argument[]) => Object.assign({}, state.css, ...(styles.filter(Boolean) as RuntimeStyle[])),
                get: (_target, prop) => resolve(state, prop),
        }) as Chain
const resolve = (state: State, prop: string | symbol) => {
        const key = typeof prop === 'symbol' ? '' : prop
        if (!key || key === 'then') return undefined
        const local = state.scope ? scoped[state.scope]?.[key] : undefined
        if (local) return chain(local(state))
        const rule = rules[key]
        if (rule && controlKeys.has(key)) return chain(rule(state))
        const greedy = state.greedy ? state.read?.(key) : undefined
        if (greedy) return chain(greedy)
        const next = state.read?.(key)
        if (next) return chain(next)
        if (rule) return chain(rule(state))
        return chain(readRule((value) => ({ [key]: value }), true)(state))
}
export const controls = (...keys: string[]) => {
        for (const key of keys) controlKeys.add(key)
}
export const x4 = (key: string) => `${Number(key) * 4}px`
export const isNum = (key: string) => Number.isFinite(Number(key))
export const isLength = (key: string) => key === '0' || /^-?\d*\.?\d+(px|rem|em|%|vw|vh|dvw|dvh|lvw|lvh|svw|svh|lh|rlh|ch|ex|cap|ic|vmin|vmax|cm|mm|in|pt|pc)$/.test(key)
export const colorValue = (key: string) => (key === 'current' ? 'currentColor' : key)
export const lengthValue = (key: string, screen = '100vw') => {
        if (isNum(key)) return x4(key)
        if (isLength(key)) return key === '0' ? '0px' : key
        if (key === 'px') return '1px'
        if (key === 'full') return '100%'
        if (key === 'screen') return screen
        if (key === 'dvw') return '100dvw'
        if (key === 'dvh') return '100dvh'
        if (key === 'lvw') return '100lvw'
        if (key === 'lvh') return '100lvh'
        if (key === 'svw') return '100svw'
        if (key === 'svh') return '100svh'
        if (key === 'min') return 'min-content'
        if (key === 'max') return 'max-content'
        if (key === 'fit') return 'fit-content'
        if (key === 'min-content' || key === 'max-content' || key === 'fit-content' || key === 'auto' || key === 'none') return key
        return undefined
}
export const styleRule =
        (css: RuntimeStyle, scopeName?: string): Rule =>
        (state) =>
                merge(state, css, scopeName)
export const readRule =
        (fn: (key: string, state: State) => RuntimeStyle | undefined, greedy = false): Rule =>
        (state) => ({
                css: state.css,
                dark: state.dark,
                greedy,
                read: (key) => {
                        const css = fn(key, state)
                        if (!css) return undefined
                        return merge(state, css)
                },
                scope: state.scope,
                wraps: state.wraps,
        })
export const utility = <T>(name: string, entry: Entry, scopeName?: string): T => {
        const rule = toRule(entry, scopeName)
        rules[name] = rule
        return chain(rule(root)) as T
}
export const group = (name: string, entries: Record<string, Entry>) => {
        const current = scoped[name] ?? Object.create(null)
        for (const [key, entry] of Object.entries(entries)) current[key] = toRule(entry)
        scoped[name] = current
}
export const values = (prop: string, entries: Record<string, string | number>): Record<string, RuntimeStyle> => Object.fromEntries(Object.entries(entries).map(([key, value]) => [key, { [prop]: value }]))
export const scopedRule =
        (scopeName: string, entry: Entry): Rule =>
        (state) => ({ ...toRule(entry)(state), scope: scopeName })
export const propertyRule = (prop: string, fn: (key: string) => any = (key) => key, greedy = false): Rule => readRule((key) => ({ [prop]: fn(key) }), greedy)
export const numericRule = (fn: (key: string) => RuntimeStyle): Rule => readRule((key) => (isNum(key) ? fn(key) : undefined))
export const scaleRule = (...props: string[]): Rule => numericRule((key) => Object.fromEntries(props.map((prop) => [prop, x4(key)])))
export const spacingRule = (...props: string[]): Rule => readRule((key) => {
        const value = isNum(key) ? x4(key) : isLength(key) ? key : key === 'auto' ? 'auto' : undefined
        if (!value) return undefined
        return Object.fromEntries(props.map((prop) => [prop, value]))
})
export const lengthRule = (prop: string, screen?: string): Rule => readRule((key) => {
        const value = lengthValue(key, screen ?? (/height|Height|blockSize|BlockSize/.test(prop) ? '100vh' : '100vw'))
        if (!value) return undefined
        return { [prop]: value }
})
export const colorRule = (prop: string): Rule => readRule((key, state) => {
        const value = colorValue(key)
        if (!state.dark) return { [prop]: value }
        const scheme = prop === 'background' ? { colorScheme: 'light dark' } : {}
        return { ...scheme, [prop]: `light-dark(${state.css[prop] ?? 'initial'}, ${value})` }
}, true)
export const positionRule = (...props: string[]): Rule => readRule((key) => {
        const value = lengthValue(key)
        if (!value) return undefined
        return Object.fromEntries(props.map((prop) => [prop, value]))
})
export const appendRule = (prop: string, fn: (key: string) => string | undefined): Rule => readRule((key, state) => {
        const value = fn(key)
        if (!value) return undefined
        const current = state.css[prop]
        return { [prop]: current && current !== 'none' ? `${current} ${value}` : value }
})
export const mediaRule = (value: string): Rule => variantRule(`media(width >= ${value})`)
export const variantRule =
        (value: string): Rule =>
        (state) => ({ ...state, wraps: [...(state.wraps ?? []), value] })
export const darkRule: Rule = (state) => ({ ...state, dark: true })
export const splitRule: Rule = (state) => state
export const flexRule: Rule = (state) => {
        const next = merge(state, { display: 'flex' }, 'flex')
        return { ...next, read: (key) => (isNum(key) ? merge(next, { flex: Number(key) }, 'flex') : undefined) }
}
export const borderWidthValue = (key: string) => {
        if (isNum(key)) return `${Number(key)}px`
        if (isLength(key)) return key === '0' ? '0px' : key
        return undefined
}
export const borderRule: Rule = (state) => {
        const next = merge(state, {}, 'border')
        return { ...next, read: (key) => {
                const width = borderWidthValue(key)
                if (width) return merge(next, { borderWidth: width })
                return merge(next, { borderColor: colorValue(key) })
        } }
}
export const borderSideRule =
        (...props: string[]): Rule =>
        (state) => {
                const next = merge(state, {})
                return { ...next, read: (key) => {
                        const width = borderWidthValue(key)
                        if (width) return merge(next, Object.fromEntries(props.map((prop) => [`${prop}Width`, width])))
                        return merge(next, Object.fromEntries(props.map((prop) => [`${prop}Color`, colorValue(key)])))
                } }
        }
export const outlineRule: Rule = (state) => {
        const next = merge(state, {}, 'outline')
        return { ...next, read: (key) => {
                const width = borderWidthValue(key)
                if (width) return merge(next, { outlineWidth: width })
                return merge(next, { outlineColor: colorValue(key) })
        } }
}
export const divideRule =
        (...props: string[]): Rule =>
        (state) => {
                const next = merge(state, Object.fromEntries(props.map((prop) => [prop, '1px'])), 'divide')
                return { ...next, read: (key) => {
                        const width = borderWidthValue(key)
                        if (width) return merge(next, Object.fromEntries(props.map((prop) => [prop, width])))
                        return merge(next, { borderColor: colorValue(key) })
                } }
        }
export const columnsRule: Rule = readRule((key) => ({ gridTemplateColumns: isNum(key) ? `repeat(${Number(key)}, minmax(0, 1fr))` : key }))
export const rowsRule: Rule = readRule((key) => ({ gridTemplateRows: isNum(key) ? `repeat(${Number(key)}, minmax(0, 1fr))` : key }))
export const columnRule: Rule = readRule((key) => ({ gridColumn: isNum(key) ? `span ${key} / span ${key}` : key }))
export const rowRule: Rule = readRule((key) => ({ gridRow: isNum(key) ? `span ${key} / span ${key}` : key }))
export const roundedValue = (key: string) => {
        if (key === 'full') return '9999px'
        if (key === 'none') return '0px'
        if (isNum(key)) return x4(key)
        if (isLength(key)) return key === '0' ? '0px' : key
        return undefined
}
export const roundedRule =
        (...props: string[]): Rule =>
        (state) => {
                const keys = props.length ? props : ['borderRadius']
                const next = merge(state, Object.fromEntries(keys.map((prop) => [prop, '4px'])), 'rounded')
                return { ...next, read: (key) => {
                        const value = roundedValue(key)
                        if (!value) return undefined
                        return merge(next, Object.fromEntries(keys.map((prop) => [prop, value])))
                } }
        }
export const sizeRule: Rule = readRule((key) => {
        const value = lengthValue(key)
        if (!value) return undefined
        return { height: value, width: value }
})
export const sizePropsRule = (heightProp: string, widthProp: string): Rule => readRule((key) => {
        const value = lengthValue(key)
        if (!value) return undefined
        return { [heightProp]: value, [widthProp]: value }
})
export const opacityRule = (prop: string): Rule => numericRule((key) => ({ [prop]: String(Number(key) / 100) }))
export const translateRule = (axis: 'X' | 'Y'): Rule => appendRule('transform', (key) => {
        const value = lengthValue(key)
        if (!value) return undefined
        return `translate${axis}(${value})`
})
export const transformRule = (name: string, unit = ''): Rule => appendRule('transform', (key) => {
        if (key === 'none') return 'none'
        if (!isNum(key)) return undefined
        return `${name}(${key}${unit})`
})
export const filterRule = (prop: string, name: string, unit = ''): Rule => appendRule(prop, (key) => {
        if (key === 'none') return 'none'
        if (!isNum(key)) return undefined
        return `${name}(${key}${unit})`
})
export const defaultFilterRule = (prop: string, name: string, value: string, unit = ''): Rule => (state) => {
        const current = state.css[prop]
        const nextValue = current && current !== 'none' ? `${current} ${name}(${value})` : `${name}(${value})`
        const next = merge(state, { [prop]: nextValue })
        return { ...next, read: (key) => {
                if (key === 'none') return merge(state, { [prop]: 'none' })
                if (!isNum(key)) return undefined
                const currentValue = state.css[prop]
                const keyedValue = `${name}(${key}${unit})`
                return merge(state, { [prop]: currentValue && currentValue !== 'none' ? `${currentValue} ${keyedValue}` : keyedValue })
        } }
}
export const textRule: Rule = (state) => ({
        css: state.css,
        dark: state.dark,
        greedy: true,
        read: (key) => {
                if (isNum(key)) return merge(state, { fontSize: x4(key) })
                const value = colorValue(key)
                if (!state.dark) return merge(state, { color: value })
                return merge(state, { color: `light-dark(${state.css.color ?? 'initial'}, ${value})` })
        },
        scope: 'text',
        wraps: state.wraps,
})
