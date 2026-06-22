yarn run v1.22.22
$ cd examples/docs && npm run build
npm warn Unknown env config "version-commit-hooks". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.
npm warn Unknown env config "version-tag-prefix". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.
npm warn Unknown env config "version-git-message". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.
npm warn Unknown env config "argv". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.
npm warn Unknown env config "version-git-tag". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.

> docs@0.1.0 build
> next build

▲ Next.js 16.2.9 (Turbopack)

  Creating an optimized production build ...

> Build error occurred
Error: Turbopack build failed with 2 errors:
./examples/docs/app/page.tsx.js:6:27
Expected ',', got ':'
  [90m4 |[0m [36mimport[0m { glow, cardSheen } [36mfrom[0m [32m'@/src/styles/patterns'[0m
  [90m5 |[0m [36mimport[0m { [33mHeroCode[0m } [36mfrom[0m [32m'@/src/components/site/hero-code'[0m
[31m[1m>[0m [90m6 |[0m [36mconst[0m [33mPill[0m = ({ children }: any) => (
  [90m  |[0m                           [31m[1m^[0m
  [90m7 |[0m         <span style={({...({ borderWidth: [32m'1px'[0m, borderStyle: [32m'solid'[0m, b...
  [90m8 |[0m )
  [90m9 |[0m [36mconst[0m [33mCta[0m = ({ href, primary, children }: any) => (

Parsing ecmascript source code failed

Generated code of loaders [/workspaces/typscriptcss/packages/@typescriptcss/plugin-next/src/loader.ts] transform of file content of examples/docs/app/page.tsx:
./examples/docs/app/page.tsx.js:6:27
  [90m4 |[0m [36mimport[0m { glow, cardSheen } [36mfrom[0m [32m'@/src/styles/patterns'[0m
  [90m5 |[0m [36mimport[0m { [33mHeroCode[0m } [36mfrom[0m [32m'@/src/components/site/hero-code'[0m
[31m[1m>[0m [90m6 |[0m [36mconst[0m [33mPill[0m = ({ children }: any) => (
  [90m  |[0m                           [31m[1m^[0m
  [90m7 |[0m         <span style={({...({ borderWidth: [32m'1px'[0m, borderStyle: [32m'solid'[0m, b...
  [90m8 |[0m )
  [90m9 |[0m [36mconst[0m [33mCta[0m = ({ href, primary, children }: any) => (


./examples/docs/app/layout.tsx.js:1:13
Expected ',', got '{'
[31m[1m>[0m [90m1 |[0m [36mimport[0m [36mtype[0m { [33mMetadata[0m } [36mfrom[0m [32m'next'[0m
  [90m  |[0m             [31m[1m^[0m
  [90m2 |[0m [36mimport[0m { flex, m } [36mfrom[0m [32m'typescriptcss/src'[0m
  [90m3 |[0m [36mimport[0m { color, fontSans } [36mfrom[0m [32m'@/src/styles/tokens'[0m
  [90m4 |[0m [36mimport[0m { diagonal } [36mfrom[0m [32m'@/src/styles/patterns'[0m

Parsing ecmascript source code failed

Generated code of loaders [/workspaces/typscriptcss/packages/@typescriptcss/plugin-next/src/loader.ts] transform of file content of examples/docs/app/layout.tsx:
./examples/docs/app/layout.tsx.js:1:13
[31m[1m>[0m [90m1 |[0m [36mimport[0m [36mtype[0m { [33mMetadata[0m } [36mfrom[0m [32m'next'[0m
  [90m  |[0m             [31m[1m^[0m
  [90m2 |[0m [36mimport[0m { flex, m } [36mfrom[0m [32m'typescriptcss/src'[0m
  [90m3 |[0m [36mimport[0m { color, fontSans } [36mfrom[0m [32m'@/src/styles/tokens'[0m
  [90m4 |[0m [36mimport[0m { diagonal } [36mfrom[0m [32m'@/src/styles/patterns'[0m


    at <unknown> (./examples/docs/app/page.tsx.js:6:27)
    at <unknown> (./examples/docs/app/page.tsx.js:6:27)
    at <unknown> (./examples/docs/app/layout.tsx.js:1:13)
    at <unknown> (./examples/docs/app/layout.tsx.js:1:13)
npm error Lifecycle script `build` failed with error:
npm error code 1
npm error path /workspaces/typscriptcss/examples/docs
npm error workspace docs@0.1.0
npm error location /workspaces/typscriptcss/examples/docs
npm error command failed
npm error command sh -c next build
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
