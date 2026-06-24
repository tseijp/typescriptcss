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
