// Shared fixtures + helpers for the @typescriptcss/plugin-vite suite.
//
// Each framework keeps its own minimal standard-template fixture; only the small
// binding that passes a typescriptcss chain to the element changes per framework.
// Observation is via real build/dev: served HTML + reachable stylesheets, parsed
// with the shared harness scanners (no browser driver is assumed present).

import { collectClasses, definedClasses, html, json, ts } from '../utils'
export { fetchPage, fetchStyles, retryAssertion, test } from '../utils'

export const MARKER = 'tcss-vite-marker'
export const RAW_VALUE = '#0b1120'
export const RAW_VALUE_2 = '#f8fafc'

export const VITE_DEV = { vite: '^7' }

/** package.json with workspace plugin deps + per-framework extras. */
export function pkg(deps: Record<string, string>, dev: Record<string, string> = {}): string {
        const all = { typescriptcss: 'workspace:*', '@typescriptcss/plugin-vite': 'workspace:*', ...deps }
        return json`
		{
		  "name": "fixture",
		  "private": true,
		  "type": "module",
		  "scripts": { "build": "vite build", "dev": "vite", "preview": "vite preview" },
		  "dependencies": ${JSON.stringify(all, null, 2)},
		  "devDependencies": ${JSON.stringify({ vite: '^7', ...dev }, null, 2)}
		}
	`
}

/** vite.config.ts placing the typescriptcss plugin before the framework plugin. */
export function viteConfig(opts: { output?: string; framework?: string; pluginExtra?: string } = {}): string {
        const { output, framework = '', pluginExtra = '' } = opts
        const optionParts = [output ? `output: ${JSON.stringify(output)}` : '', pluginExtra].filter(Boolean).join(', ')
        return ts`
		import { defineConfig } from 'vite'
		import { typescriptcss } from '@typescriptcss/plugin-vite/src'
		${framework ? framework : ''}

		export default defineConfig({
		  plugins: [typescriptcss({ ${optionParts} })${framework ? ', frameworkPlugin()' : ''}],
		})
	`
}

export const indexHtml = (entry = '/src/main.ts') => html`
        <!doctype html>
        <html>
                <head>
                        <meta charset="utf-8" />
                </head>
                <body>
                        <div id="app"></div>
                        <script type="module" src="${entry}"></script>
                </body>
        </html>
`

/** tcss-* classes referenced in served HTML class/className attributes. */
export function referencedClasses(htmlText: string, prefix = 'tcss'): string[] {
        const out = new Set<string>()
        for (const m of htmlText.matchAll(/class(?:Name)?="([^"]*)"/gi)) for (const t of m[1].split(/\s+/)) if (t.startsWith(`${prefix}-`)) out.add(t)
        return [...out]
}

/** Assert every referenced tcss-* class in `htmlText` has a rule in `sheet`. */
export function expectResolved(expect: any, htmlText: string, sheet: string, prefix = 'tcss') {
        const refs = [...new Set([...referencedClasses(htmlText, prefix), ...collectClasses(htmlText, { prefix })])]
        const defined = definedClasses(sheet, { prefix })
        expect(refs.filter((c) => !defined.has(c))).toEqual([])
        return refs
}

export function assertNoInvalid(expect: any, text: string) {
        expect(text).not.toMatch(/[a-z-]+\s*:\s*(?:undefined|null)\b/i)
        expect(text).not.toContain('[object Object]')
}

// ---------------------------------------------------------------------------
// Framework fixtures — minimal standard template, single styled marker element.
// ---------------------------------------------------------------------------

export const vanilla = {
        deps: {},
        files: (): Record<string, string> => ({
                'index.html': indexHtml('/src/main.ts'),
                // Vanilla has no JSX. The chain returns a style object; we apply it to the
                // element. The plugin only rewrites JSX `style` attributes, so this exercises
                // whether vanilla DOM source is reached at all (expected RED for head/file).
                'src/main.ts': ts`
			import { flex } from 'typescriptcss'
			const el = document.getElementById('app')
			const style = flex.col.gap[3].p[6].bg['${RAW_VALUE}']()
			Object.assign(el.style, style)
			el.textContent = '${MARKER}'
		`,
        }),
}

export const react = {
        deps: { react: '^19', 'react-dom': '^19' },
        dev: { '@vitejs/plugin-react': '^4' },
        frameworkImport: "import react from '@vitejs/plugin-react'\nconst frameworkPlugin = react",
        files: (): Record<string, string> => ({
                'index.html': indexHtml('/src/main.tsx'),
                'src/main.tsx': ts`
			import { createRoot } from 'react-dom/client'
			import { flex } from 'typescriptcss'
			function App() {
			  const shared = flex.col.gap[3].p[6].bg['${RAW_VALUE}']
			  return (
			    <main>
			      <p>${MARKER}</p>
			      <div style={shared() as any}>one</div>
			      <div style={shared({ outlineColor: '${RAW_VALUE_2}' }) as any}>two</div>
			    </main>
			  )
			}
			createRoot(document.getElementById('app')!).render(<App />)
		`,
        }),
}

