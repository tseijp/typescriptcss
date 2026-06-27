```ts
⎯⎯⎯⎯⎯⎯ Failed Tests 166 ⎯⎯⎯⎯⎯⎯

 FAIL  test/00_layout.test.ts > display > sr.only
AssertionError: expected { position: 'absolute', …(9) } to deeply equal { position: 'absolute', …(8) }

- Expected
+ Received

@@ -1,7 +1,8 @@
  {
    "borderWidth": "0",
+   "clip": "rect(0, 0, 0, 0)",
    "clipPath": "inset(50%)",
    "height": "1px",
    "margin": "-1px",
    "overflow": "hidden",
    "padding": "0",

 ❯ test/00_layout.test.ts:182:37


⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[12/178]⎯

 FAIL  test/00_layout.test.ts > display > not.sr.only
AssertionError: expected { position: 'static', …(7) } to deeply equal { position: 'static', …(7) }

- Expected
+ Received

@@ -1,7 +1,7 @@
  {
-   "clipPath": "none",
+   "clip": "auto",
    "height": "auto",
    "margin": "0",
    "overflow": "visible",
    "padding": "0",
    "position": "static",

 ❯ test/00_layout.test.ts:185:41
    183|         })
    184|         test('not.sr.only', () => {
    185|                 expect(_.not.sr.only()).toEqual({ position: 'static', …
       |                                         ^
    186|         })
    187| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[13/178]⎯

 FAIL  test/01_flexbox-grid.test.ts > flex-basis > basis[4]
AssertionError: expected { flexBasis: '100%' } to deeply equal { flexBasis: '16px' }

- Expected
+ Received

  {
-   "flexBasis": "16px",
+   "flexBasis": "100%",
  }

 ❯ test/01_flexbox-grid.test.ts:8:40
      6| describe('flex-basis', () => {
      7|         test('basis[4]', () => {
      8|                 expect(_.basis.full()).toEqual({ flexBasis: '16px' })
       |                                        ^
      9|         })
     10|         test('basis.full', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[14/178]⎯

 FAIL  test/01_flexbox-grid.test.ts > grid-column > col[4]
AssertionError: expected { gridColumn: 'span 4 / span 4' } to deeply equal { gridColumn: '4' }

- Expected
+ Received

  {
-   "gridColumn": "4",
+   "gridColumn": "span 4 / span 4",
  }

 ❯ test/01_flexbox-grid.test.ts:128:36
    126|         })
    127|         test('col[4]', () => {
    128|                 expect(_.col[4]()).toEqual({ gridColumn: '4' })
       |                                    ^
    129|         })
    130| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[15/178]⎯

 FAIL  test/01_flexbox-grid.test.ts > grid-row > row[4]
AssertionError: expected { gridRow: 'span 4 / span 4' } to deeply equal { gridRow: '4' }

- Expected
+ Received

  {
-   "gridRow": "4",
+   "gridRow": "span 4 / span 4",
  }

 ❯ test/01_flexbox-grid.test.ts:167:36
    165|         })
    166|         test('row[4]', () => {
    167|                 expect(_.row[4]()).toEqual({ gridRow: '4' })
       |                                    ^
    168|         })
    169| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[16/178]⎯

 FAIL  test/01_flexbox-grid.test.ts > align-self > self.end
AssertionError: expected { alignSelf: 'flex-end' } to deeply equal { alignSelf: 'safe flex-end' }

- Expected
+ Received

  {
-   "alignSelf": "safe flex-end",
+   "alignSelf": "flex-end",
  }

 ❯ test/01_flexbox-grid.test.ts:389:38
    387|         })
    388|         test('self.end', () => {
    389|                 expect(_.self.end()).toEqual({ alignSelf: 'safe flex-e…
       |                                      ^
    390|         })
    391|         test('self.center', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[17/178]⎯

 FAIL  test/01_flexbox-grid.test.ts > align-self > self.center
AssertionError: expected { alignSelf: 'center' } to deeply equal { alignSelf: 'safe center' }

- Expected
+ Received

  {
-   "alignSelf": "safe center",
+   "alignSelf": "center",
  }

 ❯ test/01_flexbox-grid.test.ts:395:41
    393|         })
    394|         test('self.center', () => {
    395|                 expect(_.self.center()).toEqual({ alignSelf: 'safe cen…
       |                                         ^
    396|         })
    397|         test('self.stretch', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[18/178]⎯

 FAIL  test/03_sizing.test.ts > max-width > container
AssertionError: expected { width: '100%' } to deeply equal { width: '100%', …(5) }

- Expected
+ Received

  {
-   "@media (width >= 40rem)": {
-     "maxWidth": "40rem",
-   },
-   "@media (width >= 48rem)": {
-     "maxWidth": "48rem",
-   },
-   "@media (width >= 64rem)": {
-     "maxWidth": "64rem",
-   },
-   "@media (width >= 80rem)": {
-     "maxWidth": "80rem",
-   },
-   "@media (width >= 96rem)": {
-     "maxWidth": "96rem",
-   },
    "width": "100%",
  }

 ❯ test/03_sizing.test.ts:167:39
    165|         })
    166|         test('container', () => {
    167|                 expect(_.container()).toEqual({
       |                                       ^
    168|                         width: '100%',
    169|                         '@media (width >= 40rem)': { maxWidth: '40rem'…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[19/178]⎯

 FAIL  test/03_sizing.test.ts > inline-size > size['1px']
AssertionError: expected { height: '1px', width: '1px' } to deeply equal { inlineSize: '1px' }

- Expected
+ Received

  {
-   "inlineSize": "1px",
+   "height": "1px",
+   "width": "1px",
  }

 ❯ test/03_sizing.test.ts:315:41
    313| describe('inline-size', () => {
    314|         test("size['1px']", () => {
    315|                 expect(_.size['1px']()).toEqual({ inlineSize: '1px' })
       |                                         ^
    316|         })
    317|         test("size['100%']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[20/178]⎯

 FAIL  test/03_sizing.test.ts > inline-size > size['100%']
AssertionError: expected { height: '100%', width: '100%' } to deeply equal { inlineSize: '100%' }

- Expected
+ Received

  {
-   "inlineSize": "100%",
+   "height": "100%",
+   "width": "100%",
  }

 ❯ test/03_sizing.test.ts:318:42
    316|         })
    317|         test("size['100%']", () => {
    318|                 expect(_.size['100%']()).toEqual({ inlineSize: '100%' …
       |                                          ^
    319|         })
    320|         test("size['100vw']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[21/178]⎯

 FAIL  test/03_sizing.test.ts > inline-size > size['100vw']
AssertionError: expected { height: '100vw', width: '100vw' } to deeply equal { inlineSize: '100vw' }

- Expected
+ Received

  {
-   "inlineSize": "100vw",
+   "height": "100vw",
+   "width": "100vw",
  }

 ❯ test/03_sizing.test.ts:321:43
    319|         })
    320|         test("size['100vw']", () => {
    321|                 expect(_.size['100vw']()).toEqual({ inlineSize: '100vw…
       |                                           ^
    322|         })
    323|         test("size['100dvw']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[22/178]⎯

 FAIL  test/03_sizing.test.ts > inline-size > size['100dvw']
AssertionError: expected { height: '100dvw', width: '100dvw' } to deeply equal { inlineSize: '100dvw' }

- Expected
+ Received

  {
-   "inlineSize": "100dvw",
+   "height": "100dvw",
+   "width": "100dvw",
  }

 ❯ test/03_sizing.test.ts:324:44
    322|         })
    323|         test("size['100dvw']", () => {
    324|                 expect(_.size['100dvw']()).toEqual({ inlineSize: '100d…
       |                                            ^
    325|         })
    326|         test("size['100dvh']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[23/178]⎯

 FAIL  test/03_sizing.test.ts > inline-size > size['100dvh']
AssertionError: expected { height: '100dvh', width: '100dvh' } to deeply equal { inlineSize: '100dvh' }

- Expected
+ Received

  {
-   "inlineSize": "100dvh",
+   "height": "100dvh",
+   "width": "100dvh",
  }

 ❯ test/03_sizing.test.ts:327:44
    325|         })
    326|         test("size['100dvh']", () => {
    327|                 expect(_.size['100dvh']()).toEqual({ inlineSize: '100d…
       |                                            ^
    328|         })
    329|         test("size['100lvw']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[24/178]⎯

 FAIL  test/03_sizing.test.ts > inline-size > size['100lvw']
AssertionError: expected { height: '100lvw', width: '100lvw' } to deeply equal { inlineSize: '100lvw' }

- Expected
+ Received

  {
-   "inlineSize": "100lvw",
+   "height": "100lvw",
+   "width": "100lvw",
  }

 ❯ test/03_sizing.test.ts:330:44
    328|         })
    329|         test("size['100lvw']", () => {
    330|                 expect(_.size['100lvw']()).toEqual({ inlineSize: '100l…
       |                                            ^
    331|         })
    332|         test("size['100lvh']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[25/178]⎯

 FAIL  test/03_sizing.test.ts > inline-size > size['100lvh']
AssertionError: expected { height: '100lvh', width: '100lvh' } to deeply equal { inlineSize: '100lvh' }

- Expected
+ Received

  {
-   "inlineSize": "100lvh",
+   "height": "100lvh",
+   "width": "100lvh",
  }

 ❯ test/03_sizing.test.ts:333:44
    331|         })
    332|         test("size['100lvh']", () => {
    333|                 expect(_.size['100lvh']()).toEqual({ inlineSize: '100l…
       |                                            ^
    334|         })
    335|         test("size['100svw']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[26/178]⎯

 FAIL  test/03_sizing.test.ts > inline-size > size['100svw']
AssertionError: expected { height: '100svw', width: '100svw' } to deeply equal { inlineSize: '100svw' }

- Expected
+ Received

  {
-   "inlineSize": "100svw",
+   "height": "100svw",
+   "width": "100svw",
  }

 ❯ test/03_sizing.test.ts:336:44
    334|         })
    335|         test("size['100svw']", () => {
    336|                 expect(_.size['100svw']()).toEqual({ inlineSize: '100s…
       |                                            ^
    337|         })
    338|         test("size['100svh']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[27/178]⎯

 FAIL  test/03_sizing.test.ts > inline-size > size['100svh']
AssertionError: expected { height: '100svh', width: '100svh' } to deeply equal { inlineSize: '100svh' }

- Expected
+ Received

  {
-   "inlineSize": "100svh",
+   "height": "100svh",
+   "width": "100svh",
  }

 ❯ test/03_sizing.test.ts:339:44
    337|         })
    338|         test("size['100svh']", () => {
    339|                 expect(_.size['100svh']()).toEqual({ inlineSize: '100s…
       |                                            ^
    340|         })
    341|         test("size['min-content']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[28/178]⎯

 FAIL  test/03_sizing.test.ts > inline-size > size['min-content']
AssertionError: expected { height: 'min-content', …(1) } to deeply equal { inlineSize: 'min-content' }

- Expected
+ Received

  {
-   "inlineSize": "min-content",
+   "height": "min-content",
+   "width": "min-content",
  }

 ❯ test/03_sizing.test.ts:342:49
    340|         })
    341|         test("size['min-content']", () => {
    342|                 expect(_.size['min-content']()).toEqual({ inlineSize: …
       |                                                 ^
    343|         })
    344|         test("size['max-content']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[29/178]⎯

 FAIL  test/03_sizing.test.ts > inline-size > size['max-content']
AssertionError: expected { height: 'max-content', …(1) } to deeply equal { inlineSize: 'max-content' }

- Expected
+ Received

  {
-   "inlineSize": "max-content",
+   "height": "max-content",
+   "width": "max-content",
  }

 ❯ test/03_sizing.test.ts:345:49
    343|         })
    344|         test("size['max-content']", () => {
    345|                 expect(_.size['max-content']()).toEqual({ inlineSize: …
       |                                                 ^
    346|         })
    347|         test("size['fit-content']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[30/178]⎯

 FAIL  test/03_sizing.test.ts > inline-size > size['fit-content']
AssertionError: expected { height: 'fit-content', …(1) } to deeply equal { inlineSize: 'fit-content' }

- Expected
+ Received

  {
-   "inlineSize": "fit-content",
+   "height": "fit-content",
+   "width": "fit-content",
  }

 ❯ test/03_sizing.test.ts:348:49
    346|         })
    347|         test("size['fit-content']", () => {
    348|                 expect(_.size['fit-content']()).toEqual({ inlineSize: …
       |                                                 ^
    349|         })
    350| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[31/178]⎯

 FAIL  test/03_sizing.test.ts > min-inline-size > min.size.auto
AssertionError: expected { minHeight: 'auto', minWidth: 'auto' } to deeply equal { minInlineSize: 'auto' }

- Expected
+ Received

  {
-   "minInlineSize": "auto",
+   "minHeight": "auto",
+   "minWidth": "auto",
  }

 ❯ test/03_sizing.test.ts:354:43
    352| describe('min-inline-size', () => {
    353|         test('min.size.auto', () => {
    354|                 expect(_.min.size.auto()).toEqual({ minInlineSize: 'au…
       |                                           ^
    355|         })
    356|         test("min.size['1px']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[32/178]⎯

 FAIL  test/03_sizing.test.ts > min-inline-size > min.size['1px']
AssertionError: expected { minHeight: '1px', minWidth: '1px' } to deeply equal { minInlineSize: '1px' }

- Expected
+ Received

  {
-   "minInlineSize": "1px",
+   "minHeight": "1px",
+   "minWidth": "1px",
  }

 ❯ test/03_sizing.test.ts:357:45
    355|         })
    356|         test("min.size['1px']", () => {
    357|                 expect(_.min.size['1px']()).toEqual({ minInlineSize: '…
       |                                             ^
    358|         })
    359|         test("min.size['100%']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[33/178]⎯

 FAIL  test/03_sizing.test.ts > min-inline-size > min.size['100%']
AssertionError: expected { minHeight: '100%', minWidth: '100%' } to deeply equal { minInlineSize: '100%' }

- Expected
+ Received

  {
-   "minInlineSize": "100%",
+   "minHeight": "100%",
+   "minWidth": "100%",
  }

 ❯ test/03_sizing.test.ts:360:46
    358|         })
    359|         test("min.size['100%']", () => {
    360|                 expect(_.min.size['100%']()).toEqual({ minInlineSize: …
       |                                              ^
    361|         })
    362|         test("min.size['100vw']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[34/178]⎯

 FAIL  test/03_sizing.test.ts > min-inline-size > min.size['100vw']
AssertionError: expected { minHeight: '100vw', …(1) } to deeply equal { minInlineSize: '100vw' }

- Expected
+ Received

  {
-   "minInlineSize": "100vw",
+   "minHeight": "100vw",
+   "minWidth": "100vw",
  }

 ❯ test/03_sizing.test.ts:363:47
    361|         })
    362|         test("min.size['100vw']", () => {
    363|                 expect(_.min.size['100vw']()).toEqual({ minInlineSize:…
       |                                               ^
    364|         })
    365|         test("min.size['100dvw']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[35/178]⎯

 FAIL  test/03_sizing.test.ts > min-inline-size > min.size['100dvw']
AssertionError: expected { minHeight: '100dvw', …(1) } to deeply equal { minInlineSize: '100dvw' }

- Expected
+ Received

  {
-   "minInlineSize": "100dvw",
+   "minHeight": "100dvw",
+   "minWidth": "100dvw",
  }

 ❯ test/03_sizing.test.ts:366:48
    364|         })
    365|         test("min.size['100dvw']", () => {
    366|                 expect(_.min.size['100dvw']()).toEqual({ minInlineSize…
       |                                                ^
    367|         })
    368|         test("min.size['100dvh']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[36/178]⎯

 FAIL  test/03_sizing.test.ts > min-inline-size > min.size['100dvh']
AssertionError: expected { minHeight: '100dvh', …(1) } to deeply equal { minInlineSize: '100dvh' }

- Expected
+ Received

  {
-   "minInlineSize": "100dvh",
+   "minHeight": "100dvh",
+   "minWidth": "100dvh",
  }

 ❯ test/03_sizing.test.ts:369:48
    367|         })
    368|         test("min.size['100dvh']", () => {
    369|                 expect(_.min.size['100dvh']()).toEqual({ minInlineSize…
       |                                                ^
    370|         })
    371|         test("min.size['100lvw']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[37/178]⎯

 FAIL  test/03_sizing.test.ts > min-inline-size > min.size['100lvw']
AssertionError: expected { minHeight: '100lvw', …(1) } to deeply equal { minInlineSize: '100lvw' }

- Expected
+ Received

  {
-   "minInlineSize": "100lvw",
+   "minHeight": "100lvw",
+   "minWidth": "100lvw",
  }

 ❯ test/03_sizing.test.ts:372:48
    370|         })
    371|         test("min.size['100lvw']", () => {
    372|                 expect(_.min.size['100lvw']()).toEqual({ minInlineSize…
       |                                                ^
    373|         })
    374|         test("min.size['100lvh']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[38/178]⎯

 FAIL  test/03_sizing.test.ts > min-inline-size > min.size['100lvh']
AssertionError: expected { minHeight: '100lvh', …(1) } to deeply equal { minInlineSize: '100lvh' }

- Expected
+ Received

  {
-   "minInlineSize": "100lvh",
+   "minHeight": "100lvh",
+   "minWidth": "100lvh",
  }

 ❯ test/03_sizing.test.ts:375:48
    373|         })
    374|         test("min.size['100lvh']", () => {
    375|                 expect(_.min.size['100lvh']()).toEqual({ minInlineSize…
       |                                                ^
    376|         })
    377|         test("min.size['100svw']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[39/178]⎯

 FAIL  test/03_sizing.test.ts > min-inline-size > min.size['100svw']
AssertionError: expected { minHeight: '100svw', …(1) } to deeply equal { minInlineSize: '100svw' }

- Expected
+ Received

  {
-   "minInlineSize": "100svw",
+   "minHeight": "100svw",
+   "minWidth": "100svw",
  }

 ❯ test/03_sizing.test.ts:378:48
    376|         })
    377|         test("min.size['100svw']", () => {
    378|                 expect(_.min.size['100svw']()).toEqual({ minInlineSize…
       |                                                ^
    379|         })
    380|         test("min.size['100svh']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[40/178]⎯

 FAIL  test/03_sizing.test.ts > min-inline-size > min.size['100svh']
AssertionError: expected { minHeight: '100svh', …(1) } to deeply equal { minInlineSize: '100svh' }

- Expected
+ Received

  {
-   "minInlineSize": "100svh",
+   "minHeight": "100svh",
+   "minWidth": "100svh",
  }

 ❯ test/03_sizing.test.ts:381:48
    379|         })
    380|         test("min.size['100svh']", () => {
    381|                 expect(_.min.size['100svh']()).toEqual({ minInlineSize…
       |                                                ^
    382|         })
    383|         test("min.size['min-content']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[41/178]⎯

 FAIL  test/03_sizing.test.ts > min-inline-size > min.size['min-content']
AssertionError: expected { minHeight: 'min-content', …(1) } to deeply equal { minInlineSize: 'min-content' }

- Expected
+ Received

  {
-   "minInlineSize": "min-content",
+   "minHeight": "min-content",
+   "minWidth": "min-content",
  }

 ❯ test/03_sizing.test.ts:384:53
    382|         })
    383|         test("min.size['min-content']", () => {
    384|                 expect(_.min.size['min-content']()).toEqual({ minInlin…
       |                                                     ^
    385|         })
    386|         test("min.size['max-content']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[42/178]⎯

 FAIL  test/03_sizing.test.ts > min-inline-size > min.size['max-content']
AssertionError: expected { minHeight: 'max-content', …(1) } to deeply equal { minInlineSize: 'max-content' }

- Expected
+ Received

  {
-   "minInlineSize": "max-content",
+   "minHeight": "max-content",
+   "minWidth": "max-content",
  }

 ❯ test/03_sizing.test.ts:387:53
    385|         })
    386|         test("min.size['max-content']", () => {
    387|                 expect(_.min.size['max-content']()).toEqual({ minInlin…
       |                                                     ^
    388|         })
    389|         test("min.size['fit-content']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[43/178]⎯

 FAIL  test/03_sizing.test.ts > min-inline-size > min.size['fit-content']
AssertionError: expected { minHeight: 'fit-content', …(1) } to deeply equal { minInlineSize: 'fit-content' }

- Expected
+ Received

  {
-   "minInlineSize": "fit-content",
+   "minHeight": "fit-content",
+   "minWidth": "fit-content",
  }

 ❯ test/03_sizing.test.ts:390:53
    388|         })
    389|         test("min.size['fit-content']", () => {
    390|                 expect(_.min.size['fit-content']()).toEqual({ minInlin…
       |                                                     ^
    391|         })
    392| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[44/178]⎯

 FAIL  test/03_sizing.test.ts > max-inline-size > max.size.none
AssertionError: expected { maxHeight: 'none', maxWidth: 'none' } to deeply equal { maxInlineSize: 'none' }

- Expected
+ Received

  {
-   "maxInlineSize": "none",
+   "maxHeight": "none",
+   "maxWidth": "none",
  }

 ❯ test/03_sizing.test.ts:396:43
    394| describe('max-inline-size', () => {
    395|         test('max.size.none', () => {
    396|                 expect(_.max.size.none()).toEqual({ maxInlineSize: 'no…
       |                                           ^
    397|         })
    398|         test("max.size['1px']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[45/178]⎯

 FAIL  test/03_sizing.test.ts > max-inline-size > max.size['1px']
AssertionError: expected { maxHeight: '1px', maxWidth: '1px' } to deeply equal { maxInlineSize: '1px' }

- Expected
+ Received

  {
-   "maxInlineSize": "1px",
+   "maxHeight": "1px",
+   "maxWidth": "1px",
  }

 ❯ test/03_sizing.test.ts:399:45
    397|         })
    398|         test("max.size['1px']", () => {
    399|                 expect(_.max.size['1px']()).toEqual({ maxInlineSize: '…
       |                                             ^
    400|         })
    401|         test("max.size['100%']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[46/178]⎯

 FAIL  test/03_sizing.test.ts > max-inline-size > max.size['100%']
AssertionError: expected { maxHeight: '100%', maxWidth: '100%' } to deeply equal { maxInlineSize: '100%' }

- Expected
+ Received

  {
-   "maxInlineSize": "100%",
+   "maxHeight": "100%",
+   "maxWidth": "100%",
  }

 ❯ test/03_sizing.test.ts:402:46
    400|         })
    401|         test("max.size['100%']", () => {
    402|                 expect(_.max.size['100%']()).toEqual({ maxInlineSize: …
       |                                              ^
    403|         })
    404|         test("max.size['100dvw']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[47/178]⎯

 FAIL  test/03_sizing.test.ts > max-inline-size > max.size['100dvw']
AssertionError: expected { maxHeight: '100dvw', …(1) } to deeply equal { maxInlineSize: '100dvw' }

- Expected
+ Received

  {
-   "maxInlineSize": "100dvw",
+   "maxHeight": "100dvw",
+   "maxWidth": "100dvw",
  }

 ❯ test/03_sizing.test.ts:405:48
    403|         })
    404|         test("max.size['100dvw']", () => {
    405|                 expect(_.max.size['100dvw']()).toEqual({ maxInlineSize…
       |                                                ^
    406|         })
    407|         test("max.size['100dvh']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[48/178]⎯

 FAIL  test/03_sizing.test.ts > max-inline-size > max.size['100dvh']
AssertionError: expected { maxHeight: '100dvh', …(1) } to deeply equal { maxInlineSize: '100dvh' }

- Expected
+ Received

  {
-   "maxInlineSize": "100dvh",
+   "maxHeight": "100dvh",
+   "maxWidth": "100dvh",
  }

 ❯ test/03_sizing.test.ts:408:48
    406|         })
    407|         test("max.size['100dvh']", () => {
    408|                 expect(_.max.size['100dvh']()).toEqual({ maxInlineSize…
       |                                                ^
    409|         })
    410|         test("max.size['100lvw']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[49/178]⎯

 FAIL  test/03_sizing.test.ts > max-inline-size > max.size['100lvw']
AssertionError: expected { maxHeight: '100lvw', …(1) } to deeply equal { maxInlineSize: '100lvw' }

- Expected
+ Received

  {
-   "maxInlineSize": "100lvw",
+   "maxHeight": "100lvw",
+   "maxWidth": "100lvw",
  }

 ❯ test/03_sizing.test.ts:411:48
    409|         })
    410|         test("max.size['100lvw']", () => {
    411|                 expect(_.max.size['100lvw']()).toEqual({ maxInlineSize…
       |                                                ^
    412|         })
    413|         test("max.size['100lvh']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[50/178]⎯

 FAIL  test/03_sizing.test.ts > max-inline-size > max.size['100lvh']
AssertionError: expected { maxHeight: '100lvh', …(1) } to deeply equal { maxInlineSize: '100lvh' }

- Expected
+ Received

  {
-   "maxInlineSize": "100lvh",
+   "maxHeight": "100lvh",
+   "maxWidth": "100lvh",
  }

 ❯ test/03_sizing.test.ts:414:48
    412|         })
    413|         test("max.size['100lvh']", () => {
    414|                 expect(_.max.size['100lvh']()).toEqual({ maxInlineSize…
       |                                                ^
    415|         })
    416|         test("max.size['100svw']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[51/178]⎯

 FAIL  test/03_sizing.test.ts > max-inline-size > max.size['100svw']
AssertionError: expected { maxHeight: '100svw', …(1) } to deeply equal { maxInlineSize: '100svw' }

- Expected
+ Received

  {
-   "maxInlineSize": "100svw",
+   "maxHeight": "100svw",
+   "maxWidth": "100svw",
  }

 ❯ test/03_sizing.test.ts:417:48
    415|         })
    416|         test("max.size['100svw']", () => {
    417|                 expect(_.max.size['100svw']()).toEqual({ maxInlineSize…
       |                                                ^
    418|         })
    419|         test("max.size['100svh']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[52/178]⎯

 FAIL  test/03_sizing.test.ts > max-inline-size > max.size['100svh']
AssertionError: expected { maxHeight: '100svh', …(1) } to deeply equal { maxInlineSize: '100svh' }

- Expected
+ Received

  {
-   "maxInlineSize": "100svh",
+   "maxHeight": "100svh",
+   "maxWidth": "100svh",
  }

 ❯ test/03_sizing.test.ts:420:48
    418|         })
    419|         test("max.size['100svh']", () => {
    420|                 expect(_.max.size['100svh']()).toEqual({ maxInlineSize…
       |                                                ^
    421|         })
    422|         test("max.size['100vw']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[53/178]⎯

 FAIL  test/03_sizing.test.ts > max-inline-size > max.size['100vw']
AssertionError: expected { maxHeight: '100vw', …(1) } to deeply equal { maxInlineSize: '100vw' }

- Expected
+ Received

  {
-   "maxInlineSize": "100vw",
+   "maxHeight": "100vw",
+   "maxWidth": "100vw",
  }

 ❯ test/03_sizing.test.ts:423:47
    421|         })
    422|         test("max.size['100vw']", () => {
    423|                 expect(_.max.size['100vw']()).toEqual({ maxInlineSize:…
       |                                               ^
    424|         })
    425|         test("max.size['min-content']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[54/178]⎯

 FAIL  test/03_sizing.test.ts > max-inline-size > max.size['min-content']
AssertionError: expected { maxHeight: 'min-content', …(1) } to deeply equal { maxInlineSize: 'min-content' }

- Expected
+ Received

  {
-   "maxInlineSize": "min-content",
+   "maxHeight": "min-content",
+   "maxWidth": "min-content",
  }

 ❯ test/03_sizing.test.ts:426:53
    424|         })
    425|         test("max.size['min-content']", () => {
    426|                 expect(_.max.size['min-content']()).toEqual({ maxInlin…
       |                                                     ^
    427|         })
    428|         test("max.size['max-content']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[55/178]⎯

 FAIL  test/03_sizing.test.ts > max-inline-size > max.size['max-content']
AssertionError: expected { maxHeight: 'max-content', …(1) } to deeply equal { maxInlineSize: 'max-content' }

- Expected
+ Received

  {
-   "maxInlineSize": "max-content",
+   "maxHeight": "max-content",
+   "maxWidth": "max-content",
  }

 ❯ test/03_sizing.test.ts:429:53
    427|         })
    428|         test("max.size['max-content']", () => {
    429|                 expect(_.max.size['max-content']()).toEqual({ maxInlin…
       |                                                     ^
    430|         })
    431|         test("max.size['fit-content']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[56/178]⎯

 FAIL  test/03_sizing.test.ts > max-inline-size > max.size['fit-content']
AssertionError: expected { maxHeight: 'fit-content', …(1) } to deeply equal { maxInlineSize: 'fit-content' }

- Expected
+ Received

  {
-   "maxInlineSize": "fit-content",
+   "maxHeight": "fit-content",
+   "maxWidth": "fit-content",
  }

 ❯ test/03_sizing.test.ts:432:53
    430|         })
    431|         test("max.size['fit-content']", () => {
    432|                 expect(_.max.size['fit-content']()).toEqual({ maxInlin…
       |                                                     ^
    433|         })
    434| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[57/178]⎯

 FAIL  test/03_sizing.test.ts > block-size > size['100vh']
AssertionError: expected { height: '100vh', width: '100vh' } to deeply equal { blockSize: '100vh' }

- Expected
+ Received

  {
-   "blockSize": "100vh",
+   "height": "100vh",
+   "width": "100vh",
  }

 ❯ test/03_sizing.test.ts:438:43
    436| describe('block-size', () => {
    437|         test("size['100vh']", () => {
    438|                 expect(_.size['100vh']()).toEqual({ blockSize: '100vh'…
       |                                           ^
    439|         })
    440|         test("size['1lh']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[58/178]⎯

 FAIL  test/03_sizing.test.ts > block-size > size['1lh']
AssertionError: expected { height: '1lh', width: '1lh' } to deeply equal { blockSize: '1lh' }

- Expected
+ Received

  {
-   "blockSize": "1lh",
+   "height": "1lh",
+   "width": "1lh",
  }

 ❯ test/03_sizing.test.ts:441:41
    439|         })
    440|         test("size['1lh']", () => {
    441|                 expect(_.size['1lh']()).toEqual({ blockSize: '1lh' })
       |                                         ^
    442|         })
    443| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[59/178]⎯

 FAIL  test/03_sizing.test.ts > min-block-size > min.size['100vh']
AssertionError: expected { minHeight: '100vh', …(1) } to deeply equal { minBlockSize: '100vh' }

- Expected
+ Received

  {
-   "minBlockSize": "100vh",
+   "minHeight": "100vh",
+   "minWidth": "100vh",
  }

 ❯ test/03_sizing.test.ts:447:47
    445| describe('min-block-size', () => {
    446|         test("min.size['100vh']", () => {
    447|                 expect(_.min.size['100vh']()).toEqual({ minBlockSize: …
       |                                               ^
    448|         })
    449|         test("min.size['1lh']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[60/178]⎯

 FAIL  test/03_sizing.test.ts > min-block-size > min.size['1lh']
AssertionError: expected { minHeight: '1lh', minWidth: '1lh' } to deeply equal { minBlockSize: '1lh' }

- Expected
+ Received

  {
-   "minBlockSize": "1lh",
+   "minHeight": "1lh",
+   "minWidth": "1lh",
  }

 ❯ test/03_sizing.test.ts:450:45
    448|         })
    449|         test("min.size['1lh']", () => {
    450|                 expect(_.min.size['1lh']()).toEqual({ minBlockSize: '1…
       |                                             ^
    451|         })
    452| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[61/178]⎯

 FAIL  test/03_sizing.test.ts > max-block-size > max.size['100vh']
AssertionError: expected { maxHeight: '100vh', …(1) } to deeply equal { maxBlockSize: '100vh' }

- Expected
+ Received

  {
-   "maxBlockSize": "100vh",
+   "maxHeight": "100vh",
+   "maxWidth": "100vh",
  }

 ❯ test/03_sizing.test.ts:456:47
    454| describe('max-block-size', () => {
    455|         test("max.size['100vh']", () => {
    456|                 expect(_.max.size['100vh']()).toEqual({ maxBlockSize: …
       |                                               ^
    457|         })
    458|         test("max.size['1lh']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[62/178]⎯

 FAIL  test/03_sizing.test.ts > max-block-size > max.size['1lh']
AssertionError: expected { maxHeight: '1lh', maxWidth: '1lh' } to deeply equal { maxBlockSize: '1lh' }

- Expected
+ Received

  {
-   "maxBlockSize": "1lh",
+   "maxHeight": "1lh",
+   "maxWidth": "1lh",
  }

 ❯ test/03_sizing.test.ts:459:45
    457|         })
    458|         test("max.size['1lh']", () => {
    459|                 expect(_.max.size['1lh']()).toEqual({ maxBlockSize: '1…
       |                                             ^
    460|         })
    461| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[63/178]⎯

 FAIL  test/04_typography.test.ts > font-family > font.sans
AssertionError: expected { Object (fontFamily) } to deeply equal { Object (fontFamily) }

- Expected
+ Received

  {
-   "fontFamily": "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
+   "fontFamily": "Arial, Helvetica, sans-serif",
  }

 ❯ test/04_typography.test.ts:8:39
      6| describe('font-family', () => {
      7|         test('font.sans', () => {
      8|                 expect(_.font.sans()).toEqual({ fontFamily: "ui-sans-s…
       |                                       ^
      9|         })
     10|         test('font.serif', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[64/178]⎯

 FAIL  test/04_typography.test.ts > font-family > font.serif
AssertionError: expected { Object (fontFamily) } to deeply equal { Object (fontFamily) }

- Expected
+ Received

  {
-   "fontFamily": "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif",
+   "fontFamily": "Georgia, Cambria, Times New Roman, Times, serif",
  }

 ❯ test/04_typography.test.ts:11:40
      9|         })
     10|         test('font.serif', () => {
     11|                 expect(_.font.serif()).toEqual({ fontFamily: "ui-serif…
       |                                        ^
     12|         })
     13|         test('font.mono', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[65/178]⎯

 FAIL  test/04_typography.test.ts > font-family > font.mono
AssertionError: expected { Object (fontFamily) } to deeply equal { Object (fontFamily) }

- Expected
+ Received

  {
-   "fontFamily": "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
+   "fontFamily": "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  }

 ❯ test/04_typography.test.ts:14:39
     12|         })
     13|         test('font.mono', () => {
     14|                 expect(_.font.mono()).toEqual({ fontFamily: "ui-monosp…
       |                                       ^
     15|         })
     16|         test('font[4]', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[66/178]⎯

 FAIL  test/04_typography.test.ts > font-family > font[4]
AssertionError: expected { fontWeight: 4 } to deeply equal { fontFamily: '4' }

- Expected
+ Received

  {
-   "fontFamily": "4",
+   "fontWeight": 4,
  }

 ❯ test/04_typography.test.ts:17:37
     15|         })
     16|         test('font[4]', () => {
     17|                 expect(_.font[4]()).toEqual({ fontFamily: '4' })
       |                                     ^
     18|         })
     19| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[67/178]⎯

 FAIL  test/04_typography.test.ts > font-size > text.base
AssertionError: expected { Object (fontSize, lineHeight) } to deeply equal { fontSize: '1rem (16px)' }

- Expected
+ Received

  {
-   "fontSize": "1rem (16px)",
+   "fontSize": "16px",
+   "lineHeight": "24px",
  }

 ❯ test/04_typography.test.ts:23:39
     21| describe('font-size', () => {
     22|         test('text.base', () => {
     23|                 expect(_.text.base()).toEqual({ fontSize: '1rem (16px)…
       |                                       ^
     24|         })
     25|         test('text[4]', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[68/178]⎯

 FAIL  test/04_typography.test.ts > font-size > text[4]
AssertionError: expected { fontSize: '16px' } to deeply equal { fontSize: '4' }

- Expected
+ Received

  {
-   "fontSize": "4",
+   "fontSize": "16px",
  }

 ❯ test/04_typography.test.ts:26:37
     24|         })
     25|         test('text[4]', () => {
     26|                 expect(_.text[4]()).toEqual({ fontSize: '4' })
       |                                     ^
     27|         })
     28| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[69/178]⎯

 FAIL  test/04_typography.test.ts > font-weight > font['100']
AssertionError: expected { fontWeight: 100 } to deeply equal { fontWeight: '100' }

- Expected
+ Received

  {
-   "fontWeight": "100",
+   "fontWeight": 100,
  }

 ❯ test/04_typography.test.ts:50:41
     48| describe('font-weight', () => {
     49|         test("font['100']", () => {
     50|                 expect(_.font['100']()).toEqual({ fontWeight: '100' })
       |                                         ^
     51|         })
     52|         test("font['200']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[70/178]⎯

 FAIL  test/04_typography.test.ts > font-weight > font['200']
AssertionError: expected { fontWeight: 200 } to deeply equal { fontWeight: '200' }

- Expected
+ Received

  {
-   "fontWeight": "200",
+   "fontWeight": 200,
  }

 ❯ test/04_typography.test.ts:53:41
     51|         })
     52|         test("font['200']", () => {
     53|                 expect(_.font['200']()).toEqual({ fontWeight: '200' })
       |                                         ^
     54|         })
     55|         test("font['300']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[71/178]⎯

 FAIL  test/04_typography.test.ts > font-weight > font['300']
AssertionError: expected { fontWeight: 300 } to deeply equal { fontWeight: '300' }

- Expected
+ Received

  {
-   "fontWeight": "300",
+   "fontWeight": 300,
  }

 ❯ test/04_typography.test.ts:56:41
     54|         })
     55|         test("font['300']", () => {
     56|                 expect(_.font['300']()).toEqual({ fontWeight: '300' })
       |                                         ^
     57|         })
     58|         test("font['400']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[72/178]⎯

 FAIL  test/04_typography.test.ts > font-weight > font['400']
AssertionError: expected { fontWeight: 400 } to deeply equal { fontWeight: '400' }

- Expected
+ Received

  {
-   "fontWeight": "400",
+   "fontWeight": 400,
  }

 ❯ test/04_typography.test.ts:59:41
     57|         })
     58|         test("font['400']", () => {
     59|                 expect(_.font['400']()).toEqual({ fontWeight: '400' })
       |                                         ^
     60|         })
     61|         test("font['500']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[73/178]⎯

 FAIL  test/04_typography.test.ts > font-weight > font['500']
AssertionError: expected { fontWeight: 500 } to deeply equal { fontWeight: '500' }

- Expected
+ Received

  {
-   "fontWeight": "500",
+   "fontWeight": 500,
  }

 ❯ test/04_typography.test.ts:62:41
     60|         })
     61|         test("font['500']", () => {
     62|                 expect(_.font['500']()).toEqual({ fontWeight: '500' })
       |                                         ^
     63|         })
     64|         test("font['600']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[74/178]⎯

 FAIL  test/04_typography.test.ts > font-weight > font['600']
AssertionError: expected { fontWeight: 600 } to deeply equal { fontWeight: '600' }

- Expected
+ Received

  {
-   "fontWeight": "600",
+   "fontWeight": 600,
  }

 ❯ test/04_typography.test.ts:65:41
     63|         })
     64|         test("font['600']", () => {
     65|                 expect(_.font['600']()).toEqual({ fontWeight: '600' })
       |                                         ^
     66|         })
     67|         test("font['700']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[75/178]⎯

 FAIL  test/04_typography.test.ts > font-weight > font['700']
AssertionError: expected { fontWeight: 700 } to deeply equal { fontWeight: '700' }

- Expected
+ Received

  {
-   "fontWeight": "700",
+   "fontWeight": 700,
  }

 ❯ test/04_typography.test.ts:68:41
     66|         })
     67|         test("font['700']", () => {
     68|                 expect(_.font['700']()).toEqual({ fontWeight: '700' })
       |                                         ^
     69|         })
     70|         test("font['800']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[76/178]⎯

 FAIL  test/04_typography.test.ts > font-weight > font['800']
AssertionError: expected { fontWeight: 800 } to deeply equal { fontWeight: '800' }

- Expected
+ Received

  {
-   "fontWeight": "800",
+   "fontWeight": 800,
  }

 ❯ test/04_typography.test.ts:71:41
     69|         })
     70|         test("font['800']", () => {
     71|                 expect(_.font['800']()).toEqual({ fontWeight: '800' })
       |                                         ^
     72|         })
     73|         test("font['900']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[77/178]⎯

 FAIL  test/04_typography.test.ts > font-weight > font['900']
AssertionError: expected { fontWeight: 900 } to deeply equal { fontWeight: '900' }

- Expected
+ Received

  {
-   "fontWeight": "900",
+   "fontWeight": 900,
  }

 ❯ test/04_typography.test.ts:74:41
     72|         })
     73|         test("font['900']", () => {
     74|                 expect(_.font['900']()).toEqual({ fontWeight: '900' })
       |                                         ^
     75|         })
     76| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[78/178]⎯

 FAIL  test/04_typography.test.ts > font-stretch > font.stretch[4]
AssertionError: expected { fontStretch: '4' } to deeply equal { fontStretch: '50%' }

- Expected
+ Received

  {
-   "fontStretch": "50%",
+   "fontStretch": "4",
  }

 ❯ test/04_typography.test.ts:107:45
    105|         })
    106|         test('font.stretch[4]', () => {
    107|                 expect(_.font.stretch[4]()).toEqual({ fontStretch: '50…
       |                                             ^
    108|         })
    109| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[79/178]⎯

 FAIL  test/04_typography.test.ts > font-variant-numeric > diagonalFractions
TypeError: diagonalFractions is not a function
 ❯ test/04_typography.test.ts:131:26
    129|         })
    130|         test('diagonalFractions', () => {
    131|                 expect(_.diagonalFractions()).toEqual({ fontVariantNum…
       |                          ^
    132|         })
    133|         test('stackedFractions', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[80/178]⎯

 FAIL  test/04_typography.test.ts > letter-spacing > tracking[4]
AssertionError: expected { letterSpacing: '16px' } to deeply equal { letterSpacing: '4' }

- Expected
+ Received

  {
-   "letterSpacing": "4",
+   "letterSpacing": "16px",
  }

 ❯ test/04_typography.test.ts:164:41
    162|         })
    163|         test('tracking[4]', () => {
    164|                 expect(_.tracking[4]()).toEqual({ letterSpacing: '4' })
       |                                         ^
    165|         })
    166| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[81/178]⎯

 FAIL  test/04_typography.test.ts > line-clamp > line.clamp[4]
AssertionError: expected { overflow: 'hidden', …(3) } to deeply equal { overflow: 'hidden', …(3) }

- Expected
+ Received

  {
    "WebkitBoxOrient": "vertical",
-   "WebkitLineClamp": "4",
+   "WebkitLineClamp": 4,
    "display": "-webkit-box",
    "overflow": "hidden",
  }

 ❯ test/04_typography.test.ts:170:43
    168| describe('line-clamp', () => {
    169|         test('line.clamp[4]', () => {
    170|                 expect(_.line.clamp[4]()).toEqual({ overflow: 'hidden'…
       |                                           ^
    171|         })
    172|         test('line.clamp.none', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[82/178]⎯

 FAIL  test/04_typography.test.ts > line-clamp > line.clamp.none
AssertionError: expected { overflow: 'visible', …(3) } to deeply equal { overflow: 'visible', …(3) }

- Expected
+ Received

  {
    "WebkitBoxOrient": "horizontal",
-   "WebkitLineClamp": "unset",
+   "WebkitLineClamp": "none",
    "display": "block",
    "overflow": "visible",
  }

 ❯ test/04_typography.test.ts:173:45
    171|         })
    172|         test('line.clamp.none', () => {
    173|                 expect(_.line.clamp.none()).toEqual({ overflow: 'visib…
       |                                             ^
    174|         })
    175| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[83/178]⎯

 FAIL  test/04_typography.test.ts > line-height > leading['1']
AssertionError: expected { lineHeight: '4px' } to deeply equal { lineHeight: '1' }

- Expected
+ Received

  {
-   "lineHeight": "1",
+   "lineHeight": "4px",
  }

 ❯ test/04_typography.test.ts:179:42
    177| describe('line-height', () => {
    178|         test("leading['1']", () => {
    179|                 expect(_.leading['1']()).toEqual({ lineHeight: '1' })
       |                                          ^
    180|         })
    181| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[84/178]⎯

 FAIL  test/04_typography.test.ts > text-underline-offset > underline.offset[4]
AssertionError: expected { …(2) } to deeply equal { textUnderlineOffset: '4px' }

- Expected
+ Received

  {
+   "textDecorationLine": "underline",
    "textUnderlineOffset": "4px",
  }

 ❯ test/04_typography.test.ts:308:49
    306| describe('text-underline-offset', () => {
    307|         test('underline.offset[4]', () => {
    308|                 expect(_.underline.offset[4]()).toEqual({ textUnderlin…
       |                                                 ^
    309|         })
    310|         test('underline.offset.auto', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[85/178]⎯

 FAIL  test/04_typography.test.ts > text-underline-offset > underline.offset.auto
AssertionError: expected { …(2) } to deeply equal { textUnderlineOffset: 'auto' }

- Expected
+ Received

  {
+   "textDecorationLine": "underline",
    "textUnderlineOffset": "auto",
  }

 ❯ test/04_typography.test.ts:311:51
    309|         })
    310|         test('underline.offset.auto', () => {
    311|                 expect(_.underline.offset.auto()).toEqual({ textUnderl…
       |                                                   ^
    312|         })
    313| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[86/178]⎯

 FAIL  test/04_typography.test.ts > tab-size > tab[4]
AssertionError: expected { tabSize: 4 } to deeply equal { tabSize: '4' }

- Expected
+ Received

  {
-   "tabSize": "4",
+   "tabSize": 4,
  }

 ❯ test/04_typography.test.ts:365:36
    363| describe('tab-size', () => {
    364|         test('tab[4]', () => {
    365|                 expect(_.tab[4]()).toEqual({ tabSize: '4' })
       |                                    ^
    366|         })
    367| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[87/178]⎯

 FAIL  test/04_typography.test.ts > word-break > break.normal
AssertionError: expected { overflowWrap: 'normal', …(1) } to deeply equal { wordBreak: 'normal' }

- Expected
+ Received

  {
+   "overflowWrap": "normal",
    "wordBreak": "normal",
  }

 ❯ test/04_typography.test.ts:422:42
    420| describe('word-break', () => {
    421|         test('break.normal', () => {
    422|                 expect(_.break.normal()).toEqual({ wordBreak: 'normal'…
       |                                          ^
    423|         })
    424|         test("break['break-all']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[88/178]⎯

 FAIL  test/05_backgrounds.test.ts > background-color > bg.inherit
AssertionError: expected { background: 'inherit' } to deeply equal { backgroundColor: 'inherit' }

- Expected
+ Received

  {
-   "backgroundColor": "inherit",
+   "background": "inherit",
  }

 ❯ test/05_backgrounds.test.ts:35:40
     33| describe('background-color', () => {
     34|         test('bg.inherit', () => {
     35|                 expect(_.bg.inherit()).toEqual({ backgroundColor: 'inh…
       |                                        ^
     36|         })
     37|         test('bg.currentColor', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[89/178]⎯

 FAIL  test/05_backgrounds.test.ts > background-color > bg.currentColor
AssertionError: expected { background: 'currentColor' } to deeply equal { backgroundColor: 'currentColor' }

- Expected
+ Received

  {
-   "backgroundColor": "currentColor",
+   "background": "currentColor",
  }

 ❯ test/05_backgrounds.test.ts:38:45
     36|         })
     37|         test('bg.currentColor', () => {
     38|                 expect(_.bg.currentColor()).toEqual({ backgroundColor:…
       |                                             ^
     39|         })
     40|         test('bg.transparent', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[90/178]⎯

 FAIL  test/05_backgrounds.test.ts > background-color > bg.transparent
AssertionError: expected { background: 'transparent' } to deeply equal { backgroundColor: 'transparent' }

- Expected
+ Received

  {
-   "backgroundColor": "transparent",
+   "background": "transparent",
  }

 ❯ test/05_backgrounds.test.ts:41:44
     39|         })
     40|         test('bg.transparent', () => {
     41|                 expect(_.bg.transparent()).toEqual({ backgroundColor: …
       |                                            ^
     42|         })
     43|         test('bg[4]', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[91/178]⎯

 FAIL  test/05_backgrounds.test.ts > background-color > bg[4]
AssertionError: expected { background: '4' } to deeply equal { backgroundColor: '4' }

- Expected
+ Received

  {
-   "backgroundColor": "4",
+   "background": "4",
  }

 ❯ test/05_backgrounds.test.ts:44:35
     42|         })
     43|         test('bg[4]', () => {
     44|                 expect(_.bg[4]()).toEqual({ backgroundColor: '4' })
       |                                   ^
     45|         })
     46| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[92/178]⎯

 FAIL  test/05_backgrounds.test.ts > background-image > bg.none
AssertionError: expected { background: 'none' } to deeply equal { backgroundImage: 'none' }

- Expected
+ Received

  {
-   "backgroundImage": "none",
+   "background": "none",
  }

 ❯ test/05_backgrounds.test.ts:50:37
     48| describe('background-image', () => {
     49|         test('bg.none', () => {
     50|                 expect(_.bg.none()).toEqual({ backgroundImage: 'none' …
       |                                     ^
     51|         })
     52| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[93/178]⎯

 FAIL  test/06_borders.test.ts > outline-style > outline.hidden
AssertionError: expected { outlineStyle: 'hidden' } to deeply equal { …(2) }

- Expected
+ Received

  {
-   "outline": "2px solid transparent",
-   "outlineOffset": "2px",
+   "outlineStyle": "hidden",
  }

 ❯ test/06_borders.test.ts:392:44
    390|         })
    391|         test('outline.hidden', () => {
    392|                 expect(_.outline.hidden()).toEqual({ outline: '2px sol…
       |                                            ^
    393|         })
    394| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[94/178]⎯

 FAIL  test/07_effects.test.ts > box-shadow > shadow[4]
AssertionError: expected { boxShadow: '4' } to deeply equal { Object (boxShadow) }

- Expected
+ Received

  {
-   "boxShadow": "0 1px rgb(0 0 0 / 0.05)",
+   "boxShadow": "4",
  }

 ❯ test/07_effects.test.ts:8:39
      6| describe('box-shadow', () => {
      7|         test('shadow[4]', () => {
      8|                 expect(_.shadow[4]()).toEqual({ boxShadow: '0 1px rgb(…
       |                                       ^
      9|         })
     10|         test("shadow['0 0 #0000']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[95/178]⎯

 FAIL  test/07_effects.test.ts > text-shadow > text.shadow[4]
AssertionError: expected { textShadow: '4' } to deeply equal { Object (textShadow) }

- Expected
+ Received

  {
-   "textShadow": "0px 1px 0px rgb(0 0 0 / 0.15)",
+   "textShadow": "4",
  }

 ❯ test/07_effects.test.ts:17:44
     15| describe('text-shadow', () => {
     16|         test('text.shadow[4]', () => {
     17|                 expect(_.text.shadow[4]()).toEqual({ textShadow: '0px …
       |                                            ^
     18|         })
     19|         test('text.shadow.none', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[96/178]⎯

 FAIL  test/07_effects.test.ts > opacity > opacity[4]
AssertionError: expected { opacity: '0.04' } to deeply equal { opacity: '4%' }

- Expected
+ Received

  {
-   "opacity": "4%",
+   "opacity": "0.04",
  }

 ❯ test/07_effects.test.ts:26:40
     24| describe('opacity', () => {
     25|         test('opacity[4]', () => {
     26|                 expect(_.opacity[4]()).toEqual({ opacity: '4%' })
       |                                        ^
     27|         })
     28| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[97/178]⎯

 FAIL  test/07_effects.test.ts > mask-image > mask.radial[4]
AssertionError: expected { maskImage: '16px' } to deeply equal { maskImage: 'radial-gradient(4)' }

- Expected
+ Received

  {
-   "maskImage": "radial-gradient(4)",
+   "maskImage": "16px",
  }

 ❯ test/07_effects.test.ts:185:44
    183|         })
    184|         test('mask.radial[4]', () => {
    185|                 expect(_.mask.radial[4]()).toEqual({ maskImage: 'radia…
       |                                            ^
    186|         })
    187| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[98/178]⎯

 FAIL  test/07_effects.test.ts > mask-position > mask.position[4]
AssertionError: expected { maskPosition: '4' } to deeply equal { maskPosition: 'var(4)' }

- Expected
+ Received

  {
-   "maskPosition": "var(4)",
+   "maskPosition": "4",
  }

 ❯ test/07_effects.test.ts:251:46
    249|         })
    250|         test('mask.position[4]', () => {
    251|                 expect(_.mask.position[4]()).toEqual({ maskPosition: '…
       |                                              ^
    252|         })
    253| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[99/178]⎯

 FAIL  test/07_effects.test.ts > mask-size > mask.size[4]
AssertionError: expected { maskSize: '16px' } to deeply equal { maskSize: 'var(4)' }

- Expected
+ Received

  {
-   "maskSize": "var(4)",
+   "maskSize": "16px",
  }

 ❯ test/07_effects.test.ts:287:42
    285|         })
    286|         test('mask.size[4]', () => {
    287|                 expect(_.mask.size[4]()).toEqual({ maskSize: 'var(4)' …
       |                                          ^
    288|         })
    289| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[100/178]⎯

 FAIL  test/08_filters.test.ts > filter > filter[4]
AssertionError: expected { filter: '4' } to deeply equal { filter: 'var(4)' }

- Expected
+ Received

  {
-   "filter": "var(4)",
+   "filter": "4",
  }

 ❯ test/08_filters.test.ts:11:39
      9|         })
     10|         test('filter[4]', () => {
     11|                 expect(_.filter[4]()).toEqual({ filter: 'var(4)' })
       |                                       ^
     12|         })
     13| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[101/178]⎯

 FAIL  test/08_filters.test.ts > blur > blur.none
AssertionError: expected { filter: 'none' } to deeply equal { filter: '' }

- Expected
+ Received

  {
-   "filter": "",
+   "filter": "none",
  }

 ❯ test/08_filters.test.ts:17:39
     15| describe('blur', () => {
     16|         test('blur.none', () => {
     17|                 expect(_.blur.none()).toEqual({ filter: '' })
       |                                       ^
     18|         })
     19| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[102/178]⎯

 FAIL  test/08_filters.test.ts > brightness > brightness[4]
AssertionError: expected { filter: 'brightness(4)' } to deeply equal { filter: 'brightness(4%)' }

- Expected
+ Received

  {
-   "filter": "brightness(4%)",
+   "filter": "brightness(4)",
  }

 ❯ test/08_filters.test.ts:23:43
     21| describe('brightness', () => {
     22|         test('brightness[4]', () => {
     23|                 expect(_.brightness[4]()).toEqual({ filter: 'brightnes…
       |                                           ^
     24|         })
     25| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[103/178]⎯

 FAIL  test/08_filters.test.ts > contrast > contrast[4]
AssertionError: expected { filter: 'contrast(4)' } to deeply equal { filter: 'contrast(4%)' }

- Expected
+ Received

  {
-   "filter": "contrast(4%)",
+   "filter": "contrast(4)",
  }

 ❯ test/08_filters.test.ts:29:41
     27| describe('contrast', () => {
     28|         test('contrast[4]', () => {
     29|                 expect(_.contrast[4]()).toEqual({ filter: 'contrast(4%…
       |                                         ^
     30|         })
     31| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[104/178]⎯

 FAIL  test/08_filters.test.ts > grayscale > grayscale[4]
AssertionError: expected { filter: 'grayscale(4)' } to deeply equal { filter: 'grayscale(4%)' }

- Expected
+ Received

  {
-   "filter": "grayscale(4%)",
+   "filter": "grayscale(4)",
  }

 ❯ test/08_filters.test.ts:44:42
     42|         })
     43|         test('grayscale[4]', () => {
     44|                 expect(_.grayscale[4]()).toEqual({ filter: 'grayscale(…
       |                                          ^
     45|         })
     46| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[105/178]⎯

 FAIL  test/08_filters.test.ts > invert > invert[4]
AssertionError: expected { filter: 'invert(4)' } to deeply equal { filter: 'invert(4%)' }

- Expected
+ Received

  {
-   "filter": "invert(4%)",
+   "filter": "invert(4)",
  }

 ❯ test/08_filters.test.ts:59:39
     57|         })
     58|         test('invert[4]', () => {
     59|                 expect(_.invert[4]()).toEqual({ filter: 'invert(4%)' })
       |                                       ^
     60|         })
     61| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[106/178]⎯

 FAIL  test/08_filters.test.ts > saturate > saturate[4]
AssertionError: expected { filter: 'saturate(4)' } to deeply equal { filter: 'saturate(4%)' }

- Expected
+ Received

  {
-   "filter": "saturate(4%)",
+   "filter": "saturate(4)",
  }

 ❯ test/08_filters.test.ts:65:41
     63| describe('saturate', () => {
     64|         test('saturate[4]', () => {
     65|                 expect(_.saturate[4]()).toEqual({ filter: 'saturate(4%…
       |                                         ^
     66|         })
     67| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[107/178]⎯

 FAIL  test/08_filters.test.ts > sepia > sepia[4]
AssertionError: expected { filter: 'sepia(4)' } to deeply equal { filter: 'sepia(4%)' }

- Expected
+ Received

  {
-   "filter": "sepia(4%)",
+   "filter": "sepia(4)",
  }

 ❯ test/08_filters.test.ts:74:38
     72|         })
     73|         test('sepia[4]', () => {
     74|                 expect(_.sepia[4]()).toEqual({ filter: 'sepia(4%)' })
       |                                      ^
     75|         })
     76| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[108/178]⎯

 FAIL  test/08_filters.test.ts > backdrop-filter > backdrop.filter[4]
AssertionError: expected { backdropFilter: '4' } to deeply equal { backdropFilter: 'var(4)' }

- Expected
+ Received

  {
-   "backdropFilter": "var(4)",
+   "backdropFilter": "4",
  }

 ❯ test/08_filters.test.ts:83:48
     81|         })
     82|         test('backdrop.filter[4]', () => {
     83|                 expect(_.backdrop.filter[4]()).toEqual({ backdropFilte…
       |                                                ^
     84|         })
     85| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[109/178]⎯

 FAIL  test/08_filters.test.ts > blur > backdrop.blur.none
AssertionError: expected { backdropFilter: 'none' } to deeply equal { backdropFilter: '' }

- Expected
+ Received

  {
-   "backdropFilter": "",
+   "backdropFilter": "none",
  }

 ❯ test/08_filters.test.ts:89:48
     87| describe('blur', () => {
     88|         test('backdrop.blur.none', () => {
     89|                 expect(_.backdrop.blur.none()).toEqual({ backdropFilte…
       |                                                ^
     90|         })
     91| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[110/178]⎯

 FAIL  test/08_filters.test.ts > brightness > backdrop.brightness[4]
AssertionError: expected { backdropFilter: 'brightness(4)' } to deeply equal { backdropFilter: 'brightness(4%)' }

- Expected
+ Received

  {
-   "backdropFilter": "brightness(4%)",
+   "backdropFilter": "brightness(4)",
  }

 ❯ test/08_filters.test.ts:95:52
     93| describe('brightness', () => {
     94|         test('backdrop.brightness[4]', () => {
     95|                 expect(_.backdrop.brightness[4]()).toEqual({ backdropF…
       |                                                    ^
     96|         })
     97| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[111/178]⎯

 FAIL  test/08_filters.test.ts > contrast > backdrop.contrast[4]
AssertionError: expected { backdropFilter: 'contrast(4)' } to deeply equal { backdropFilter: 'contrast(4%)' }

- Expected
+ Received

  {
-   "backdropFilter": "contrast(4%)",
+   "backdropFilter": "contrast(4)",
  }

 ❯ test/08_filters.test.ts:101:50
     99| describe('contrast', () => {
    100|         test('backdrop.contrast[4]', () => {
    101|                 expect(_.backdrop.contrast[4]()).toEqual({ backdropFil…
       |                                                  ^
    102|         })
    103| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[112/178]⎯

 FAIL  test/08_filters.test.ts > grayscale > backdrop.grayscale[4]
AssertionError: expected { backdropFilter: 'grayscale(4)' } to deeply equal { backdropFilter: 'grayscale(4%)' }

- Expected
+ Received

  {
-   "backdropFilter": "grayscale(4%)",
+   "backdropFilter": "grayscale(4)",
  }

 ❯ test/08_filters.test.ts:110:51
    108|         })
    109|         test('backdrop.grayscale[4]', () => {
    110|                 expect(_.backdrop.grayscale[4]()).toEqual({ backdropFi…
       |                                                   ^
    111|         })
    112| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[113/178]⎯

 FAIL  test/08_filters.test.ts > invert > backdrop.invert[4]
AssertionError: expected { backdropFilter: 'invert(4)' } to deeply equal { backdropFilter: 'invert(4%)' }

- Expected
+ Received

  {
-   "backdropFilter": "invert(4%)",
+   "backdropFilter": "invert(4)",
  }

 ❯ test/08_filters.test.ts:125:48
    123|         })
    124|         test('backdrop.invert[4]', () => {
    125|                 expect(_.backdrop.invert[4]()).toEqual({ backdropFilte…
       |                                                ^
    126|         })
    127| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[114/178]⎯

 FAIL  test/08_filters.test.ts > opacity > backdrop.opacity[4]
AssertionError: expected { backdropFilter: 'opacity(4)' } to deeply equal { backdropFilter: 'opacity(4%)' }

- Expected
+ Received

  {
-   "backdropFilter": "opacity(4%)",
+   "backdropFilter": "opacity(4)",
  }

 ❯ test/08_filters.test.ts:131:49
    129| describe('opacity', () => {
    130|         test('backdrop.opacity[4]', () => {
    131|                 expect(_.backdrop.opacity[4]()).toEqual({ backdropFilt…
       |                                                 ^
    132|         })
    133| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[115/178]⎯

 FAIL  test/08_filters.test.ts > saturate > backdrop.saturate[4]
AssertionError: expected { backdropFilter: 'saturate(4)' } to deeply equal { backdropFilter: 'saturate(4%)' }

- Expected
+ Received

  {
-   "backdropFilter": "saturate(4%)",
+   "backdropFilter": "saturate(4)",
  }

 ❯ test/08_filters.test.ts:137:50
    135| describe('saturate', () => {
    136|         test('backdrop.saturate[4]', () => {
    137|                 expect(_.backdrop.saturate[4]()).toEqual({ backdropFil…
       |                                                  ^
    138|         })
    139| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[116/178]⎯

 FAIL  test/08_filters.test.ts > sepia > backdrop.sepia[4]
AssertionError: expected { backdropFilter: 'sepia(4)' } to deeply equal { backdropFilter: 'sepia(4%)' }

- Expected
+ Received

  {
-   "backdropFilter": "sepia(4%)",
+   "backdropFilter": "sepia(4)",
  }

 ❯ test/08_filters.test.ts:146:47
    144|         })
    145|         test('backdrop.sepia[4]', () => {
    146|                 expect(_.backdrop.sepia[4]()).toEqual({ backdropFilter…
       |                                               ^
    147|         })
    148| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[117/178]⎯

 FAIL  test/09_tables.test.ts > table-layout > table.auto
AssertionError: expected { display: 'table', …(1) } to deeply equal { tableLayout: 'auto' }

- Expected
+ Received

  {
+   "display": "table",
    "tableLayout": "auto",
  }

 ❯ test/09_tables.test.ts:17:40
     15| describe('table-layout', () => {
     16|         test('table.auto', () => {
     17|                 expect(_.table.auto()).toEqual({ tableLayout: 'auto' })
       |                                        ^
     18|         })
     19|         test('table.fixed', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[118/178]⎯

 FAIL  test/09_tables.test.ts > table-layout > table.fixed
AssertionError: expected { display: 'table', …(1) } to deeply equal { tableLayout: 'fixed' }

- Expected
+ Received

  {
+   "display": "table",
    "tableLayout": "fixed",
  }

 ❯ test/09_tables.test.ts:20:41
     18|         })
     19|         test('table.fixed', () => {
     20|                 expect(_.table.fixed()).toEqual({ tableLayout: 'fixed'…
       |                                         ^
     21|         })
     22| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[119/178]⎯

 FAIL  test/10_transitions-animation.test.ts > transition-property > transition.all
AssertionError: expected { transitionProperty: 'all' } to deeply equal { Object (transitionProperty) }

- Expected
+ Received

  {
-   "transitionProperty": "cubic-bezier(0.4, 0, 0.2, 1)",
+   "transitionProperty": "all",
  }

 ❯ test/10_transitions-animation.test.ts:8:44
      6| describe('transition-property', () => {
      7|         test('transition.all', () => {
      8|                 expect(_.transition.all()).toEqual({ transitionPropert…
       |                                            ^
      9|         })
     10|         test('transition.opacity', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[120/178]⎯

 FAIL  test/10_transitions-animation.test.ts > transition-property > transition.opacity
AssertionError: expected { transitionProperty: 'opacity' } to deeply equal { Object (transitionProperty) }

- Expected
+ Received

  {
-   "transitionProperty": "cubic-bezier(0.4, 0, 0.2, 1)",
+   "transitionProperty": "opacity",
  }

 ❯ test/10_transitions-animation.test.ts:11:48
      9|         })
     10|         test('transition.opacity', () => {
     11|                 expect(_.transition.opacity()).toEqual({ transitionPro…
       |                                                ^
     12|         })
     13|         test('transition.shadow', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[121/178]⎯

 FAIL  test/10_transitions-animation.test.ts > transition-property > transition.shadow
AssertionError: expected { transitionProperty: 'box-shadow' } to deeply equal { Object (transitionProperty) }

- Expected
+ Received

  {
-   "transitionProperty": "cubic-bezier(0.4, 0, 0.2, 1)",
+   "transitionProperty": "box-shadow",
  }

 ❯ test/10_transitions-animation.test.ts:14:47
     12|         })
     13|         test('transition.shadow', () => {
     14|                 expect(_.transition.shadow()).toEqual({ transitionProp…
       |                                               ^
     15|         })
     16|         test('transition.transform', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[122/178]⎯

 FAIL  test/10_transitions-animation.test.ts > transition-property > transition.transform
AssertionError: expected { transitionProperty: 'transform' } to deeply equal { Object (transitionProperty) }

- Expected
+ Received

  {
-   "transitionProperty": "cubic-bezier(0.4, 0, 0.2, 1)",
+   "transitionProperty": "transform",
  }

 ❯ test/10_transitions-animation.test.ts:17:50
     15|         })
     16|         test('transition.transform', () => {
     17|                 expect(_.transition.transform()).toEqual({ transitionP…
       |                                                  ^
     18|         })
     19|         test('transition.none', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[123/178]⎯

 FAIL  test/10_transitions-animation.test.ts > transition-property > transition[4]
AssertionError: expected { transitionProperty: '4' } to deeply equal { Object (transitionProperty) }

- Expected
+ Received

  {
-   "transitionProperty": "cubic-bezier(0.4, 0, 0.2, 1)",
+   "transitionProperty": "4",
  }

 ❯ test/10_transitions-animation.test.ts:23:43
     21|         })
     22|         test('transition[4]', () => {
     23|                 expect(_.transition[4]()).toEqual({ transitionProperty…
       |                                           ^
     24|         })
     25| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[124/178]⎯

 FAIL  test/10_transitions-animation.test.ts > transition-timing-function > ease[4]
AssertionError: expected { transitionTimingFunction: '4' } to deeply equal { transitionTimingFunction: 'var(4)' }

- Expected
+ Received

  {
-   "transitionTimingFunction": "var(4)",
+   "transitionTimingFunction": "4",
  }

 ❯ test/10_transitions-animation.test.ts:62:37
     60|         })
     61|         test('ease[4]', () => {
     62|                 expect(_.ease[4]()).toEqual({ transitionTimingFunction…
       |                                     ^
     63|         })
     64| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[125/178]⎯

 FAIL  test/10_transitions-animation.test.ts > animation > animate.spin
AssertionError: expected { animation: 'spin' } to deeply equal { Object (animation) }

- Expected
+ Received

  {
-   "animation": "spin 1s linear infinite",
+   "animation": "spin",
  }

 ❯ test/10_transitions-animation.test.ts:74:42
     72| describe('animation', () => {
     73|         test('animate.spin', () => {
     74|                 expect(_.animate.spin()).toEqual({ animation: 'spin 1s…
       |                                          ^
     75|         })
     76|         test('animate.ping', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[126/178]⎯

 FAIL  test/10_transitions-animation.test.ts > animation > animate.ping
AssertionError: expected { animation: 'ping' } to deeply equal { Object (animation) }

- Expected
+ Received

  {
-   "animation": "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
+   "animation": "ping",
  }

 ❯ test/10_transitions-animation.test.ts:77:42
     75|         })
     76|         test('animate.ping', () => {
     77|                 expect(_.animate.ping()).toEqual({ animation: 'ping 1s…
       |                                          ^
     78|         })
     79|         test('animate.pulse', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[127/178]⎯

 FAIL  test/10_transitions-animation.test.ts > animation > animate.pulse
AssertionError: expected { animation: 'pulse' } to deeply equal { Object (animation) }

- Expected
+ Received

  {
-   "animation": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
+   "animation": "pulse",
  }

 ❯ test/10_transitions-animation.test.ts:80:43
     78|         })
     79|         test('animate.pulse', () => {
     80|                 expect(_.animate.pulse()).toEqual({ animation: 'pulse …
       |                                           ^
     81|         })
     82|         test('animate.bounce', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[128/178]⎯

 FAIL  test/10_transitions-animation.test.ts > animation > animate.bounce
AssertionError: expected { animation: 'bounce' } to deeply equal { animation: 'bounce 1s infinite' }

- Expected
+ Received

  {
-   "animation": "bounce 1s infinite",
+   "animation": "bounce",
  }

 ❯ test/10_transitions-animation.test.ts:83:44
     81|         })
     82|         test('animate.bounce', () => {
     83|                 expect(_.animate.bounce()).toEqual({ animation: 'bounc…
       |                                            ^
     84|         })
     85|         test('animate.none', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[129/178]⎯

 FAIL  test/10_transitions-animation.test.ts > animation > animate[4]
AssertionError: expected { animation: '4' } to deeply equal { animation: 'var(4)' }

- Expected
+ Received

  {
-   "animation": "var(4)",
+   "animation": "4",
  }

 ❯ test/10_transitions-animation.test.ts:89:40
     87|         })
     88|         test('animate[4]', () => {
     89|                 expect(_.animate[4]()).toEqual({ animation: 'var(4)' })
       |                                        ^
     90|         })
     91| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[130/178]⎯

 FAIL  test/11_transforms.test.ts > perspective > perspective[4]
AssertionError: expected { perspective: '4' } to deeply equal { perspective: 'var(4)' }

- Expected
+ Received

  {
-   "perspective": "var(4)",
+   "perspective": "4",
  }

 ❯ test/11_transforms.test.ts:35:44
     33|         })
     34|         test('perspective[4]', () => {
     35|                 expect(_.perspective[4]()).toEqual({ perspective: 'var…
       |                                            ^
     36|         })
     37| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[131/178]⎯

 FAIL  test/11_transforms.test.ts > perspective-origin > perspective.origin[4]
AssertionError: expected {} to deeply equal { perspectiveOrigin: 'var(4)' }

- Expected
+ Received

- {
-   "perspectiveOrigin": "var(4)",
- }
+ {}

 ❯ test/11_transforms.test.ts:68:51
     66|         })
     67|         test('perspective.origin[4]', () => {
     68|                 expect(_.perspective.origin[4]()).toEqual({ perspectiv…
       |                                                   ^
     69|         })
     70| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[132/178]⎯

 FAIL  test/11_transforms.test.ts > rotate > rotate.none
AssertionError: expected { transform: 'none' } to deeply equal { rotate: 'none' }

- Expected
+ Received

  {
-   "rotate": "none",
+   "transform": "none",
  }

 ❯ test/11_transforms.test.ts:74:41
     72| describe('rotate', () => {
     73|         test('rotate.none', () => {
     74|                 expect(_.rotate.none()).toEqual({ rotate: 'none' })
       |                                         ^
     75|         })
     76|         test('rotate[4]', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[133/178]⎯

 FAIL  test/11_transforms.test.ts > rotate > rotate[4]
AssertionError: expected { transform: 'rotate(4deg)' } to deeply equal { rotate: '4deg' }

- Expected
+ Received

  {
-   "rotate": "4deg",
+   "transform": "rotate(4deg)",
  }

 ❯ test/11_transforms.test.ts:77:39
     75|         })
     76|         test('rotate[4]', () => {
     77|                 expect(_.rotate[4]()).toEqual({ rotate: '4deg' })
       |                                       ^
     78|         })
     79| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[134/178]⎯

 FAIL  test/11_transforms.test.ts > scale > scale.none
AssertionError: expected { transform: 'none' } to deeply equal { scale: 'none' }

- Expected
+ Received

  {
-   "scale": "none",
+   "transform": "none",
  }

 ❯ test/11_transforms.test.ts:83:40
     81| describe('scale', () => {
     82|         test('scale.none', () => {
     83|                 expect(_.scale.none()).toEqual({ scale: 'none' })
       |                                        ^
     84|         })
     85|         test('scale[4]', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[135/178]⎯

 FAIL  test/11_transforms.test.ts > scale > scale[4]
AssertionError: expected { transform: 'scale(4)' } to deeply equal { scale: '4% 4%' }

- Expected
+ Received

  {
-   "scale": "4% 4%",
+   "transform": "scale(4)",
  }

 ❯ test/11_transforms.test.ts:86:38
     84|         })
     85|         test('scale[4]', () => {
     86|                 expect(_.scale[4]()).toEqual({ scale: '4% 4%' })
       |                                      ^
     87|         })
     88| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[136/178]⎯

 FAIL  test/11_transforms.test.ts > skew > skew[4]
AssertionError: expected { transform: 'skew(4deg)' } to deeply equal { Object (transform) }

- Expected
+ Received

  {
-   "transform": "skewX(4deg) skewY(4deg)",
+   "transform": "skew(4deg)",
  }

 ❯ test/11_transforms.test.ts:92:37
     90| describe('skew', () => {
     91|         test('skew[4]', () => {
     92|                 expect(_.skew[4]()).toEqual({ transform: 'skewX(4deg) …
       |                                     ^
     93|         })
     94|         test('skew.x[4]', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[137/178]⎯

 FAIL  test/11_transforms.test.ts > skew > skew.x[4]
AssertionError: expected { transform: 'skewX(4deg)' } to deeply equal { transform: 'skewX(4deg))' }

- Expected
+ Received

  {
-   "transform": "skewX(4deg))",
+   "transform": "skewX(4deg)",
  }

 ❯ test/11_transforms.test.ts:95:39
     93|         })
     94|         test('skew.x[4]', () => {
     95|                 expect(_.skew.x[4]()).toEqual({ transform: 'skewX(4deg…
       |                                       ^
     96|         })
     97|         test('skew.y[4]', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[138/178]⎯

 FAIL  test/11_transforms.test.ts > transform > transform[4]
AssertionError: expected { transform: '4' } to deeply equal { transform: 'var(4)' }

- Expected
+ Received

  {
-   "transform": "var(4)",
+   "transform": "4",
  }

 ❯ test/11_transforms.test.ts:104:42
    102| describe('transform', () => {
    103|         test('transform[4]', () => {
    104|                 expect(_.transform[4]()).toEqual({ transform: 'var(4)'…
       |                                          ^
    105|         })
    106|         test('transform.none', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[139/178]⎯

 FAIL  test/11_transforms.test.ts > transform-origin > origin[4]
AssertionError: expected { transformOrigin: '4' } to deeply equal { transformOrigin: 'var(4)' }

- Expected
+ Received

  {
-   "transformOrigin": "var(4)",
+   "transformOrigin": "4",
  }

 ❯ test/11_transforms.test.ts:140:39
    138|         })
    139|         test('origin[4]', () => {
    140|                 expect(_.origin[4]()).toEqual({ transformOrigin: 'var(…
       |                                       ^
    141|         })
    142| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[140/178]⎯

 FAIL  test/11_transforms.test.ts > translate > translate.full
AssertionError: expected { transform: 'translate(100%, 100%)' } to deeply equal { translate: '100% 100%' }

- Expected
+ Received

  {
-   "translate": "100% 100%",
+   "transform": "translate(100%, 100%)",
  }

 ❯ test/11_transforms.test.ts:155:44
    153| describe('translate', () => {
    154|         test('translate.full', () => {
    155|                 expect(_.translate.full()).toEqual({ translate: '100% …
       |                                            ^
    156|         })
    157|         test('translate.px', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[141/178]⎯

 FAIL  test/11_transforms.test.ts > translate > translate.px
AssertionError: expected { transform: 'translate(1px, 1px)' } to deeply equal { translate: '1px 1px' }

- Expected
+ Received

  {
-   "translate": "1px 1px",
+   "transform": "translate(1px, 1px)",
  }

 ❯ test/11_transforms.test.ts:158:42
    156|         })
    157|         test('translate.px', () => {
    158|                 expect(_.translate.px()).toEqual({ translate: '1px 1px…
       |                                          ^
    159|         })
    160|         test('translate.none', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[142/178]⎯

 FAIL  test/11_transforms.test.ts > translate > translate.none
AssertionError: expected { transform: 'none' } to deeply equal { translate: 'none' }

- Expected
+ Received

  {
-   "translate": "none",
+   "transform": "none",
  }

 ❯ test/11_transforms.test.ts:161:44
    159|         })
    160|         test('translate.none', () => {
    161|                 expect(_.translate.none()).toEqual({ translate: 'none'…
       |                                            ^
    162|         })
    163| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[143/178]⎯

 FAIL  test/11_transforms.test.ts > zoom > zoom[4]
AssertionError: expected { zoom: '4' } to deeply equal { zoom: '4%' }

- Expected
+ Received

  {
-   "zoom": "4%",
+   "zoom": "4",
  }

 ❯ test/11_transforms.test.ts:167:37
    165| describe('zoom', () => {
    166|         test('zoom[4]', () => {
    167|                 expect(_.zoom[4]()).toEqual({ zoom: '4%' })
       |                                     ^
    168|         })
    169| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[144/178]⎯

 FAIL  test/12_interactivity.test.ts > accent-color > accent[4]
AssertionError: expected { accentColor: '4' } to deeply equal { accentColor: 'var(4)' }

- Expected
+ Received

  {
-   "accentColor": "var(4)",
+   "accentColor": "4",
  }

 ❯ test/12_interactivity.test.ts:17:39
     15|         })
     16|         test('accent[4]', () => {
     17|                 expect(_.accent[4]()).toEqual({ accentColor: 'var(4)' …
       |                                       ^
     18|         })
     19| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[145/178]⎯

 FAIL  test/12_interactivity.test.ts > cursor > cursor[4]
AssertionError: expected { cursor: '4' } to deeply equal { cursor: 'var(4)' }

- Expected
+ Received

  {
-   "cursor": "var(4)",
+   "cursor": "4",
  }

 ❯ test/12_interactivity.test.ts:176:39
    174|         })
    175|         test('cursor[4]', () => {
    176|                 expect(_.cursor[4]()).toEqual({ cursor: 'var(4)' })
       |                                       ^
    177|         })
    178| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[146/178]⎯

 FAIL  test/12_interactivity.test.ts > will-change > will.change[4]
AssertionError: expected { willChange: '4' } to deeply equal { willChange: 'var(4)' }

- Expected
+ Received

  {
-   "willChange": "var(4)",
+   "willChange": "4",
  }

 ❯ test/12_interactivity.test.ts:356:44
    354|         })
    355|         test('will.change[4]', () => {
    356|                 expect(_.will.change[4]()).toEqual({ willChange: 'var(…
       |                                            ^
    357|         })
    358| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[147/178]⎯

 FAIL  test/14_accessibility.test.ts > sr.only — full declaration set (one assertion per CSS property) > sr.only emits exactly the sr-only declaration block
AssertionError: expected { position: 'absolute', …(9) } to deeply equal { position: 'absolute', …(8) }

- Expected
+ Received

@@ -1,7 +1,8 @@
  {
    "borderWidth": "0",
+   "clip": "rect(0, 0, 0, 0)",
    "clipPath": "inset(50%)",
    "height": "1px",
    "margin": "-1px",
    "overflow": "hidden",
    "padding": "0",

 ❯ test/14_accessibility.test.ts:54:37
     52|         const decls = Object.entries(SR_ONLY)
     53|         test('sr.only emits exactly the sr-only declaration block', ()…
     54|                 expect(_.sr.only()).toEqual(SR_ONLY)
       |                                     ^
     55|         })
     56|         test.each(decls)('sr.only sets %s: %s', (prop, value) => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[148/178]⎯

 FAIL  test/14_accessibility.test.ts > sr.only — full declaration set (one assertion per CSS property) > sr.only result is a plain object with exactly these keys
AssertionError: expected [ 'borderWidth', 'clip', …(8) ] to deeply equal [ 'borderWidth', 'clipPath', …(7) ]

- Expected
+ Received

@@ -1,7 +1,8 @@
  [
    "borderWidth",
+   "clip",
    "clipPath",
    "height",
    "margin",
    "overflow",
    "padding",

 ❯ test/14_accessibility.test.ts:61:51
     59|         test('sr.only result is a plain object with exactly these keys…
     60|                 const style = _.sr.only()
     61|                 expect(Object.keys(style).sort()).toEqual(Object.keys(…
       |                                                   ^
     62|                 expect(Object.getPrototypeOf(style)).toBe(Object.proto…
     63|         })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[149/178]⎯

 FAIL  test/14_accessibility.test.ts > sr.only — full declaration set (one assertion per CSS property) > sr.only merges call-time overrides
AssertionError: expected { position: 'absolute', …(10) } to deeply equal { position: 'absolute', …(9) }

- Expected
+ Received

@@ -1,7 +1,8 @@
  {
    "borderWidth": "0",
+   "clip": "rect(0, 0, 0, 0)",
    "clipPath": "inset(50%)",
    "color": "red",
    "height": "1px",
    "margin": "-1px",
    "overflow": "hidden",

 ❯ test/14_accessibility.test.ts:65:53
     63|         })
     64|         test('sr.only merges call-time overrides', () => {
     65|                 expect(_.sr.only({ color: 'red' })).toEqual({ ...SR_ON…
       |                                                     ^
     66|         })
     67| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[150/178]⎯

 FAIL  test/14_accessibility.test.ts > notSr.only — full declaration set (one assertion per CSS property) > notSr.only emits exactly the not-sr-only declaration block
AssertionError: expected { position: 'static', …(7) } to deeply equal { position: 'static', …(7) }

- Expected
+ Received

@@ -1,7 +1,7 @@
  {
-   "clipPath": "none",
+   "clip": "auto",
    "height": "auto",
    "margin": "0",
    "overflow": "visible",
    "padding": "0",
    "position": "static",

 ❯ test/14_accessibility.test.ts:72:40
     70|         const decls = Object.entries(NOT_SR_ONLY)
     71|         test('notSr.only emits exactly the not-sr-only declaration blo…
     72|                 expect(_.notSr.only()).toEqual(NOT_SR_ONLY)
       |                                        ^
     73|         })
     74|         test.each(decls)('notSr.only sets %s: %s', (prop, value) => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[151/178]⎯

 FAIL  test/14_accessibility.test.ts > notSr.only — full declaration set (one assertion per CSS property) > notSr.only sets clipPath: none
AssertionError: expected undefined to be 'none' // Object.is equality

- Expected:
"none"

+ Received:
undefined

 ❯ test/14_accessibility.test.ts:75:75
     73|         })
     74|         test.each(decls)('notSr.only sets %s: %s', (prop, value) => {
     75|                 expect((_.notSr.only() as Record<string, unknown>)[pro…
       |                                                                           ^
     76|         })
     77|         test('notSr.only result is a plain object with exactly these k…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[152/178]⎯

 FAIL  test/14_accessibility.test.ts > notSr.only — full declaration set (one assertion per CSS property) > notSr.only result is a plain object with exactly these keys
AssertionError: expected [ 'clip', 'height', 'margin', …(5) ] to deeply equal [ Array(8) ]

- Expected
+ Received

@@ -1,7 +1,7 @@
  [
-   "clipPath",
+   "clip",
    "height",
    "margin",
    "overflow",
    "padding",
    "position",

 ❯ test/14_accessibility.test.ts:79:51
     77|         test('notSr.only result is a plain object with exactly these k…
     78|                 const style = _.notSr.only()
     79|                 expect(Object.keys(style).sort()).toEqual(Object.keys(…
       |                                                   ^
     80|                 expect(Object.getPrototypeOf(style)).toBe(Object.proto…
     81|         })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[153/178]⎯

 FAIL  test/14_accessibility.test.ts > notSr.only — full declaration set (one assertion per CSS property) > notSr.only merges call-time overrides
AssertionError: expected { position: 'static', …(8) } to deeply equal { position: 'static', …(8) }

- Expected
+ Received

@@ -1,7 +1,7 @@
  {
-   "clipPath": "none",
+   "clip": "auto",
    "display": "block",
    "height": "auto",
    "margin": "0",
    "overflow": "visible",
    "padding": "0",

 ❯ test/14_accessibility.test.ts:83:60
     81|         })
     82|         test('notSr.only merges call-time overrides', () => {
     83|                 expect(_.notSr.only({ display: 'block' })).toEqual({ .…
       |                                                            ^
     84|         })
     85| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[154/178]⎯

 FAIL  test/00_layout.test.ts > break-after > break.after.all
TypeCheckError: This expression is not callable. Type 'Values' has no call signatures.
 ❯ test/00_layout.test.ts:38:38
     36|         })
     37|         test('break.after.all', () => {
     38|                 expect(_.break.after.all()).toEqual({ breakAfter: 'all…
       |                                      ^
     39|         })
     40|         test("break.after['avoid-page']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[155/178]⎯

 FAIL  test/00_layout.test.ts > break-after > break.after.page
TypeCheckError: This expression is not callable. Type 'Values' has no call signatures.
 ❯ test/00_layout.test.ts:44:38
     42|         })
     43|         test('break.after.page', () => {
     44|                 expect(_.break.after.page()).toEqual({ breakAfter: 'pa…
       |                                      ^
     45|         })
     46|         test('break.after.left', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[156/178]⎯

 FAIL  test/00_layout.test.ts > break-after > break.after.left
TypeCheckError: This expression is not callable. Type 'PositionValue' has no call signatures.
 ❯ test/00_layout.test.ts:47:38
     45|         })
     46|         test('break.after.left', () => {
     47|                 expect(_.break.after.left()).toEqual({ breakAfter: 'le…
       |                                      ^
     48|         })
     49|         test('break.after.right', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[157/178]⎯

 FAIL  test/00_layout.test.ts > break-after > break.after.right
TypeCheckError: This expression is not callable. Type 'PositionValue' has no call signatures.
 ❯ test/00_layout.test.ts:50:38
     48|         })
     49|         test('break.after.right', () => {
     50|                 expect(_.break.after.right()).toEqual({ breakAfter: 'r…
       |                                      ^
     51|         })
     52|         test('break.after.column', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[158/178]⎯

 FAIL  test/00_layout.test.ts > break-before > break.before.all
TypeCheckError: This expression is not callable. Type 'Values' has no call signatures.
 ❯ test/00_layout.test.ts:65:39
     63|         })
     64|         test('break.before.all', () => {
     65|                 expect(_.break.before.all()).toEqual({ breakBefore: 'a…
       |                                       ^
     66|         })
     67|         test("break.before['avoid-page']", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[159/178]⎯

 FAIL  test/00_layout.test.ts > break-before > break.before.page
TypeCheckError: This expression is not callable. Type 'Values' has no call signatures.
 ❯ test/00_layout.test.ts:71:39
     69|         })
     70|         test('break.before.page', () => {
     71|                 expect(_.break.before.page()).toEqual({ breakBefore: '…
       |                                       ^
     72|         })
     73|         test('break.before.left', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[160/178]⎯

 FAIL  test/00_layout.test.ts > break-before > break.before.left
TypeCheckError: This expression is not callable. Type 'PositionValue' has no call signatures.
 ❯ test/00_layout.test.ts:74:39
     72|         })
     73|         test('break.before.left', () => {
     74|                 expect(_.break.before.left()).toEqual({ breakBefore: '…
       |                                       ^
     75|         })
     76|         test('break.before.right', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[161/178]⎯

 FAIL  test/00_layout.test.ts > break-before > break.before.right
TypeCheckError: This expression is not callable. Type 'PositionValue' has no call signatures.
 ❯ test/00_layout.test.ts:77:39
     75|         })
     76|         test('break.before.right', () => {
     77|                 expect(_.break.before.right()).toEqual({ breakBefore: …
       |                                       ^
     78|         })
     79|         test('break.before.column', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[162/178]⎯

 FAIL  test/00_layout.test.ts > object-fit > object.contain
TypeCheckError: This expression is not callable. Type 'Values' has no call signatures.
 ❯ test/00_layout.test.ts:239:33
    237| describe('object-fit', () => {
    238|         test('object.contain', () => {
    239|                 expect(_.object.contain()).toEqual({ objectFit: 'conta…
       |                                 ^
    240|         })
    241|         test('object.cover', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[163/178]⎯

 FAIL  test/04_typography.test.ts > font-variant-numeric > diagonalFractions
TypeCheckError: Property 'diagonalFractions' does not exist on type 'typeof import("/workspaces/typscriptcss/packages/typescriptcss/src/index")'.
 ❯ test/04_typography.test.ts:131:26
    129|         })
    130|         test('diagonalFractions', () => {
    131|                 expect(_.diagonalFractions()).toEqual({ fontVariantNum…
       |                          ^
    132|         })
    133|         test('stackedFractions', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[164/178]⎯

 FAIL  test/06_borders.test.ts > border-width > divide.x
TypeCheckError: This expression is not callable. Type 'Values & { [value number] C; } & { [x `${number}`] C; } & { [x `${number}pt`] C; [x `${number}px`] C; [x `${number}rem`] C; [x `${number}em`] C; [x `${number}%`] C; [x `${number}vw`] C; [x `${number}vh`] C; [x `${number}dvw`] C; [x `${number}dvh`] C; [x `${number}lvw`] C; [x `${number}lvh`]...' has no call signatures.
 ❯ test/06_borders.test.ts:206:33
    204|         })
    205|         test('divide.x', () => {
    206|                 expect(_.divide.x()).toEqual({ '& > :not(:last-child)'…
       |                                 ^
    207|         })
    208|         test('divide.x[4]', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[165/178]⎯

 FAIL  test/06_borders.test.ts > border-width > divide.y
TypeCheckError: This expression is not callable. Type 'Values & { [value number] C; } & { [x `${number}`] C; } & { [x `${number}pt`] C; [x `${number}px`] C; [x `${number}rem`] C; [x `${number}em`] C; [x `${number}%`] C; [x `${number}vw`] C; [x `${number}vh`] C; [x `${number}dvw`] C; [x `${number}dvh`] C; [x `${number}lvw`] C; [x `${number}lvh`]...' has no call signatures.
 ❯ test/06_borders.test.ts:212:33
    210|         })
    211|         test('divide.y', () => {
    212|                 expect(_.divide.y()).toEqual({ '& > :not(:last-child)'…
       |                                 ^
    213|         })
    214|         test('divide.y[4]', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[166/178]⎯

 FAIL  test/08_filters.test.ts > sepia > sepia
TypeCheckError: This expression is not callable. Type 'Filter' has no call signatures.
 ❯ test/08_filters.test.ts:71:26
     69| describe('sepia', () => {
     70|         test('sepia', () => {
     71|                 expect(_.sepia()).toEqual({ filter: 'sepia(100%)' })
       |                          ^
     72|         })
     73|         test('sepia[4]', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[167/178]⎯

 FAIL  test/08_filters.test.ts > grayscale > backdrop.grayscale
TypeCheckError: This expression is not callable. Type 'Values & { [value number] C; } & { [x `${number}`] C; } & { none C; }' has no call signatures.
 ❯ test/08_filters.test.ts:107:35
    105| describe('grayscale', () => {
    106|         test('backdrop.grayscale', () => {
    107|                 expect(_.backdrop.grayscale()).toEqual({ backdropFilte…
       |                                   ^
    108|         })
    109|         test('backdrop.grayscale[4]', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[168/178]⎯

 FAIL  test/08_filters.test.ts > invert > backdrop.invert
TypeCheckError: This expression is not callable. Type 'Values & { [value number] C; } & { [x `${number}`] C; } & { none C; }' has no call signatures.
 ❯ test/08_filters.test.ts:122:35
    120| describe('invert', () => {
    121|         test('backdrop.invert', () => {
    122|                 expect(_.backdrop.invert()).toEqual({ backdropFilter: …
       |                                   ^
    123|         })
    124|         test('backdrop.invert[4]', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[169/178]⎯

 FAIL  test/08_filters.test.ts > sepia > backdrop.sepia
TypeCheckError: This expression is not callable. Type 'Values & { [value number] C; } & { [x `${number}`] C; } & { none C; }' has no call signatures.
 ❯ test/08_filters.test.ts:143:35
    141| describe('sepia', () => {
    142|         test('backdrop.sepia', () => {
    143|                 expect(_.backdrop.sepia()).toEqual({ backdropFilter: '…
       |                                   ^
    144|         })
    145|         test('backdrop.sepia[4]', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[170/178]⎯

 FAIL  test/12_interactivity.test.ts > resize > resize
TypeCheckError: This expression is not callable. Type 'Values' has no call signatures.
 ❯ test/12_interactivity.test.ts:203:26
    201|         })
    202|         test('resize', () => {
    203|                 expect(_.resize()).toEqual({ resize: 'both' })
       |                          ^
    204|         })
    205|         test('resize.y', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[171/178]⎯

 FAIL  test/17_object-model.test.ts > prototype access does not pollute and does not leak Object.prototype > building through __proto__/prototype keys produces own props, no global pollution
TypeCheckError: Object is of type 'unknown'.
 ❯ test/17_object-model.test.ts:86:32
     84|         })
     85|         test('building through __proto__/prototype keys produces own p…
     86|                 const out = fn(obj(obj(obj(_.flex).__proto__).x).proto…
       |                                ^
     87|                 expect(Object.prototype.hasOwnProperty.call(out, '__pr…
     88|                 expect(obj({}).x).toBeUndefined()

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[172/178]⎯

 FAIL  test/21_composition.test.ts > filter family — unimplemented roots compose into one filter (RED) > blur then brightness should accumulate into one filter (RED)
TypeCheckError: Property 'brightness' does not exist on type '() => Record<string, string>'.
 ❯ test/21_composition.test.ts:163:34
    161|         })
    162|         test('blur then brightness should accumulate into one filter (…
    163|                 expect(u.blur[4].brightness[50]()).toEqual({ filter: '…
       |                                  ^
    164|         })
    165|         test('grayscale root unimplemented (RED)', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[173/178]⎯

 FAIL  test/22_dark-mode.test.ts > light -> dark pairing produces light-dark(base, dark) > bg pairing emits colorScheme so light-dark() resolves
TypeCheckError: Property 'colorScheme' does not exist on type 'StyleObject'.
 ❯ test/22_dark-mode.test.ts:36:28
     34|         test('bg pairing emits colorScheme so light-dark() resolves', …
     35|                 const out = tw.bg.blue.dark.bg.red()
     36|                 expect(out.colorScheme).toBe('light dark')
       |                            ^
     37|                 expect(out.background).toBe('light-dark(blue, red)')
     38|         })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[174/178]⎯

 FAIL  test/22_dark-mode.test.ts > light -> dark pairing produces light-dark(base, dark) > bg pairing emits colorScheme so light-dark() resolves
TypeCheckError: Property 'background' does not exist on type 'StyleObject'.
 ❯ test/22_dark-mode.test.ts:37:28
     35|                 const out = tw.bg.blue.dark.bg.red()
     36|                 expect(out.colorScheme).toBe('light dark')
     37|                 expect(out.background).toBe('light-dark(blue, red)')
       |                            ^
     38|         })
     39|         test('text pairing does not spuriously emit colorScheme', () =…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[175/178]⎯

 FAIL  test/22_dark-mode.test.ts > non-leak boundary — dark must not bleed across independent chains > non-dark sibling of a paired call stays unpaired
TypeCheckError: Property 'background' does not exist on type 'StyleObject'.
 ❯ test/22_dark-mode.test.ts:96:31
     94|                 const paired = tw.bg.white.dark.bg.black()
     95|                 const plain = tw.bg.white()
     96|                 expect(paired.background).toBe('light-dark(white, blac…
       |                               ^
     97|                 expect(plain).toEqual({ background: 'white' })
     98|         })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[176/178]⎯

 FAIL  test/22_dark-mode.test.ts > activation source — only the dark chain activates pairing > the dark chain is the activation flag (GREEN)
TypeCheckError: Property 'background' does not exist on type 'StyleObject'.
 ❯ test/22_dark-mode.test.ts:138:52
    136| describe('activation source — only the dark chain activates pairing', …
    137|         test('the dark chain is the activation flag (GREEN)', () => {
    138|                 expect(tw.bg.white.dark.bg.black().background).toBe('l…
       |                                                    ^
    139|         })
    140|         test('data-attribute-driven activation is unimplemented (RED)'…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[177/178]⎯

 FAIL  test/22_dark-mode.test.ts > activation source — only the dark chain activates pairing > data-attribute-driven activation is unimplemented (RED)
TypeCheckError: Property 'black' does not exist on type '() => Record<string, string>'.
 ❯ test/22_dark-mode.test.ts:142:138


⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[178/178]⎯
```
