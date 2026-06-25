import { defineConfig } from 'vitest/config'

// Unit tests for the typescriptcss runtime chain.
// Browser-oracle cases (chapter K) are authored but gated behind a `jsdom`
// environment so they can run without a real browser when one is unavailable.
export default defineConfig({
        test: {
                include: ['test/**/*.test.ts'],
                environment: 'node',
                typecheck: {
                        enabled: true,
                        include: ['test/**/*.test.ts'],
                        tsconfig: './tsconfig.json',
                },
                coverage: {
                        provider: 'v8',
                        include: ['src/**/*.ts', 'src/**/*.tsx'],
                        exclude: ['src/**/*.test.ts', 'src/**/*.d.ts', 'src/**/types.ts'],
                        reporter: ['text', 'json', 'html'],
                        reportsDirectory: './logs/coverage',
                },
        },
})
