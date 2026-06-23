import Link from 'next/link'
import { notFound } from 'next/navigation'
import { font, gap, leading, m, px } from 'typescriptcss/src'
import { color } from '@/styles'
import { ArticleHeader } from '../_utils/article-header'
import { installationGuides, installationMethod, installationTabs } from '../_utils/installation-guides'

type InstallationMethodLayoutProps = Readonly<{
        children: React.ReactNode
        params: Promise<{ slug: string }>
}>

export default async function InstallationMethodLayout({ children, params }: InstallationMethodLayoutProps) {
        const { slug } = await params
        const method = installationMethod(slug)
        if (!method) notFound()
        const guide = installationGuides[method]
        const callout = method === 'framework-guides' ? { title: 'Ready to start?', body: 'Vite is the smallest setup if you want to try typescriptcss in a new project.', action: 'Using Vite', href: '/docs/installation/using-vite' } : { title: 'Using another platform?', body: 'Every adapter uses the same typed chain API. Choose the integration that owns your application build.', action: 'Framework guides', href: '/docs/installation/framework-guides' }
        return (
                <>
                        <ArticleHeader eyebrow={guide.eyebrow} title={guide.title} />
                        <div style={gap[4].flex.col()}>
                                {guide.lead.map((line) => (
                                        <p key={line} style={m[0].max.w[180].leading[8].text[4.5].text[color.muted]()}>
                                                {line}
                                        </p>
                                ))}
                        </div>
                        <nav aria-label="Installation methods" style={gap[1].flex.items.center.border.b.border[color.border].overflowX.auto()}>
                                {installationTabs.map((tab) => {
                                        const active = tab.method === method
                                        return (
                                                <Link key={tab.method} href={tab.href} aria-current={active ? 'page' : undefined} style={px[3].py[2].text[3.5].whiteSpace.nowrap.textDecoration.none({ fontWeight: active ? 600 : 400, color: active ? color.text : color.muted, borderBottom: active ? `2px solid ${color.cyan}` : '2px solid transparent' })}>
                                                        {tab.label}
                                                </Link>
                                        )
                                })}
                        </nav>
                        {children}
                        <div style={px[5].py[4].gap[4].flex.col.items.start.justify.between.bg[color.panel].rounded[3].border[color.border]()}>
                                <div style={gap[1].flex.col()}>
                                        <span style={font.semibold.text[4].text[color.text]()}>{callout.title}</span>
                                        <span style={leading[6].text[3.5].text[color.muted]()}>{callout.body}</span>
                                </div>
                                <Link href={callout.href} style={px[4].py[2].font.semibold.text[3.5].text[color.bg].bg[color.cyan].rounded.full.whiteSpace.nowrap.textDecoration.none()}>
                                        {callout.action}
                                </Link>
                        </div>
                </>
        )
}
