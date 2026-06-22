import type { Metadata } from 'next'
import { bg, flex, m, text } from 'typescriptcss/src'
import { color } from '@/src/styles/tokens'
import { primaryNav } from '@/src/data/docs-nav'

export const metadata: Metadata = {
        title: 'typescriptcss',
        description: 'Tailwind-like utilities authored as inline style chains, collected to CSS at build time.',
}

const themeSegment = (label: string, active: boolean) => (
        <span key={label} style={flex.items.center.justify.center.text[3].px[3].py[1]({ backgroundColor: active ? color.panelHi : 'transparent', color: active ? color.text : color.faint })}>
                {label}
        </span>
)

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
        return (
                <html lang="en" style={m[0].p[0].min.h.full()}>
                        <body style={m[0].p[0].min.h.full.flex.col.bg[color.bg].text[color.text]({ fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, sans-serif', colorScheme: 'dark' })}>
                                <div
                                        style={flex.col.min.h.full({
                                                backgroundImage: `repeating-linear-gradient(-45deg, ${color.line}1a 0px, ${color.line}1a 1px, transparent 1px, transparent 9px)`,
                                                position: 'relative',
                                        })}
                                >
                                        <header style={flex.items.center.justify.between.h[16].px[6].bg[color.bg].border.b.border[color.border]({ position: 'sticky', top: 0, zIndex: 30, borderBottomWidth: '1px' })}>
                                                <div style={flex.items.center.gap[3]()}>
                                                        <span style={bg[color.cyan].rounded[2]({ width: '18px', height: '18px' })} />
                                                        <span style={text[4].text[color.text].font.semibold({ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace' })}>typescriptcss</span>
                                                        <span style={flex.items.center.text[3].text[color.cyan].border.border[color.border].rounded[2].px[2]({ borderWidth: '1px' })}>v0.1</span>
                                                </div>
                                                <nav style={flex.items.center.gap[6]()}>
                                                        {primaryNav.map((item) => (
                                                                <a key={item.label} href={item.href} style={text[3.5].text[color.muted].font.medium({ textDecoration: 'none' })}>
                                                                        {item.label}
                                                                </a>
                                                        ))}
                                                </nav>
                                                <div style={flex.items.center.gap[3]()}>
                                                        <div
                                                                style={flex.items.center.gap[2].text[3].text[color.muted].bg[color.panel].border.border[color.border].rounded[3].px[3].py[1]({
                                                                        borderWidth: '1px',
                                                                        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                                                                })}
                                                        >
                                                                <span>Search</span>
                                                                <span style={text[color.faint]({})}>⌘K</span>
                                                        </div>
                                                        <a href="https://github.com" style={text[3.5].text[color.muted].font.medium({ textDecoration: 'none' })}>
                                                                GitHub
                                                        </a>
                                                </div>
                                        </header>
                                        <div style={flex.col({ flex: 1, minWidth: '0px' })}>{children}</div>
                                        <footer style={flex.col.bg[color.bg].border.t.border[color.border]({ borderTopWidth: '1px' })}>
                                                <div style={flex.px[6].py[12]({ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' })}>
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
                                                                                { label: 'Installation', href: '/docs/installation' },
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
                                                                                { label: 'plugin-vite', href: '/docs/installation/framework-guides/vite' },
                                                                                { label: 'plugin-next', href: '/docs/installation/framework-guides/nextjs' },
                                                                                { label: 'plugin-rollup', href: '/docs/installation/framework-guides/rollup' },
                                                                                { label: 'plugin-webpack', href: '/docs/installation/framework-guides/webpack' },
                                                                        ],
                                                                },
                                                        ].map((group) => (
                                                                <div key={group.title} style={flex.col.gap[3].px[6].py[2].border.l.border[color.border]({ borderLeftWidth: '1px' })}>
                                                                        <span style={text[3].text[color.faint].font.semibold({ textTransform: 'uppercase', letterSpacing: '0.08em' })}>{group.title}</span>
                                                                        {group.links.map((link) => (
                                                                                <a key={link.label} href={link.href} style={text[3.5].text[color.muted]({ textDecoration: 'none' })}>
                                                                                        {link.label}
                                                                                </a>
                                                                        ))}
                                                                </div>
                                                        ))}
                                                </div>
                                                <div style={flex.items.center.justify.between.px[6].py[5].border.t.border[color.border]({ borderTopWidth: '1px' })}>
                                                        <div style={flex.items.center.border.border[color.border]({ borderWidth: '1px', borderRadius: '9999px', overflow: 'hidden' })}>
                                                                {themeSegment('System', false)}
                                                                {themeSegment('Light', false)}
                                                                {themeSegment('Dark', true)}
                                                        </div>
                                                        <span style={text[3].text[color.faint]({})}>© 2026 typescriptcss</span>
                                                </div>
                                        </footer>
                                </div>
                        </body>
                </html>
        )
}
