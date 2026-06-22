import { border, flex, font, gap, items, leading, m, md, min, px, py, rounded, text, w } from 'typescriptcss/src'
import { color, fontMono } from '@/styles'
import { CodeWindow } from './code-window'
import type { InstallationGuide } from './installation-guides'

type InstallationStepsProps = {
        guide: InstallationGuide
}

export const InstallationSteps = ({ guide }: InstallationStepsProps) => {
        const steps = [
                {
                        title: 'Install typescriptcss',
                        body: guide.install.body,
                        code: { title: 'Terminal', language: 'Terminal', lines: guide.install.lines },
                },
                {
                        title: 'Add the plugin to your config',
                        body: guide.config.body,
                        code: { title: guide.config.title, language: guide.config.title, lines: guide.config.lines },
                },
                {
                        title: 'Write your styles inline',
                        body: 'Import the utilities you need and build a chain, then call it to produce the style object. No class names or separate CSS file are required.',
                        code: {
                                title: 'App.tsx',
                                language: 'App.tsx',
                                lines: ["import { flex, gap, text, bg } from 'typescriptcss'", '', 'export const App = () => (', "        <div style={gap[4].flex.col.items.center.bg['#020617']()}>", "                <h1 style={text[8].text['#f8fafc']()}>Hello</h1>", '        </div>', ')'],
                        },
                },
                {
                        title: 'Compose states and breakpoints',
                        body: 'Insert dark, sm, md, or lg anywhere in the chain to scope the styles after it. Everything stays in the same expression.',
                        code: {
                                title: 'Button.tsx',
                                language: 'Button.tsx',
                                lines: ["import { flex, px, bg, text } from 'typescriptcss'", '', 'export const Button = () => (', "        <button style={px[5].py[2].text['#020617'].flex.bg['#22d3ee'].md.px[8].dark.bg['#0b1120']()}>", '                Save', '        </button>', ')'],
                        },
                },
                {
                        title: 'Run the build',
                        body: guide.build.body,
                        code: { title: 'Terminal', language: 'Terminal', lines: guide.build.lines },
                },
        ]

        return (
                <div style={py[4].gap[10].flex.col()}>
                        {steps.map((step, index) => (
                                <div key={step.title} style={gap[5].flex.col.items.start.md.flex.row()}>
                                        <span style={px[2].py[1].flexShrink[0].text[3].text[color.faint].fontFamily[fontMono].rounded[2].border[color.border]()}>[{String(index + 1).padStart(2, '0')}]</span>
                                        <div style={gap[2].min.w[0].flex[1].col()}>
                                                <h3 style={m[0].text[4.5].text[color.text].font.semibold()}>{step.title}</h3>
                                                <p style={m[0].text[3.5].text[color.muted].leading[6]()}>{step.body}</p>
                                        </div>
                                        <div style={w.full.min.w[0].flex[1]()}>
                                                <CodeWindow title={step.code.title} language={step.code.language} lines={step.code.lines} />
                                        </div>
                                </div>
                        ))}
                </div>
        )
}
