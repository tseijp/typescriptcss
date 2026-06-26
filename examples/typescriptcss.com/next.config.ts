import createMDX from '@next/mdx'
import createCSS from '@typescriptcss/next/src'

const withMDX = createMDX({
        options: {
                remarkPlugins: [['remark-gfm']],
        },
})
const withCSS = createCSS({ output: 'file' })
const config = {
        output: 'export' as const,
        pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
        transpilePackages: ['typescriptcss', '@typescriptcss/share', '@typescriptcss/next'],
}

export default withCSS(withMDX(config))
