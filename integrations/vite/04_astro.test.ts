// VITE-ASTRO — .astro server render + browser output.
import { astro, json, ts } from '../utils'
import { MARKER, RAW_VALUE, assertNoInvalid, expectResolved, test } from './_fixtures'

const files = (output: string): Record<string, string> => ({
        'package.json': json`
		{
		  "name": "fixture",
		  "private": true,
		  "type": "module",
		  "scripts": { "build": "astro build", "dev": "astro dev", "preview": "astro preview" },
		  "dependencies": {
		    "astro": "^5",
		    "typescriptcss": "workspace:*",
		    "@typescriptcss/vite": "workspace:*"
		  }
		}
	`,
        // Astro integrates the vite plugin through astro.config's vite.plugins.
        'astro.config.mjs': ts`
		import { defineConfig } from 'astro/config'
		import { typescriptcss } from '@typescriptcss/vite/src'
		export default defineConfig({
		  vite: { plugins: [typescriptcss({ output: '${output}' })] },
		})
	`,
        'src/pages/index.astro': astro`
		---
		import { flex } from 'typescriptcss'
		const shared = flex.col.gap[3].p[6].bg['${RAW_VALUE}']()
		---
		<html>
		  <head><meta charset="utf-8" /></head>
		  <body>
		    <main>
		      <p>${MARKER}</p>
		      <div style={shared}>one</div>
		    </main>
		  </body>
		</html>
	`,
})

test('VITE-ASTRO file build: server-rendered page reaches the collected style (expected RED until .astro is collected)', { fs: files('file') }, async ({ exec, expect, fs }) => {
        await exec('pnpm astro build')
        const htmlFiles = await fs.readAll('dist/**/*.html')
        const htmlText = htmlFiles.map(([, c]) => c).join('\n')
        const sheet = (await fs.readAll('dist/**/*.css')).map(([, c]) => c).join('\n')
        expect(htmlText).toContain(MARKER)
        // RED: the marker style should be reachable from the rendered HTML.
        expectResolved(expect, htmlText, sheet + '\n' + htmlText)
        assertNoInvalid(expect, htmlText)
})

test('VITE-ASTRO inline build: server-rendered page keeps the runtime style on the element', { fs: files('inline') }, async ({ exec, expect, fs }) => {
        await exec('pnpm astro build')
        const htmlText = (await fs.readAll('dist/**/*.html')).map(([, c]) => c).join('\n')
        expect(htmlText).toContain(MARKER)
        expect(htmlText).toContain(RAW_VALUE)
        assertNoInvalid(expect, htmlText)
})
