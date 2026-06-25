// 04 — Build shape: multi-entry and dynamic import (Rollup core, FORMAT-ESM).
//
// PROMPT.md (rollup) "Build shape": multi-entry shares one chain + owns one;
// dynamic import places different styles in main vs lazy module. Chunk count /
// chunk names are NOT fixed — only that every required class reference resolves
// to a defined rule across the whole output graph.

import { collectClasses, definedClasses } from '../utils'
import { DYNAMIC_LAZY, DYNAMIC_MAIN, ENTRY_A, ENTRY_B, H_FACTORY, TSCONFIG, esmRunner, packageJson, pickResult, rollupConfig, ROLLUP_DEV, test } from './_fixtures'

test(
        'multi-entry: shared chain + per-entry chain all resolve across the output graph',
        {
                fs: {
                        'package.json': packageJson({}, ROLLUP_DEV),
                        'tsconfig.json': TSCONFIG,
                        'src/jsx.ts': H_FACTORY,
                        'src/a.tsx': ENTRY_A,
                        'src/b.tsx': ENTRY_B,
                        'rollup.config.mjs': rollupConfig({ output: 'file', multi: true }),
                        'run-a.mjs': esmRunner('./dist/a.js', ['shared', 'ownA', 'marker']),
                        'run-b.mjs': esmRunner('./dist/b.js', ['shared', 'ownB', 'marker']),
                },
        },
        async ({ exec, expect, fs }) => {
                await exec('pnpm rollup -c rollup.config.mjs')

                const a = pickResult(await exec('node run-a.mjs'))
                const b = pickResult(await exec('node run-b.mjs'))
                expect(a.marker).toBe('ENTRY_A')
                expect(b.marker).toBe('ENTRY_B')

                // All JS + all CSS across the graph.
                const jsText = (await fs.readAll('dist/**/*.js')).map(([, c]) => c).join('\n')
                const sheet = (await fs.readAll('dist/**/*.css')).map(([, c]) => c).join('\n')
                const defined = definedClasses(sheet)

                // Both entries reference classes; none dangle.
                const referenced = collectClasses(jsText)
                expect(referenced.length).toBeGreaterThan(0)
                expect(referenced.filter((c) => !defined.has(c))).toEqual([])

                // The shared chain produces one class shared by both entries (dedup): the
                // `shared` export of A and B must resolve to the same class token.
                const sharedA = (a.shared.className ?? '').trim()
                const sharedB = (b.shared.className ?? '').trim()
                expect(sharedA).not.toBe('')
                expect(sharedA).toBe(sharedB)
                // Per-entry classes differ.
                expect((a.ownA.className ?? '').trim()).not.toBe((b.ownB.className ?? '').trim())
        },
)

test(
        'dynamic import: main + lazy module classes both reach a defined rule',
        {
                fs: {
                        'package.json': packageJson({}, ROLLUP_DEV),
                        'tsconfig.json': TSCONFIG,
                        'src/jsx.ts': H_FACTORY,
                        'src/index.tsx': DYNAMIC_MAIN,
                        'src/lazy.tsx': DYNAMIC_LAZY,
                        'rollup.config.mjs': rollupConfig({ output: 'file' }),
                        // Exercise the dynamic boundary: import main, await load() for lazy.
                        'run.mjs': `import * as mod from './dist/index.js'
const lazy = await mod.load()
process.stdout.write('RESULT:' + JSON.stringify({ main: mod.main, lazy, marker: mod.marker }))
`,
                },
        },
        async ({ exec, expect, fs }) => {
                await exec('pnpm rollup -c rollup.config.mjs')

                const out = pickResult(await exec('node run.mjs'))
                expect(out.marker).toBe('DYNAMIC_MAIN')

                const jsText = (await fs.readAll('dist/**/*.js')).map(([, c]) => c).join('\n')
                const sheet = (await fs.readAll('dist/**/*.css')).map(([, c]) => c).join('\n')
                const defined = definedClasses(sheet)

                // main and lazy each produced a class, both defined in the (shared) asset graph.
                const mainClass = (out.main.className ?? '').trim()
                const lazyClass = (out.lazy.className ?? '').trim()
                expect(mainClass).toMatch(/tcss-/)
                expect(lazyClass).toMatch(/tcss-/)
                expect(mainClass).not.toBe(lazyClass)
                expect([mainClass, lazyClass].filter((c) => !defined.has(c))).toEqual([])

                // No dangling references anywhere.
                expect(collectClasses(jsText).filter((c) => !defined.has(c))).toEqual([])
        },
)
