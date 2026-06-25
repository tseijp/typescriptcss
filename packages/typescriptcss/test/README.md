# typescriptcss unit tests

Unit tests for the runtime chain in `../src` only. Framework, bundler, generated
assets, HTML head, CSS file, SSR and HMR are out of scope (those live in
`integrations`).

## Run

```bash
pnpm --filter typescriptcss test        # vitest run (unit + typecheck)
pnpm --filter typescriptcss test:watch  # vitest watch
```

Config: `../vitest.config.ts`. Environment is `node`. `typecheck.enabled` is on,
so the `.test-d.ts` type oracle and `@ts-expect-error` markers are verified by
`tsc` during the run. Browser-oracle cases are gated on a DOM and skip under
`node`.

## How the runtime behaves (the model the tests assume)

A chain is a `Proxy` over a function. Reading a property returns a new chain;
calling it returns a plain style object via `Object.assign({}, state.css, ...truthyArgs)`.

Property resolution order for each access (`src/utils.ts` `resolve`):

1. `symbol`, empty string, or `then` resolve to `undefined`.
2. scoped keyword (when the previous segment set a `scope`).
3. greedy read (the previous segment armed `state.read` with `greedy`).
4. global root utility (`rules[key]`).
5. the current segment's own `read(key)`.
6. native-property fallback: an arbitrary key becomes a one-shot greedy reader
   that takes the _next_ access as its value.

Consequences exercised by the suite:

- A scoped keyword (`flex.col`) drops the parent's numeric reader, so
  `flex.col[1]` does **not** add `flex:1`.
- Direction is set once: after `flex.col` the scope is gone, so a later
  `.row`/`.col` cannot override it.
- `dark` applies to the single color utility that immediately follows; it is
  cleared by the next merge and does not leak.
- A breakpoint (`sm`/`md`) wraps only declarations produced while `media` is
  still on the state. The first non-scope merge clears `media`, so trailing
  utilities escape the query.
- `text` is greedy, so a literal `text.dark` is swallowed as `color: 'dark'`.
- Numeric scale and length utilities (`p`, `w`, `gap`, …) reject arbitrary
  string values; color utilities and native fallbacks accept any string.
- Bracketed numbers arrive as strings; native fallback keeps them verbatim
  (`zIndex[5]` → `'5'`). `__proto__` as a key is dropped by `Object.assign`'s
  prototype setter and never poisons the result.

## File map

| File                                 | Surface                                                      |
| ------------------------------------ | ------------------------------------------------------------ |
| `_helpers.ts`                        | PRNG, `isPlainStyle`, `assertNoLeakedMarkers`, `styleEqual`  |
| `00_chain-contract.test.ts`          | public API, call/merge, forking, `css` marker, serialization |
| `01_grammar-collision.test.ts`       | scope vs root vs native disambiguation boundaries            |
| `02_proxy-object-model.test.ts`      | thenable, symbols, reflection, deep chains, frozen args      |
| `03_value-syntax.test.ts`            | integers, keywords, colors, `var()`, arbitrary, nullish      |
| `04_utility-implemented.test.ts`     | every implemented utility, grouped by CSS property meaning   |
| `05_utility-unsupported-red.test.ts` | unimplemented Tailwind utility families (RED ledger)         |
| `06_dark-mode.test.ts`               | `light-dark()` pairing, base fallback, leak boundary         |
| `07_responsive-media.test.ts`        | breakpoint wrapping and the media-scope leak                 |
| `08_composition-cascade.test.ts`     | override order, commutativity, transform/direction limits    |
| `09_variants-red.test.ts`            | variants (hover, group, …) as RED; stack contracts           |
| `10_type-surface.test-d.ts`          | positive types and `@ts-expect-error` rejections             |
| `11_fuzz.test.ts`                    | seeded order/last-write/leak/reserved-word properties        |
| `12_package-surface.test.ts`         | entry exports, plain-object output, shared registry          |
| `13_browser-semantic.test.ts`        | computed-style oracle, gated on a DOM                        |

## Conventions

- GREEN tests assert the real, observed behavior of `src` (never weakened to
  match a bug — bugs are documented explicitly).
- Unsupported surface is kept visible, not deleted or hidden:
     - `expect(lib.x).toBeUndefined()` for a family with no export.
     - `it.fails(...)` titled `[RED unsupported]` / `[RED bug]` for behavior that
       should hold under Tailwind compatibility but does not yet. These pass while
       the gap exists and start failing once the gap is fixed, prompting an update.
- Color palette and named design tokens (`red-500`, `text-sm` → fixed numbers)
  are out of compatibility scope and are not asserted.
- The differential target is Tailwind _semantics_ over raw values, never copied
  Tailwind output; independent invariants (`styleEqual`, structural checks)
  back every comparison.
