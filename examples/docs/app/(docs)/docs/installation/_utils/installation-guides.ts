export type InstallationMethod = 'using-vite' | 'using-postcss' | 'tsdown' | 'framework-guides' | 'nextjs'

export type InstallationGuide = {
        method: InstallationMethod
        label: string
        name: string
        eyebrow: string
        title: string
        lead: readonly string[]
        install: {
                body: string
                lines: readonly string[]
        }
        config: {
                title: string
                body: string
                lines: readonly string[]
        }
        build: {
                body: string
                lines: readonly string[]
        }
}

export const installationTabs: ReadonlyArray<{ label: string; method: InstallationMethod; href: string }> = [
        { label: 'Using Vite', method: 'using-vite', href: '/docs/installation/using-vite' },
        { label: 'Using PostCSS', method: 'using-postcss', href: '/docs/installation/using-postcss' },
        { label: 'tsdown', method: 'tsdown', href: '/docs/installation/tsdown' },
        { label: 'Framework Guides', method: 'framework-guides', href: '/docs/installation/framework-guides' },
        { label: 'Next.js', method: 'nextjs', href: '/docs/installation/nextjs' },
]

const sharedLead = 'typescriptcss is a zero-runtime CSS-in-JS library. You write styles as inline chains directly on your elements, and the build plugin collects them into a stylesheet with hashed class names.'

export const installationGuides: Record<InstallationMethod, InstallationGuide> = {
        'using-vite': {
                method: 'using-vite',
                label: 'Using Vite',
                name: 'Vite',
                eyebrow: 'INSTALLATION · VITE',
                title: 'Install typescriptcss with Vite',
                lead: [sharedLead, 'Add the Vite adapter to an existing or new Vite project. It transforms style chains during development and emits the collected CSS in production.'],
                install: {
                        body: 'Install the runtime package and the Vite adapter.',
                        lines: ['npm install typescriptcss', 'npm install -D @typescriptcss/plugin-vite'],
                },
                config: {
                        title: 'vite.config.ts',
                        body: 'Register the adapter before the rest of your application plugins so it can transform source files during the build.',
                        lines: ["import { defineConfig } from 'vite'", "import typescriptcss from '@typescriptcss/plugin-vite'", '', 'export default defineConfig({', '        plugins: [typescriptcss()],', '})'],
                },
                build: {
                        body: 'Run the Vite build. The adapter collects every chain, removes duplicates, and emits the resulting styles.',
                        lines: ['npm run build'],
                },
        },
        'using-postcss': {
                method: 'using-postcss',
                label: 'Using PostCSS',
                name: 'PostCSS',
                eyebrow: 'INSTALLATION · POSTCSS',
                title: 'Use typescriptcss alongside PostCSS',
                lead: [sharedLead, 'typescriptcss does not currently ship a standalone PostCSS plugin. Keep your PostCSS pipeline and add the adapter for the bundler that runs it; this example uses Vite.'],
                install: {
                        body: 'Install the runtime and the Vite adapter. Your existing PostCSS plugins can stay in postcss.config.mjs.',
                        lines: ['npm install typescriptcss', 'npm install -D @typescriptcss/plugin-vite'],
                },
                config: {
                        title: 'vite.config.ts',
                        body: 'Register typescriptcss at the bundler layer. Vite continues to pass the emitted CSS through your existing PostCSS configuration.',
                        lines: ["import { defineConfig } from 'vite'", "import typescriptcss from '@typescriptcss/plugin-vite'", '', 'export default defineConfig({', '        plugins: [typescriptcss()],', '})'],
                },
                build: {
                        body: 'Run the normal Vite build. typescriptcss emits CSS first, and your configured PostCSS pipeline processes the build output.',
                        lines: ['npm run build'],
                },
        },
        tsdown: {
                method: 'tsdown',
                label: 'tsdown',
                name: 'tsdown',
                eyebrow: 'INSTALLATION · TSDOWN',
                title: 'Install typescriptcss with tsdown',
                lead: [sharedLead, 'tsdown accepts Rollup-compatible plugins, so typescriptcss integrates through the Rollup adapter.'],
                install: {
                        body: 'Install the runtime package and the Rollup adapter used by tsdown.',
                        lines: ['npm install typescriptcss', 'npm install -D @typescriptcss/plugin-rollup'],
                },
                config: {
                        title: 'tsdown.config.ts',
                        body: 'Add the adapter to the plugins array in your tsdown configuration.',
                        lines: ["import { defineConfig } from 'tsdown'", "import typescriptcss from '@typescriptcss/plugin-rollup'", '', 'export default defineConfig({', '        plugins: [typescriptcss()],', '})'],
                },
                build: {
                        body: 'Run tsdown. The extracted styles are emitted as a CSS build asset next to your JavaScript output.',
                        lines: ['npx tsdown'],
                },
        },
        'framework-guides': {
                method: 'framework-guides',
                label: 'Framework Guides',
                name: 'your framework',
                eyebrow: 'INSTALLATION · FRAMEWORK GUIDES',
                title: 'Choose a framework adapter',
                lead: [sharedLead, 'Choose the adapter at the layer that owns your build. All adapters share the same collector and the same inline-chain authoring API.'],
                install: {
                        body: 'Install the runtime, then add the adapter that matches your build tool. Install only one adapter for a typical application.',
                        lines: ['npm install typescriptcss', '', 'npm install -D @typescriptcss/plugin-vite', '# or', 'npm install -D @typescriptcss/plugin-next', '# or', 'npm install -D @typescriptcss/plugin-rollup'],
                },
                config: {
                        title: 'Choose your config',
                        body: 'Register the adapter in the configuration file owned by your framework or bundler.',
                        lines: ['Vite       → vite.config.ts', 'Next.js    → next.config.ts', 'Rollup     → rollup.config.ts', 'tsdown     → tsdown.config.ts'],
                },
                build: {
                        body: 'Use the framework’s normal production build command after registering its adapter.',
                        lines: ['npm run build'],
                },
        },
        nextjs: {
                method: 'nextjs',
                label: 'Next.js',
                name: 'Next.js',
                eyebrow: 'INSTALLATION · NEXT.JS',
                title: 'Install typescriptcss with Next.js',
                lead: [sharedLead, 'The Next.js adapter configures both Turbopack and webpack so the same setup works in development and production.'],
                install: {
                        body: 'Install the runtime package and the Next.js adapter.',
                        lines: ['npm install typescriptcss', 'npm install -D @typescriptcss/plugin-next'],
                },
                config: {
                        title: 'next.config.ts',
                        body: 'Wrap your Next.js configuration with the typescriptcss adapter.',
                        lines: ["import typescriptcss from '@typescriptcss/plugin-next'", '', 'const withTypescriptcss = typescriptcss()', '', 'export default withTypescriptcss({})'],
                },
                build: {
                        body: 'Run the Next.js production build. The adapter transforms application source files and injects the collected styles.',
                        lines: ['npm run build'],
                },
        },
}

export const installationMethod = (value: string): InstallationMethod | undefined => {
        if (value in installationGuides) return value as InstallationMethod
        return undefined
}
