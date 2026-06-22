import * as babel from 'prettier/plugins/babel'
// import * as mdx from 'prettier/plugins/mdx'
import * as typescript from 'prettier/plugins/typescript'
import { transform } from './sort.ts'

const wrap = (parser: any) => ({
        ...parser,
        preprocess: (source: string, options: any) => (parser.preprocess ? parser.preprocess(transform(source), options) : transform(source)),
})

export const parsers = {
        babel: wrap((babel as any).parsers.babel),
        'babel-ts': wrap((babel as any).parsers['babel-ts']),
        // mdx: wrap((mdx as any).parsers.mdx),
        typescript: wrap((typescript as any).parsers.typescript),
}

export default { parsers }
