import { bg, flex, text } from 'typescriptcss/src'
import { color } from '@/styles/tokens'
import { primaryNav, sections } from '@/data/docs-nav'

export default function DocsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
        return (
                <div style={flex.row.min.h.full({ maxWidth: '1536px', marginLeft: 'auto', marginRight: 'auto', width: '100%' })}>
                        <aside style={flex.col.gap[6].py[8].px[2]({ position: 'sticky', top: '64px', alignSelf: 'flex-start', width: '288px', height: 'calc(100dvh - 64px)', overflowY: 'auto' })}>
                                <nav style={flex.col.gap[1]()}>
                                        {primaryNav.map((item) => (
                                                <a key={item.label} href={item.href} style={flex.items.center.gap[3].px[3].py[2].text[3.5].text[color.muted].font.medium({ textDecoration: 'none', borderRadius: '6px' })}>
                                                        <span style={bg[color.faint]({ width: '14px', height: '14px', borderRadius: '3px' })} />
                                                        <span>{item.label}</span>
                                                        {'badge' in item ? <span style={text[2.5].text[color.cyan].border.border[color.cyan].px[2]({ borderWidth: '1px', borderRadius: '4px', marginLeft: 'auto' })}>{item.badge}</span> : null}
                                                </a>
                                        ))}
                                </nav>
                                {sections.map((section) => (
                                        <div key={section.title} style={flex.col.gap[1]()}>
                                                <span style={text[3].text[color.faint].font.semibold.tracking.tight.px[4].py[2]({ textTransform: 'uppercase', letterSpacing: '0.08em' })}>{section.title}</span>
                                                <div style={flex.col()}>
                                                        {section.items.map((item) => {
                                                                const active = item.href === '/docs'
                                                                return (
                                                                        <a
                                                                                key={item.label}
                                                                                href={item.href}
                                                                                style={flex.items.center.px[4].py[1].text[3.5].text[active ? color.text : color.muted].border.l.border[active ? color.cyan : color.border]({
                                                                                        textDecoration: 'none',
                                                                                        borderLeftWidth: '2px',
                                                                                        fontWeight: active ? 600 : 400,
                                                                                })}
                                                                        >
                                                                                {item.label}
                                                                        </a>
                                                                )
                                                        })}
                                                </div>
                                        </div>
                                ))}
                        </aside>
                        <main style={flex.col.min.h.full({ flex: 1, minWidth: '0px' })}>{children}</main>
                </div>
        )
}
