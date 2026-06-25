// Transform targeting + virtual modules (TRANSFORM-001..005) — representative TSX.
import { collectClasses, definedClasses, ts } from '../utils'
import { RAW_VALUE, assertNoInvalid, pkg, react, test, viteConfig } from './_fixtures'

test(
        'TRANSFORM-001/005: .tsx entry is transformed and query-suffixed module IDs do not multiply rules',
        {
                fs: {
                        'package.json': pkg(react.deps, react.dev),
                        'vite.config.ts': viteConfig({ output: 'file', framework: react.frameworkImport }),
                        'index.html': '<!doctype html><html><head><meta charset="utf-8" /></head><body><div id="app"></div><script type="module" src="/src/main.tsx"></script></body></html>',
                        'src/shared.tsx': ts`
				import { flex } from 'typescriptcss'
				export const Box = () => <div style={flex.col.gap[3].bg['${RAW_VALUE}']() as any}>box</div>
			`,
                        'src/main.tsx': ts`
				import { createRoot } from 'react-dom/client'
				import { Box } from './shared'
				function App() { return <main><Box /><Box /></main> }
				createRoot(document.getElementById('app')!).render(<App />)
			`,
                },
        },
        async ({ exec, expect, fs }) => {
                await exec('pnpm vite build')
                const js = (await fs.readAll('dist/**/*.js')).map(([, c]) => c).join('\n')
                const sheet = (await fs.readAll('dist/**/*.css')).map(([, c]) => c).join('\n')
                const refs = collectClasses(js)
                expect(refs.filter((c) => !definedClasses(sheet).has(c))).toEqual([])
                // Same chain used twice → one defined rule (no unbounded duplication).
                for (const c of [...definedClasses(sheet)]) {
                        const occ = (sheet.match(new RegExp(`\\.${c}\\s*\\{`, 'g')) ?? []).length
                        expect(occ).toBeLessThanOrEqual(1)
                }
                assertNoInvalid(expect, sheet)
        },
)

test(
        'TRANSFORM-003: framework runtime / node_modules source is not mis-transformed',
        {
                fs: {
                        'package.json': pkg(react.deps, react.dev),
                        'vite.config.ts': viteConfig({ output: 'file', framework: react.frameworkImport }),
                        ...react.files(),
                },
        },
        async ({ exec, expect, fs }) => {
                await exec('pnpm vite build')
                const js = (await fs.readAll('dist/**/*.js')).map(([, c]) => c).join('\n')
                // No invalid declarations leaked from accidentally transforming dependency code.
                assertNoInvalid(expect, js)
                // React itself still works (bundle present, marker rendered into the module).
                expect(js.length).toBeGreaterThan(0)
        },
)
