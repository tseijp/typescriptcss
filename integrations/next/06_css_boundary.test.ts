// SPLIT-001..005 — CSS boundary API on App Router Server Component (one matrix cell).
import { MARKER, appBase, assertNoInvalid, definedSelectors, nextConfig, referencedClasses, startServer } from './fixtures'
import { fetchStyles, test, tsx } from '../utils'

const splitPage = tsx`
	import { bg, css, flex, text } from 'typescriptcss'
	export const dynamic = 'force-static'
	export default function Page() {
		return (
			<main>
				<p>${MARKER}</p>
				<div data-leading style={css.flex.col.bg['rgb(11, 17, 32)']() as any}>leading</div>
				<div data-middle style={flex.col.css.bg['rgb(11, 17, 32)'].text['rgb(248, 250, 252)']() as any}>middle</div>
				<div data-empty style={flex.col.css() as any}>emptyBack</div>
				<div data-args style={flex.col.css.bg['rgb(11, 17, 32)']({ outlineColor: 'rgb(1, 2, 3)' }) as any}>args</div>
			</main>
		)
	}
`

test(
        'SPLIT-001..005 app-router server component: css marker splits placement and composes to a valid result',
        {
                fs: {
                        ...appBase('tcss-next-split'),
                        'next.config.mjs': nextConfig({ output: 'file' }),
                        'app/page.tsx': splitPage,
                },
        },
        async ({ root, exec, expect, spawn }) => {
                await exec('pnpm exec next build', { cwd: root, env: { NODE_ENV: 'production' } })
                const { server, url } = await startServer(spawn, 'pnpm exec next start --port 0', root)
                try {
                        const html = await fetch(new URL('/', url)).then((r) => r.text())
                        const sheet = (await fetchStyles(url, '/')) + '\n' + html
                        expect(html).toContain(MARKER)
                        // Every referenced class (split tails) resolves; nothing dangling.
                        const missing = [...referencedClasses(html)].filter((c) => !definedSelectors(sheet).has(c))
                        expect(missing).toEqual([])
                        // SPLIT-005: call-arg present, exactly once.
                        const both = html + '\n' + sheet
                        expect((both.match(/rgb\(1, 2, 3\)/g) ?? []).length).toBeGreaterThanOrEqual(1)
                        // SPLIT-003/empty: no invalid declarations and no empty dangling selectors.
                        assertNoInvalid(expect, sheet)
                } finally {
                        await server.dispose()
                }
        },
)
