# next integration suite

Exercises `@typescriptcss/next` on real Next.js projects: App Router and
Pages Router, Server and Client Components, Turbopack and webpack, dev and
production, static export. Each test writes a temp Next project, runs the real
`next build` / `next dev` / `next start`, and observes the served HTML + reachable
stylesheets.

## Shared helpers — `fixtures.ts`

- `packageJson`, `tsconfig`, `nextEnv`, `appLayout`, `appBase(name)`, `pagesBase(name)`.
- `nextConfig({ output, classPrefix, fileName, minify, root, staticExport })` —
  wraps a Next config with the plugin imported from `@typescriptcss/next/src`
  and sets `transpilePackages` for the workspace packages.
- Page fixtures sharing one chain (`flex.col.gap[3].p[6].bg[RAW_VALUE]`) + a call-arg:
  `serverPage('static'|'dynamic')`, `clientPage` (`'use client'`).
- Observation: `referencedClasses(html)`, `definedSelectors(sheet)`,
  `assertNoInvalid(expect, text)`, `startServer(spawn, command, root)` (returns
  `{ server, url }` parsed from the ready line). `MARKER`, `RAW_VALUE`, `RAW_VALUE_2`.

`fetchStyles` / `fetchPage` / `test` come from `../utils`.

## What each file observes

| File                   | Focus                                                               |
| ---------------------- | ------------------------------------------------------------------- |
| `00_app_router_server` | original MATRIX-001 inline active + skipped placeholders            |
| `01_app_router_modes`  | App Router Server Component, static+dynamic × inline/head/file      |
| `02_app_router_client` | App Router Client Component, static+dynamic parent × three modes    |
| `03_mixed_tree`        | Server + Client siblings; one graph's rule must not erase the other |
| `04_pages_router`      | Pages Router SSR + static, custom `_document`/`_app`, three modes   |
| `05_routes_navigation` | two routes, direct-request resolution; client-nav rows skipped RED  |
| `06_css_boundary`      | `css` marker split on an App Router Server Component                |
| `07_bundler_matrix`    | Turbopack vs webpack, dev + production — see RED                    |
| `08_static_export`     | `output: 'export'`; each out/ HTML resolves its class references    |
| `09_options_scanner`   | classPrefix, minify, invalid-output + dangling-class scan           |
| `10_dev_update`        | edit Server / Client / token source; new value reflected in dev     |

## Observed plugin contract (next adapter)

- Turbopack branch: forwards the requested `output` and registers a loader rule per
  extension; the loader emits collected rules as `data:text/css` module imports.
- webpack branch: **forces `{ output: 'inline', inlineOnly: true }`** regardless of
  the requested mode. So placement is engine-dependent — webpack only ever inlines.
- `head` mode also turns on Next's `experimental.inlineCss`.
- The loader lives at `src/loader.js` (resolved next to the built `index`); the
  `/src` entry imports `./loader.js`.
- Same JSX-only transform as the other adapters: `style={chain()}` → inline object
  (inline) or `className="tcss-…"` (head/file).

## Known RED

- `07_bundler_matrix` ENGINE-004 (webpack production, `file` requested) expects a
  reachable file asset, but the webpack branch forces inline — fails by design,
  recording the engine divergence.
- `05_routes_navigation` client-navigation rows are `test.skip` that throw: they
  need a browser driver the shared harness does not provide, kept visible not dropped.
- head/file rows depend on the loader actually collecting + placing rules through
  Next's CSS pipeline; where that pipeline does not surface the rules, the
  class-resolution assertions fail rather than being skipped.
