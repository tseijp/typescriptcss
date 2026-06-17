import { flex, text, font, py, px, max } from 'typescriptcss/src'
import { color, fontMono } from '@/styles/tokens'
import { logos } from '@/data/logos'
const cell = (name: string) => (
        <div key={name} style={flex.items.center.justify.center.py[8]({ borderWidth: '1px', borderStyle: 'solid', borderColor: color.border, minHeight: '96px' })}>
                <span style={text[color.text].font.medium({ fontSize: '17px', letterSpacing: '-0.01em', opacity: 0.85 })}>{name}</span>
        </div>
)
export const Sponsors = () => (
        <section style={flex.col.py[24].px[6]({ alignItems: 'center', width: '100%' })}>
                <div style={flex.col.max.w[256]({ width: '100%', gap: '12px', alignItems: 'center' })}>
                        <span style={text[color.cyan]({ fontFamily: fontMono, fontSize: '12px', letterSpacing: '0.18em' })}>SUPPORTED BUNDLERS</span>
                        <h2 style={text[color.text].font.semibold({ fontSize: '30px', letterSpacing: '-0.02em', textAlign: 'center' })}>One plugin, every toolchain</h2>
                        <p style={text[color.muted]({ fontSize: '16px', textAlign: 'center', maxWidth: '560px', lineHeight: '1.6' })}>The same collector runs inside the build step of whichever bundler you already use, so adopting typescriptcss never means changing your toolchain.</p>
                        <div style={flex({ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', width: '100%', marginTop: '40px', gap: '0px' })}>{logos.map(cell)}</div>
                </div>
        </section>
)
