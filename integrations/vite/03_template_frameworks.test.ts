// VITE-VUE / VITE-SVELTE / VITE-LIT — SFC / template / shadow-root frameworks.
//
// These bind styles via non-JSX surfaces (Vue :style, Svelte style=, Lit
// styleMap). The plugin transform only rewrites JSX `style` attributes, so for
// head/file collection these are expected RED until the plugin reaches the
// frameworks' compiled modules. inline (runtime object) should still render.
import { MARKER, RAW_VALUE, assertNoInvalid, expectResolved, lit, pkg, svelte, test, viteConfig, vue } from './_fixtures'

const cases = [
        { id: 'VITE-VUE', fx: vue },
        { id: 'VITE-SVELTE', fx: svelte },
        { id: 'VITE-LIT', fx: lit },
]

for (const { id, fx } of cases) {
        test(
                `${id} inline build: framework compile keeps the runtime marker style`,
                {
                        fs: {
                                'package.json': pkg(fx.deps, fx.dev),
                                'vite.config.ts': viteConfig({ output: 'inline', framework: fx.frameworkImport }),
                                ...fx.files(),
                        },
                },
                async ({ exec, expect, fs }) => {
                        await exec('pnpm vite build')
                        const js = (await fs.readAll('dist/**/*.js')).map(([, c]) => c).join('\n')
                        // Marker text survives the framework compile, and the raw value is present
                        // somewhere in the runtime bundle (style applied at runtime).
                        expect(js).toContain(MARKER)
                        expect(js).toContain(RAW_VALUE)
                        assertNoInvalid(expect, js)
                },
        )

        test(
                `${id} file build: collected marker style is reachable from the document (expected RED for non-JSX binding)`,
                {
                        fs: {
                                'package.json': pkg(fx.deps, fx.dev),
                                'vite.config.ts': viteConfig({ output: 'file', framework: fx.frameworkImport }),
                                ...fx.files(),
                        },
                },
                async ({ exec, expect, fs }) => {
                        await exec('pnpm vite build')
                        const htmlText = await fs.read('dist/index.html')
                        const js = (await fs.readAll('dist/**/*.js')).map(([, c]) => c).join('\n')
                        const sheet = (await fs.readAll('dist/**/*.css')).map(([, c]) => c).join('\n')
                        // RED: a collected class should be referenced (in HTML or compiled JS) and
                        // resolve to a rule. Non-JSX style bindings are not yet collected → fails.
                        expectResolved(expect, htmlText + '\n' + js, sheet)
                        assertNoInvalid(expect, sheet)
                },
        )
}
