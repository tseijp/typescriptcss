import { flex, text, bg, inline } from 'typescriptcss/src'
import { color, fontMono } from '@/styles/tokens'
const seg = (s: any, i: number) => {
        if (s.t === 'kw') return <span key={i} style={text[color.pink]()}>{s.v}</span>
        if (s.t === 'fn') return <span key={i} style={text[color.cyan]()}>{s.v}</span>
        if (s.t === 'str') return <span key={i} style={text[color.purple]()}>{s.v}</span>
        if (s.t === 'mut') return <span key={i} style={text[color.faint]()}>{s.v}</span>
        return <span key={i} style={text[color.text]()}>{s.v}</span>
}
const row = (segs: any[], i: number) => (
        <div key={i} style={flex.px[5]({ minHeight: '22px', alignItems: 'center' })}>
                <span style={text[color.faint]({ width: '30px', flexShrink: 0, userSelect: 'none' })}>{i + 1}</span>
                <span style={inline.whiteSpace.pre()}>{segs.map(seg)}</span>
        </div>
)
const dot = (c: string) => {
        if (c === '#f87171') return <span style={bg['#f87171']({ width: '11px', height: '11px', borderRadius: '9999px' })} />
        if (c === '#fbbf24') return <span style={bg['#fbbf24']({ width: '11px', height: '11px', borderRadius: '9999px' })} />
        return <span style={bg['#34d399']({ width: '11px', height: '11px', borderRadius: '9999px' })} />
}
const lines = [
        [{ t: 'kw', v: 'export default' }, { v: ' ' }, { t: 'kw', v: 'function' }, { v: ' ' }, { t: 'fn', v: 'Card' }, { v: '() {' }],
        [{ v: '  ' }, { t: 'kw', v: 'return' }, { v: ' (' }],
        [{ v: '    <' }, { t: 'fn', v: 'div' }, { v: ' style={' }, { t: 'fn', v: 'flex' }, { t: 'mut', v: '.col.items.center' }],
        [{ v: '      ' }, { t: 'mut', v: '.gap' }, { v: '[' }, { t: 'str', v: '4' }, { v: ']' }, { t: 'mut', v: '.p' }, { v: '[' }, { t: 'str', v: '6' }, { v: ']' }, { t: 'mut', v: '.rounded' }, { v: '[' }, { t: 'str', v: '4' }, { v: ']' }],
        [{ v: '      ' }, { t: 'mut', v: '.bg' }, { v: '[' }, { t: 'str', v: "'#0b1120'" }, { v: ']' }, { t: 'mut', v: '.dark.bg.black' }, { v: '()}>' }],
        [{ v: '      <' }, { t: 'fn', v: 'h2' }, { v: ' style={' }, { t: 'fn', v: 'text' }, { v: '[' }, { t: 'str', v: "'#fff'" }, { v: ']' }, { t: 'mut', v: '.font.semibold' }, { v: '()}>' }],
        [{ v: '        Zero runtime' }],
        [{ v: '      </' }, { t: 'fn', v: 'h2' }, { v: '>' }],
        [{ v: '    </' }, { t: 'fn', v: 'div' }, { v: '>' }],
        [{ v: '  )' }],
        [{ v: '}' }],
]
export const HeroCode = () => (
        <div style={flex.col.bg[color.panel]({ borderWidth: '1px', borderStyle: 'solid', borderColor: color.border, borderRadius: '12px', overflow: 'hidden', fontFamily: fontMono, fontSize: '13px', lineHeight: '22px', boxShadow: '0 20px 60px -20px rgba(0,0,0,0.6)' })}>
                <div style={flex.items.center.px[4].py[3].bg[color.panelHi]({ gap: '8px', borderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: color.border })}>
                        {dot('#f87171')}
                        {dot('#fbbf24')}
                        {dot('#34d399')}
                        <span style={text[color.faint]({ marginLeft: '8px', fontSize: '12px' })}>card.tsx</span>
                </div>
                <div style={flex.col.py[4]()}>{lines.map(row)}</div>
        </div>
)
