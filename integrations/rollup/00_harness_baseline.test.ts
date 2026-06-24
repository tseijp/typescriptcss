// 00 — Harness + plugin-disabled runtime baseline.
//
// Responsibility: prove the shared integration harness can stand up an isolated
// temp project with only public package deps (HARNESS-001), run a real build and
// capture exit/stdout/stderr (HARNESS-002), inventory artifacts (HARNESS-003),
// execute a generated entry (HARNESS-004) and normalize style meaning
// (HARNESS-006). It also produces the *baseline*: a build with the plugin
// disabled whose evaluated style object is the reference that `inline` and
// `file` artifacts must reconstruct (see 10_/11_).
//
// Scope note: no utility-value / variant / Proxy assertions live here. We only
// observe process + artifact boundaries. These assertions intentionally fail
// (RED) until @typescriptcss/plugin-rollup exists; missing-package or config
// syntax errors are NOT counted as the meaningful RED per PROMPT.
import { test } from './_fixtures'

const PKG = JSON.stringify(
        {
                name: 'tcss-rollup-baseline',
                private: true,
                type: 'module',
                devDependencies: {
                        rollup: '^4.0.0',
                        '@rollup/plugin-node-resolve': '^15.0.0',
                        typescriptcss: 'workspace:^',
                        '@typescriptcss/plugin-rollup': 'workspace:^',
                },
        },
        null,
        2,
)

// Raw-token module: imported color values, no Tailwind preset / named token.
const TOKENS = `export const brand = '#0b1120'
export const ink = '#f8fafc'
`

// Single entry: unique marker export + small style chain on raw CSS values,
// a reused chain, an imported raw token, and a call-arg plain object.
const ENTRY = `import { flex } from 'typescriptcss'
import { brand, ink } from './tokens.js'
export const marker = 'MARKER_BASELINE'
const card = flex.col.gap[3]
export const a = card.bg[brand].text[ink]()
export const b = card.bg['#112233']({ position: 'sticky', top: 0 })
`

// Plugin-DISABLED config: bundle only, no transform. The evaluated style object
// from this build is the baseline both placements are compared against.
const CONFIG_NOPLUGIN = `import { nodeResolve } from '@rollup/plugin-node-resolve'
export default {
  input: 'src/index.js',
  output: { dir: 'dist', format: 'es', entryFileNames: 'index.js' },
  plugins: [nodeResolve()],
}
`

const RUNNER = `import * as m from './dist/index.js'
console.log('RESULT:' + JSON.stringify({ keys: Object.keys(m), marker: m.marker, a: m.a, b: m.b }))
`

function pickResult(stdout: string) {
        let line = stdout.split('\n').find((l) => l.startsWith('RESULT:'))
        if (!line) throw new Error('runner produced no RESULT line:\n' + stdout)
        return JSON.parse(line.slice('RESULT:'.length))
}

test(
        'HARNESS: isolated project builds with public deps and the plugin-disabled baseline is executable',
        {
                fs: {
                        'package.json': PKG,
                        'src/tokens.js': TOKENS,
                        'src/index.js': ENTRY,
                        'rollup.config.mjs': CONFIG_NOPLUGIN,
                        'run.mjs': RUNNER,
                },
        },
        async ({ root, exec, expect, fs }) => {
                // HARNESS-002: command execution with captured streams.
                await exec('pnpm rollup -c rollup.config.mjs')

                // HARNESS-003: artifact inventory.
                let artifacts = await fs.glob('dist/**/*.js')
                expect(artifacts.length).toBeGreaterThan(0)

                // HARNESS-004: module execution of the generated entry.
                let out = await exec('node run.mjs')
                let baseline = pickResult(out)

                // HARNESS-006: the baseline retains the raw style meaning (no plugin = no
                // collection). This is the reference object for placement reconstruction.
                expect(baseline.marker).toBe('MARKER_BASELINE')
                expect(JSON.stringify(baseline.a)).toContain('#0b1120')
                expect(JSON.stringify(baseline.a)).toContain('#f8fafc')
                // Call-arg plain object survives merge.
                expect(JSON.stringify(baseline.b)).toContain('sticky')

                // Persist baseline so sibling cases can diff against it (HARNESS-006).
                await fs.write('baseline.json', JSON.stringify(baseline))
                expect(root).toBeTypeOf('string')
        },
)
