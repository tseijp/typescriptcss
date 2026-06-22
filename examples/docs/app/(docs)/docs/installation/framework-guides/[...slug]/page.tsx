import { text } from 'typescriptcss/src'
import { color } from '@/styles'
import { ArticleHeader } from '../../_utils/article-header'
import { CodeWindow } from '../../_utils/code-window'
export const dynamicParams = true
const guides: any = {
        vite: { name: 'Vite', pkg: '@typescriptcss/plugin-vite', file: 'vite.config.ts', lines: ["import { defineConfig } from 'vite'", "import typescriptcss from '@typescriptcss/plugin-vite'", '', 'export default defineConfig({', '        plugins: [typescriptcss()],', '})'] },
        next: { name: 'Next.js', pkg: '@typescriptcss/plugin-next', file: 'next.config.ts', lines: ["import createTCSS from '@typescriptcss/plugin-next'", '', 'const withTCSS = createTCSS()', '', 'export default withTCSS({})'] },
        rollup: { name: 'Rollup', pkg: '@typescriptcss/plugin-rollup', file: 'rollup.config.ts', lines: ["import typescriptcss from '@typescriptcss/plugin-rollup'", '', 'export default {', '        plugins: [typescriptcss()],', '}'] },
        tsdown: { name: 'tsdown', pkg: '@typescriptcss/plugin-rollup', file: 'tsdown.config.ts', lines: ["import { defineConfig } from 'tsdown'", "import typescriptcss from '@typescriptcss/plugin-rollup'", '', 'export default defineConfig({', '        plugins: [typescriptcss()],', '})'] },
        webpack: { name: 'webpack', pkg: '@typescriptcss/plugin-webpack', file: 'webpack.config.js', lines: ["const typescriptcss = require('@typescriptcss/plugin-webpack')", '', 'module.exports = {', '        plugins: [typescriptcss()],', '}'] },
}
export const generateStaticParams = () => Object.keys(guides).map((key) => ({ slug: [key] }))
export default async function FrameworkGuide({ params }: any) {
        const { slug } = await params
        const key = Array.isArray(slug) ? slug[0] : slug
        const guide = guides[key] || { name: key || 'your bundler', pkg: '@typescriptcss/plugin-core', file: 'build config', lines: ["import typescriptcss from '@typescriptcss/plugin-core'", '', '// register typescriptcss() in your build pipeline'] }
        return (
                <>
                        <ArticleHeader eyebrow="FRAMEWORK GUIDES" title={`Install typescriptcss in ${guide.name}`} />
                        <p style={text[4.5].text[color.muted].leading[8]({ margin: 0, maxWidth: '720px' })}>Install the runtime and the {guide.name} adapter, then register the plugin in your build configuration. The adapter shares the same core collector, so the authoring experience is identical across bundlers.</p>
                        <CodeWindow title="Terminal" language="Terminal" lines={[`npm install typescriptcss`, `npm install -D ${guide.pkg}`]} />
                        <CodeWindow title={guide.file} language={guide.file} lines={guide.lines} />
                        <p style={text[3.5].text[color.muted].leading[6]({ margin: 0, maxWidth: '720px' })}>With the plugin registered, write your styles as inline chains anywhere in your components. The build step collects them into a single stylesheet and rewrites the markup to reference hashed class names.</p>
                </>
        )
}
