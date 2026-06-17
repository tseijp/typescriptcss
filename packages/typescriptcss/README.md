# typescriptcss

English | [日本語](./README.ja.md)

Tailwind-like utilities, authored as inline style chains in TypeScript and collected into a real stylesheet at build time.

```tsx
<div style={flex.col.items.center.gap[4].p[6].rounded[4].bg['#0b1120'].dark.bg.black()}>
  <h2 style={text['#fff'].font.semibold()}>Zero runtime</h2>
</div>
```

You build a chain of property accesses and call it. The call returns a plain style object, so on the server it renders like an inline style with no runtime. At build time the bundler plugin reads each chain, evaluates it, hashes the result into a class, and emits one deduplicated stylesheet.

## Why

- **No CSS files to maintain.** Styles live next to the markup as chains. The build collects them; there is no stylesheet to keep in sync with your components.
- **Typed and completed.** Every utility is a property your editor completes and the compiler validates. A style that does not type-check never ships.
- **One unit, no palette.** Scales use a four-pixel unit (`gap[4]` is 16px) and colors are plain hex or `oklch()` strings, so there is nothing to configure and nothing to purge.
- **Zero runtime.** Chains render to style objects on the server and collapse to classes at build. Nothing extra runs in the browser.

## Install

```bash
npm install typescriptcss
```

Then add the plugin for your bundler so the chains are collected at build time.

## Writing styles

Import the utilities you need and combine them. Reading a property narrows the style; calling the chain finalizes it.

```tsx
import { flex, text, bg, gap, p, rounded, max } from 'typescriptcss'

<aside style={flex.col.gap[3].max.w[72].p[6].rounded[4].bg['#0b1120']()}>
  {/* ... */}
</aside>
```

Numbers use element access (`gap[3]`, `p[6]`, `rounded[4]`), and colors are passed as strings (`bg['#0b1120']`, `text['oklch(98.5% 0 0)']`). To set a property that has no utility yet, pass a plain object to the call and it merges on top of the chain:

```tsx
<div style={flex.col.gap[3]({ position: 'sticky', top: 0 })}>{/* ... */}</div>
```

### Responsive

Insert a breakpoint segment — `sm`, `md`, `lg`, `xl` — and the utilities after it apply at that width and up.

```tsx
<div style={flex.col.sm.flex.row.gap[4]()}>{/* stack on phones, row from sm */}</div>
```

### Dark mode

Insert `dark` and the color utilities that follow take a second value. The pair compiles to one `light-dark()` declaration.

```tsx
<div style={bg['#fff'].dark.bg['#0b1120'].text['#111'].dark.text['#f8fafc']()}>{/* ... */}</div>
```

### Interactive states

Insert a state segment such as `hover`, `focus`, `active`, `first`, `disabled`, `checked`, `group`, or `peer`. Segments stack with breakpoints and `dark`.

```tsx
<button style={bg['#0ea5e9'].hover.bg['#0369a1'].text['#fff']()}>Save changes</button>
```

## Bundler setup

### Vite

```ts
import { defineConfig } from 'vite'
import { typescriptcss } from '@typescriptcss/plugin-vite'

export default defineConfig({
  plugins: [typescriptcss()],
})
```

### Rollup / tsdown

```ts
import { typescriptcss } from '@typescriptcss/plugin-rollup'

export default {
  plugins: [typescriptcss()],
}
```

### Next.js

```ts
import { typescriptcss } from '@typescriptcss/plugin-next'

const withTypescriptcss = typescriptcss()

export default withTypescriptcss({
  // your next config
})
```

## Output modes

Choose where collected styles go with the `output` option on the plugin:

- `inline` — leave the original inline styles in place; nothing is collected.
- `head` — gather the rules into a single `<style>` tag in the document head.
- `file` — emit a CSS file as a build asset.
- `auto` — let the bundler decide based on its target.

You can also draw the boundary inside a chain. A leading `css` marks the whole chain for file output, and a `css` in the middle keeps the leading part inline or in the head while sending everything after it to the file.

```tsx
<div style={flex.col.css.bg['#0b1120']()}>{/* flex.col stays inline; bg goes to the file */}</div>
```

## Packages

- `typescriptcss` — the runtime chain library.
- `@typescriptcss/plugin-core` — bundler-agnostic collector used by the adapters below.
- `@typescriptcss/plugin-vite` — Vite plugin.
- `@typescriptcss/plugin-rollup` — Rollup and tsdown plugin.
- `@typescriptcss/plugin-next` — Next.js config adapter.

## License

MIT
