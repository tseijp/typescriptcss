import { notFound } from 'next/navigation'
import { flex } from 'typescriptcss/src'
import { color } from '@/styles'
const slugs = ['styling-with-utility-classes', 'responsive-design', 'hover-focus-and-other-states', 'dark-mode', 'theme']
export const generateStaticParams = () => slugs.map((slug) => ({ slug }))
export default async function DocPage({ params }: any) {
        const { slug } = await params
        if (!slugs.includes(slug)) return notFound()
        const mod = (await import(`../../../../docs/${slug}.mdx`)) as any
        const Body = mod.default
        return (
                <article style={flex.col.max.w[224].px[8].py[12]({ marginInline: 'auto', width: '100%', lineHeight: 1.7, color: color.muted })}>
                        <Body />
                </article>
        )
}
