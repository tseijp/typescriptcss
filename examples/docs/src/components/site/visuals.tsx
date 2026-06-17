import { flex, text, bg, px, py, gap, rounded } from 'typescriptcss/src'
import { color, fontMono, token } from '@/styles/tokens'
const tone: any = { kw: token.pink, fn: token.cyan, str: token.purple, mut: color.faint }
const seg = (s: any, i: number) => (
        <span key={i} style={text[s.t ? tone[s.t] : token.plain]({})}>
                {s.v}
        </span>
)
const codeLines = [
        [{ t: 'fn', v: 'flex' }, { t: 'mut', v: '.col.gap' }, { v: '[' }, { t: 'str', v: '4' }, { v: ']' }],
        [{ t: 'mut', v: '.bg' }, { v: '[' }, { t: 'str', v: "'#0b1120'" }, { v: ']' }, { t: 'mut', v: '.rounded' }, { v: '[' }, { t: 'str', v: '4' }, { v: ']' }],
        [{ t: 'mut', v: '.dark.bg.black' }, { v: '()' }],
]
const codeVisual = () => (
        <div style={flex.col.bg[color.bg].px[4].py[3]({ borderWidth: '1px', borderStyle: 'solid', borderColor: color.border, borderRadius: '8px', fontFamily: fontMono, fontSize: '12px', lineHeight: '20px' })}>
                {codeLines.map((line, i) => (
                        <div key={i} style={{ whiteSpace: 'pre' }}>{line.map(seg)}</div>
                ))}
        </div>
)
const paletteRow = ['#f87171', '#fb923c', '#fbbf24', '#a3e635', '#34d399', '#22d3ee', '#60a5fa', '#a78bfa', '#f472b6', '#fb7185']
const paletteVisual = () => (
        <div style={flex.gap[1]({ flexWrap: 'wrap' })}>
                {paletteRow.map((c, i) => (
                        <span key={i} style={bg[c].rounded[1]({ width: '26px', height: '26px' })} />
                ))}
        </div>
)
const barRows = [{ w: '92%', c: color.cyan }, { w: '74%', c: color.pink }, { w: '58%', c: color.purple }, { w: '40%', c: color.cyan }]
const barsVisual = () => (
        <div style={flex.col.gap[2]()}>
                {barRows.map((b, i) => (
                        <div key={i} style={bg[color.bg].rounded.full({ height: '10px', overflow: 'hidden' })}>
                                <div style={bg[b.c].rounded.full({ width: b.w, height: '10px' })} />
                        </div>
                ))}
        </div>
)
const matrixCells = Array.from({ length: 24 })
const matrixTone = (i: number) => (i % 5 === 0 ? color.cyan : i % 3 === 0 ? color.pink : color.line)
const matrixVisual = () => (
        <div style={gap[1]({ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)' })}>
                {matrixCells.map((_, i) => (
                        <span key={i} style={bg[matrixTone(i)].rounded[1]({ aspectRatio: '1 / 1' })} />
                ))}
        </div>
)
const avatarRow = ['#22d3ee', '#f472b6', '#a78bfa', '#34d399', '#fbbf24']
const avatarsVisual = () => (
        <div style={flex.items.center()}>
                {avatarRow.map((c, i) => (
                        <span key={i} style={bg[c]({ width: '34px', height: '34px', borderRadius: '9999px', borderWidth: '2px', borderStyle: 'solid', borderColor: color.panel, marginLeft: i === 0 ? '0px' : '-10px' })} />
                ))}
                <span style={bg[color.bg].text[color.muted].px[3]({ marginLeft: '-10px', height: '34px', borderRadius: '9999px', borderWidth: '2px', borderStyle: 'solid', borderColor: color.panel, display: 'flex', alignItems: 'center', fontSize: '12px' })}>+8</span>
        </div>
)
export const Visual = ({ kind }: any) => {
        if (kind === 'code') return codeVisual()
        if (kind === 'palette') return paletteVisual()
        if (kind === 'bars') return barsVisual()
        if (kind === 'matrix') return matrixVisual()
        if (kind === 'avatars') return avatarsVisual()
        return null
}
