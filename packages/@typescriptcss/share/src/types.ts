export type TypescriptcssOutput = 'auto' | 'file' | 'head' | 'inline'
export type TypescriptcssOptions = {
        output?: TypescriptcssOutput
        include?: RegExp | ((id: string) => boolean)
        exclude?: RegExp | ((id: string) => boolean)
        classPrefix?: string
        fileName?: string
        minify?: boolean
        root?: string
}
export type RuntimeStyle = Record<string, any>
export type CssBlock = { base: RuntimeStyle; media: Record<string, RuntimeStyle> }
export type CssTarget = 'file' | 'head' | 'inline'
export type CssAsset = { fileName: string; source: string }
export type TransformResult = { changed: boolean; code: string; css: string; map: null }
export type EmitClass = (block: CssBlock, target: Exclude<CssTarget, 'inline'>) => string