export const preact = {
        deps: { preact: '^10' },
        dev: { '@preact/preset-vite': '^2' },
        frameworkImport: "import preact from '@preact/preset-vite'\nconst frameworkPlugin = preact",
        files: (): Record<string, string> => ({
                'index.html': indexHtml('/src/main.tsx'),
                'src/main.tsx': ts`
			import { render } from 'preact'
			import { flex } from 'typescriptcss'
			function App() {
			  const shared = flex.col.gap[3].p[6].bg['${RAW_VALUE}']
			  return <main><p>${MARKER}</p><div style={shared() as any}>one</div></main>
			}
			render(<App />, document.getElementById('app')!)
		`,
                'tsconfig.json': json`{ "compilerOptions": { "jsx": "react-jsx", "jsxImportSource": "preact", "skipLibCheck": true } }`,
        }),
}

export const solid = {
        deps: { 'solid-js': '^1' },
        dev: { 'vite-plugin-solid': '^2' },
        frameworkImport: "import solid from 'vite-plugin-solid'\nconst frameworkPlugin = solid",
        files: (): Record<string, string> => ({
                'index.html': indexHtml('/src/main.tsx'),
                'src/main.tsx': ts`
			import { render } from 'solid-js/web'
			import { flex } from 'typescriptcss'
			function App() {
			  const shared = flex.col.gap[3].p[6].bg['${RAW_VALUE}']
			  return <main><p>${MARKER}</p><div style={shared() as any}>one</div></main>
			}
			render(() => <App />, document.getElementById('app')!)
		`,
        }),
}

export const qwik = {
        deps: { '@builder.io/qwik': '^1' },
        dev: {},
        frameworkImport: "import { qwikVite } from '@builder.io/qwik/optimizer'\nconst frameworkPlugin = qwikVite",
        files: (): Record<string, string> => ({
                'index.html': indexHtml('/src/main.tsx'),
                'src/main.tsx': ts`
			import { render } from '@builder.io/qwik'
			import { flex } from 'typescriptcss'
			export const App = () => {
			  const shared = flex.col.gap[3].p[6].bg['${RAW_VALUE}']
			  return <main><p>${MARKER}</p><div style={shared() as any}>one</div></main>
			}
			render(document.getElementById('app')!, <App />)
		`,
                'tsconfig.json': json`{ "compilerOptions": { "jsx": "react-jsx", "jsxImportSource": "@builder.io/qwik", "skipLibCheck": true } }`,
        }),
}

export const vue = {
        deps: { vue: '^3' },
        dev: { '@vitejs/plugin-vue': '^5' },
        frameworkImport: "import vue from '@vitejs/plugin-vue'\nconst frameworkPlugin = vue",
        files: (): Record<string, string> => ({
                'index.html': indexHtml('/src/main.ts'),
                'src/main.ts': ts`
			import { createApp } from 'vue'
			import App from './App.vue'
			createApp(App).mount('#app')
		`,
                // Vue SFC :style binding — NOT a literal JSX style attribute. Exercises whether
                // the plugin reaches Vue's compiled module (expected RED for head/file).
                'src/App.vue': html`
                        <script setup lang="ts">
                                import { flex } from 'typescriptcss'
                                const shared = flex.col.gap[3].p[6].bg['${RAW_VALUE}']()
                        </script>
                        <template>
                                <main>
                                        <p>${MARKER}</p>
                                        <div :style="shared">one</div>
                                </main>
                        </template>
                `,
        }),
}

export const svelte = {
        deps: { svelte: '^5' },
        dev: { '@sveltejs/vite-plugin-svelte': '^5' },
        frameworkImport: "import { svelte } from '@sveltejs/vite-plugin-svelte'\nconst frameworkPlugin = svelte",
        files: (): Record<string, string> => ({
                'index.html': indexHtml('/src/main.ts'),
                'src/main.ts': ts`
			import App from './App.svelte'
			import { mount } from 'svelte'
			mount(App, { target: document.getElementById('app') })
		`,
                'src/App.svelte': html`
                        <script lang="ts">
                                import { flex } from 'typescriptcss'
                                const shared = flex.col.gap[3].p[6].bg['${RAW_VALUE}']()
                                const decls = Object.entries(shared)
                                        .map(([k, v]) => k.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase()) + ':' + v)
                                        .join(';')
                        </script>
                        <main>
                                <p>${MARKER}</p>
                                <div style="{decls}">one</div>
                        </main>
                `,
                'svelte.config.js': ts`import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'\nexport default { preprocess: vitePreprocess() }`,
        }),
}

export const lit = {
        deps: { lit: '^3' },
        dev: {},
        frameworkImport: '',
        files: (): Record<string, string> => ({
                'index.html': html`
                        <!doctype html>
                        <html>
                                <head>
                                        <meta charset="utf-8" />
                                </head>
                                <body>
                                        <my-marker></my-marker>
                                        <script type="module" src="/src/main.ts"></script>
                                </body>
                        </html>
                `,
                'src/main.ts': ts`
			import { LitElement, html as litHtml } from 'lit'
			import { customElement } from 'lit/decorators.js'
			import { styleMap } from 'lit/directives/style-map.js'
			import { flex } from 'typescriptcss'
			@customElement('my-marker')
			export class MyMarker extends LitElement {
			  render() {
			    const shared = flex.col.gap[3].p[6].bg['${RAW_VALUE}']()
			    return litHtml\`<main><p>${MARKER}</p><div style=\${styleMap(shared)}>one</div></main>\`
			  }
			}
		`,
                'tsconfig.json': json`{ "compilerOptions": { "experimentalDecorators": true, "useDefineForClassFields": false, "target": "ES2021", "module": "ESNext", "moduleResolution": "Bundler", "skipLibCheck": true } }`,
        }),
}
