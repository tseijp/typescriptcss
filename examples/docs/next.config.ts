import createMDX from '@next/mdx'
import createCSS from '@typescriptcss/plugin-next'

const withMDX = createMDX({
        options: {
                remarkPlugins: [['remark-gfm']],
        },
})
const withCSS = createCSS({ output: 'head' })
const config = {
        pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
        transpilePackages: ['typescriptcss'],
}

export default withCSS(withMDX(config))
