// MATRIX-005/006 — App Router · Server + Client siblings sharing one chain + own chains.
// One compile graph's collected rule must not erase the other's.
import { MARKER, RAW_VALUE, RAW_VALUE_2, appBase, assertNoInvalid, definedSelectors, nextConfig, referencedClasses, startServer } from './fixtures'
import { fetchStyles, test, tsx } from '../utils'

const clientChild = tsx`
	'use client'
	import { flex } from 'typescriptcss'
	export default function ClientChild() {
		const shared = flex.col.gap[3].bg['${RAW_VALUE}']
		return <div data-client style={shared({ outlineColor: '${RAW_VALUE_2}' }) as any}>client</div>
	}
`

const serverParent = tsx`
	import { flex } from 'typescriptcss'
	import ClientChild from './client-child'
	export const dynamic = 'force-static'
	export default function Page() {
		const shared = flex.col.gap[3].bg['${RAW_VALUE}']
		return (
			<main>
				<p>${MARKER}</p>
				<div data-server style={shared() as any}>server</div>
				<ClientChild />
			</main>
		)
	}
`

for (const output of ['inline', 'head', 'file'] as const) {
        test(
                `MATRIX-005 server+client siblings, static, production, ${output}`,
                {
                        fs: {
                                ...appBase('tcss-next-mixed'),
                                'next.config.mjs': nextConfig({ output }),
                                'app/client-child.tsx': clientChild,
                                'app/page.tsx': serverParent,
                        },
                },
                async ({ root, exec, expect, spawn }) => {
                        await exec('pnpm exec next build', { cwd: root, env: { NODE_ENV: 'production' } })
                        const { server, url } = await startServer(spawn, 'pnpm exec next start --port 0', root)
                        try {
                                const html = await fetch(new URL('/', url)).then((r) => r.text())
                                expect(html).toContain(MARKER)
                                assertNoInvalid(expect, html)
                                if (output !== 'inline') {
                                        const sheet = (await fetchStyles(url, '/')) + '\n' + html
                                        // Both server and client referenced classes resolve — neither graph erased the other.
                                        const missing = [...referencedClasses(html)].filter((c) => !definedSelectors(sheet).has(c))
                                        expect(missing).toEqual([])
                                } else {
                                        expect(html).toContain(RAW_VALUE)
                                }
                        } finally {
                                await server.dispose()
                        }
                },
        )
}
