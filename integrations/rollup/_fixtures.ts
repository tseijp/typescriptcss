// Shared fixtures + config generators for the @typescriptcss/rollup
// integration suite.
//
// These helpers satisfy the REFACTOR rule in PROMPT.md: the temporary project
// skeleton, the per-tool build config, the artifact scanner, the JS evaluator
// and the CSS-reference check are shared across cases — but each tool
// (Rollup / tsup / tsdown) keeps its *own* config generator instead of being
// hidden behind a single opaque template.
//
// Observation strategy
// --------------------
// Fixtures author JSX `style={chain()}` attributes. We compile JSX with a local
// `h` factory (configured in tsconfig as `jsxFactory: "h"`) that simply returns
// the props object. After the build:
//
//   - in `file` mode the plugin rewrites `style={...}` to `className="tcss-…"`,
//     so the built module's marker export is `{ className: "tcss-…" }`;
//   - in `inline` mode the plugin keeps the resolved inline object, so the
//     marker export is `{ style: { …css… } }` (actually `{ …decls… }` merged
//     onto the props bag because the call returns a plain style object).
//
// A tiny generated runner script imports the built entry and prints the markers
// as JSON to stdout, which the test reads back with `exec`. This executes the
// real emitted JavaScript (no mocking) and lets us compare the recovered style
// meaning against a plugin-disabled baseline.

import { json, ts, tsx } from '../utils'

export { test } from '../utils'
export const PLUGIN = '@typescriptcss/rollup'

// ---------------------------------------------------------------------------
// tsconfig — shared JSX factory so every tool compiles `<div/>` to `h('div',…)`
// ---------------------------------------------------------------------------
export const TSCONFIG = json`
	{
	  "compilerOptions": {
	    "target": "ESNext",
	    "module": "ESNext",
	    "moduleResolution": "Bundler",
	    "allowImportingTsExtensions": false,
	    "strict": true,
	    "skipLibCheck": true,
	    "jsx": "react",
	    "jsxFactory": "h",
	    "jsxFragmentFactory": "Fragment",
	    "esModuleInterop": true,
	    "lib": ["ESNext", "DOM"]
	  },
	  "include": ["src", "*.ts"]
	}
`

// A JSX factory that returns the props object verbatim. Lives next to every
// entry so the compiled marker export is exactly the element's prop bag.
export const H_FACTORY = ts`
	export const Fragment = 'Fragment'
	export const h = (tag, props, ...children) => ({ tag, ...(props || {}), children })
`

export function packageJson(extra: Record<string, string> = {}, devExtra: Record<string, string> = {}): string {
        return json`
		{
		  "name": "fixture",
		  "version": "0.0.0",
		  "private": true,
		  "type": "module",
		  "dependencies": {
		    "typescriptcss": "workspace:*",
		    "@typescriptcss/rollup": "workspace:*"${depsTail(extra)}
		  },
		  "devDependencies": {${depsTail(devExtra, true)}
		  }
		}
	`
}

function depsTail(deps: Record<string, string>, leading = false): string {
        const entries = Object.entries(deps)
        if (!entries.length) return ''
        const body = entries.map(([k, v]) => `    ${JSON.stringify(k)}: ${JSON.stringify(v)}`).join(',\n')
        return `${leading ? '' : ','}\n${body}`
}

// ---------------------------------------------------------------------------
// Per-tool dev dependency sets (pinned to majors the plugin documents support for)
// ---------------------------------------------------------------------------
export const ROLLUP_DEV = { rollup: '^4', '@rollup/plugin-node-resolve': '^15' }
export const TSUP_DEV = { tsup: '^8' }
export const TSDOWN_DEV = { tsdown: '0.22.2' }

// ---------------------------------------------------------------------------
// Fixture entry sources
// ---------------------------------------------------------------------------

/**
 * Single entry exercising: a reused chain, an imported raw token, and a chain
 * with a call-arg plain object. Every value is a raw CSS value (no preset
 * tokens). Exports markers `a`, `b` (reused chain) and `c` (call-arg).
 */
