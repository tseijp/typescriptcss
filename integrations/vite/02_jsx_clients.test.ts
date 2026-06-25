// VITE-PREACT / VITE-SOLID / VITE-QWIK — JSX client components, file-mode build smoke.
// Each row is an independent real build (no cross-framework reuse of evidence).
import { collectClasses, definedClasses } from '../utils'
import { MARKER, assertNoInvalid, pkg, preact, qwik, solid, test, viteConfig } from './_fixtures'

const cases = [
        { id: 'VITE-PREACT', fx: preact },
        { id: 'VITE-SOLID', fx: solid },
        { id: 'VITE-QWIK', fx: qwik },
]

for (const { id, fx } of cases) {
        test(
                `${id} file build: JSX style chain produces a resolved class + CSS asset`,
                {
                        fs: {
                                'package.json': pkg(fx.deps, fx.dev),
                                'vite.config.ts': viteConfig({ output: 'file', framework: fx.frameworkImport }),
                                ...fx.files(),
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
                },
        )
}
