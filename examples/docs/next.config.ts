import createMDX from '@next/mdx'
import createCSS from '@typescriptcss/plugin-next/src'

const withMDX = createMDX()
const withCSS = createCSS({ output: 'inline' })
const config = {
        pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
        transpilePackages: ['typescriptcss', '@typescriptcss/plugin-core'],
}

export default withCSS(withMDX(config))
