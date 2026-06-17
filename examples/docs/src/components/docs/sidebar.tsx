import { flex, text, bg } from 'typescriptcss/src'
import { color } from '@/styles/tokens'
const primaryRow = (item: any) => (
        <a key={item.label} href={item.href} style={flex.items.center.gap[3].px[3].py[2].text[3.5].text[color.muted].font.medium({ textDecoration: 'none', borderRadius: '6px' })}>
                <span style={bg[color.faint]({ width: '14px', height: '14px', borderRadius: '3px' })} />
                <span>{item.label}</span>
                {item.badge ? <span style={text[2.5].text[color.cyan].border.border[color.cyan].px[2]({ borderWidth: '1px', borderRadius: '4px', marginLeft: 'auto' })}>{item.badge}</span> : null}
        </a>
)
const navItem = (activePath: string) => (item: any) => {
        const active = item.href === activePath
        const tone = active ? color.text : color.muted
        const edge = active ? color.cyan : color.border
        return (
                <a key={item.label} href={item.href} style={flex.items.center.px[4].py[1].text[3.5].text[tone].border.l.border[edge]({ textDecoration: 'none', borderLeftWidth: '2px', fontWeight: active ? 600 : 400 })}>
                        {item.label}
                </a>
        )
}
const section = (activePath: string) => (sec: any) => (
        <div key={sec.title} style={flex.col.gap[1]()}>
                <span style={text[3].text[color.faint].font.semibold.tracking.tight.px[4].py[2]({ textTransform: 'uppercase', letterSpacing: '0.08em' })}>{sec.title}</span>
                <div style={flex.col()}>{sec.items.map(navItem(activePath))}</div>
        </div>
)
export const Sidebar = ({ sections = [], primaryNav = [], activePath = '' }: any) => (
        <aside style={flex.col.gap[6].py[8].px[2]({ position: 'sticky', top: '64px', alignSelf: 'flex-start', width: '288px', height: 'calc(100dvh - 64px)', overflowY: 'auto' })}>
                <nav style={flex.col.gap[1]()}>{primaryNav.map(primaryRow)}</nav>
                {sections.map(section(activePath))}
        </aside>
)
