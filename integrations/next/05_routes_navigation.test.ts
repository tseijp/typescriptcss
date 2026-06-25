// ROUTE-001..006 — two routes with layout/shared/own styles.
// Direct-request rows (ROUTE-001/002/005/006) are observed via HTTP. Client-side
// navigation rows (ROUTE-003/004) need a browser driver not present in the shared
// harness and are recorded as a skipped RED so they are not silently dropped.
import { MARKER, appBase, assertNoInvalid, definedSelectors, nextConfig, referencedClasses, startServer } from './fixtures'
import { fetchStyles, test, tsx } from '../utils'

const layout = tsx`
	import { flex } from 'typescriptcss'
	export default function RootLayout({ children }: { children: React.ReactNode }) {
		return (<html lang="en"><body><header style={flex.row.gap[2]() as any}>nav</header>{children}</body></html>)
	}
`
const routeA = tsx`
	import { flex } from 'typescriptcss'
	export const dynamic = 'force-static'
	export default function A() {
		const shared = flex.col.gap[3].bg['rgb(11, 17, 32)']
		return <main><p>${MARKER}-A</p><div style={shared() as any}>shared</div><div style={flex.col.bg['rgb(1, 2, 3)']() as any}>ownA</div></main>
	}
`
const routeB = tsx`
	import { flex } from 'typescriptcss'
	export const dynamic = 'force-static'
	export default function B() {
		const shared = flex.col.gap[3].bg['rgb(11, 17, 32)']
		return <main><p>${MARKER}-B</p><div style={shared() as any}>shared</div><div style={flex.col.bg['rgb(4, 5, 6)']() as any}>ownB</div></main>
	}
`

for (const output of ['head', 'file'] as const) {
        test(
                `ROUTE-001/002/005 direct request to A and B resolves layout + shared + own (${output})`,
                {
                        fs: {
                                ...appBase('tcss-next-routes'),
                                'app/layout.tsx': layout,
                                'next.config.mjs': nextConfig({ output }),
                                'app/a/page.tsx': routeA,
                                'app/b/page.tsx': routeB,
                        },
                },
                async ({ root, exec, expect, spawn }) => {
                        await exec('pnpm exec next build', { cwd: root, env: { NODE_ENV: 'production' } })
                        const { server, url } = await startServer(spawn, 'pnpm exec next start --port 0', root)
                        try {
                                for (const [route, tag] of [
                                        ['/a', 'A'],
                                        ['/b', 'B'],
                                ] as const) {
                                        const html = await fetch(new URL(route, url)).then((r) => r.text())
                                        expect(html).toContain(`${MARKER}-${tag}`)
                                        const sheet = (await fetchStyles(url, route)) + '\n' + html
                                        const missing = [...referencedClasses(html)].filter((c) => !definedSelectors(sheet).has(c))
                                        expect(missing).toEqual([])
                                        assertNoInvalid(expect, sheet)
                                }
                        } finally {
                                await server.dispose()
                        }
                },
        )
}

test.skip('ROUTE-003/004 client navigation A↔B preserves shared+layout and brings own style — needs browser driver (RED, not dropped)', { fs: { ...appBase('tcss-next-routes-nav'), 'next.config.mjs': nextConfig({ output: 'file' }), 'app/a/page.tsx': routeA, 'app/b/page.tsx': routeB } }, async () => {
        throw new Error('client navigation observation requires a browser driver not present in the shared harness')
})