export const SINGLE_ENTRY = tsx`
	import { bg, css, flex, gap, m, p, text } from 'typescriptcss'
	import { brand } from './tokens'
	import { h } from './jsx'

	const reused = flex.col.gap[4].p[6]

	export const a = <div style={reused.bg['#0b1120']()} />
	export const b = <section style={reused.bg['#0b1120']()} />
	export const c = <span style={text[brand]({ position: 'sticky', top: '0px' })} />
	export const marker = 'SINGLE_MARKER'
`

export const TOKENS = ts`
	export const brand = '#0b1120'
`

// Multi-entry: A and B share one chain and each owns a unique chain.
export const ENTRY_A = tsx`
	import { flex, gap, bg, p } from 'typescriptcss'
	import { h } from './jsx'
	export const shared = <div style={gap[4].flex.col.bg['#101828']()} />
	export const ownA = <div style={p[6]()} />
	export const marker = 'ENTRY_A'
`

export const ENTRY_B = tsx`
	import { flex, gap, bg, m } from 'typescriptcss'
	import { h } from './jsx'
	export const shared = <div style={gap[4].flex.col.bg['#101828']()} />
	export const ownB = <div style={m[3]()} />
	export const marker = 'ENTRY_B'
`

// Dynamic import: main owns one style, the lazily-imported module owns another.
export const DYNAMIC_MAIN = tsx`
	import { bg } from 'typescriptcss'
	import { h } from './jsx'
	export const main = <div style={bg['#0b1120']()} />
	export async function load() {
	  const mod = await import('./lazy')
	  return mod.lazy
	}
	export const marker = 'DYNAMIC_MAIN'
`

export const DYNAMIC_LAZY = tsx`
	import { text, p } from 'typescriptcss'
	import { h } from './jsx'
	export const lazy = <div style={p[5].text['#f8fafc']()} />
	export const marker = 'DYNAMIC_LAZY'
`

// ---------------------------------------------------------------------------
// Split-chain fixtures (CSS boundary API — SPLIT-001..005)
// ---------------------------------------------------------------------------
//
// `css` in a chain draws the file/inline boundary. In the rollup adapter the
// base target is `file` (rollup forces output='inline' | 'file', defaulting to
// 'file'), and `splitTarget` is also `file`. A leading `css` marks the whole
// chain for file output; a `css` in the middle keeps the leading part at the
// base target and sends the tail to the split target.
export const SPLIT_ENTRY = tsx`
	import { bg, css, flex, gap, p, text } from 'typescriptcss'
	import { h } from './jsx'

	// SPLIT-001: leading css — whole chain to file target.
	export const leading = <div style={gap[3].flex.col.css.bg['#0b1120']()} />
	// SPLIT-002: css in the middle — front + back placed separately.
	export const middle = <div style={text['#f8fafc'].gap[3].flex.col.css.bg['#0b1120']()} />
	// SPLIT-003: same property before and after the split — cascade meaning.
	export const cascade = <div style={css.bg['#111111'].bg['#222222']()} />
	// SPLIT-004: empty front / empty back halves.
	export const emptyFront = <div style={css.bg['#0b1120']()} />
	export const emptyBack = <div style={flex.col.css()} />
	// SPLIT-005: split chain with a call-arg plain object.
	export const withArgs = <div style={flex.col.css.bg['#0b1120']({ position: 'sticky', top: '0px' })} />
	export const marker = 'SPLIT_MARKER'
`

// ---------------------------------------------------------------------------
// Runner scripts — execute the built entry and print observed markers as JSON
// ---------------------------------------------------------------------------

/** ESM runner: dynamically imports a built module and prints named exports. */
export function esmRunner(entryPath: string, names: string[]): string {
        return ts`
		const mod = await import(${JSON.stringify(entryPath)})
		const picked = {}
		for (const name of ${JSON.stringify(names)}) picked[name] = mod[name]
		process.stdout.write('RESULT:' + JSON.stringify(picked))
	`
}

/** CJS runner: requires a built module and prints named exports. */
export function cjsRunner(entryPath: string, names: string[]): string {
        return ts`
		const mod = require(${JSON.stringify(entryPath)})
		const picked = {}
		for (const name of ${JSON.stringify(names)}) picked[name] = mod[name]
		process.stdout.write('RESULT:' + JSON.stringify(picked))
	`
}

