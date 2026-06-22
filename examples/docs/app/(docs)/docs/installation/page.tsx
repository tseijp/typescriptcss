import { flex, text } from 'typescriptcss/src'
import { color, fontMono } from '@/styles'
import { ArticleHeader } from './_utils/article-header'
import { CodeWindow } from './_utils/code-window'

const article = {
        eyebrow: 'INSTALLATION',
        title: 'Get started with typescriptcss',
        lead: ['typescriptcss is a zero-runtime CSS-in-JS library. You write styles as inline chains directly on your elements, and the build plugin collects them into a stylesheet with hashed class names.', 'The fastest way to get started is to install the package and add the bundler plugin. This guide walks through a Vite project from an empty folder to a working build.'],
        steps: [
                {
                        index: '01',
                        title: 'Install typescriptcss',
                        body: 'Add the runtime package to your project. It ships the chain API and the type definitions, with no CSS files of its own.',
                        code: { lang: 'Terminal', name: 'Terminal', lines: ['npm install typescriptcss', 'npm install -D @typescriptcss/plugin-vite'] },
                },
                {
                        index: '02',
                        title: 'Add the plugin to your config',
                        body: 'Register the plugin in your Vite config. During the build it reads your style chains, hashes the declarations, and writes the collected CSS.',
                        code: { lang: 'vite.config.ts', name: 'vite.config.ts', lines: ["import { defineConfig } from 'vite'", "import typescriptcss from '@typescriptcss/plugin-vite'", '', 'export default defineConfig({', '        plugins: [typescriptcss()],', '})'] },
                },
                {
                        index: '03',
                        title: 'Write your styles inline',
                        body: 'Import the utilities you need and build a chain, then call it to produce the style object. No class names, no separate CSS file.',
                        code: {
                                lang: 'App.tsx',
                                name: 'App.tsx',
                                lines: ["import { flex, text, bg } from 'typescriptcss'", '', 'export const App = () => (', "        <div style={flex.col.items.center.gap[4].bg['#020617']()}>", "                <h1 style={text[8].text['#f8fafc']()}>Hello</h1>", '        </div>', ')'],
                        },
                },
                {
                        index: '04',
                        title: 'Compose states and breakpoints',
                        body: 'Insert dark, sm, md, or lg anywhere in the chain to scope the styles after it. Everything stays in the same expression.',
                        code: { lang: 'Button.tsx', name: 'Button.tsx', lines: ["import { flex, bg, text } from 'typescriptcss'", '', 'export const Button = () => (', "        <button style={flex.px[5].py[2].bg['#22d3ee'].text['#020617'].dark.bg['#0b1120'].md.px[8]()}>", '                Save', '        </button>', ')'] },
                },
                {
                        index: '05',
                        title: 'Run the build',
                        body: 'Build the project. The plugin collects every chain into a single stylesheet, removes duplicates, and replaces the inline styles with class names.',
                        code: { lang: 'Terminal', name: 'Terminal', lines: ['npm run build'] },
                },
        ],
        callout: {
                title: 'Using another bundler?',
                body: 'The same core works through plugin-next, plugin-rollup, and plugin-webpack. Pick the adapter that matches your setup.',
                action: 'Framework guides',
        },
}

export default function InstallationPage() {
        return (
                <>
                        <ArticleHeader eyebrow={article.eyebrow} title={article.title} />
                        <div style={flex.col.gap[4]()}>
                                {article.lead.map((line) => (
                                        <p key={line} style={text[4.5].text[color.muted].leading[8]({ margin: 0, maxWidth: '720px' })}>
                                                {line}
                                        </p>
                                ))}
                        </div>
                        <div style={flex.items.center.gap[1].border.b.border[color.border]({ borderBottomWidth: '1px', overflowX: 'auto' })}>
                                {[
                                        { label: 'Using Vite', value: 'vite' },
                                        { label: 'Using PostCSS', value: 'postcss' },
                                        { label: 'tsdown', value: 'tsdown' },
                                        { label: 'Framework Guides', value: 'guides' },
                                        { label: 'Next.js', value: 'next' },
                                ].map((tab) => {
                                        const on = tab.value === 'vite'
                                        return (
                                                <span key={tab.value} style={text[3.5].px[3].py[2]({ color: on ? color.text : color.muted, borderBottom: on ? `2px solid ${color.cyan}` : '2px solid transparent', whiteSpace: 'nowrap', fontWeight: on ? 600 : 400 })}>
                                                        {tab.label}
                                                </span>
                                        )
                                })}
                        </div>
                        <div style={flex.col.gap[10].py[4]()}>
                                {article.steps.map((step) => (
                                        <div key={step.index} style={flex.col.gap[5].md.flex.row({ alignItems: 'flex-start' })}>
                                                <span style={text[3].text[color.faint].border.border[color.border].px[2].py[1].rounded[2]({ borderWidth: '1px', fontFamily: fontMono, flexShrink: 0 })}>[{step.index}]</span>
                                                <div style={flex.col.gap[2]({ flex: 1, minWidth: 0 })}>
                                                        <h3 style={text[4.5].text[color.text].font.semibold({ margin: 0 })}>{step.title}</h3>
                                                        <p style={text[3.5].text[color.muted].leading[6]({ margin: 0 })}>{step.body}</p>
                                                </div>
                                                <div style={flex({ flex: 1, minWidth: 0, width: '100%' })}>
                                                        <CodeWindow title={step.code.name} language={step.code.lang} lines={step.code.lines} />
                                                </div>
                                        </div>
                                ))}
                        </div>
                        <div style={flex.items.center.justify.between.gap[4].border.border[color.border].bg[color.panel].px[5].py[4].rounded[3].md.flex.row({ borderWidth: '1px', flexDirection: 'column', alignItems: 'flex-start' })}>
                                <div style={flex.col.gap[1]()}>
                                        <span style={text[4].text[color.text].font.semibold()}>{article.callout.title}</span>
                                        <span style={text[3.5].text[color.muted].leading[6]()}>{article.callout.body}</span>
                                </div>
                                <span style={text[3.5].text[color.bg].bg[color.cyan].px[4].py[2].rounded.full({ whiteSpace: 'nowrap', fontWeight: 600 })}>{article.callout.action}</span>
                        </div>
                </>
        )
}
