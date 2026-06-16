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
type Value = { [value: string]: Chain }
type Screen = Scale & { full: Chain; screen: Chain; dvh: Chain }
type Color = { [value: `#${string}` | `oklch(${string})`]: Chain; black: Chain; transparent: Chain; white: Chain }
type Native = { [K in Exclude<keyof CSS & string, keyof Utility>]: { [value: string]: Chain } }
type Flex = Chain & Scale & Value & { auto: Chain; col: Chain; initial: Chain; none: Chain; nowrap: Chain; row: Chain; wrap: Chain }
type Border = Chain & Color & { b: Chain; collapse: Chain; l: Chain; r: Chain; t: Chain; x: Chain; y: Chain }
export type Utility = {
        bg: Color
        block: Chain
        border: Border
        dark: Chain
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
        lg: Chain
        m: Scale
        max: { h: Screen; w: Screen }
        md: Chain
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
        sm: Chain
        table: Chain & { auto: Chain; fixed: Chain }
        text: Scale & Color & { base: Chain; center: Chain; left: Chain; right: Chain; sm: Chain; xs: Chain }
        tracking: { tight: Chain }
        w: Screen
        xl: Chain
        xs: Chain
        xxl: Chain
}
type Func = (...styles: Argument[]) => Partial<CSS>
export type RuntimeStyle = Record<string, string | number | undefined>
export type Argument = Partial<CSS> | RuntimeStyle | null | undefined | false
export type Media = { name: string; query: string }
export type Rule = (state: State, key: string) => State
export type State = { css: RuntimeStyle; greedy?: boolean; media?: Media[]; scope?: string; read?: (key: string) => State | undefined }
export type Chain = Func& RuntimeStyle & Utility & Native
