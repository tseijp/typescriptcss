import type { Metadata } from 'next'
import { flex, m } from 'typescriptcss/src'
import { color, fontSans } from '@/src/styles/tokens'
import { diagonal } from '@/src/styles/patterns'
import { TopNav } from '@/src/components/docs/top-nav'
import { DocsFooter } from '@/src/components/docs/footer'
import { primaryNav } from '@/src/data/docs-nav'
import { footerGroups } from '@/src/data/footer-links'

export const metadata: Metadata = {
        title: 'typescriptcss',
        description: 'Tailwind-like utilities authored as inline style chains, collected to CSS at build time.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
        return (
                <html lang="en" style={m[0].p[0].min.h.full()}>
                        <body style={m[0].p[0].min.h.full.flex.col.bg[color.bg].text[color.text]({ fontFamily: fontSans, colorScheme: 'dark' })}>
                                <div style={flex.col.min.h.full({ ...diagonal, position: 'relative' })}>
                                        <TopNav items={primaryNav} version="v0.1" />
                                        <div style={flex.col({ flex: 1, minWidth: '0px' })}>{children}</div>
                                        <DocsFooter groups={footerGroups} />
                                </div>
                        </body>
                </html>
        )
}
