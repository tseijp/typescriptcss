import { defineConfig } from 'tsdown/config'

export default defineConfig({
        cwd: process.cwd(),
        entry: ['src/index.ts', 'src/*.js'],
        outDir: 'dist',
        format: ['esm', 'cjs'],
        dts: true,
        clean: true,
        deps: {
                alwaysBundle: [/^@typescriptcss\/plugin-core\/src$/],
                neverBundle: [/^@typescriptcss\/plugin-core$/],
                onlyBundle: false,
                dts: {
                        alwaysBundle: () => false,
                        neverBundle: [/^@typescriptcss\/plugin-core(?:\/.*)?$/],
                },
        },
        outExtensions: ({ format }) => ({
                js: format === 'cjs' ? '.cjs' : '.js',
                dts: '.d.ts',
        }),
})
