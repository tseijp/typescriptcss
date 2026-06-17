import { flex, items, justify, text, bg, px, py, gap, border, font, leading, rounded } from 'typescriptcss/src'
import { color, fontMono } from '@/styles/tokens'
import { Article } from '@/components/docs/article'
import { CodeWindow } from '@/components/docs/code-window'
import { installTabs } from '@/data/install-tabs'
import { article } from '@/data/installation-using-vite'
const Tab = ({ tab }: any) => {
        const on = tab.value === 'vite'
        return (
                <span style={text[3.5].px[3].py[2]({ color: on ? color.text : color.muted, borderBottom: on ? `2px solid ${color.cyan}` : '2px solid transparent', whiteSpace: 'nowrap', fontWeight: on ? 600 : 400 })}>{tab.label}</span>
        )
}
const Tabs = () => (
        <div style={flex.items.center.gap[1].border.b.border[color.border]({ borderBottomWidth: '1px', overflowX: 'auto' })}>
                {installTabs.map((tab: any) => <Tab key={tab.value} tab={tab} />)}
        </div>
)
const Lead = ({ lines }: any) => (
        <div style={flex.col.gap[4]()}>
                {lines.map((line: string, i: number) => <p key={i} style={text[4.5].text[color.muted].leading[8]({ margin: 0, maxWidth: '720px' })}>{line}</p>)}
        </div>
)
const Step = ({ step }: any) => (
        <div style={flex.col.gap[5].md.flex.row({ alignItems: 'flex-start' })}>
                <span style={text[3].text[color.faint].border.border[color.border].px[2].py[1].rounded[2]({ borderWidth: '1px', fontFamily: fontMono, flexShrink: 0 })}>[{step.index}]</span>
                <div style={flex.col.gap[2]({ flex: 1, minWidth: 0 })}>
                        <h3 style={text[4.5].text[color.text].font.semibold({ margin: 0 })}>{step.title}</h3>
                        <p style={text[3.5].text[color.muted].leading[6]({ margin: 0 })}>{step.body}</p>
                </div>
                <div style={flex({ flex: 1, minWidth: 0, width: '100%' })}>
                        <CodeWindow title={step.code.name} language={step.code.lang} lines={step.code.lines} />
                </div>
        </div>
)
const Callout = ({ callout }: any) => (
        <div style={flex.items.center.justify.between.gap[4].border.border[color.border].bg[color.panel].px[5].py[4].rounded[3].md.flex.row({ borderWidth: '1px', flexDirection: 'column', alignItems: 'flex-start' })}>
                <div style={flex.col.gap[1]()}>
                        <span style={text[4].text[color.text].font.semibold()}>{callout.title}</span>
                        <span style={text[3.5].text[color.muted].leading[6]()}>{callout.body}</span>
                </div>
                <span style={text[3.5].text[color.bg].bg[color.cyan].px[4].py[2].rounded.full({ whiteSpace: 'nowrap', fontWeight: 600 })}>{callout.action}</span>
        </div>
)
export default function InstallationPage() {
        return (
                <Article eyebrow={article.eyebrow} title={article.title}>
                        <Lead lines={article.lead} />
                        <Tabs />
                        <div style={flex.col.gap[10].py[4]()}>
                                {article.steps.map((step: any) => <Step key={step.index} step={step} />)}
                        </div>
                        <Callout callout={article.callout} />
                </Article>
        )
}