/** Read back the JSON the runner printed on its `RESULT:` line. */
export function pickResult(stdout: string): Record<string, any> {
        const line = stdout.split('\n').find((l) => l.startsWith('RESULT:'))
        if (!line) throw new Error('runner produced no RESULT line:\n' + stdout)
        return JSON.parse(line.slice('RESULT:'.length))
}

// ---------------------------------------------------------------------------
// Per-tool config generators (kept distinct, not one opaque template)
// ---------------------------------------------------------------------------

export interface RollupOptions {
        output?: string
        plugin?: boolean
        format?: 'es' | 'cjs'
        multi?: boolean
        pluginExtra?: string
        sourcemap?: boolean | 'inline'
}

/** A real `rollup.config.mjs` that registers the plugin from its public entry. */
export function rollupConfig(opts: RollupOptions = {}): string {
        const { output, plugin = true, format = 'es', multi = false, pluginExtra = '', sourcemap } = opts
        const optionParts = [output ? `output: ${JSON.stringify(output)}` : '', pluginExtra].filter(Boolean).join(', ')
        const pluginLine = plugin ? `typescriptcss({ ${optionParts} })` : ''
        const input = multi ? `{ a: 'src/a.tsx', b: 'src/b.tsx' }` : `'src/index.tsx'`
        const ext = format === 'cjs' ? "entryFileNames: '[name].cjs'" : "entryFileNames: '[name].js'"
        const sm = sourcemap !== undefined ? `sourcemap: ${JSON.stringify(sourcemap)}, ` : ''
        return ts`
		import { nodeResolve } from '@rollup/plugin-node-resolve'
		${plugin ? `import { typescriptcss } from '@typescriptcss/rollup/src'` : ''}

		export default {
		  input: ${input},
		  output: { dir: 'dist', format: ${JSON.stringify(format)}, ${sm}${ext} },
		  plugins: [${[`nodeResolve({ extensions: ['.js', '.ts', '.tsx'] })`, pluginLine].filter(Boolean).join(', ')}],
		}
	`
}

/** A real `tsup.config.ts` registering the rollup plugin via tsup's esbuild→rollup hook surface. */
export function tsupConfig(opts: { output?: string; multi?: boolean; pluginExtra?: string } = {}): string {
        const { output, multi = false, pluginExtra = '' } = opts
        const optionParts = [output ? `output: ${JSON.stringify(output)}` : '', pluginExtra].filter(Boolean).join(', ')
        const entry = multi ? `['src/a.tsx', 'src/b.tsx']` : `['src/index.tsx']`
        // tsup exposes a Rollup-compatible plugin surface through its `plugins` option
        // (rolldown-based in v8). The typescriptcss rollup plugin only relies on
        // transform + generateBundle, which tsup forwards.
        return ts`
		import { defineConfig } from 'tsup'
		import { typescriptcss } from '@typescriptcss/rollup/src'

		export default defineConfig({
		  entry: ${entry},
		  format: ['esm'],
		  outDir: 'dist',
		  clean: true,
		  dts: false,
		  loader: { '.tsx': 'tsx' },
		  esbuildOptions(options) {
		    options.jsxFactory = 'h'
		    options.jsxFragment = 'Fragment'
		  },
		  plugins: [typescriptcss({ ${optionParts} })],
		})
	`
}

/** A real `tsdown.config.ts` registering the rollup plugin. tsdown forwards rollup-style plugins. */
export function tsdownConfig(opts: { output?: string; multi?: boolean; pluginExtra?: string } = {}): string {
        const { output, multi = false, pluginExtra = '' } = opts
        const optionParts = [output ? `output: ${JSON.stringify(output)}` : '', pluginExtra].filter(Boolean).join(', ')
        const entry = multi ? `['src/a.tsx', 'src/b.tsx']` : `['src/index.tsx']`
        return ts`
		import { defineConfig } from 'tsdown'
		import { typescriptcss } from '@typescriptcss/rollup/src'

		export default defineConfig({
		  entry: ${entry},
		  format: ['esm'],
		  outDir: 'dist',
		  clean: true,
		  dts: false,
		  plugins: [typescriptcss({ ${optionParts} })],
		})
	`
}
