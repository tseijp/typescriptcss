import { flex, text } from 'typescriptcss/src'
import { color } from '@/styles/tokens'
const linkRow = (l: any) => (
        <a key={l.label} href={l.href} style={text[3.5].text[color.muted]({ textDecoration: 'none' })}>
                {l.label}
        </a>
)
const groupCol = (g: any) => (
        <div key={g.title} style={flex.col.gap[3].px[6].py[2].border.l.border[color.border]({ borderLeftWidth: '1px' })}>
                <span style={text[3].text[color.faint].font.semibold({ textTransform: 'uppercase', letterSpacing: '0.08em' })}>{g.title}</span>
                {g.links.map(linkRow)}
        </div>
)
const seg = (label: string, on: boolean) => {
        if (on) return <span key={label} style={flex.items.center.justify.center.text[3].px[3].py[1]({ backgroundColor: color.panelHi, color: color.text })}>{label}</span>
        return <span key={label} style={flex.items.center.justify.center.text[3].px[3].py[1]({ backgroundColor: 'transparent', color: color.faint })}>{label}</span>
}
export const DocsFooter = ({ groups = [] }: any) => (
        <footer style={flex.col.bg[color.bg].border.t.border[color.border]({ borderTopWidth: '1px' })}>
                <div style={flex.px[6].py[12]({ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' })}>{groups.map(groupCol)}</div>
                <div style={flex.items.center.justify.between.px[6].py[5].border.t.border[color.border]({ borderTopWidth: '1px' })}>
                        <div style={flex.items.center.border.border[color.border]({ borderWidth: '1px', borderRadius: '9999px', overflow: 'hidden' })}>
                                {seg('System', false)}
                                {seg('Light', false)}
                                {seg('Dark', true)}
                        </div>
                        <span style={text[3].text[color.faint]({})}>© 2026 typescriptcss</span>
                </div>
        </footer>
)
