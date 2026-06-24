import { defineConfig } from 'tsdown/config'

export default defineConfig({
        cwd: process.cwd(),
        entry: ['src/index.ts', 'src/*.js'],
        outDir: 'dist',
        format: ['esm', 'cjs'],
        dts: true,
        minify: true,
        clean: true,
        deps: {
                skipNodeModulesBundle: true,
                onlyBundle: [],
        },
        outExtensions: ({ format }) => ({
                js: format === 'cjs' ? '.cjs' : '.js',
                dts: '.d.ts',
        }),
})
