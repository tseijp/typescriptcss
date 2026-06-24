/**
 * App Router · Server Component
 *
 * Matrix coverage (see PROMPT.md "Rendering matrix"):
 *   - MATRIX-001  App Router · Server Component · static generation · production  → INLINE is the single ACTIVE RED.
 *   - MATRIX-001  head / file modes                                              → test.skip (TODO, not yet GREEN).
 *   - MATRIX-002  App Router · Server Component · dynamic SSR · production × 3    → test.skip (TODO).
 *
 * TDD regime (PROMPT.md "TDD 実行規約"): exactly one boundary/mode is driven RED at a
 * time. The active test below builds a real Next.js project and exercises the
 * @typescriptcss/plugin-next config wrapper at the App Router Server Component +
 * `inline` placement boundary. Every other cell stays as a visible skip so the
 * unaddressed boundaries are not deleted (PROMPT.md "最終監査").
 *
 * This file observes ONLY what the shared harness (../utils) exposes: build/start
 * commands, served HTML, and emitted files. Hydration-after-DOM / computed-style
 * observations (COMMON-003/004/007/008) require a browser driver whose presence in
 * the shared harness is not assumed here, so those checks are recorded as TODO
 * inside the relevant skipped cells rather than asserted against unread code.
 */
import { expect } from 'vitest'
import { css, fetchStyles, jsx, json, test, ts, txt } from '../utils'

type OutputMode = 'inline' | 'head' | 'file' | 'auto'
type RenderMode = 'static' | 'dynamic'

// A unique, greppable text marker. Per PROMPT.md "共通 fixture" the fixture carries
// a unique text marker, an independent property chain, an imported raw CSS token,
// two elements that share the same chain, and a plain-object call argument.
const MARKER = 'tcss-app-server-marker'

// Raw CSS values only — no Tailwind preset colors, no named tokens, no pseudo /
// media. The plain-object call argument injects a raw declaration that has the
// same meaning on the server and on the client, so it can act as the shared
// oracle (PROMPT.md "共通 fixture" / COMMON-002).
const RAW_DECL_PROP = 'outline-color'
const RAW_DECL_VALUE = 'rgb(3, 5, 7)'

function project({ output, render }: { output: OutputMode; render: RenderMode }) {
        return {
                'package.json': json`
      {
        "name": "tcss-next-app-server",
        "private": true,
        "type": "module",
        "scripts": {
          "build": "next build",
          "start": "next start",
          "dev": "next dev"
        },
        "dependencies": {
          "next": "^15",
          "react": "^19",
          "react-dom": "^19",
          "typescriptcss": "workspace:^",
          "@typescriptcss/plugin-next": "workspace:^"
        }
      }
    `,
                // Standard Next config, plugin wrapper added, only the output mode varies from
                // the matrix (PROMPT.md "共通 fixture").
                'next.config.mjs': ts`
      import typescriptcss from '@typescriptcss/plugin-next'

      const withTypescriptcss = typescriptcss({ output: '${output}' })

      export default withTypescriptcss({})
    `,
                'tsconfig.json': json`
      {
        "compilerOptions": {
          "target": "ES2022",
          "lib": ["dom", "dom.iterable", "esnext"],
          "module": "esnext",
          "moduleResolution": "bundler",
          "jsx": "preserve",
          "strict": true,
          "noEmit": true,
          "esModuleInterop": true,
          "skipLibCheck": true,
          "plugins": [{ "name": "next" }]
        },
        "include": ["**/*.ts", "**/*.tsx", ".next/types/**/*.ts"]
      }
    `,
                // Imported raw CSS token, resolvable as a static value.
                'app/tokens.ts': ts`
      export const brand = '#0b1d2c'
    `,
                'app/layout.tsx': jsx`
      export default function RootLayout({ children }: { children: React.ReactNode }) {
        return (
          <html lang="en">
            <body>{children}</body>
          </html>
        )
      }
    `,
                // Server Component: no 'use client'. The chain is applied directly to the JSX
                // \`style\` prop (README "Writing styles"); the plugin decides placement by mode.
                'app/page.tsx': jsx`
      import { flex } from 'typescriptcss'
      import { brand } from './tokens'

      export const dynamic = '${render === 'static' ? 'force-static' : 'force-dynamic'}'

      export default function Page() {
        // Same chain reused by two elements (PROMPT.md "共通 fixture": 二要素).
        const shared = flex.col.gap[3].p[6].bg[brand]
        return (
          <main>
            <p data-marker="server">${MARKER}</p>
            <div data-box="one" style={shared() as any}>one</div>
            <div
              data-box="two"
              style={shared({ outlineStyle: 'solid', outlineColor: '${RAW_DECL_VALUE}', outlineWidth: '2px' }) as any}
            >
              two
            </div>
          </main>
        )
      }
    `,
        }
}

// --- Reusable observation helpers (kept local; integrations/next owns only test files) ---

/** Collect every `tcss-*` class referenced in the HTML (COMMON-005). */
function referencedClasses(html: string): Set<string> {
        let classes = new Set<string>()
        for (let attr of html.matchAll(/class(?:Name)?="([^"]*)"/gi)) {
                for (let token of attr[1].split(/\s+/)) {
                        if (token.startsWith('tcss-')) classes.add(token)
                }
        }
        return classes
}

/** Selectors defined in the collected stylesheet text (COMMON-005). */
function definedClasses(stylesheet: string): Set<string> {
        let classes = new Set<string>()
        for (let sel of stylesheet.matchAll(/\.(tcss-[A-Za-z0-9_-]+)/g)) classes.add(sel[1])
        return classes
}

/**
 * COMMON-006: a CSS declaration / style attribute must not contain undefined,
 * null, or [object Object]. React's `$undefined` protocol token is intentionally
 * not matched here (PROMPT.md "Invalid output scanner").
 */
