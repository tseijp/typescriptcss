// MATRIX-003/004 — App Router · Client Component · static/dynamic parent · three modes.
// COMMON-007: client bundle must not need the typescriptcss runtime for the marker style.
import { MARKER, RAW_VALUE, appBase, assertNoInvalid, clientPage, definedSelectors, nextConfig, referencedClasses, startServer } from './fixtures'
import { fetchStyles, test, tsx } from '../utils'

const wrapper = (render: 'static' | 'dynamic') => tsx`
	import ClientPage from './client'
	export const dynamic = '${render === 'static' ? 'force-static' : 'force-dynamic'}'
	export default function Page() { return <ClientPage /> }
`

const modes = ['inline', 'head', 'file'] as const
const renders = ['static', 'dynamic'] as const

for (const render of renders) {
        for (const output of modes) {
                test(
                        `MATRIX-${render === 'static' ? '003' : '004'} app-router client component, ${render} parent, production, ${output}`,
                        {
                                fs: {
                                        ...appBase('tcss-next-app-client'),
                                        'next.config.mjs': nextConfig({ output }),
                                        'app/client.tsx': clientPage,
                                        'app/page.tsx': wrapper(render),
                                },
                        },
                        async ({ root, exec, expect, spawn }) => {
                                await exec('pnpm exec next build', { cwd: root, env: { NODE_ENV: 'production' } })
                                const { server, url } = await startServer(spawn, 'pnpm exec next start --port 0', root)
                                try {
                                        const html = await fetch(new URL('/', url)).then((r) => r.text())
                                        // server pre-render contains the marker (COMMON-002).
                                        expect(html).toContain(MARKER)
                                        assertNoInvalid(expect, html)
                                        if (output === 'inline') {
                                                expect(html).toContain(RAW_VALUE)
                                        } else {
                                                const sheet = (await fetchStyles(url, '/')) + '\n' + html
                                                const missing = [...referencedClasses(html)].filter((c) => !definedSelectors(sheet).has(c))
                                                expect(missing).toEqual([])
                                        }
                                } finally {
                                        await server.dispose()
                                }
                        },
                )
        }
}
