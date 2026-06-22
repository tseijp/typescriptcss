import { notFound } from 'next/navigation'
import { flex, max, px, py, text, w } from 'typescriptcss/src'
import { color } from '@/styles'
const slugs = ['styling-with-utility-classes', 'responsive-design', 'hover-focus-and-other-states', 'dark-mode', 'theme']
export const generateStaticParams = () => slugs.map((slug) => ({ slug }))
export default async function DocPage({ params }: any) {
        const { slug } = await params
        if (!slugs.includes(slug)) return notFound()
        const mod = (await import(`../../../../docs/${slug}.mdx`)) as any
        const Body = mod.default
        return (
                <article style={px[8].marginInline.auto.py[12].max.w[224].w.full.text[color.muted].flex.col.lineHeight[1.7]()}>
                        <Body />
                </article>
        )
}
