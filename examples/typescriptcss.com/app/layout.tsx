import type { Metadata } from 'next'
import { flex, font, gap, h, m, min, px, relative, text } from 'typescriptcss/src'
import { color } from '@/styles'
import Link from 'next/link'
import AnimatedIcon from '@/_atoms/animated-icon'

export const metadata: Metadata = {
        title: 'typescriptcss',
        description: 'Tailwind-like utilities authored as inline style chains, collected to CSS at build time.',
        applicationName: 'typescriptcss',
        appleWebApp: {
                title: 'typescriptcss',
        },
        manifest: '/icon/site.webmanifest',
        icons: {
                icon: [
                        { url: '/icon/icon-32x32.png', sizes: '32x32', type: 'image/png' },
                        { url: '/icon/icon-16x16.png', sizes: '16x16', type: 'image/png' },
                        { url: '/icon/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
                        { url: '/icon/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
                ],
                apple: [{ url: '/icon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
                shortcut: ['/icon/icon.ico'],
        },
        other: {
                'msapplication-TileColor': '#38bdf8',
        },
}

const primaryNav = [{ label: 'Docs', href: '/docs' }]

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
        return (
                <html lang="en" style={m[0].p[0].min.h.full()}>
                        <body style={m[0].p[0].min.h.full.text[color.text].flex.col.fontFamily['Inter, system-ui, -apple-system, Segoe UI, sans-serif'].bg[color.bg].colorScheme.dark()}>
                                <div style={relative.min.h.full.flex.col.backgroundImage[`repeating-linear-gradient(-45deg, ${color.line}1a 0px, ${color.line}1a 1px, transparent 1px, transparent 9px)`]()}>
                                        {/* @TODO FIX */}
                                        <style>{`
                                                #page-content:has([data-docs-sidebar]) {
                                                        position: relative;
                                                        width: 100%;
                                                        max-width: 96rem;
                                                        margin-inline: auto;
                                                }
                                                #page-content:has([data-docs-sidebar]) > #site-footer,
                                                #page-content:has([data-docs-sidebar]) [data-docs-main] {
                                                        margin-left: 18rem;
                                                        width: calc(100% - 18rem);
                                                        box-sizing: border-box;
                                                }
                                                @media (max-width: 768px) {
                                                        #page-content:has([data-docs-sidebar]) > #site-footer,
                                                        #page-content:has([data-docs-sidebar]) [data-docs-main] {
                                                                margin-left: 0;
                                                                width: 100%;
                                                        }
                                                }
                                        `}</style>
                                        <header style={px[6].position.sticky.zIndex[30].h[16].top[0].flex.items.center.justify.between.bg[color.bg].border.b.border[color.border]()}>
                                                <Link href="/" style={h.full.gap[3].flex.items.center.textDecoration.none()}>
                                                        <AnimatedIcon src="/icon.webm" width={32} height={32}>
                                                                <img src="/icon.webp" alt="" width={32} height={32} style={{ borderRadius: '8px', flexShrink: 0 }} />
                                                        </AnimatedIcon>
                                                        <span style={font.semibold.text[4].text[color.text].fontFamily['ui-monospace, SFMono-Regular, Menlo, Consolas, monospace']()}>typescriptcss</span>
                                                        <span style={px[2].text[3].text[color.cyan].flex.items.center.rounded[2].border.border[color.border]()}>v0.1</span>
                                                </Link>
                                                <nav style={gap[6].flex.items.center()}>
                                                        {primaryNav.map((item) => (
                                                                <Link key={item.label} href={item.href} style={font.medium.text[3.5].text[color.muted].textDecoration.none()}>
                                                                        {item.label}
                                                                </Link>
                                                        ))}
                                                </nav>
                                                <div style={gap[3].flex.items.center()}>
                                                        <div style={px[3].py[1].text[3].text[color.muted].gap[2].flex.items.center.fontFamily['ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'].bg[color.panel].rounded[3].border.border[color.border]()}>
                                                                <span>Search</span>
                                                                <span style={text[color.faint]()}>⌘K</span>
                                                        </div>
                                                        <Link href="https://github.com/tseijp/typescriptcss" target="_blank" rel="noopener noreferrer" style={m[-3].p[3].font.medium.text[3.5].text[color.muted].textDecoration.none()}>
                                                                GitHub
                                                        </Link>
                                                </div>
                                        </header>
                                        <div id="page-content" style={min.w[0].flex[1].col()}>
                                                {children}
                                                <footer id="site-footer" style={flex.col.bg[color.bg].border.t.border[color.border]()}>
                                                        <div style={px[6].py[12].grid.cols[4]()}>
                                                                <div style={px[6].py[2].gap[3].flex.col.border.l.border[color.border]()}>
                                                                        <span style={font.semibold.letterSpacing['0.08em'].text[3].text[color.faint].textTransform.uppercase()}>typescriptcss</span>
                                                                        <Link href="/docs" style={text[3.5].text[color.muted].textDecoration.none()}>
                                                                                Documentation
                                                                        </Link>
                                                                        <Link href="/docs/components" style={text[3.5].text[color.muted].textDecoration.none()}>
                                                                                Components
                                                                        </Link>
                                                                        <Link href="/docs/templates" style={text[3.5].text[color.muted].textDecoration.none()}>
                                                                                Templates
                                                                        </Link>
                                                                        <Link href="/playground" style={text[3.5].text[color.muted].textDecoration.none()}>
                                                                                Playground
                                                                        </Link>
                                                                </div>
                                                                <div style={px[6].py[2].gap[3].flex.col.border.l.border[color.border]()}>
                                                                        <span style={font.semibold.letterSpacing['0.08em'].text[3].text[color.faint].textTransform.uppercase()}>Resources</span>
                                                                        <Link href="/docs/installation/using-vite" style={text[3.5].text[color.muted].textDecoration.none()}>
                                                                                Installation
                                                                        </Link>
                                                                        <Link href="/docs/theme" style={text[3.5].text[color.muted].textDecoration.none()}>
                                                                                Theme
                                                                        </Link>
                                                                        <Link href="/docs/responsive-design" style={text[3.5].text[color.muted].textDecoration.none()}>
                                                                                Responsive design
                                                                        </Link>
                                                                        <Link href="/docs/dark-mode" style={text[3.5].text[color.muted].textDecoration.none()}>
                                                                                Dark mode
                                                                        </Link>
                                                                </div>
                                                                <div style={px[6].py[2].gap[3].flex.col.border.l.border[color.border]()}>
                                                                        <span style={font.semibold.letterSpacing['0.08em'].text[3].text[color.faint].textTransform.uppercase()}>Community</span>
                                                                        <Link href="https://github.com/tseijp" style={text[3.5].text[color.muted].textDecoration.none()}>
                                                                                GitHub
                                                                        </Link>
                                                                        <Link href="/community" style={text[3.5].text[color.muted].textDecoration.none()}>
                                                                                Discussions
                                                                        </Link>
                                                                        <Link href="/showcase" style={text[3.5].text[color.muted].textDecoration.none()}>
                                                                                Showcase
                                                                        </Link>
                                                                        <Link href="/blog" style={text[3.5].text[color.muted].textDecoration.none()}>
                                                                                Blog
                                                                        </Link>
                                                                </div>
                                                                <div style={px[6].py[2].gap[3].flex.col.border.l.border[color.border]()}>
                                                                        <span style={font.semibold.letterSpacing['0.08em'].text[3].text[color.faint].textTransform.uppercase()}>More</span>
                                                                        <Link href="/docs/installation/using-vite" style={text[3.5].text[color.muted].textDecoration.none()}>
                                                                                plugin-vite
                                                                        </Link>
                                                                        <Link href="/docs/installation/nextjs" style={text[3.5].text[color.muted].textDecoration.none()}>
                                                                                plugin-next
                                                                        </Link>
                                                                        <Link href="/docs/installation/framework-guides" style={text[3.5].text[color.muted].textDecoration.none()}>
                                                                                plugin-rollup
                                                                        </Link>
                                                                        <Link href="/docs/installation/framework-guides" style={text[3.5].text[color.muted].textDecoration.none()}>
                                                                                plugin-webpack
                                                                        </Link>
                                                                </div>
                                                        </div>
                                                        <div style={px[6].py[5].flex.items.center.justify.between.border.t.border[color.border]()}>
                                                                <div style={flex.items.center.rounded.full.border.border[color.border].overflow.hidden()}>
                                                                        <span style={px[3].py[1].text[3].flex.items.center.justify.center({ color: color.faint, background: 'transparent' })}>System</span>
                                                                        <span style={px[3].py[1].text[3].flex.items.center.justify.center({ color: color.faint, background: 'transparent' })}>Light</span>
                                                                        <span style={px[3].py[1].text[3].flex.items.center.justify.center({ color: color.text, background: color.panelHi })}>Dark</span>
                                                                </div>
                                                                <span style={text[3].text[color.faint]()}>© 2026 typescriptcss</span>
                                                        </div>
                                                </footer>
                                        </div>
                                </div>
                        </body>
                </html>
        )
}
