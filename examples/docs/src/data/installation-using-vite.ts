export const article = {
        eyebrow: 'INSTALLATION',
        title: 'Get started with typescriptcss',
        lead: [
                'typescriptcss is a zero-runtime CSS-in-JS library. You write styles as inline chains directly on your elements, and the build plugin collects them into a stylesheet with hashed class names.',
                'The fastest way to get started is to install the package and add the bundler plugin. This guide walks through a Vite project from an empty folder to a working build.',
        ],
        steps: [
                {
                        index: '01',
                        title: 'Install typescriptcss',
                        body: 'Add the runtime package to your project. It ships the chain API and the type definitions, with no CSS files of its own.',
                        code: {
                                lang: 'Terminal',
                                name: 'Terminal',
                                lines: ['npm install typescriptcss', 'npm install -D @typescriptcss/plugin-vite'],
                        },
                },
                {
                        index: '02',
                        title: 'Add the plugin to your config',
                        body: 'Register the plugin in your Vite config. During the build it reads your style chains, hashes the declarations, and writes the collected CSS.',
                        code: {
                                lang: 'vite.config.ts',
                                name: 'vite.config.ts',
                                lines: [
                                        "import { defineConfig } from 'vite'",
                                        "import typescriptcss from '@typescriptcss/plugin-vite'",
                                        '',
                                        'export default defineConfig({',
                                        '        plugins: [typescriptcss()],',
                                        '})',
                                ],
                        },
                },
                {
                        index: '03',
                        title: 'Write your styles inline',
                        body: 'Import the utilities you need and build a chain, then call it to produce the style object. No class names, no separate CSS file.',
                        code: {
                                lang: 'App.tsx',
                                name: 'App.tsx',
                                lines: [
                                        "import { flex, text, bg } from 'typescriptcss'",
                                        '',
                                        'export const App = () => (',
                                        "        <div style={flex.col.items.center.gap[4].bg['#020617']()}>",
                                        "                <h1 style={text[8].text['#f8fafc']()}>Hello</h1>",
                                        '        </div>',
                                        ')',
                                ],
                        },
                },
                {
                        index: '04',
                        title: 'Compose states and breakpoints',
                        body: 'Insert dark, sm, md, or lg anywhere in the chain to scope the styles after it. Everything stays in the same expression.',
                        code: {
                                lang: 'Button.tsx',
                                name: 'Button.tsx',
                                lines: [
                                        "import { flex, bg, text } from 'typescriptcss'",
                                        '',
                                        'export const Button = () => (',
                                        "        <button style={flex.px[5].py[2].bg['#22d3ee'].text['#020617'].dark.bg['#0b1120'].md.px[8]()}>",
                                        '                Save',
                                        '        </button>',
                                        ')',
                                ],
                        },
                },
                {
                        index: '05',
                        title: 'Run the build',
                        body: 'Build the project. The plugin collects every chain into a single stylesheet, removes duplicates, and replaces the inline styles with class names.',
                        code: {
                                lang: 'Terminal',
                                name: 'Terminal',
                                lines: ['npm run build'],
                        },
                },
        ],
        callout: {
                title: 'Using another bundler?',
                body: 'The same core works through plugin-next, plugin-rollup, and plugin-webpack. Pick the adapter that matches your setup.',
                action: 'Framework guides',
        },
}
