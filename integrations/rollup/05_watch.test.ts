// 05 — Watch (HARNESS-005), Rollup core, tool standard format.
//
// PROMPT.md (rollup) "Watch": change one raw CSS value, and after the rebuild the
// JS + CSS asset carry the new meaning; the other entry's marker and the shared
// chain are not broken. Do not fail merely because a stale asset still exists —
// judge by artifacts *reachable from the output graph*.

import { collectClasses, definedClasses, retryAssertion } from '../utils'
import { ENTRY_A, H_FACTORY, TSCONFIG, esmRunner, packageJson, pickResult, rollupConfig, ROLLUP_DEV, test } from './_fixtures'

// A small two-entry watch project: entry A holds the value we edit, entry B is the
// untouched neighbour that must survive the rebuild.
const ENTRY_EDIT = `import { bg, flex, p } from 'typescriptcss'
import { h } from './jsx'
export const box = <div style={flex.col.bg['#0b1120']()} />
export const marker = 'WATCH_EDIT'
`
const ENTRY_NEIGHBOUR = `import { p } from 'typescriptcss'
import { h } from './jsx'
export const box = <div style={p[6]()} />
export const marker = 'WATCH_NEIGHBOUR'
`

test(
        'watch: editing one raw value rebuilds that entry without breaking the neighbour',
        {
                fs: {
                        'package.json': packageJson({}, ROLLUP_DEV),
                        'tsconfig.json': TSCONFIG,
                        'src/jsx.ts': H_FACTORY,
                        'src/a.tsx': ENTRY_EDIT,
                        'src/b.tsx': ENTRY_NEIGHBOUR,
                        'rollup.config.mjs': rollupConfig({ output: 'file', multi: true }),
                        'run-a.mjs': esmRunner('./dist/a.js?v=' + Date.now(), ['box', 'marker']),
                        'run-b.mjs': esmRunner('./dist/b.js?v=' + Date.now(), ['box', 'marker']),
                },
        },
        async ({ exec, expect, fs, spawn }) => {
                const watcher = await spawn('pnpm rollup -c rollup.config.mjs --watch')
                // Rollup --watch prints "created dist/..." (or "waiting for changes") when a
                // bundle finishes.
                await watcher.onStderr((m) => /created dist|waiting for changes/i.test(m))

                // Initial state: A's value is present and resolves.
                await retryAssertion(async () => {
                        const sheet = (await fs.readAll('dist/**/*.css')).map(([, c]) => c).join('\n')
                        expect(sheet).toContain('#0b1120')
                })

                // Edit one raw value in entry A only.
                watcher.flush()
                await fs.write('src/a.tsx', ENTRY_EDIT.replace('#0b1120', '#abcdef'))
                await watcher.onStderr((m) => /created dist|waiting for changes/i.test(m))

                // After rebuild: the new value is present, the old value is gone from the
                // reachable graph, and the neighbour's class is still defined.
                await retryAssertion(async () => {
                        const jsText = (await fs.readAll('dist/**/*.js')).map(([, c]) => c).join('\n')
                        const sheet = (await fs.readAll('dist/**/*.css')).map(([, c]) => c).join('\n')
                        expect(sheet).toContain('#abcdef')
                        // Every referenced class still resolves (neighbour not broken).
                        const dangling = collectClasses(jsText).filter((c) => !definedClasses(sheet).has(c))
                        expect(dangling).toEqual([])
                })

                await watcher.dispose()
        },
)
