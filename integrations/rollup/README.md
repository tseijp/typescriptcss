# rollup integration suite

Exercises `@typescriptcss/rollup` on real Rollup, tsup and tsdown builds.
Each test writes an isolated temp project (via `test` from `../utils`), installs
public deps with pnpm, runs the real build, then executes the emitted entry and
scans the artifacts.

## Shared helpers — `_fixtures.ts`

- `packageJson(deps, devDeps)` — manifest with `typescriptcss` + plugin as workspace deps.
- `TSCONFIG`, `H_FACTORY` — a JSX factory (`h`) that returns the props bag, so a
  compiled `<div style={chain()}/>` becomes `{ tag, ...props }` and the recovered
  marker export reveals exactly what the plugin produced.
- Entry fixtures: `SINGLE_ENTRY`, `ENTRY_A/ENTRY_B` (shared + own chain),
  `DYNAMIC_MAIN/DYNAMIC_LAZY`, `SPLIT_ENTRY` (css-boundary cases), `TOKENS`.
- Config generators (one per tool, intentionally not merged): `rollupConfig`,
  `tsupConfig`, `tsdownConfig`. Dev-dep sets: `ROLLUP_DEV`, `TSUP_DEV`, `TSDOWN_DEV`.
- Runners: `esmRunner` / `cjsRunner` print a `RESULT:` JSON line; `pickResult` reads it.

Cross-artifact scanners come from `../utils`: `collectClasses`, `definedClasses`,
`scanClassReferences`, `scanArtifacts`, `declarationsForClass`, `decodeInlineSourceMap`.

## What each file observes

| File                    | Focus                                                                             |
| ----------------------- | --------------------------------------------------------------------------------- |
| `00_harness_baseline`   | harness smoke + plugin-disabled baseline (reference style meaning)                |
| `01_inline_file`        | inline keeps inline decls / file emits class + matching rule / inline⇔file parity |
| `02_head_auto`          | observed behaviour of `head` and `auto` on Rollup                                 |
| `03_split_boundary`     | `css` marker split: leading / mid-chain / cascade / empty halves / call-arg       |
| `04_multi_dynamic`      | multi-entry shared+own classes; dynamic import main+lazy resolution               |
| `05_watch`              | edit one raw value, rebuild, neighbour entry stays resolvable                     |
| `06_formats`            | CJS require-able entry; tsdown DTS emit not broken by the transform               |
| `07_options`            | include/exclude, classPrefix, fileName, minify, root                              |
| `08_resolve`            | relative / tsconfig-alias / barrel token, param↔import collision, cyclic module   |
| `09_sourcemap_scanner`  | source map back-maps to source; dedup; invalid-artifact scan                      |
| `10_tsup` / `11_tsdown` | same plugin on tsup / tsdown (single, multi, split smoke; tsdown watch)           |
| `12_head_contract_red`  | asserts the documented head contract — see RED below                              |

## Observed plugin contract (rollup adapter)

- `output` is coerced: `'inline'` stays inline, **everything else (`head`, `auto`,
  `file`) becomes `file`**. The base target and the css split-target are both that
  value. Rollup owns no HTML document, so there is no `<style>`/head mechanism.
- `file` mode emits one CSS asset via `generateBundle` (`this.emitFile`), default
  name `typescriptcss.css` (overridable by `fileName`).
- The transform rewrites JSX `style={chain()}` attributes only. In `file` mode the
  attribute becomes `className="tcss-…"`; in `inline` mode it stays an inline object.
  Class tokens are `tcss-<hash>` (prefix overridable by `classPrefix`).

## Known RED

- `12_head_contract_red` expects `head` on a document-less tool to be honoured or
  explicitly rejected. The adapter silently re-routes it to `file`, so this test
  fails by design and marks that contract gap. Do not relax it to match the fallback.
