import { describe, it, expect } from 'vitest'
import { flex, sm, md, gap, p } from '../src/index.ts'

describe('VAR-VIEWPORT breakpoint segments wrap the following declaration', () => {
        it('sm wraps the immediately following scoped utility in a width query', () => {
                const out = flex.col.sm.flex.row()
                expect(out.flexDirection).toBe('if(media(width >= 640px): row; else: column)')
                expect(out.display).toBe('if(media(width >= 640px): flex; else: flex)')
        })
        it('md uses the 768px breakpoint', () => {
                const out = flex.md.flex.row()
                expect(out.flexDirection).toBe('if(media(width >= 768px): row; else: unset)')
        })
        it('sm and md tokens finalize to empty on their own', () => {
                expect(sm()).toEqual({})
                expect(md()).toEqual({})
        })
})

describe('VAR-VIEWPORT base value is used as the else branch', () => {
        it('a base flexDirection before the breakpoint becomes the else value', () => {
                const out = flex.col.sm.flex.row()
                expect(out.flexDirection).toBe('if(media(width >= 640px): row; else: column)')
        })
        it('with no base value the else branch is unset', () => {
                const out = flex.sm.flex.row()
                expect(out.flexDirection).toBe('if(media(width >= 640px): row; else: unset)')
        })
})

describe('VAR-VIEWPORT media scope is lost after the first non-scope merge (RED leak)', () => {
        it.fails('[RED bug] gap after a responsive direction should still be wrapped at the breakpoint', () => {
                const out = flex.col.sm.flex.row.gap[4]()
                expect(out.gap).toBe('if(media(width >= 640px): 16px; else: unset)')
        })
        it('observed behavior: the trailing gap escapes the media query entirely', () => {
                const out = flex.col.sm.flex.row.gap[4]()
                expect(out.gap).toBe('16px')
        })
        it('gap import kept honest', () => {
                expect(typeof gap).toBe('function')
                expect(typeof p).toBe('function')
        })
})
