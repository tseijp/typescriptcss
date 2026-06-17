import { defineConfig } from 'tsdown/config'

export default defineConfig({
        cwd: process.cwd(),
        entry: {
                index: 'src/index.ts',
        },
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
