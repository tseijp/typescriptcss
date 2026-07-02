import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

/**
 * ref:
 * https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default function sitemap(): MetadataRoute.Sitemap {
        return [
                {
                        url: 'https://typescriptcss.com',
                        lastModified: new Date(),
                        changeFrequency: 'monthly',
                        priority: 1,
                },
                {
                        url: 'https://typescriptcss.com',
                        lastModified: new Date(),
                        changeFrequency: 'monthly',
                        priority: 0.8,
                },
                {
                        url: 'https://typescriptcss.com',
                        lastModified: new Date(),
                        changeFrequency: 'monthly',
                        priority: 0.5,
                },
        ]
}
