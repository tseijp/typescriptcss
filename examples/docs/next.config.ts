import createMDX from '@next/mdx'
import withTCSS from "@typescriptcss/plugin-next/src";

const withMDX = createMDX()
const config = {
        pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
        transpilePackages: ['typescriptcss', '@typescriptcss/plugin-core'],
}

export default withTCSS()(withMDX(config));
