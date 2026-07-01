import type { Argument, C, Rule, RuntimeStyle, State } from './types.ts'
type Entry = RuntimeStyle | Rule
const root: State = { css: {} }
const rules: Record<string, Rule> = Object.create(null)
const scoped: Record<string, Record<string, Rule>> = Object.create(null)
const controlKeys = new Set<string>()
const childSelector = '& > :not(:last-child)'
const colorLogicalKeys = new Set(['inherit', 'current', 'transparent'])
const toRule = (entry: Entry, scopeName?: string): Rule => {
        if (typeof entry === 'function' && scopeName) return (state) => ({ ...(entry as Rule)(state), scope: scopeName })
        if (typeof entry === 'function') return entry as Rule
        return styleRule(entry, scopeName)
}
const wrapValue = (state: State, key: string, value: any) => (state.wraps ?? []).reduceRight((next, wrap) => `if(${wrap}: ${next}; else: ${state.css[key] ?? 'unset'})`, value)
const wrapped = (state: State, css: RuntimeStyle) => Object.fromEntries(Object.entries(css).map(([key, value]) => [key, wrapValue(state, key, value)]))
const isRecord = (value: any): value is Record<string, any> => value && typeof value === 'object' && !Array.isArray(value)
const assignCss = (...items: RuntimeStyle[]) => {
        const css: RuntimeStyle = {}
        for (const item of items) for (const [key, value] of Object.entries(item)) css[key] = isRecord(css[key]) && isRecord(value) ? { ...css[key], ...value } : value
        return css
}
const merge = (state: State, css: RuntimeStyle, scopeName?: string): State => {
        const keepWraps = scopeName || !Object.keys(css).length ? state.wraps : undefined
        return { css: assignCss(state.css, wrapped(state, css)), dark: state.dark, scope: scopeName, wraps: keepWraps }
}
const finalize = (state: State, styles: Argument[]) => {
        const [first, ...rest] = styles
        const applied = typeof first === 'number' || typeof first === 'string' ? state.call?.(String(first)) : undefined
        const css = applied ? applied.css : state.css
        const args = applied ? rest : styles
        return assignCss(css, ...(args.filter(isRecord) as RuntimeStyle[]))
}
const chain = (state: State): C =>
        new Proxy((...styles: Argument[]) => finalize(state, styles), {
                apply: (_target, _this, styles: Argument[]) => finalize(state, styles),
                get: (_target, prop) => resolve(state, prop),
        }) as C
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
export const spacingValue = (key: string) => `${4 * Number(key)}px`
export const isNum = (key: string) => Number.isFinite(Number(key))
export const isLength = (key: string) => key === '0' || /^-?\d*\.?\d+(px|rem|em|%|vw|vh|dvw|dvh|lvw|lvh|svw|svh|lh|rlh|ch|ex|cap|ic|vmin|vmax|cm|mm|in|pt|pc)$/.test(key)
export const colorValue = (key: string) => {
        if (key === 'currentColor') return undefined
        if (key === 'current') return 'currentColor'
        if (key.startsWith('--')) return `var(${key})`
        return key
}
const borderColorValue = (key: string) => (key === 'current' ? 'current' : colorValue(key))
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
const isContentSizeValue = (key: string) => key === 'min-content' || key === 'max-content' || key === 'fit-content'
type SizeValueOptions = { auto?: boolean; none?: boolean; screen?: string }
export const sizeValue = (key: string, options: SizeValueOptions = {}) => {
        if (isContentSizeValue(key)) return undefined
        const value = lengthValue(key, options.screen)
        if (value === 'auto' && options.auto === false) return undefined
        if (value === 'none' && !options.none) return undefined
        return value
}
export const styleRule =
        (css: RuntimeStyle, scopeName?: string): Rule =>
        (state) =>
                merge(state, css, scopeName)
export const displayRule =
        (display: string, entry: Entry): Rule =>
        (state) =>
                toRule(entry)(merge(state, { display }))
export const defaultDisplayRule =
        (display: string, entry: Entry): Rule =>
        (state) =>
                toRule(entry)(state.css.display === undefined ? merge(state, { display }) : state)
