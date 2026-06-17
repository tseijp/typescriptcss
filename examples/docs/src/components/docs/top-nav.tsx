import { flex, text, bg } from 'typescriptcss/src'
import { color, fontMono } from '@/styles/tokens'
const link = (item: any) => (
        <a key={item.label} href={item.href} style={text[3.5].text[color.muted].font.medium({ textDecoration: 'none' })}>
                {item.label}
        </a>
)
export const TopNav = ({ items: navItems = [], version = 'v0.1' }: any) => {
        const mark = bg[color.cyan].rounded[2]({ width: '18px', height: '18px' })
        const pill = flex.items.center.text[3].text[color.cyan].border.border[color.border].rounded[2].px[2]({ borderWidth: '1px' })
        const search = flex.items.center.gap[2].text[3].text[color.muted].bg[color.panel].border.border[color.border].rounded[3].px[3].py[1]({ borderWidth: '1px', fontFamily: fontMono })
        return (
                <header style={flex.items.center.justify.between.h[16].px[6].bg[color.bg].border.b.border[color.border]({ position: 'sticky', top: 0, zIndex: 30, borderBottomWidth: '1px' })}>
                        <div style={flex.items.center.gap[3]()}>
                                <span style={mark} />
                                <span style={text[4].text[color.text].font.semibold({ fontFamily: fontMono })}>typescriptcss</span>
                                <span style={pill}>{version}</span>
                        </div>
                        <nav style={flex.items.center.gap[6]()}>{navItems.map(link)}</nav>
                        <div style={flex.items.center.gap[3]()}>
                                <div style={search}>
                                        <span>Search</span>
                                        <span style={text[color.faint]({})}>⌘K</span>
                                </div>
                                <a href="https://github.com" style={text[3.5].text[color.muted].font.medium({ textDecoration: 'none' })}>
                                        GitHub
                                </a>
                        </div>
                </header>
        )
}
