// Output-mode oracle (MODE-INLINE/HEAD/FILE/AUTO) + CSS boundary (BOUNDARY-001..005),
// representative TSX (React) fixture — not fanned out across every framework.
import { collectClasses, declarationsForClass, definedClasses, ts } from '../utils'
import { RAW_VALUE, RAW_VALUE_2, assertNoInvalid, pkg, react, test, viteConfig } from './_fixtures'

const boundaryEntry = ts`
	import { createRoot } from 'react-dom/client'
	import { bg, css, flex, text } from 'typescriptcss'
	function App() {
	  return (
	    <main>
	      <div data-leading style={css.flex.col.bg['${RAW_VALUE}']() as any}>leading</div>
	      <div data-middle style={flex.col.css.bg['${RAW_VALUE}'].text['${RAW_VALUE_2}']() as any}>middle</div>
	      <div data-empty style={flex.col.css() as any}>emptyBack</div>
	      <div data-args style={flex.col.css.bg['${RAW_VALUE}']({ position: 'sticky' }) as any}>args</div>
	      <div data-dup1 style={flex.col.css.bg['${RAW_VALUE}']() as any}>dup1</div>
	      <div data-dup2 style={flex.col.css.bg['${RAW_VALUE}']() as any}>dup2</div>
	    </main>
	  )
	}
	createRoot(document.getElementById('app')!).render(<App />)
`

for (const output of ['inline', 'head', 'file', 'auto']) {
        test(
                `MODE-${output.toUpperCase()}: build succeeds and style placement is classified with no missing/invalid declarations`,
                {
                        fs: {
                                'package.json': pkg(react.deps, react.dev),
                                'vite.config.ts': viteConfig({ output, framework: react.frameworkImport }),
                                ...react.files(),
                        },
                },
                async ({ exec, expect, fs }) => {
                        await exec('pnpm vite build')
                        const js = (await fs.readAll('dist/**/*.js')).map(([, c]) => c).join('\n')
                        const htmlText = await fs.read('dist/index.html')
                        const sheet = htmlText + '\n' + (await fs.readAll('dist/**/*.css')).map(([, c]) => c).join('\n')
                        assertNoInvalid(expect, js)
                        assertNoInvalid(expect, sheet)
                        if (output === 'inline') {
                                expect(js).toContain(RAW_VALUE) // value stays inline in the bundle
                        } else {
                                // head/file/auto: referenced classes resolve to rules in the placement.
                                const refs = collectClasses(js)
                                expect(refs.filter((c) => !definedClasses(sheet).has(c))).toEqual([])
                        }
                },
        )
}

test(
        'BOUNDARY-001..005: css marker splits a chain across targets within one element',
        {
                fs: {
                        'package.json': pkg(react.deps, react.dev),
                        // inline base so the split front stays inline and the tail lands in the file.
                        'vite.config.ts': viteConfig({ output: 'inline', framework: react.frameworkImport }),
                        'index.html': '<!doctype html><html><head><meta charset="utf-8" /></head><body><div id="app"></div><script type="module" src="/src/main.tsx"></script></body></html>',
                        'src/main.tsx': boundaryEntry,
                },
        },
        async ({ exec, expect, fs }) => {
                await exec('pnpm vite build')
                const js = (await fs.readAll('dist/**/*.js')).map(([, c]) => c).join('\n')
                const sheet = (await fs.readAll('dist/**/*.css')).map(([, c]) => c).join('\n')

                // BOUNDARY-001/002: a class (file tail) is referenced and resolves.
                const refs = collectClasses(js)
                expect(refs.length).toBeGreaterThan(0)
                expect(refs.filter((c) => !definedClasses(sheet).has(c))).toEqual([])

                // BOUNDARY-004: the call-arg plain object is placed and present exactly once.
                const both = js + '\n' + sheet
                expect(both).toContain('sticky')

                // BOUNDARY-005: duplicate split usage does not multiply identical rules unboundedly.
                for (const c of [...definedClasses(sheet)]) {
                        const occ = (sheet.match(new RegExp(`\\.${c}\\s*\\{`, 'g')) ?? []).length
                        expect(occ).toBeLessThanOrEqual(1)
                }
                // BOUNDARY-003 (empty back) produced no dangling class.
                void declarationsForClass
                assertNoInvalid(expect, sheet)
        },
)
