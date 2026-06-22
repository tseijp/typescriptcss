import Link from 'next/link'
import { notFound } from 'next/navigation'
import { gap, m, px, text } from 'typescriptcss/src'
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
                                        <p key={line} style={m[0].text[4.5].text[color.muted].leading[8].max.w[180]()}>
                                                {line}
                                        </p>
                                ))}
                        </div>
                        <nav aria-label="Installation methods" style={gap[1].flex.items.center.overflowX.auto.border.b.border[color.border]()}>
                                {installationTabs.map((tab) => {
                                        const active = tab.method === method
                                        return (
                                                <Link key={tab.method} href={tab.href} aria-current={active ? 'page' : undefined} style={px[3].py[2].text[3.5].text[active ? color.text : color.muted].font[active ? 600 : 400].whiteSpace.nowrap.textDecoration.none.borderBottom[active ? `2px solid ${color.cyan}` : '2px solid transparent']()}>
                                                        {tab.label}
                                                </Link>
                                        )
                                })}
                        </nav>
                        {children}
                        <div style={px[5].py[4].gap[4].flex.col.items.start.justify.between.bg[color.panel].rounded[3].border[color.border]()}>
                                <div style={gap[1].flex.col()}>
                                        <span style={text[4].text[color.text].font.semibold()}>{callout.title}</span>
                                        <span style={text[3.5].text[color.muted].leading[6]()}>{callout.body}</span>
                                </div>
                                <Link href={callout.href} style={px[4].py[2].text[3.5].text[color.bg].font.semibold.whiteSpace.nowrap.textDecoration.none.bg[color.cyan].rounded.full()}>
                                        {callout.action}
                                </Link>
                        </div>
                </>
        )
}
