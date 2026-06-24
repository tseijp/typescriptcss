import { defineConfig } from 'vitest/config'

export default defineConfig({
        test: {
                include: ['vite/**/*.test.ts', 'rollup/**/*.test.ts', 'next/**/*.test.ts'],
                testTimeout: 240_000,
                hookTimeout: 240_000,
                teardownTimeout: 30_000,
                fileParallelism: true,
                isolate: true,
                reporters: ['default'],
        },
})
