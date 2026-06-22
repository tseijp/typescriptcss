import { roots, scoped, stateOf } from './rules.ts'
import type { Item } from './types.ts'

export const readBalanced = (source: string, index: number, open: string, close: string) => {
        let depth = 1
        let i = index + 1
        let quote = ''
        for (; i < source.length && depth > 0; i++) {
                const value = source[i]
                if (quote && value === '\\') {
                        i++
                        continue
                }
                if (quote && value === quote) {
                        quote = ''
                        continue
                }
                if (quote) continue
                if (value === '"' || value === "'" || value === '`') {
                        quote = value
                        continue
                }
                if (value === open) depth++
                if (value === close) depth--
        }
        return depth ? undefined : i
}

export const tokenize = (source: string) => {
        source = source.trim()
        const head = /^[A-Za-z_$][A-Za-z0-9_$]*/.exec(source)?.[0]
        if (!head) return
        const items: Item[] = [{ type: 'head', name: head }]
        let call = ''
        let i = head.length
        for (; i < source.length; ) {
                const value = source[i]
                if (/\s/.test(value)) {
                        i++
                        continue
                }
                if (value === '.') {
                        const name = /^[A-Za-z_$][A-Za-z0-9_$]*/.exec(source.slice(i + 1))?.[0]
                        if (!name) return
                        items.push({ type: 'dot', name })
                        i += name.length + 1
                        continue
                }
                if (value === '[') {
                        const end = readBalanced(source, i, '[', ']')
                        if (!end) return
                        items.push({ type: 'index', raw: source.slice(i, end) })
                        i = end
                        continue
                }
                if (value !== '(') return
                const end = readBalanced(source, i, '(', ')')
                if (!end) return
                call = source.slice(i, end)
                i = end
        }
        if (!call) return
        return { call, items }
}

export const segment = (items: Item[]) => {
        const units: Item[][] = []
        let current: Item[] = []
        let state: any
        for (const item of items) {
                if (item.type === 'head') {
                        current = [item]
                        units.push(current)
                        state = stateOf(item.name)
                        continue
                }
                if (item.type === 'index') {
                        current.push(item)
                        if (state?.condition && state.any) continue
                        if (state?.scope === 'flex' && /^\[\s*-?\d/.test(item.raw)) continue
                        if (state?.scope === 'rounded') continue
                        state = {}
                        continue
                }
                const name = item.name
                const local = state?.scope && scoped[state.scope]?.has(name)
                const namedLength = state?.length && ['full', 'screen', 'dvh'].includes(name)
                const namedRead = state?.any && !roots.has(name)
                if (local || state?.greedy || namedLength || namedRead) {
                        current.push(item)
                        state = local && ['min', 'max'].includes(state.scope) && ['h', 'w'].includes(name) ? { length: true } : {}
                        continue
                }
                current = [item]
                units.push(current)
                state = stateOf(name)
        }
        return units
}

export const unitText = (unit: Item[]) => unit.map((item) => (item.type === 'index' ? item.raw : item.type === 'head' ? item.name : `.${item.name}`)).join('')
