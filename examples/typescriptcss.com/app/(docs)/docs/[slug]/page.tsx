import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { px } from 'typescriptcss/src'
import { color } from '@/styles'
import { docSlugs, findDoc } from '@/_utils/docs'

type Props = {
        params: Promise<{ slug: string }>
}

export const dynamicParams = false

export const generateStaticParams = () => docSlugs.map((slug) => ({ slug }))

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
        const { slug } = await params
        const doc = findDoc(slug)
        if (!doc) return {}
        return {
                title: `${doc.title} - typescriptcss`,
                description: doc.description,
        }
}

export default async function DocPage({ params }: Props) {
        const { slug } = await params
        const doc = findDoc(slug)
        if (!doc) return notFound()
        const mod = (await import(`../../../../docs/${doc.relativePath}`)) as any
        const Body = mod.default
        return (
                <article style={px[8].marginInline.auto.py[12].max.w[224].w.full.lineHeight[1.7].text[color.muted].flex.col()}>
                        <Body />
                </article>
        )
}
