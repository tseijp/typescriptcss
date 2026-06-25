// ENGINE-001..004 — same App Router smoke fixture across Turbopack and webpack.
//
// OBSERVED (plugin-next/src/index.ts): the webpack branch forces
// `{ output: 'inline', inlineOnly: true }`, while the turbopack branch forwards
// the requested `output`. So head/file placement is engine-dependent: webpack
// only ever produces inline. These tests classify each engine's placement and
// surface the divergence (RED where placement is requested but not honoured).
import { MARKER, RAW_VALUE, appBase, assertNoInvalid, definedSelectors, nextConfig, referencedClasses, serverPage, startServer } from './fixtures'
import { fetchStyles, test } from '../utils'

test('ENGINE-001 Turbopack dev: loader transforms source once and serves the marker', { fs: { ...appBase('tcss-next-turbo-dev'), 'next.config.mjs': nextConfig({ output: 'head' }), 'app/page.tsx': serverPage('dynamic') } }, async ({ root, expect, spawn }) => {
        const { server, url } = await startServer(spawn, 'pnpm exec next dev --turbopack --port 0', root)
        try {
                const html = await fetch(new URL('/', url)).then((r) => r.text())
                expect(html).toContain(MARKER)
                assertNoInvalid(expect, html)
        } finally {
                await server.dispose()
        }
})

test('ENGINE-002 Turbopack production: requested placement reaches the build artifact', { fs: { ...appBase('tcss-next-turbo-prod'), 'next.config.mjs': nextConfig({ output: 'file' }), 'app/page.tsx': serverPage('static') } }, async ({ root, exec, expect, spawn }) => {
        await exec('pnpm exec next build --turbopack', { cwd: root, env: { NODE_ENV: 'production' } })
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

test('ENGINE-003 webpack dev: placement is the inline fallback the public contract documents', { fs: { ...appBase('tcss-next-wp-dev'), 'next.config.mjs': nextConfig({ output: 'head' }), 'app/page.tsx': serverPage('dynamic') } }, async ({ root, expect, spawn }) => {
        const { server, url } = await startServer(spawn, 'pnpm exec next dev --port 0', root)
        try {
                const html = await fetch(new URL('/', url)).then((r) => r.text())
                expect(html).toContain(MARKER)
                // webpack branch forces inline regardless of requested mode: declarations
                // appear inline on the element rather than as a collected head rule.
                expect(html).toContain(RAW_VALUE)
                assertNoInvalid(expect, html)
        } finally {
                await server.dispose()
        }
})

test('ENGINE-004 webpack production: server + client compilers create no undefined class', { fs: { ...appBase('tcss-next-wp-prod'), 'next.config.mjs': nextConfig({ output: 'file' }), 'app/page.tsx': serverPage('static') } }, async ({ root, exec, expect, spawn }) => {
        await exec('pnpm exec next build', { cwd: root, env: { NODE_ENV: 'production' } })
        const { server, url } = await startServer(spawn, 'pnpm exec next start --port 0', root)
        try {
                const html = await fetch(new URL('/', url)).then((r) => r.text())
                const sheet = (await fetchStyles(url, '/')) + '\n' + html
                assertNoInvalid(expect, sheet)
                // RED: file placement was requested but the webpack branch forces inline, so
                // no reachable file asset rule exists for the referenced classes (if any).
                const missing = [...referencedClasses(html)].filter((c) => !definedSelectors(sheet).has(c))
                expect(missing).toEqual([])
        } finally {
                await server.dispose()
        }
})
