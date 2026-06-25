// MATRIX-001/002 — App Router · Server Component · static + dynamic · three modes.
import { MARKER, RAW_VALUE, appBase, assertNoInvalid, definedSelectors, nextConfig, referencedClasses, serverPage, startServer } from './fixtures'
import { fetchStyles, test } from '../utils'

const modes = ['inline', 'head', 'file'] as const
const renders = ['static', 'dynamic'] as const

for (const render of renders) {
        for (const output of modes) {
                test(
                        `MATRIX-${render === 'static' ? '001' : '002'} app-router server component, ${render}, production, ${output}`,
                        {
                                fs: {
                                        ...appBase('tcss-next-app-server'),
                                        'next.config.mjs': nextConfig({ output }),
                                        'app/page.tsx': serverPage(render),
                                },
                        },
                        async ({ root, exec, expect, spawn }) => {
                                await exec('pnpm exec next build', { cwd: root, env: { NODE_ENV: 'production' } })
                                const { server, url } = await startServer(spawn, 'pnpm exec next start --port 0', root)
                                try {
                                        const html = await fetch(new URL('/', url)).then((r) => r.text())
                                        expect(html).toContain(MARKER)
                                        assertNoInvalid(expect, html)

                                        if (output === 'inline') {
                                                // inline: declarations on the element, no required collected rule.
                                                expect(html).toContain(RAW_VALUE)
                                        } else {
                                                // head/file: every referenced class resolves in collected styles.
                                                const sheet = (await fetchStyles(url, '/')) + '\n' + html
                                                const defined = definedSelectors(sheet)
                                                const missing = [...referencedClasses(html)].filter((c) => !defined.has(c))
                                                expect(missing).toEqual([])
                                                assertNoInvalid(expect, sheet)
                                        }
                                } finally {
                                        await server.dispose()
                                }
                        },
                )
        }
}