export const withoutDisplayRule =
        (entry: Entry): Rule =>
        (state) => {
                const { display: _display, ...css } = state.css
                return toRule(entry)({ ...state, css })
        }
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
export const propertyRule = (prop: string, fn: (key: string) => any = (key) => key, greedy = false): Rule =>
        readRule((key) => {
                const value = fn(key)
                return value === undefined ? undefined : { [prop]: value }
        }, greedy)
export const arbitraryValue = (key: string) => (isNum(key) || key.startsWith('--') ? `var(${key})` : key)
export const arbitraryRule = (prop: string): Rule => propertyRule(prop, arbitraryValue)
export const arbitraryColorRule = (prop: string): Rule =>
        readRule((key, state) => {
                const value = isNum(key) ? `var(${key})` : colorValue(key)
                if (!value) return undefined
                if (!state.dark) return { [prop]: value }
                return { [prop]: `light-dark(${state.css[prop] ?? 'initial'}, ${value})` }
        }, true)
export const numericRule = (fn: (key: string) => RuntimeStyle): Rule => readRule((key) => (isNum(key) ? fn(key) : undefined))
export const numericDefaultRule =
        (prop: string, value: string): Rule =>
        (state) => {
                const next = merge(state, { [prop]: value })
                return { ...next, read: (key) => (isNum(key) ? merge(next, { [prop]: key }) : undefined) }
        }
export const scaleRule = (...props: string[]): Rule => numericRule((key) => Object.fromEntries(props.map((prop) => [prop, x4(key)])))
export const callableScaleRule =
        (...props: string[]): Rule =>
        (state) => {
                const read = (key: string) => (isNum(key) ? merge(state, Object.fromEntries(props.map((prop) => [prop, x4(key)]))) : undefined)
                return { css: state.css, call: read, dark: state.dark, read, scope: state.scope, wraps: state.wraps }
        }
export const spacingRule = (...props: string[]): Rule =>
        readRule((key) => {
                const value = isNum(key) ? spacingValue(key) : isLength(key) ? key : key === 'auto' ? 'auto' : undefined
                if (!value) return undefined
                return Object.fromEntries(props.map((prop) => [prop, value]))
        })
export const splitSpacingRule = (numericProps: string[], valueProps: string[]): Rule =>
        readRule((key) => {
                const value = isNum(key) ? spacingValue(key) : isLength(key) ? key : key === 'auto' ? 'auto' : undefined
                if (!value) return undefined
                const props = isNum(key) ? numericProps : valueProps
                return Object.fromEntries(props.map((prop) => [prop, value]))
        })
export const lengthRule = (prop: string, screen?: string): Rule =>
        readRule((key) => {
                const value = lengthValue(key, screen ?? (/height|Height|blockSize|BlockSize/.test(prop) ? '100vh' : '100vw'))
                if (!value) return undefined
                return { [prop]: value }
        })
export const sizeLengthRule = (prop: string, screen?: string): Rule =>
        readRule((key) => {
                const value = sizeValue(key, { none: true, screen: screen ?? (/height|Height|blockSize|BlockSize/.test(prop) ? '100vh' : '100vw') })
                if (!value) return undefined
                return { [prop]: value }
        })
export const colorRule = (prop: string): Rule =>
        readRule((key, state) => {
                const value = colorValue(key)
                if (!value) return undefined
                if (!state.dark) return { [prop]: value } as unknown as Rule
                const scheme = prop === 'background' ? ({ colorScheme: 'light dark' } as unknown as Rule) : ({} as Rule)
                return { ...scheme, [prop]: `light-dark(${state.css[prop] ?? 'initial'}, ${value})` }
        }, true)
export const positionRule = (...props: string[]): Rule =>
        readRule((key) => {
                const value = lengthValue(key)
                if (!value) return undefined
                return Object.fromEntries(props.map((prop) => [prop, value]))
        })
export const splitPositionRule = (numericProps: string[], valueProps: string[]): Rule =>
        readRule((key) => {
                const value = lengthValue(key)
                if (!value) return undefined
                const props = isNum(key) ? numericProps : valueProps
                return Object.fromEntries(props.map((prop) => [prop, value]))
        })
