yarn run v1.22.22
$ cd packages/typescriptcss && npm run test
npm warn Unknown env config "version-commit-hooks". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.
npm warn Unknown env config "version-tag-prefix". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.
npm warn Unknown env config "version-git-message". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.
npm warn Unknown env config "argv". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.
npm warn Unknown env config "version-git-tag". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.

> typescriptcss@0.2.0 test
> vitest run --coverage

Testing types with tsc and vue-tsc is an experimental feature.
Breaking changes might not follow SemVer, please pin Vitest's version when using it.

 RUN  v4.1.9 /workspaces/typscriptcss/packages/typescriptcss
      Coverage enabled with v8

 ✓ test/07_responsive-media.test.ts (8 tests) 7ms
 ✓ test/12_package-surface.test.ts (15 tests) 5ms
 ✓ test/08_composition-cascade.test.ts (12 tests) 5ms
 ✓ test/01_grammar-collision.test.ts (31 tests) 6ms
 ✓ test/05_utility-unsupported-red.test.ts (77 tests) 10ms
 ✓ test/09_variants-red.test.ts (68 tests) 17ms
 ✓ test/04_utility-implemented.test.ts (24 tests) 21ms
 ✓ test/00_chain-contract.test.ts (70 tests) 24ms
 ✓ test/03_value-syntax.test.ts (39 tests) 30ms
 ✓ test/11_fuzz.test.ts (277 tests) 60ms
 ✓ test/13_browser-semantic.test.ts (5 tests | 4 skipped) 2ms
 ✓ test/06_dark-mode.test.ts (9 tests) 3ms
 ✓ test/02_proxy-object-model.test.ts (18 tests) 3379ms
     ✓ 5000 native (name,value) pairs all survive  3209ms
 ✓  TS  test/02_proxy-object-model.test.ts (14 tests)
 ✓  TS  test/11_fuzz.test.ts (7 tests)
 ✓  TS  test/03_value-syntax.test.ts (23 tests)
 ✓  TS  test/00_chain-contract.test.ts (15 tests)
 ✓  TS  test/07_responsive-media.test.ts (8 tests)
 ✓  TS  test/04_utility-implemented.test.ts (24 tests)
 ✓  TS  test/08_composition-cascade.test.ts (12 tests)
 ✓  TS  test/05_utility-unsupported-red.test.ts (4 tests)
 ✓  TS  test/09_variants-red.test.ts (4 tests)
 ✓  TS  test/12_package-surface.test.ts (5 tests)
 ✓  TS  test/01_grammar-collision.test.ts (31 tests)
 ✓  TS  test/06_dark-mode.test.ts (9 tests)
 ✓  TS  test/13_browser-semantic.test.ts (5 tests)

 Test Files  26 passed (26)
      Tests  790 passed | 12 expected fail | 4 skipped (814)
Type Errors  no errors
   Start at  09:57:33
   Duration  4.81s (transform 701ms, setup 0ms, import 1.22s, tests 3.57s, environment 1ms, typecheck 775ms)

 % Coverage report from v8
----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----------|---------|----------|---------|---------|-------------------
All files |   98.01 |    88.46 |   93.44 |   98.76 |                   
 index.ts |     100 |    67.85 |     100 |     100 | 16,43-60,123-130  
 utils.ts |   95.12 |      100 |   89.18 |   96.42 | 69-71             
----------|---------|----------|---------|---------|-------------------
Done in 8.31s.
