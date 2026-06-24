// Shared fixtures + config generators for the @typescriptcss/plugin-rollup
// integration suite.
//
// These helpers exist to satisfy the REFACTOR rule in PROMPT.md: the temporary
// project skeleton, the per-tool build config, the artifact scanner, the JS
// evaluator and the CSS-reference check are shared across cases — but each tool
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
//     marker export is `{ style: { …camelCase css… } }`.
//
// A tiny generated runner script imports the built entry and prints the markers
// as JSON to stdout, which the test reads back with `exec`. This executes the
// real emitted JavaScript (no mocking) and lets us compare the recovered style
// meaning against a plugin-disabled baseline.

import { json, ts, tsx } from '../utils'

export const PLUGIN = '@typescriptcss/plugin-rollup'

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
		    "@typescriptcss/plugin-rollup": "workspace:*"${depsTail(extra)}
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
// Fixture entry sources
// ---------------------------------------------------------------------------

/**
 * Single entry exercising: a reused chain, an imported raw token, and a chain
 * with a call-arg plain object. Every value is a raw CSS value (no preset
 * tokens). Exports markers `a`, `b` (reused chain) and `c` (call-arg).
 */
export const SINGLE_ENTRY = tsx`
	import { bg, flex, gap, m, p, text } from 'typescriptcss'
	import { brand } from './tokens'
	import { h } from './jsx'

	const reused = flex.col.gap[4].p[6]

	export const a = <div style={reused.bg['#0b1120']()} />
	export const b = <section style={reused.bg['#0b1120']()} />
	export const c = <span style={text[brand]({ position: 'sticky' })} />
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
// Runner scripts — execute the built entry and print observed markers as JSON
// ---------------------------------------------------------------------------

/** ESM runner: dynamically imports a built module and prints named exports. */
export function esmRunner(entryPath: string, names: string[]): string {
        return ts`
		const mod = await import(${JSON.stringify(entryPath)})
		const picked = {}
		for (const name of ${JSON.stringify(names)}) picked[name] = mod[name]
		process.stdout.write(JSON.stringify(picked))
	`
}

/** CJS runner: requires a built module and prints named exports. */
export function cjsRunner(entryPath: string, names: string[]): string {
        return ts`
		const mod = require(${JSON.stringify(entryPath)})
		const picked = {}
		for (const name of ${JSON.stringify(names)}) picked[name] = mod[name]
		process.stdout.write(JSON.stringify(picked))
	`
}
