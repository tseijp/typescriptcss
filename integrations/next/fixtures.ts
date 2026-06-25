// Shared Next.js project fixtures for the @typescriptcss/plugin-next suite.
//
// Every test builds a real Next.js project in a temp directory. The fixtures
// here keep the *framework* boilerplate in one place so each test file only
// has to express the rendering boundary and output mode it exercises.
//
// Oracle values (raw CSS, never Tailwind tokens or named theme colors):
//   flex.col              -> display:flex; flex-direction:column
//   p[6]                  -> padding:24px
//   gap[4]                -> gap:16px
//   m[2]                  -> margin:8px
//   bg['rgb(1, 2, 3)']    -> background:rgb(1,2,3)
//   text['rgb(4, 5, 6)']  -> color:rgb(4,5,6)
//   rounded[2]            -> border-radius:8px
// These survive the lightningcss pass unchanged (modulo whitespace) so the same
// declaration set can be asserted from an inline style attribute, a head
// <style> rule, or a CSS file asset.

import { json, ts, tsx } from '../utils.ts'

export const NEXT_VERSION = '16.2.9'
export const REACT_VERSION = '19.2.7'

/** package.json depending only on Next, React and the workspace packages. */
export const packageJson = (name: string) => json`
	{
		"name": "${name}",
		"private": true,
		"type": "module",
		"scripts": {
			"build": "next build",
			"start": "next start",
			"dev": "next dev"
		},
		"dependencies": {
			"next": "${NEXT_VERSION}",
			"react": "${REACT_VERSION}",
			"react-dom": "${REACT_VERSION}",
			"typescriptcss": "workspace:*",
			"@typescriptcss/plugin-next": "workspace:*"
		},
		"devDependencies": {
			"@types/node": "^20",
			"@types/react": "^19",
			"@types/react-dom": "^19",
			"typescript": "^5"
		}
	}
`

export const tsconfig = json`
	{
		"compilerOptions": {
			"target": "ES2022",
			"lib": ["dom", "dom.iterable", "esnext"],
			"allowJs": true,
			"skipLibCheck": true,
			"strict": false,
			"noEmit": true,
			"esModuleInterop": true,
			"module": "esnext",
			"moduleResolution": "bundler",
			"resolveJsonModule": true,
			"isolatedModules": true,
			"jsx": "preserve",
			"incremental": true,
			"baseUrl": ".",
			"paths": { "@/*": ["./*"] },
			"plugins": [{ "name": "next" }]
		},
		"include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
		"exclude": ["node_modules"]
	}
`

interface ConfigOptions {
        output?: any
        classPrefix?: string
        fileName?: string
        minify?: boolean
        root?: string
        turbopack?: boolean
        staticExport?: boolean
        extra?: string
}

/**
 * A next.config.mjs that wraps the user config with the plugin. The plugin is
 * imported from its `/src` export and the workspace packages are transpiled,
 * matching the documented Next.js setup.
 */
export const nextConfig = (opts: ConfigOptions = {}) => {
        const pluginOptions: string[] = []
        if (opts.output) pluginOptions.push(`output: ${JSON.stringify(opts.output)}`)
        if (opts.classPrefix !== undefined) pluginOptions.push(`classPrefix: ${JSON.stringify(opts.classPrefix)}`)
        if (opts.fileName !== undefined) pluginOptions.push(`fileName: ${JSON.stringify(opts.fileName)}`)
        if (opts.minify !== undefined) pluginOptions.push(`minify: ${opts.minify}`)
        if (opts.root !== undefined) pluginOptions.push(`root: ${JSON.stringify(opts.root)}`)

        const nextOptions: string[] = [`transpilePackages: ['typescriptcss', '@typescriptcss/plugin-core', '@typescriptcss/plugin-next']`]
        if (opts.staticExport) nextOptions.push(`output: 'export'`)
        if (opts.extra) nextOptions.push(opts.extra)

        return ts`
		import typescriptcss from '@typescriptcss/plugin-next/src'

		const withTypescriptcss = typescriptcss({ ${pluginOptions.join(', ')} })

		export default withTypescriptcss({
			${nextOptions.join(',\n\t\t\t')}
		})
	`
}

