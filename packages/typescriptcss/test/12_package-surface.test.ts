import { describe, it, expect } from 'vitest'
import * as entry from '../src/index.ts'
import { flex, bg } from '../src/index.ts'
import { isPlainStyle, assertNoLeakedMarkers } from './_helpers.ts'

const README_API = ['flex', 'text', 'bg', 'gap', 'p', 'rounded', 'dark', 'css', 'sm', 'md', 'define']

describe('PACKAGE-001 README API is reachable from the public entry', () => {
        for (const name of README_API) {
                it(`${name} is exported`, () => {
                        expect(name in entry).toBe(true)
                        expect((entry as Record<string, unknown>)[name]).toBeDefined()
                })
        }
})

describe('PACKAGE-002 type-only information does not leak into runtime values', () => {
        it('no exported member is a TypeScript-only artifact (all are chains or define)', () => {
                for (const [name, value] of Object.entries(entry)) {
                        expect(typeof value, name).toBe('function')
                }
        })
})

describe('PACKAGE-003 finished style is a plain object usable without runtime', () => {
        it('a chain call returns a structurally plain object', () => {
                const out = flex.col.gap[4].bg['#0b1120']()
                expect(isPlainStyle(out)).toBe(true)
                expect(assertNoLeakedMarkers(out)).toEqual([])
                expect(Object.getPrototypeOf(out)).toBe(Object.prototype)
        })
})

describe('PACKAGE-004 unused utilities do not change a used style object', () => {
        it('touching other exports has no effect on an already-built style', () => {
                const before = flex.col()
                void entry.rounded
                void entry.text
                void bg['#000']()
                const after = flex.col()
                expect(after).toEqual(before)
        })
})

describe('PACKAGE-006 registry is module-shared and deterministic across imports', () => {
        it('two references to the same module observe the same registry behavior', async () => {
                const again = await import('../src/index.ts')
                expect(again.flex).toBe(entry.flex)
                expect(again.flex.col()).toEqual(flex.col())
        })
})
