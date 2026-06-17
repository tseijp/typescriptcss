import { flex, text, bg, px, py, max } from 'typescriptcss/src'
import { color, fontMono } from '@/styles/tokens'
import { cardSheen } from '@/styles/patterns'
const tone: any = { kw: color.pink, fn: color.cyan, str: color.purple, mut: color.faint, txt: color.text }
const seg = (s: any, i: number) => (
        <span key={i} style={text[s.t ? tone[s.t] : color.text]({})}>
                {s.v}
        </span>
)
const row = (segs: any[], i: number) => (
        <div key={i} style={flex.px[5]({ minHeight: '24px', alignItems: 'center' })}>
                <span style={text[color.faint]({ width: '32px', flexShrink: 0, userSelect: 'none' })}>{i + 1}</span>
                <span style={{ whiteSpace: 'pre' }}>{segs.map(seg)}</span>
        </div>
)
const dot = (c: string) => <span style={bg[c]({ width: '11px', height: '11px', borderRadius: '9999px' })} />
const lines = [
        [{ t: 'mut', v: '// vite.config.ts' }],
        [{ t: 'kw', v: 'import' }, { v: ' { typescriptcss } ' }, { t: 'kw', v: 'from' }, { v: ' ' }, { t: 'str', v: "'@typescriptcss/plugin-vite'" }],
        [{ v: '' }],
        [{ t: 'kw', v: 'export default' }, { v: ' {' }],
        [{ v: '  plugins: [' }, { t: 'fn', v: 'typescriptcss' }, { v: '()],' }],
        [{ v: '}' }],
        [{ v: '' }],
        [{ t: 'mut', v: '// every style chain is collected at build —' }],
        [{ t: 'mut', v: '// no css file to import, nothing to purge.' }],
]
export const ShipSection = () => (
        <section style={flex.col.py[24].px[6]({ alignItems: 'center', width: '100%' })}>
                <div style={flex.col.max.w[256]({ width: '100%', alignItems: 'center', gap: '16px' })}>
                        <span style={text[color.pink]({ fontFamily: fontMono, fontSize: '12px', letterSpacing: '0.18em' })}>BUILD-TIME COLLECTION</span>
                        <h2 style={text[color.text]({ fontSize: '44px', fontWeight: 600, letterSpacing: '-0.03em', textAlign: 'center', lineHeight: '1.1', maxWidth: '720px' })}>Ship faster, with less to maintain</h2>
                        <p style={text[color.muted]({ fontSize: '18px', textAlign: 'center', maxWidth: '620px', lineHeight: '1.65' })}>Add one plugin and keep writing chains. The build turns them into a single stylesheet, so there is no runtime in the browser and no second source of truth to keep in sync.</p>
                        <div style={flex.col.bg[color.panel](cardSheen, { width: '100%', maxWidth: '720px', marginTop: '24px', borderWidth: '1px', borderStyle: 'solid', borderColor: color.border, borderRadius: '12px', overflow: 'hidden', fontFamily: fontMono, fontSize: '14px', lineHeight: '24px', boxShadow: '0 24px 70px -24px rgba(0,0,0,0.7)' })}>
                                <div style={flex.items.center.px[4].py[3].bg[color.panelHi]({ gap: '8px', borderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: color.border })}>
                                        {dot('#f87171')}
                                        {dot('#fbbf24')}
                                        {dot('#34d399')}
                                        <span style={text[color.faint]({ marginLeft: '8px', fontSize: '12px' })}>vite.config.ts</span>
                                </div>
                                <div style={flex.col.py[4]()}>{lines.map(row)}</div>
                        </div>
                </div>
        </section>
)