/** Minimal App Router root layout. */
export const appLayout = (extraStyle = '') => tsx`
	export default function RootLayout({ children }: { children: React.ReactNode }) {
		return (
			<html lang="en">
				<body${extraStyle}>{children}</body>
			</html>
		)
	}
`

/** A `next-env.d.ts` so `tsc`/Next type stubs resolve. */
export const nextEnv = ts`
	/// <reference types="next" />
	/// <reference types="next/image-types/global" />
`

/**
 * Base file set shared by every App Router project: package.json, tsconfig,
 * next-env and a root layout. Callers supply `next.config.mjs` and route files.
 */
export const appBase = (name: string, layoutStyle = ''): Record<string, string> => ({
        'package.json': packageJson(name),
        'tsconfig.json': tsconfig,
        'next-env.d.ts': nextEnv,
        'app/layout.tsx': appLayout(layoutStyle),
})

/** Base file set for a Pages Router project. */
export const pagesBase = (name: string): Record<string, string> => ({
        'package.json': packageJson(name),
        'tsconfig.json': tsconfig,
        'next-env.d.ts': nextEnv,
})

// ---------------------------------------------------------------------------
// Shared fixture vocabulary + observation helpers (kept here so test files stay lean).
// ---------------------------------------------------------------------------

export const MARKER = 'tcss-next-marker'
export const RAW_VALUE = 'rgb(11, 17, 32)'
export const RAW_VALUE_2 = 'rgb(248, 250, 252)'

/** A Server Component page applying a reused chain + call-arg, no 'use client'. */
export const serverPage = (render: 'static' | 'dynamic' = 'static') => tsx`
        import { flex } from 'typescriptcss'
        export const dynamic = '${render === 'static' ? 'force-static' : 'force-dynamic'}'
        export default function Page() {
                const shared = flex.col.gap[3].p[6].bg['${RAW_VALUE}']
                return (
                        <main>
                                <p data-marker="server">${MARKER}</p>
                                <div data-box="one" style={shared() as any}>one</div>
                                <div data-box="two" style={shared({ outlineColor: '${RAW_VALUE_2}' }) as any}>two</div>
                        </main>
                )
        }
`

/** A Client Component page (same chain fixture) with 'use client'. */
export const clientPage = tsx`
        'use client'
        import { flex } from 'typescriptcss'
        export default function Page() {
                const shared = flex.col.gap[3].p[6].bg['${RAW_VALUE}']
                return (
                        <main>
                                <p data-marker="client">${MARKER}</p>
                                <div data-box="one" style={shared() as any}>one</div>
                                <div data-box="two" style={shared({ outlineColor: '${RAW_VALUE_2}' }) as any}>two</div>
                        </main>
                )
        }
`

/** tcss-* classes referenced in HTML class/className attributes. */
export const referencedClasses = (htmlText: string, prefix = 'tcss'): Set<string> => {
        const out = new Set<string>()
        for (const m of htmlText.matchAll(/class(?:Name)?="([^"]*)"/gi)) for (const t of m[1].split(/\s+/)) if (t.startsWith(`${prefix}-`)) out.add(t)
        return out
}

/** Selectors defined in collected stylesheet text. */
export const definedSelectors = (sheet: string, prefix = 'tcss'): Set<string> => {
        const out = new Set<string>()
        for (const m of sheet.matchAll(new RegExp(`\\.(${prefix}-[A-Za-z0-9_-]+)`, 'g'))) out.add(m[1])
        return out
}

/** COMMON-006: no undefined/null/[object Object] CSS value (React $undefined ignored). */
export const assertNoInvalid = (expect: any, text: string) => {
        expect(text).not.toMatch(/[a-z-]+\s*:\s*(?:undefined|null)\b/i)
        expect(text).not.toContain('[object Object]')
}

/** Spawn `next start`/`next dev` and resolve the bound URL from the ready line. */
export const startServer = async (spawn: any, command: string, root: string) => {
        const server = await spawn(command, { cwd: root })
        let url = ''
        await server.onStdout((m: string) => ((url = m.match(/https?:\/\/[^\s]+/)?.[0] ?? url), url !== ''))
        return { server, url }
}
