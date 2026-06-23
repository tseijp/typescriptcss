import { defineConfig } from 'tsdown/config'

export default defineConfig({
        cwd: process.cwd(),
        entry: ['src/index.ts', 'src/*.js'],
        outDir: 'dist',
        format: ['esm', 'cjs'],
        dts: true,
        clean: true,
        deps: {
                alwaysBundle: [/^@typescriptcss\/plugin-core(?:\/src)?$/, /^typescriptcss\/src$/],
        },
        outExtensions: ({ format }) => ({
                js: format === 'cjs' ? '.cjs' : '.js',
                dts: '.d.ts',
        }),
})
