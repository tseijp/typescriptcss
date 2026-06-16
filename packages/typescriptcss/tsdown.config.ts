import { defineConfig } from 'tsdown/config'

export default defineConfig({
        entry: {
                index: 'src/index.ts',
        },
        outDir: 'dist',
        tsconfig: 'tsconfig.json',
        format: ['esm', 'cjs'],
        dts: true,
        clean: true,
        outExtensions: ({ format }) => ({
                js: format === 'cjs' ? '.cjs' : '.js',
                dts: '.d.ts',
        }),
})
