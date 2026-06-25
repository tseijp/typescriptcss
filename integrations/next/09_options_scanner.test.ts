// OPTION-001..005 + invalid-output scanner (App Router Server Component, production).
import { MARKER, appBase, assertNoInvalid, definedSelectors, nextConfig, referencedClasses, serverPage, startServer } from './fixtures'
import { fetchStyles, test } from '../utils'

test('OPTION-001 classPrefix: HTML reference and CSS selector share the prefix', { fs: { ...appBase('tcss-next-prefix'), 'next.config.mjs': nextConfig({ output: 'file', classPrefix: 'xyz' }), 'app/page.tsx': serverPage('static') } }, async ({ root, exec, expect, spawn }) => {
        await exec('pnpm exec next build', { cwd: root, env: { NODE_ENV: 'production' } })
        const { server, url } = await startServer(spawn, 'pnpm exec next start --port 0', root)
        try {
                const html = await fetch(new URL('/', url)).then((r) => r.text())
                const sheet = (await fetchStyles(url, '/')) + '\n' + html
                const refs = [...referencedClasses(html, 'xyz')]
                expect(refs.length).toBeGreaterThan(0)
                expect(refs.filter((c) => !definedSelectors(sheet, 'xyz').has(c))).toEqual([])
                expect([...referencedClasses(html, 'tcss')]).toEqual([])
        } finally {
                await server.dispose()
        }
})

test('OPTION-003 minify: notation differs but referenced classes still resolve', { fs: { ...appBase('tcss-next-minify'), 'next.config.mjs': nextConfig({ output: 'file', minify: false }), 'app/page.tsx': serverPage('static') } }, async ({ root, exec, expect, spawn }) => {
        await exec('pnpm exec next build', { cwd: root, env: { NODE_ENV: 'production' } })
        const { server, url } = await startServer(spawn, 'pnpm exec next start --port 0', root)
        try {
                const html = await fetch(new URL('/', url)).then((r) => r.text())
                const sheet = (await fetchStyles(url, '/')) + '\n' + html
                const missing = [...referencedClasses(html)].filter((c) => !definedSelectors(sheet).has(c))
                expect(missing).toEqual([])
        } finally {
                await server.dispose()
        }
})

test('invalid-output scanner: no undefined/null/[object Object] and no dangling class across artifacts', { fs: { ...appBase('tcss-next-scanner'), 'next.config.mjs': nextConfig({ output: 'file' }), 'app/page.tsx': serverPage('static') } }, async ({ root, exec, expect, spawn }) => {
        await exec('pnpm exec next build', { cwd: root, env: { NODE_ENV: 'production' } })
        const { server, url } = await startServer(spawn, 'pnpm exec next start --port 0', root)
        try {
                const html = await fetch(new URL('/', url)).then((r) => r.text())
                const sheet = (await fetchStyles(url, '/')) + '\n' + html
                expect(html).toContain(MARKER)
                assertNoInvalid(expect, html)
                assertNoInvalid(expect, sheet)
                const missing = [...referencedClasses(html)].filter((c) => !definedSelectors(sheet).has(c))
                expect(missing).toEqual([])
        } finally {
                await server.dispose()
        }
})
