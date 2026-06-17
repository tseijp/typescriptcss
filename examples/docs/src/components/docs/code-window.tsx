import { flex, text, w } from 'typescriptcss/src'
import { color, token, fontMono } from '@/styles/tokens'
const tone: any = { cmd: token.cyan, keyword: token.pink, string: token.cyan, comment: token.gray, plain: token.plain }
const piece = (seg: any, i: number) => {
        if (typeof seg === 'string')
                return (
                        <span key={i} style={text[color.text]({})}>
                                {seg}
                        </span>
                )
        return (
                <span key={i} style={text[tone[seg.kind] || token.plain]({})}>
                        {seg.text}
                </span>
        )
}
const row = (line: any, i: number, highlights: number[]) => {
        const hot = highlights.indexOf(i) !== -1
        const segs = Array.isArray(line) ? line : [line]
        return (
                <div key={i} style={flex.px[4]({ backgroundColor: hot ? 'rgba(34,211,238,0.08)' : 'transparent', minHeight: '22px', alignItems: 'center' })}>
                        <span style={text[color.faint]({ width: '28px', userSelect: 'none', flexShrink: 0 })}>{i + 1}</span>
                        <span style={{ whiteSpace: 'pre' }}>{segs.map(piece)}</span>
                </div>
        )
}
const dot = (c: string) => <span style={w[2.5].h[2.5].rounded.full.bg[c]()} />
export const CodeWindow = ({ title = '', language = '', lines = [], highlights = [] }: any) => (
        <div style={flex.col.bg[color.panel].border.border[color.border]({ borderWidth: '1px', borderRadius: '8px', overflow: 'hidden', fontFamily: fontMono, fontSize: '13px', lineHeight: '22px' })}>
                <div style={flex.items.center.justify.between.px[4].py[2].bg[color.panelHi].border.b.border[color.border]({ borderBottomWidth: '1px' })}>
                        <div style={flex.items.center.gap[2]()}>
                                {dot('#475569')}
                                <span style={text[3].text[color.muted]({})}>{title || language}</span>
                        </div>
                        <span style={text[3].text[color.faint]({})}>Copy</span>
                </div>
                <div style={flex.col.py[3]()}>{lines.map((l: any, i: number) => row(l, i, highlights))}</div>
        </div>
)
