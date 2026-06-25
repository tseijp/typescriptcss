// Static export — every emitted HTML page's class references resolve in the export dir.
import { MARKER, appBase, assertNoInvalid, definedSelectors, nextConfig, referencedClasses, serverPage } from './fixtures'
import { test } from '../utils'

test(
        'static export: each out/ HTML page resolves its class references to head style or CSS asset',
        {
                fs: {
                        ...appBase('tcss-next-export'),
                        'next.config.mjs': nextConfig({ output: 'file', staticExport: true }),
                        'app/page.tsx': serverPage('static'),
                },
        },
        async ({ root, exec, expect, fs }) => {
                await exec('pnpm exec next build', { cwd: root, env: { NODE_ENV: 'production' } })

                const htmlPages = await fs.readAll('out/**/*.html')
                expect(htmlPages.length).toBeGreaterThan(0)
                const cssText = (await fs.readAll('out/**/*.css')).map(([, c]) => c).join('\n')

                for (const [, html] of htmlPages) {
                        if (!html.includes(MARKER)) continue
                        const sheet = cssText + '\n' + html // head style or asset
                        const missing = [...referencedClasses(html)].filter((c) => !definedSelectors(sheet).has(c))
                        expect(missing).toEqual([])
                        assertNoInvalid(expect, html)
                }
        },
)
