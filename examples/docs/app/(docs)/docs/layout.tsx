import { flex, gap, min, mx, px, py } from 'typescriptcss/src'
import { color } from '@/styles'
import { primaryNav, sections } from '@/const'
import Link from 'next/link'

export default function DocsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
        return (
                <div style={mx.auto.max.w[384].w.full.min.h.full.flex.row()}>
                        <aside style={py[8].position.sticky.px[2].w[72].height['calc(100dvh - 64px)'].top['64px'].gap[6].flex.col.alignSelf['flex-start'].overflowY.auto()}>
                                <nav style={gap[1].flex.col()}>
                                        {primaryNav.map((item) => (
                                                <Link key={item.label} href={item.href} style={px[3].py[2].font.medium.text[3.5].text[color.muted].gap[3].flex.items.center.rounded[1.5].textDecoration.none()}>
                                                        <img src={item.icon} alt="" width={16} height={16} style={{ borderRadius: '3px', flexShrink: 0 }} />
                                                        <span>{item.label}</span>
                                                        {'badge' in item ? <span style={px[2].marginLeft.auto.text[2.5].text[color.cyan].rounded[1].border.border[color.cyan]()}>{(item as any).badge}</span> : null}
                                                </Link>
                                        ))}
                                </nav>
                                {sections.map((section) => (
                                        <div key={section.title} style={gap[1].flex.col()}>
                                                <span style={px[4].py[2].letterSpacing['0.08em'].font.semibold.text[3].text[color.faint].textTransform.uppercase()}>{section.title}</span>
                                                <div style={flex.col()}>
                                                        {section.items.map((item) => {
                                                                const active = item.href === '/docs'
                                                                return (
                                                                        <Link key={item.label} href={item.href} style={px[4].py[2].text[3.5].flex.items.center.border.l.borderLeftWidth['2px'].textDecoration.none({ fontWeight: active ? 600 : 400, color: active ? color.text : color.muted, borderLeftColor: active ? color.cyan : color.border })}>
                                                                                {item.label}
                                                                        </Link>
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
