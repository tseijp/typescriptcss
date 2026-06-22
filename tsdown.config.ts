import { basename } from 'node:path'
import { defineConfig } from 'tsdown/config'

const next = basename(process.cwd()) === 'plugin-next'

export default defineConfig({
        cwd: process.cwd(),
        entry: next ? { index: 'src/index.ts', loader: 'src/loader.ts' } : { index: 'src/index.ts' },
        outDir: 'dist',
        format: ['esm', 'cjs'],
        dts: true,
        clean: true,
        deps: {
                alwaysBundle: [/^@typescriptcss\/plugin-core\/src/],
        },
        outExtensions: ({ format }) => ({
                js: format === 'cjs' ? '.cjs' : '.js',
                dts: '.d.ts',
        }),
})
