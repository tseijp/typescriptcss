# typescriptcss

Tailwind 風の utility を TypeScript の inline style chain として記述し、build 時に実際の stylesheet へ集約する。

<!-- prettier-ignore -->
```tsx
<div style={p[6].gap[4].flex.col.items.center.bg['#0b1120'].rounded[4].dark.bg.black()}>
  <h2 style={font.semibold.text['#fff']()}>Zero runtime</h2>
</div>
```

property access の chain を組み立てて呼び出す。呼び出しは plain な style object を返すため、server 上では runtime なしの inline style として描画される。build 時には bundler plugin が各 chain を読み取り、評価し、結果を hash 化して class にし、重複を除いた 1 枚の stylesheet を出力する。

## なぜ typescriptcss か

- **保守する CSS ファイルがない。** style は chain として markup の隣に存在する。build がそれらを集約するため、component と同期させ続ける stylesheet が存在しない。
- **型付きで補完が効く。** すべての utility は editor が補完し compiler が検証する property。型検査を通らない style は出荷されない。
- **Zero runtime。** chain は server 上で style object に描画され、build 時に class へ畳まれる。browser で余分に走るものはない。

## インストール

```bash
npm install typescriptcss
```

その後、chain が build 時に集約されるよう、使っている bundler 向けの plugin を追加する。

## スタイルの記述

必要な utility を import して組み合わせる。property を読むと style が絞り込まれ、chain を呼び出すと確定する。

<!-- prettier-ignore -->
```tsx
import { p } from 'typescriptcss'

<aside style={p[6].max.w[72].gap[3].flex.col.bg['#0b1120'].rounded[4]()}>
  {/* ... */}
</aside>
```

数値は要素アクセス（`gap[3]`、`p[6]`、`rounded[4]`）、色は文字列で渡す（`bg['#0b1120']`、`text['oklch(98.5% 0 0)']`）。まだ utility のない property を設定するには、呼び出しに plain な object を渡すと chain の上に merge される。

<!-- prettier-ignore -->
```tsx
<div style={flex.col.gap[3]({ position: 'sticky', top: 0 })}>{/* ... */}</div>
```

### レスポンシブ

breakpoint の segment（`sm`、`md`、`lg`、`xl`）を挿入すると、その後ろの utility はその幅以上で適用される。

<!-- prettier-ignore -->
```tsx
<div style={flex.col.sm.gap[4].flex.row()}>{/* stack on phones, row from sm */}</div>
```

### ダークモード

`dark` を挿入すると、その後ろの色 utility は 2 つ目の値をとる。この組は 1 つの `light-dark()` 宣言に compile される。

<!-- prettier-ignore -->
```tsx
<div style={bg['#fff'].dark.bg['#0b1120'].text['#111'].dark.text['#f8fafc']()}>{/* ... */}</div>
```

### インタラクティブな状態

`hover`、`focus`、`active`、`first`、`disabled`、`checked`、`group`、`peer` などの状態 segment を挿入する。segment は breakpoint や `dark` と重ねられる。

<!-- prettier-ignore -->
```tsx
<button style={bg['#0ea5e9'].hover.text['#fff'].bg['#0369a1']()}>Save changes</button>
```

🚧 まだ実装に取り組んでいます！

## bundler のセットアップ

### Vite

<!-- prettier-ignore -->
```ts
import { defineConfig } from 'vite'
import { typescriptcss } from '@typescriptcss/vite'

export default defineConfig({
  plugins: [typescriptcss()],
})
```

### Rollup / tsdown

<!-- prettier-ignore -->
```ts
import { typescriptcss } from '@typescriptcss/rollup'

export default {
  plugins: [typescriptcss()],
}
```

### Next.js

<!-- prettier-ignore -->
```ts
import typescriptcss from '@typescriptcss/next'

const withTypescriptcss = typescriptcss()

export default withTypescriptcss({
  // your next config
})
```

## 出力モード

集約した style の行き先を、plugin の `output` option で選ぶ。

- `inline` — 元の inline style をそのまま残す。何も集約しない。
- `head` — rule をドキュメント head の 1 つの `<style>` タグにまとめる。
- `file` — CSS ファイルを build の asset として出力する。
- `auto` — bundler の target に応じて任せる。

境界を chain の内側に引くこともできる。先頭の `css` は chain 全体をファイル出力の対象にし、途中の `css` は先頭部分を inline か head に残しつつ、その後ろをすべてファイルへ送る。

<!-- prettier-ignore -->
```tsx
<div style={flex.col.css.bg['#0b1120']()}>{/* flex.col は inline のまま、bg はファイルへ */}</div>
```

## パッケージ

- `typescriptcss` — runtime の chain library。
- `@typescriptcss/share` — 以下の adapter が使う、bundler 非依存の collector。
- `@typescriptcss/next` — Next.js の config adapter。
- `@typescriptcss/vite` — Vite plugin。
- `@typescriptcss/rollup` — Rollup および tsdown plugin。

## ライセンス

MIT
