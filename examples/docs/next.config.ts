import createMDX from '@next/mdx'
import createTCSS from "@typescriptcss/plugin-next/src";

const withMDX = createMDX()
const withTCSS = createTCSS;
const config = {
        pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
        transpilePackages: ['typescriptcss', '@typescriptcss/plugin-core'],
}

export default withTCSS()(withMDX(config));
