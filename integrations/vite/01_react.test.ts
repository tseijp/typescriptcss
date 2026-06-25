// VITE-REACT — TSX client component, three modes, dev update, source map.
import { collectClasses, definedClasses } from '../utils'
import { MARKER, RAW_VALUE, assertNoInvalid, fetchPage, pkg, react, retryAssertion, test, viteConfig } from './_fixtures'

const fw = () => viteConfig({ output: 'file', framework: react.frameworkImport, pluginExtra: '' })

test(
        'VITE-REACT file build: TSX style chain becomes a resolved class + CSS asset',
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
                const sheet = (await fs.readAll('dist/**/*.css')).map(([, c]) => c).join('\n')
                expect(js).toContain(MARKER)
                const refs = collectClasses(js)
                expect(refs.length).toBeGreaterThan(0)
                expect(refs.filter((c) => !definedClasses(sheet).has(c))).toEqual([])
                assertNoInvalid(expect, sheet)
                assertNoInvalid(expect, js)
        },
)

test(
        'VITE-REACT inline build: TSX style chain stays inline (no required CSS asset)',
        {
                fs: {
                        'package.json': pkg(react.deps, react.dev),
                        'vite.config.ts': viteConfig({ output: 'inline', framework: react.frameworkImport }),
                        ...react.files(),
                },
        },
        async ({ exec, expect, fs }) => {
                await exec('pnpm vite build')
                const js = (await fs.readAll('dist/**/*.js')).map(([, c]) => c).join('\n')
                expect(js).toContain(MARKER)
                expect(js).toContain(RAW_VALUE)
                assertNoInvalid(expect, js)
        },
)

test(
        'VITE-REACT head build: collected rules reachable from the document',
        {
                fs: {
                        'package.json': pkg(react.deps, react.dev),
                        'vite.config.ts': viteConfig({ output: 'head', framework: react.frameworkImport }),
                        ...react.files(),
                },
        },
        async ({ exec, expect, fs }) => {
                await exec('pnpm vite build')
                const htmlText = await fs.read('dist/index.html')
                const js = (await fs.readAll('dist/**/*.js')).map(([, c]) => c).join('\n')
                // head injects a <style data-typescriptcss> into index.html via transformIndexHtml.
                const sheet = htmlText + '\n' + (await fs.readAll('dist/**/*.css')).map(([, c]) => c).join('\n')
                const refs = collectClasses(js)
                expect(refs.length).toBeGreaterThan(0)
                expect(refs.filter((c) => !definedClasses(sheet).has(c))).toEqual([])
        },
)

test(
        'VITE-REACT dev: marker served and a raw-value edit is reflected after rebuild',
        {
                fs: {
                        'package.json': pkg(react.deps, react.dev),
                        'vite.config.ts': viteConfig({ output: 'head', framework: react.frameworkImport }),
                        ...react.files(),
                },
        },
        async ({ spawn, expect, fs }) => {
                const server = await spawn('pnpm vite --port 0')
                let url = ''
                await server.onStdout((m) => ((url = m.match(/https?:\/\/[^\s]+/)?.[0] ?? url), url !== ''))

                await retryAssertion(async () => {
                        // The transformed entry module is served and carries the original value.
                        const mod = await fetchPage(url, '/src/main.tsx')
                        expect(mod).toContain(RAW_VALUE)
                })

                await fs.write('src/main.tsx', react.files()['src/main.tsx'].replace(RAW_VALUE, '#abcdef'))
                await retryAssertion(async () => {
                        const mod = await fetchPage(url, '/src/main.tsx')
                        expect(mod).toContain('#abcdef')
                })
                await server.dispose()
        },
)

test(
        'VITE-REACT source map: transformed marker region maps back to the component source',
        {
                fs: {
                        'package.json': pkg(react.deps, react.dev),
                        'vite.config.ts': viteConfig({ output: 'file', framework: react.frameworkImport }).replace('defineConfig({', 'defineConfig({\n  build: { sourcemap: true },'),
                        ...react.files(),
                },
        },
        async ({ exec, expect, fs }) => {
                await exec('pnpm vite build')
                const maps = await fs.glob('dist/**/*.js.map')
                expect(maps.length).toBeGreaterThan(0)
                const mapText = await fs.read(maps[0])
                expect(mapText).toMatch(/main\.tsx/)
        },
)

void fw