function assertNoInvalidValues(text: string) {
        expect(text).not.toMatch(/[a-z-]+\s*:\s*(?:undefined|null)\b/i)
        expect(text).not.toContain('[object Object]')
}

// ---------------------------------------------------------------------------
// ACTIVE RED — MATRIX-001 · App Router · Server Component · static · production · inline
// ---------------------------------------------------------------------------
test('MATRIX-001 app-router server component, static generation, production, inline', { fs: project({ output: 'inline', render: 'static' }) }, async ({ root, spawn, exec }) => {
        // COMMON-001: production build must complete.
        await exec('pnpm exec next build', { cwd: root, env: { NODE_ENV: 'production' } })

        let server = await spawn('pnpm exec next start --port 0', { cwd: root })
        // next prints the bound URL when ready; capture the port from the ready line.
        let url = ''
        await server.onStdout((message) => {
                let match = message.match(/https?:\/\/[^\s]+/)
                if (match) url = match[0]
                return url !== ''
        })

        let html = await fetch(new URL('/', url)).then((r) => r.text())

        // COMMON-002: marker present, style not missing. In `inline` mode the chain
        // renders as an inline style on the element (README "Output modes": inline =
        // leave the original inline styles in place).
        expect(html).toContain(MARKER)
        expect(html).toMatch(new RegExp(`${RAW_DECL_PROP}\\s*:\\s*${RAW_DECL_VALUE.replace(/[()]/g, '\\$&')}`))

        // COMMON-006: no invalid declarations leaked into the server HTML.
        assertNoInvalidValues(html)

        await server.dispose()
})

// ---------------------------------------------------------------------------
// SKIP / TODO — remaining MATRIX-001 placements (head, file)
// ---------------------------------------------------------------------------
test.skip('MATRIX-001 app-router server component, static, production, head — TODO drive RED next', { fs: project({ output: 'head', render: 'static' }) }, async ({ root, spawn, exec }) => {
        await exec('pnpm exec next build', { cwd: root, env: { NODE_ENV: 'production' } })
        let server = await spawn('pnpm exec next start --port 0', { cwd: root })
        let url = ''
        await server.onStdout((m) => ((url = m.match(/https?:\/\/[^\s]+/)?.[0] ?? url), url !== ''))
        let html = await fetch(new URL('/', url)).then((r) => r.text())
        let stylesheet = await fetchStyles(url, '/')
        // NEXT-HEAD: marker class rule is reachable from the document head style; do not
        // require a single <style> tag (PROMPT.md "出力 mode").
        expect(html).toContain(MARKER)
        // COMMON-005: every referenced tcss-* class is defined in the collected styles.
        let missing = [...referencedClasses(html)].filter((c) => !definedClasses(stylesheet).has(c))
        expect(missing).toEqual([])
        assertNoInvalidValues(stylesheet)
        await server.dispose()
})

test.skip('MATRIX-001 app-router server component, static, production, file — TODO', { fs: project({ output: 'file', render: 'static' }) }, async ({ root, spawn, exec }) => {
        await exec('pnpm exec next build', { cwd: root, env: { NODE_ENV: 'production' } })
        let server = await spawn('pnpm exec next start --port 0', { cwd: root })
        let url = ''
        await server.onStdout((m) => ((url = m.match(/https?:\/\/[^\s]+/)?.[0] ?? url), url !== ''))
        let html = await fetch(new URL('/', url)).then((r) => r.text())
        // NEXT-FILE: marker class rule lives in a stylesheet asset reachable from the
        // route HTML; do not assert a fixed file name or chunk count (PROMPT.md "出力 mode").
        let stylesheet = await fetchStyles(url, '/')
        expect(html).toContain(MARKER)
        let missing = [...referencedClasses(html)].filter((c) => !definedClasses(stylesheet).has(c))
        expect(missing).toEqual([])
        assertNoInvalidValues(stylesheet)
        await server.dispose()
})

// ---------------------------------------------------------------------------
// SKIP / TODO — MATRIX-002 · App Router · Server Component · dynamic SSR · production × 3 modes
// ---------------------------------------------------------------------------
for (let output of ['inline', 'head', 'file'] as OutputMode[]) {
        test.skip(`MATRIX-002 app-router server component, dynamic SSR, production, ${output} — TODO`, { fs: project({ output, render: 'dynamic' }) }, async ({ root, spawn, exec }) => {
                await exec('pnpm exec next build', { cwd: root, env: { NODE_ENV: 'production' } })
                let server = await spawn('pnpm exec next start --port 0', { cwd: root })
                let url = ''
                await server.onStdout((m) => ((url = m.match(/https?:\/\/[^\s]+/)?.[0] ?? url), url !== ''))
                let html = await fetch(new URL('/', url)).then((r) => r.text())
                expect(html).toContain(MARKER)
                // TODO: per-mode placement assertion identical to MATRIX-001 above, plus
                // COMMON-003/004 hydrated-DOM + browser-diagnostics equivalence once a browser
                // driver is available in the shared harness.
                await server.dispose()
        })
}

// Imported-token coverage note (PROMPT.md "App Router の境界 · Imported token"):
// the fixture already reads `brand` via a relative import. A path-alias variant and
// a non-statically-evaluable value variant are tracked in
// 09_options.test.ts (OPTION-004 root) and below as dynamic-value TODO.
export const __redCells = txt`
  ACTIVE: MATRIX-001 inline (static, production)
  SKIP:   MATRIX-001 head, MATRIX-001 file, MATRIX-002 inline/head/file
`
const _keepImports = css`
        /* keep css tag imported for sibling files parity */
`
void _keepImports
