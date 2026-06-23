import createMDX from '@next/mdx'
import createCSS from '@typescriptcss/plugin-next/src'

const withMDX = createMDX({
        options: {
                remarkPlugins: [['remark-gfm']],
        },
})
const withCSS = createCSS({ output: 'file' })
const config = {
        pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
        transpilePackages: ['typescriptcss', '@typescriptcss/plugin-core', '@typescriptcss/plugin-next'],
}

export default withCSS(withMDX(config))
