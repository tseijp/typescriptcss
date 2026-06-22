import type { Metadata } from 'next'
import { bg, flex, gap, m, min, px, text } from 'typescriptcss/src'
import { color } from '@/styles'
import { primaryNav } from '@/const'

export const metadata: Metadata = {
        title: 'typescriptcss',
        description: 'Tailwind-like utilities authored as inline style chains, collected to CSS at build time.',
}

const themeSegment = (label: string, active: boolean) => (
        <span key={label} style={px[3].py[1].text[3].text[active ? color.text : color.faint].flex.items.center.justify.center.bg[active ? color.panelHi : 'transparent']()}>
                {label}
        </span>
)

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
        return (
                <html lang="en" style={m[0].p[0].min.h.full()}>
                        <body style={m[0].p[0].min.h.full.flex.col.text[color.text].fontFamily['Inter, system-ui, -apple-system, Segoe UI, sans-serif'].bg[color.bg].colorScheme.dark()}>
                                <div style={min.h.full.position.relative.flex.col.backgroundImage[`repeating-linear-gradient(-45deg, ${color.line}1a 0px, ${color.line}1a 1px, transparent 1px, transparent 9px)`]()}>
                                        <header style={px[6].position.sticky.zIndex[30].h[16].top[0].flex.items.center.justify.between.bg[color.bg].border.b.border[color.border]()}>
                                                <div style={gap[3].flex.items.center()}>
                                                        <span style={bg[color.cyan].width['18px'].height['18px'].rounded[2]()} />
                                                        <span style={text[4].text[color.text].font.semibold.fontFamily['ui-monospace, SFMono-Regular, Menlo, Consolas, monospace']()}>typescriptcss</span>
                                                        <span style={px[2].text[3].text[color.cyan].flex.items.center.rounded[2].border.border[color.border]()}>v0.1</span>
                                                </div>
                                                <nav style={gap[6].flex.items.center()}>
                                                        {primaryNav.map((item) => (
                                                                <a key={item.label} href={item.href} style={text[3.5].text[color.muted].font.medium.textDecoration.none()}>
                                                                        {item.label}
                                                                </a>
                                                        ))}
                                                </nav>
                                                <div style={gap[3].flex.items.center()}>
                                                        <div style={px[3].py[1].text[3].text[color.muted].gap[2].flex.items.center.fontFamily['ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'].bg[color.panel].rounded[3].border.border[color.border]()}>
                                                                <span>Search</span>
                                                                <span style={text[color.faint]()}>⌘K</span>
                                                        </div>
                                                        <a href="https://github.com" style={text[3.5].text[color.muted].font.medium.textDecoration.none()}>
                                                                GitHub
                                                        </a>
                                                </div>
                                        </header>
                                        <div style={min.w[0].flex[1].col()}>{children}</div>
                                        <footer style={flex.col.bg[color.bg].border.t.border[color.border]()}>
                                                <div style={px[6].py[12].grid.cols[4]()}>
                                                        {[
                                                                {
                                                                        title: 'typescriptcss',
                                                                        links: [
                                                                                { label: 'Documentation', href: '/docs' },
                                                                                { label: 'Components', href: '/docs/components' },
                                                                                { label: 'Templates', href: '/docs/templates' },
                                                                                { label: 'Playground', href: '/playground' },
                                                                        ],
                                                                },
                                                                {
                                                                        title: 'Resources',
                                                                        links: [
                                                                                { label: 'Installation', href: '/docs/installation/using-vite' },
                                                                                { label: 'Theme', href: '/docs/theme' },
                                                                                { label: 'Responsive design', href: '/docs/responsive-design' },
                                                                                { label: 'Dark mode', href: '/docs/dark-mode' },
                                                                        ],
                                                                },
                                                                {
                                                                        title: 'Community',
                                                                        links: [
                                                                                { label: 'GitHub', href: 'https://github.com/tseijp' },
                                                                                { label: 'Discussions', href: '/community' },
                                                                                { label: 'Showcase', href: '/showcase' },
                                                                                { label: 'Blog', href: '/blog' },
                                                                        ],
                                                                },
                                                                {
                                                                        title: 'More',
                                                                        links: [
                                                                                { label: 'plugin-vite', href: '/docs/installation/using-vite' },
                                                                                { label: 'plugin-next', href: '/docs/installation/nextjs' },
                                                                                { label: 'plugin-rollup', href: '/docs/installation/framework-guides' },
                                                                                { label: 'plugin-webpack', href: '/docs/installation/framework-guides' },
                                                                        ],
                                                                },
                                                        ].map((group) => (
                                                                <div key={group.title} style={px[6].py[2].gap[3].flex.col.border.l.border[color.border]()}>
                                                                        <span style={text[3].text[color.faint].font.semibold.letterSpacing['0.08em'].textTransform.uppercase()}>{group.title}</span>
                                                                        {group.links.map((link) => (
                                                                                <a key={link.label} href={link.href} style={text[3.5].text[color.muted].textDecoration.none()}>
                                                                                        {link.label}
                                                                                </a>
                                                                        ))}
                                                                </div>
                                                        ))}
                                                </div>
                                                <div style={px[6].py[5].flex.items.center.justify.between.border.t.border[color.border]()}>
                                                        <div style={flex.items.center.rounded.full.border.border[color.border].overflow.hidden()}>
                                                                {themeSegment('System', false)}
                                                                {themeSegment('Light', false)}
                                                                {themeSegment('Dark', true)}
                                                        </div>
                                                        <span style={text[3].text[color.faint]()}>© 2026 typescriptcss</span>
                                                </div>
                                        </footer>
                                </div>
                        </body>
                </html>
        )
}
