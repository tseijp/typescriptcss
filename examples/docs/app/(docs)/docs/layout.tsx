import { bg, flex, gap, min, px, py } from 'typescriptcss/src'
import { color } from '@/styles'
import { primaryNav, sections } from '@/const'

export default function DocsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
        return (
                <div style={min.h.full.max.w[384].w.full.mx.auto.flex.row()}>
                        <aside style={py[8].px[2].w[72].gap[6].flex.col.position.sticky.top['64px'].height['calc(100dvh - 64px)'].alignSelf['flex-start'].overflowY.auto()}>
                                <nav style={gap[1].flex.col()}>
                                        {primaryNav.map((item) => (
                                                <a key={item.label} href={item.href} style={px[3].py[2].text[3.5].text[color.muted].gap[3].flex.items.center.font.medium.rounded[1.5].textDecoration.none()}>
                                                        <span style={bg[color.faint].width['14px'].height['14px'].rounded[0.75]()} />
                                                        <span>{item.label}</span>
                                                        {'badge' in item ? <span style={px[2].text[2.5].text[color.cyan].rounded[1].border.border[color.cyan].marginLeft.auto()}>{item.badge}</span> : null}
                                                </a>
                                        ))}
                                </nav>
                                {sections.map((section) => (
                                        <div key={section.title} style={gap[1].flex.col()}>
                                                <span style={px[4].py[2].text[3].text[color.faint].font.semibold.letterSpacing['0.08em'].textTransform.uppercase()}>{section.title}</span>
                                                <div style={flex.col()}>
                                                        {section.items.map((item) => {
                                                                const active = item.href === '/docs'
                                                                return (
                                                                        <a key={item.label} href={item.href} style={px[4].py[1].text[3.5].text[active ? color.text : color.muted].fontWeight[active ? 600 : 400].flex.items.center.border.l.borderLeftWidth['2px'].border[active ? color.cyan : color.border].textDecoration.none()}>
                                                                                {item.label}
                                                                        </a>
                                                                )
                                                        })}
                                                </div>
                                        </div>
                                ))}
                        </aside>
                        <main style={min.h.full.min.w[0].flex[1].col()}>{children}</main>
                </div>
        )
}
