import { importable, updateImports } from './imports.ts'
import { readBalanced, segment, tokenize, unitText } from './parse.ts'
import { bucket, conditions, first, native, pseudo, responsive } from './rules.ts'
import type { Item, Segment } from '../types.ts'
const split = (units: Item[][]) => {
        const segments: Segment[] = []
        let current: Segment = { conditions: [], units: [] }
        const push = () => {
                if (!current.conditions.length && !current.units.length) return
                segments.push(current)
                current = { conditions: [], units: [] }
        }
        for (const unit of units) {
                if (!conditions.has(first(unit))) {
                        current.units.push(unit)
                        continue
                }
                if (current.units.length) push()
                current.conditions.push(unit)
        }
        push()
        return segments
}
const rank = (part: Segment) => {
        if (part.conditions.some((unit) => pseudo.has(first(unit)))) return 120
        if (part.conditions.some((unit) => responsive.has(first(unit)))) return 110
        return 0
}
const sortUnits = (units: Item[][]) =>
        units
                .map((unit, index) => ({ index, unit }))
                .sort((a, b) => bucket(a.unit) - bucket(b.unit) || a.index - b.index)
                .map(({ unit }) => unit)
const sortSegments = (segments: Segment[]) => segments.map((part) => ({ ...part, units: sortUnits(part.units) })).sort((a, b) => rank(a) - rank(b))
export const sortChain = (source: string) => {
        const tokenized = tokenize(source)
        if (!tokenized) return source
        const result: Segment[] = []
        let pending: Segment[] = []
        const flush = () => {
                result.push(...sortSegments(pending))
                pending = []
        }
        for (const part of split(segment(tokenized.items))) {
                if (!part.conditions.some((unit) => first(unit) === 'dark')) {
                        pending.push(part)
                        continue
                }
                flush()
                result.push({ ...part, units: sortUnits(part.units) })
        }
        flush()
        const head = result[0]
        const headUnit = head?.units[0]
        if (head?.conditions.length === 0 && headUnit && native.has(first(headUnit))) {
                const index = head.units.findIndex((unit) => !native.has(first(unit)))
                if (index > 0) head.units.unshift(head.units.splice(index, 1)[0])
        }
        return (
                result
                        .flatMap((part) => [...part.conditions, ...part.units])
                        .map(unitText)
                        .join('.') + tokenized.call
        )
}
export const transform = (source: string) => {
        let output = ''
        let index = 0
        const required = new Set<string>()
        for (;;) {
                const found = source.indexOf('style={', index)
                if (found < 0) return updateImports(output + source.slice(index), required)
                const start = found + 7
                output += source.slice(index, found)
                if (source[start] === '{') {
                        output += source.slice(found, start)
                        index = start
                        continue
                }
                const end = readBalanced(source, start - 1, '{', '}')
                if (!end) return updateImports(output + source.slice(found), required)
                const sorted = sortChain(source.slice(start, end - 1))
                // @ts-ignore @TODO FIX
                const name = tokenize(sorted)?.items[0]?.name
                if (name && importable(name)) required.add(name)
                output += `style={${sorted}}`
                index = end
        }
}