export const insetRule: Rule = readRule((key) => {
        const value = isNum(key) ? `${Number(key)}px` : lengthValue(key)
        if (!value) return undefined
        return { inset: value }
})
export const appendRule = (prop: string, fn: (key: string) => string | undefined): Rule =>
        readRule((key, state) => {
                const value = fn(key)
                if (value === undefined) return undefined
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
        return { ...next, read: (key) => (isNum(key) ? merge(state, { flex: key }, 'flex') : undefined) }
}
export const borderWidthValue = (key: string) => {
        if (isNum(key)) return `${Number(key)}px`
        if (isLength(key)) return key === '0' ? '0px' : key
        return undefined
}
export const borderRule: Rule = (state) => {
        const next = merge(state, {}, 'border')
        return {
                ...next,
                read: (key) => {
                        const width = borderWidthValue(key)
                        if (width) return merge(next, { borderWidth: width })
                        const color = borderColorValue(key)
                        if (!color) return undefined
                        return merge(next, { borderColor: color })
                },
        }
}
export const borderSideRule =
        (...props: string[]): Rule =>
        (state) => {
                const next = merge(state, {})
                return {
                        ...next,
                        read: (key) => {
                                const width = borderWidthValue(key)
                                if (width) return merge(next, Object.fromEntries(props.map((prop) => [`${prop}Width`, width])))
                                const color = borderColorValue(key)
                                if (!color) return undefined
                                return merge(next, Object.fromEntries(props.map((prop) => [`${prop}Color`, color])))
                        },
                }
        }
export const splitBorderSideRule =
        (numericProps: string[], valueProps: string[]): Rule =>
        (state) => {
                const next = merge(state, {})
                return {
                        ...next,
                        read: (key) => {
                                const width = borderWidthValue(key)
                                if (width) return merge(next, Object.fromEntries((isNum(key) ? numericProps : valueProps).map((prop) => [`${prop}Width`, width])))
                                const color = borderColorValue(key)
                                if (!color) return undefined
                                return merge(next, Object.fromEntries((colorLogicalKeys.has(key) ? valueProps : numericProps).map((prop) => [`${prop}Color`, color])))
                        },
                }
        }
export const outlineRule: Rule = (state) => {
        const next = merge(state, {}, 'outline')
        return {
                ...next,
                read: (key) => {
                        const width = borderWidthValue(key)
                        if (width) return merge(next, { outlineWidth: width })
                        const color = colorValue(key)
                        if (!color) return undefined
                        return merge(next, { outlineColor: color })
                },
        }
}
export const divideRule =
        (zeroProp: string, widthProp: string): Rule =>
        (state) => {
                const next = merge(state, childStyle({ [zeroProp]: '0px', [widthProp]: '1px' }), 'divide')
                return {
                        ...next,
                        read: (key) => {
                                const width = borderWidthValue(key)
                                if (width) return merge(next, childStyle({ [zeroProp]: '0px', [widthProp]: width }))
                                const color = borderColorValue(key)
                                if (!color) return undefined
                                return merge(next, childStyle({ borderColor: color }))
                        },
                }
        }
export const divideColorRule: Rule = readRule((key) => {
        const color = borderColorValue(key)
        if (!color) return undefined
        return childStyle({ borderColor: color })
}, true)
export const childStyle = (css: RuntimeStyle): RuntimeStyle => ({ [childSelector]: css })
export const columnsRule: Rule = readRule((key) => ({ gridTemplateColumns: isNum(key) ? `repeat(${Number(key)}, minmax(0, 1fr))` : key }))
export const rowsRule: Rule = readRule((key) => ({ gridTemplateRows: isNum(key) ? `repeat(${Number(key)}, minmax(0, 1fr))` : key }))
export const columnRule: Rule = readRule((key) => ({ gridColumn: isNum(key) ? `span ${key} / span ${key}` : key }))
export const rowRule: Rule = readRule((key) => ({ gridRow: isNum(key) ? `span ${key} / span ${key}` : key }))
export const roundedValue = (key: string) => {
        if (key === 'full') return 'calc(infinity * 1px)'
        if (key === 'none') return '0px'
        if (isNum(key)) return x4(key)
        if (isLength(key)) return key === '0' ? '0px' : key
        return key
}
export const roundedRule =
        (...props: string[]): Rule =>
        (state) => {
                const keys = props.length ? props : ['borderRadius']
                const next = { ...state, scope: props.length ? undefined : 'rounded' }
                return {
                        ...next,
                        read: (key) => {
                                if (key === 'none' && keys.length > 1) return merge(next, Object.fromEntries(keys.map((prop, index) => [prop, index ? '0px' : '0'])))
                                const value = roundedValue(key)
                                if (!value) return undefined
                                return merge(next, Object.fromEntries(keys.map((prop) => [prop, value])))
                        },
                }
        }
export const sizeRule = (prop: string, options: SizeValueOptions = {}): Rule =>
        readRule((key) => {
                const value = sizeValue(key, options)
                if (!value) return undefined
                return { [prop]: value }
        })
export const sizePropsRule = (props: string[], options: SizeValueOptions = {}): Rule =>
        readRule((key) => {
                const value = sizeValue(key, options)
                if (!value) return undefined
                return Object.fromEntries(props.map((prop) => [prop, value]))
        })
export const defaultSizeRule =
        (css: RuntimeStyle, prop: string, scopeName?: string, options: SizeValueOptions = {}): Rule =>
        (state) => {
                const next = merge(state, css, scopeName)
                return {
                        ...next,
                        read: (key) => {
                                const value = sizeValue(key, options)
                                if (!value) return undefined
                                return merge(state, { [prop]: value }, scopeName)
                        },
                }
        }
export const opacityRule = (prop: string): Rule => numericRule((key) => ({ [prop]: `${key}%` }))
export const transitionRule: Rule = readRule((key) => ({ transitionProperty: key, transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)', transitionDuration: '150ms' }))
export const standaloneRule =
        (entry: Entry): Rule =>
        (state) =>
                toRule(entry)({ ...state, css: {} })
export const translateRule = (axis: 'X' | 'Y'): Rule =>
        appendRule('transform', (key) => {
                const value = lengthValue(key)
                if (!value) return undefined
                return `translate${axis}(${value})`
        })
export const individualTransformRule = (prop: string, unit = ''): Rule =>
        readRule((key) => {
                if (key === 'none') return { [prop]: 'none' }
                if (!isNum(key)) return undefined
                return { [prop]: `${key}${unit}` }
        })
export const scaleTransformRule: Rule = readRule((key) => {
        if (key === 'none') return { scale: 'none' }
        if (!isNum(key)) return undefined
        return { scale: `${key}% ${key}%` }
})
export const skewRule: Rule = readRule((key) => {
        if (!isNum(key)) return undefined
        return { transform: `skewX(${key}deg) skewY(${key}deg)` }
})
export const transformRule = (name: string, unit = ''): Rule =>
        appendRule('transform', (key) => {
                if (key === 'none') return 'none'
                if (!isNum(key)) return undefined
                return `${name}(${key}${unit})`
        })
export const filterRule = (prop: string, name: string, unit = '', none = 'none'): Rule =>
        appendRule(prop, (key) => {
                if (key === 'none') return none
                if (!isNum(key)) return undefined
                return `${name}(${key}${unit})`
        })
export const defaultFilterRule =
        (prop: string, name: string, value: string, unit = ''): Rule =>
        (state) => {
                const current = state.css[prop]
                const nextValue = current && current !== 'none' ? `${current} ${name}(${value})` : `${name}(${value})`
                const next = merge(state, { [prop]: nextValue })
                return {
                        ...next,
                        read: (key) => {
                                if (key === 'none') return merge(state, { [prop]: 'none' })
                                if (!isNum(key)) return undefined
                                const currentValue = state.css[prop]
                                const keyedValue = `${name}(${key}${unit})`
                                return merge(state, { [prop]: currentValue && currentValue !== 'none' ? `${currentValue} ${keyedValue}` : keyedValue })
                        },
                }
        }
export const textRule: Rule = (state) => ({
        css: state.css,
        dark: state.dark,
        greedy: true,
        read: (key) => {
                if (isNum(key)) return merge(state, { fontSize: key })
                const value = colorValue(key)
                if (!value) return undefined
                if (!state.dark) return merge(state, { color: value })
                return merge(state, { color: `light-dark(${state.css.color ?? 'initial'}, ${value})` })
        },
        scope: 'text',
        wraps: state.wraps,
})
