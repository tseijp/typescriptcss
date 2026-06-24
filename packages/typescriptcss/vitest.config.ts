import { defineConfig } from 'vitest/config'

// Unit tests for the typescriptcss runtime chain.
// Browser-oracle cases (chapter K) are authored but gated behind a `jsdom`
// environment so they can run without a real browser when one is unavailable.
export default defineConfig({
        test: {
                include: ['test/**/*.test.ts'],
                environment: 'node',
                typecheck: {
                        // Chapter J (type oracle) relies on vitest's typecheck pass to assert
                        // that `// @ts-expect-error` lines are honoured by tsc.
                        enabled: true,
                        include: ['test/**/*.test-d.ts', 'test/**/*.test.ts'],
                        tsconfig: '../../tsconfig.json',
                },
        },
})
