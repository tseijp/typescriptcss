# vite integration suite

Exercises `@typescriptcss/vite` on Vite itself and on the frameworks that
build on Vite. Each test stands up a temp project, installs the framework + the
workspace plugin, then runs a real `vite build` (or `vite` dev) and observes the
served HTML and reachable stylesheets.

## Shared helpers — `_fixtures.ts`

- `pkg(deps, dev)` — manifest; always pulls `typescriptcss` + `@typescriptcss/vite`.
- `viteConfig({ output, framework, pluginExtra })` — puts the typescriptcss plugin
  first; `framework` is an import snippet that binds `frameworkPlugin`, called after.
- `indexHtml(entry)` — minimal mount point.
- Per-framework fixture objects, each `{ deps, dev?, frameworkImport, files() }`:
  `vanilla`, `react`, `preact`, `solid`, `qwik`, `vue`, `svelte`, `lit`.
  Every fixture renders one `MARKER` text node and applies one reused chain
  (`flex.col.gap[3].p[6].bg[RAW_VALUE]`) plus a call-arg variant.
- Observation: `referencedClasses(html)`, `expectResolved(expect, html, sheet)`
  (every referenced `tcss-*` has a rule), `assertNoInvalid`. `fetchPage`,
  `fetchStyles`, `retryAssertion`, `test` are re-exported from `../utils`.

## What each file observes

| File                     | Focus                                                                          |
| ------------------------ | ------------------------------------------------------------------------------ |
| `00_vanilla`             | VITE-VANILLA, three modes — see RED (non-JSX binding)                          |
| `01_react`               | VITE-REACT, three modes + dev value-edit + source map                          |
| `02_jsx_clients`         | VITE-PREACT / VITE-SOLID / VITE-QWIK file-mode build, one real build each      |
| `03_template_frameworks` | VITE-VUE / VITE-SVELTE / VITE-LIT, inline (runtime) + file — see RED           |
| `04_astro`               | VITE-ASTRO server-rendered page, file + inline                                 |
| `05_modes_boundary`      | inline/head/file/auto oracle on a TSX fixture + `css` split boundary           |
| `06_options`             | classPrefix, fileName, minify, include/exclude (TSX, no per-framework fan-out) |
| `07_transform`           | `.tsx` targeting, dedup across modules, no node_modules mis-transform          |

## Observed plugin contract (vite adapter)

- `output` passes through (`inline` / `head` / `file` / `auto`; non-file/inline → head base).
- `head`: `transformIndexHtml` injects `<style data-typescriptcss>` into the document head.
- `file`: emits one CSS asset and injects a `<link rel="stylesheet">`; dev serves the
  same sheet from `<base>typescriptcss.css` via a middleware.
- The transform only rewrites **JSX `style={chain()}`** attributes. So React /
  Preact / Solid / Qwik (TSX) are collectible; vanilla DOM, Vue `:style`, Svelte
  `style=`, Lit `styleMap`, and `.astro` template bindings are not literal JSX style
  attributes and are not collected for head/file.

## Known RED

- `00_vanilla` head/file, `03_template_frameworks` file rows, and `04_astro` file
  expect the marker style to be reachable from a collected rule. Because those
  bindings are not literal JSX `style` attributes, nothing is collected and the
  resolution assertions fail by design. The `inline` rows for the same frameworks
  pass (the chain renders as a runtime style object). These RED rows record the
  binding-coverage gap rather than hiding it with a skip.
