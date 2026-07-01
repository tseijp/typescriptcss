import Link from 'next/link'
import {  flex, gap, min, px, py } from 'typescriptcss/src'
import { color } from '@/styles'
import { docSections } from '@/_utils/docs'

const primaryNav = [{ label: 'Docs', href: '/docs', icon: '/icon.webp' }]

const sections = [
        {
                title: 'Getting Started',
                items: [{ title: 'Installation', href: '/docs/installation/using-vite' }],
        },
        ...docSections.map((section) => ({
                title: section.title,
                items: section.items.map((item) => ({ title: item.title, href: item.href })),
        })),
]

export default function DocsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
        return (
                <>
                        {/* @TODO FIX */}
                        <style>{`
                                [data-docs-mobile-bar] {
                                        display: none;
                                }
                                [data-docs-sidebar] {
                                        position: fixed;
                                        top: 64px;
                                        left: max(0px, calc((100vw - 96rem) / 2));
                                        width: 18rem;
                                        height: calc(100dvh - 64px);
                                        z-index: 20;
                                }
                                #docs-nav-toggle {
                                        display: none;
                                }
                                @media (max-width: 768px) {
                                        [data-docs-mobile-bar] {
                                                display: flex;
                                                position: sticky;
                                                top: 64px;
                                                z-index: 30;
                                                align-items: center;
                                                gap: 12px;
                                                min-height: 48px;
                                                padding: 0 20px;
                                                background: ${color.bg};
                                                border-bottom: 1px solid ${color.border};
                                        }
                                        [data-docs-sidebar] {
                                                display: none;
                                                top: 112px;
                                                left: 0;
                                                width: min(20rem, 100vw);
                                                height: calc(100dvh - 112px);
                                                z-index: 40;
                                                background: ${color.bg};
                                                border-right: 1px solid ${color.border};
                                                box-shadow: 24px 0 48px rgba(0, 0, 0, 0.35);
                                        }
                                        #docs-nav-toggle:checked ~ [data-docs-sidebar] {
                                                display: flex;
                                        }
                                }
                        `}</style>
                        <input id="docs-nav-toggle" type="checkbox" />
                        <div data-docs-mobile-bar>
                                <label htmlFor="docs-nav-toggle" style={px[3].py[2].font.medium.text[3.5].text[color.text].rounded[1.5].border.border[color.border]({ cursor: 'pointer', lineHeight: 1 })}>
                                        ☰
                                </label>
                                <span style={px[0].text[3.5].text[color.muted]()}>Docs</span>
                        </div>
                        <aside data-docs-sidebar style={py[8].px[2].gap[6].flex.col.overflow.y.auto({ boxSizing: 'border-box' })}>
                                <nav style={gap[1].flex.col()}>
                                        {primaryNav.map((item) => (
                                                <Link key={item.label} href={item.href} style={px[3].py[2].font.medium.text[3.5].text[color.muted].gap[3].flex.items.center.rounded[1.5]()}>
                                                        <img src={item.icon} alt="" width={16} height={16} style={{ borderRadius: '3px', flexShrink: 0 }} />
                                                        <span>{item.label}</span>
                                                </Link>
                                        ))}
                                </nav>
                                {sections.map((section) => (
                                        <div key={section.title} style={gap[1].flex.col()}>
                                                <span style={px[4].py[2].letterSpacing['0.08em'].font.semibold.text[3].text[color.faint].textTransform.uppercase()}>{section.title}</span>
                                                <div style={flex.col()}>
                                                        {section.items.map((item) => (
                                                                <Link key={item.href} href={item.href} style={px[4].py[2].text[3.5].flex.items.center.textDecoration.none.border.l['2px']({ fontWeight: 400, color: color.muted, borderLeftColor: color.border })}>
                                                                        {item.title}
                                                                </Link>
                                                        ))}
                                                </div>
                                        </div>
                                ))}
                        </aside>
                        <main data-docs-main style={min.w[0].flex[1].flex.col()}>
                                {children}
                        </main>
                </>
        )
}
