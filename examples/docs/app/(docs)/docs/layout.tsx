import { bg, flex, gap, max, min, mx, px, py } from 'typescriptcss/src'
import { color } from '@/styles'
import { primaryNav, sections } from '@/const'

export default function DocsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
        return (
                <div style={mx.auto.max.w[384].w.full.min.h.full.flex.row()}>
                        <aside style={py[8].position.sticky.px[2].w[72].height['calc(100dvh - 64px)'].top['64px'].gap[6].flex.col.alignSelf['flex-start'].overflowY.auto()}>
                                <nav style={gap[1].flex.col()}>
                                        {primaryNav.map((item) => (
                                                <a key={item.label} href={item.href} style={px[3].py[2].font.medium.text[3.5].text[color.muted].gap[3].flex.items.center.rounded[1.5].textDecoration.none()}>
                                                        <span style={bg[color.faint].width['14px'].height['14px'].rounded[0.75]()} />
                                                        <span>{item.label}</span>
                                                        {'badge' in item ? <span style={px[2].marginLeft.auto.text[2.5].text[color.cyan].rounded[1].border.border[color.cyan]()}>{(item as any).badge}</span> : null}
                                                </a>
                                        ))}
                                </nav>
                                {sections.map((section) => (
                                        <div key={section.title} style={gap[1].flex.col()}>
                                                <span style={px[4].py[2].letterSpacing['0.08em'].font.semibold.text[3].text[color.faint].textTransform.uppercase()}>{section.title}</span>
                                                <div style={flex.col()}>
                                                        {section.items.map((item) => {
                                                                const active = item.href === '/docs'
                                                                return (
                                                                        <a key={item.label} href={item.href} style={px[4].py[1].fontWeight[active ? 600 : 400].text[3.5].text[active ? color.text : color.muted].flex.items.center.border.l.borderLeftWidth['2px'].border[active ? color.cyan : color.border].textDecoration.none()}>
                                                                                {item.label}
                                                                        </a>
                                                                )
                                                        })}
                                                </div>
                                        </div>
                                ))}
                        </aside>
                        <main style={min.w[0].min.h.full.flex[1].col()}>{children}</main>
                </div>
        )
}
