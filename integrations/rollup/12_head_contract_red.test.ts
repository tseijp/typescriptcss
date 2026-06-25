// RED — the documented `head` contract on a document-less build tool.
//
// README "Output modes": `head` — gather the rules into a single <style> tag in
// the document head. Rollup owns no HTML document. PROMPT.md demands head be
// EITHER a working placement OR an explicit, public non-support signal — never a
// silent re-mode to `file`.
//
// OBSERVED (plugin-rollup/src/index.ts): `output === 'inline' ? 'inline' : 'file'`,
// so `head` is silently coerced to `file` with no error, no warning, no <style>.
// This test asserts the contract that SHOULD hold and is therefore expected to
// FAIL until the adapter either honours head (impossible without a document → it
// must reject) or surfaces an explicit non-support signal. Do not weaken it to
// match the silent fallback.
import { H_FACTORY, SINGLE_ENTRY, TOKENS, TSCONFIG, packageJson, rollupConfig, ROLLUP_DEV, test } from './_fixtures'

test(
        'RED head contract: requesting head on Rollup must give an explicit non-support signal, not a silent file fallback',
        {
                fs: {
                        'package.json': packageJson({}, ROLLUP_DEV),
                        'tsconfig.json': TSCONFIG,
                        'src/jsx.ts': H_FACTORY,
                        'src/tokens.ts': TOKENS,
                        'src/index.tsx': SINGLE_ENTRY,
                        'rollup.config.mjs': rollupConfig({ output: 'head' }),
                },
        },
        async ({ exec, expect, fs }) => {
                let log = ''
                let threw = false
                try {
                        log = await exec('pnpm rollup -c rollup.config.mjs', {}, { ignoreStdErr: true })
                } catch (error: any) {
                        threw = true
                        log = String(error?.stderr ?? error?.message ?? error)
                }

                const cssAssets = await fs.glob('dist/**/*.css')
                const explicitlyRejected = threw || /head.*(not\s+supported|unsupported|requires.*document|no.*document)/i.test(log)
                const silentFileFallback = !explicitlyRejected && cssAssets.length > 0

                // The contract: head must NOT silently degrade to a file asset.
                expect(silentFileFallback, 'head silently fell back to a CSS file asset with no public non-support signal').toBe(false)
                expect(explicitlyRejected, 'head should be honoured or explicitly classified as unsupported on a document-less tool').toBe(true)
        },
)
