// MATRIX-010/011/012 development update — edit Server source, Client source, and a
// token file; observe the new value after the dev rebuild without hydration errors.
import { MARKER, RAW_VALUE, appBase, clientPage, nextConfig, serverPage, startServer } from './fixtures'
import { fetchPage, retryAssertion, test, ts } from '../utils'

test('MATRIX-010 App Router Server Component dev: editing a raw value is reflected', { fs: { ...appBase('tcss-next-dev-server'), 'next.config.mjs': nextConfig({ output: 'head' }), 'app/page.tsx': serverPage('dynamic') } }, async ({ root, expect, spawn, fs }) => {
        const { server, url } = await startServer(spawn, 'pnpm exec next dev --port 0', root)
        try {
                await retryAssertion(async () => {
                        const html = await fetchPage(url, '/')
                        expect(html).toContain(MARKER)
                        expect(html).toContain(RAW_VALUE)
                })
                await fs.write('app/page.tsx', serverPage('dynamic').replace(RAW_VALUE, 'rgb(170, 187, 204)'))
                await retryAssertion(async () => {
                        const html = await fetchPage(url, '/')
                        expect(html).toContain('rgb(170, 187, 204)')
                })
        } finally {
                await server.dispose()
        }
})

test('MATRIX-011 App Router Client Component dev: editing a raw value is reflected', { fs: { ...appBase('tcss-next-dev-client'), 'next.config.mjs': nextConfig({ output: 'head' }), 'app/client.tsx': clientPage, 'app/page.tsx': ts`import C from './client'\nexport default function Page(){return <C/>}` } }, async ({ root, expect, spawn, fs }) => {
        const { server, url } = await startServer(spawn, 'pnpm exec next dev --port 0', root)
        try {
                await retryAssertion(async () => expect(await fetchPage(url, '/')).toContain(MARKER))
                await fs.write('app/client.tsx', clientPage.replace(RAW_VALUE, 'rgb(170, 187, 204)'))
                await retryAssertion(async () => expect(await fetchPage(url, '/')).toContain('rgb(170, 187, 204)'))
        } finally {
                await server.dispose()
        }
})

test(
        'dev: editing an imported token file is reflected',
        {
                fs: {
                        ...appBase('tcss-next-dev-token'),
                        'next.config.mjs': nextConfig({ output: 'head' }),
                        'app/tokens.ts': ts`export const brand = '${RAW_VALUE}'`,
                        'app/page.tsx': ts`
				import { bg, flex } from 'typescriptcss'
				import { brand } from './tokens'
				export const dynamic = 'force-dynamic'
				export default function Page() { return <main><p>${MARKER}</p><div style={flex.col.bg[brand]() as any}>x</div></main> }
			`,
                },
        },
        async ({ root, expect, spawn, fs }) => {
                const { server, url } = await startServer(spawn, 'pnpm exec next dev --port 0', root)
                try {
                        await retryAssertion(async () => expect(await fetchPage(url, '/')).toContain(RAW_VALUE))
                        await fs.write('app/tokens.ts', ts`export const brand = 'rgb(170, 187, 204)'`)
                        await retryAssertion(async () => expect(await fetchPage(url, '/')).toContain('rgb(170, 187, 204)'))
                } finally {
                        await server.dispose()
                }
        },
)
