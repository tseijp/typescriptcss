// MATRIX-007/008/009 — Pages Router: SSR, static, client hydration + custom _document/_app.
import { MARKER, RAW_VALUE, assertNoInvalid, definedSelectors, nextConfig, pagesBase, referencedClasses, startServer } from './fixtures'
import { fetchStyles, test, tsx } from '../utils'

const ssrPage = tsx`
	import { flex } from 'typescriptcss'
	export const getServerSideProps = async () => ({ props: {} })
	export default function Page() {
		const shared = flex.col.gap[3].p[6].bg['${RAW_VALUE}']
		return <main><p>${MARKER}</p><div style={shared() as any}>one</div></main>
	}
`

const staticPage = tsx`
	import { flex } from 'typescriptcss'
	export default function Page() {
		const shared = flex.col.gap[3].p[6].bg['${RAW_VALUE}']
		return <main><p>${MARKER}</p><div style={shared() as any}>one</div></main>
	}
`

const customDocument = tsx`
	import { Html, Head, Main, NextScript } from 'next/document'
	export default function Document() {
		return (<Html><Head /><body><Main /><NextScript /></body></Html>)
	}
`

const customApp = tsx`
	import type { AppProps } from 'next/app'
	export default function App({ Component, pageProps }: AppProps) { return <Component {...pageProps} /> }
`

for (const output of ['inline', 'head', 'file'] as const) {
        test(
                `MATRIX-007/008 pages router SSR + static, production, ${output}`,
                {
                        fs: {
                                ...pagesBase('tcss-next-pages'),
                                'next.config.mjs': nextConfig({ output }),
                                'pages/_document.tsx': customDocument,
                                'pages/_app.tsx': customApp,
                                'pages/index.tsx': ssrPage,
                                'pages/static.tsx': staticPage,
                        },
                },
                async ({ root, exec, expect, spawn }) => {
                        await exec('pnpm exec next build', { cwd: root, env: { NODE_ENV: 'production' } })
                        const { server, url } = await startServer(spawn, 'pnpm exec next start --port 0', root)
                        try {
                                for (const route of ['/', '/static']) {
                                        const html = await fetch(new URL(route, url)).then((r) => r.text())
                                        expect(html).toContain(MARKER)
                                        assertNoInvalid(expect, html)
                                        if (output !== 'inline') {
                                                const sheet = (await fetchStyles(url, route)) + '\n' + html
                                                const missing = [...referencedClasses(html)].filter((c) => !definedSelectors(sheet).has(c))
                                                expect(missing).toEqual([])
                                        } else {
                                                expect(html).toContain(RAW_VALUE)
                                        }
                                }
                        } finally {
                                await server.dispose()
                        }
                },
        )
}
