type CSS = Partial<
        Record<
                Exclude<
                        {
                                [K in keyof CSSStyleDeclaration]: CSSStyleDeclaration[K] extends string ? K : never
                        }[keyof CSSStyleDeclaration],
                        'cssText'
                > &
                        string,
                string | number
        >
>
type Scale = { [value: number]: Chain }
type Screen = Scale & { full: Chain; screen: Chain; dvh: Chain }
type Color = { [value: `#${string}` | `oklch(${string})`]: Chain; black: Chain; transparent: Chain; white: Chain }
type Native = { [K in Exclude<keyof CSS & string, keyof Utility>]: { [value: string]: Chain } }
type Flex = Chain & { col: Chain; nowrap: Chain; row: Chain; wrap: Chain }
type Border = Chain & Color & { b: Chain; collapse: Chain; l: Chain; r: Chain; t: Chain; x: Chain; y: Chain }
export type Utility = {
        bg: Color
        block: Chain
        border: Border
        flex: Flex
        font: Scale & { bold: Chain; medium: Chain; normal: Chain; semibold: Chain }
        gap: Scale
        grid: Chain
        h: Screen
        hidden: Chain
        inline: Chain
        inlineBlock: Chain
        items: { center: Chain; end: Chain; start: Chain; stretch: Chain }
        justify: { between: Chain; center: Chain; end: Chain; start: Chain }
        leading: Scale
        m: Scale
        max: { h: Screen; w: Screen }
        mb: Scale
        min: { h: Screen; w: Screen }
        ml: Scale
        mr: Scale
        mt: Scale
        mx: Scale & { auto: Chain }
        my: Scale & { auto: Chain }
        overflow: { auto: Chain; hidden: Chain; scroll: Chain; visible: Chain }
        p: Scale
        pb: Scale
        pl: Scale
        pr: Scale
        pt: Scale
        px: Scale
        py: Scale
        rounded: Chain & Scale & { full: Chain }
        size: Screen
        table: Chain & { auto: Chain; fixed: Chain }
        text: Scale & Color & { base: Chain; center: Chain; left: Chain; right: Chain; sm: Chain; xs: Chain }
        tracking: { tight: Chain }
        w: Screen
}
type Func = (...styles: Argument[]) => Partial<CSS> 
export type RuntimeStyle = Record<string, string | number | undefined>
export type Argument = RuntimeStyle | null | undefined | false
export type Rule = (state: State, key: string) => State
export type State = { css: RuntimeStyle; greedy?: boolean; scope?: string; read?: (key: string) => State | undefined }
export type Chain = Func& RuntimeStyle & Utility & Native
