import { utility } from './rules.ts'

const runtimeConditions = new Set(['dark', 'md', 'sm'])
const modulePattern = /import\s*\{([\s\S]*?)\}\s*from\s*(['"])([^'"]+)\2/g

export const importable = (name: string) => utility.has(name) || runtimeConditions.has(name)

const sourceModule = (value: string) => value === 'typescriptcss' || value === 'typescriptcss/src' || value.endsWith('/typescriptcss') || value.endsWith('/typescriptcss/src')

const localName = (value: string) =>
        value
                .split(/\s+as\s+/)
                .at(-1)
                ?.trim() ?? value.trim()

const namesOf = (value: string) =>
        value
                .split(',')
                .map((part) => localName(part))
                .filter(Boolean)

const mergeNames = (current: string, required: Set<string>) => {
        const names = new Set(namesOf(current))
        for (const name of required) names.add(name)
        return [...names].sort().join(', ')
}

export const updateImports = (source: string, required: Set<string>) => {
        if (!required.size) return source
        let done = false
        const updated = source.replace(modulePattern, (match, current: string, quote: string, specifier: string) => {
                if (done || !sourceModule(specifier)) return match
                done = true
                return `import { ${mergeNames(current, required)} } from ${quote}${specifier}${quote}`
        })
        if (done) return updated
        return `import { ${[...required].sort().join(', ')} } from 'typescriptcss/src'\n${source}`
}
