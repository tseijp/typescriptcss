// Options (OPTION-001..006) — Vanilla/TSX production fixture only, no per-framework fan-out.
import { collectClasses, definedClasses } from '../utils'
import { RAW_VALUE, pkg, react, test, viteConfig } from './_fixtures'

const base = () => ({ 'package.json': pkg(react.deps, react.dev), ...react.files() })

test('OPTION-003 classPrefix: HTML/JS reference and CSS selector share the prefix', { fs: { ...base(), 'vite.config.ts': viteConfig({ output: 'file', framework: react.frameworkImport, pluginExtra: "classPrefix: 'xyz'" }) } }, async ({ exec, expect, fs }) => {
        await exec('pnpm vite build')
        const js = (await fs.readAll('dist/**/*.js')).map(([, c]) => c).join('\n')
        const sheet = (await fs.readAll('dist/**/*.css')).map(([, c]) => c).join('\n')
        const refs = collectClasses(js, { prefix: 'xyz' })
        expect(refs.length).toBeGreaterThan(0)
        expect(refs.filter((c) => !definedClasses(sheet, { prefix: 'xyz' }).has(c))).toEqual([])
        expect(collectClasses(js, { prefix: 'tcss' })).toEqual([])
})

test('OPTION-004 fileName: HTML reaches the named asset', { fs: { ...base(), 'vite.config.ts': viteConfig({ output: 'file', framework: react.frameworkImport, pluginExtra: "fileName: 'app-tcss.css'" }) } }, async ({ exec, expect, fs }) => {
        await exec('pnpm vite build')
        expect((await fs.glob('dist/**/app-tcss.css')).length).toBeGreaterThan(0)
        const htmlText = await fs.read('dist/index.html')
        expect(htmlText).toContain('app-tcss.css')
})

test(
        'OPTION-005 minify: minify on/off keeps the same defined class set',
        {
                fs: {
                        ...base(),
                        'vite.min.ts': viteConfig({ output: 'file', framework: react.frameworkImport, pluginExtra: 'minify: true' }),
                        'vite.pretty.ts': viteConfig({ output: 'file', framework: react.frameworkImport, pluginExtra: 'minify: false' }),
                },
        },
        async ({ exec, expect, fs }) => {
                await exec('pnpm vite build --config vite.min.ts --outDir dist-min')
                await exec('pnpm vite build --config vite.pretty.ts --outDir dist-pretty')
                const min = (await fs.readAll('dist-min/**/*.css')).map(([, c]) => c).join('\n')
                const pretty = (await fs.readAll('dist-pretty/**/*.css')).map(([, c]) => c).join('\n')
                expect([...definedClasses(min)].sort()).toEqual([...definedClasses(pretty)].sort())
        },
)

test('OPTION-001/002 include & exclude: only targeted source is transformed', { fs: { ...base(), 'vite.config.ts': viteConfig({ output: 'file', framework: react.frameworkImport, pluginExtra: 'exclude: /main\\.tsx$/' }) } }, async ({ exec, expect, fs }) => {
        await exec('pnpm vite build')
        // main.tsx excluded → its style chain stays inline (raw value in JS, no class collected).
        const js = (await fs.readAll('dist/**/*.js')).map(([, c]) => c).join('\n')
        expect(js).toContain(RAW_VALUE)
})
