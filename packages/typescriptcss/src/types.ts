type CSS = Partial<Record<Exclude<keyof CSSStyleDeclaration, 'cssText'> & string, any>>
type Scale = { [value: number]: Chain }
type Screen = Scale & { full: Chain; screen: Chain; dvh: Chain }
type ColorFunction = 'alpha' | 'color' | 'color-mix' | 'contrast-color' | 'device-cmyk' | 'hsl' | 'hsla' | 'hwb' | 'lab' | 'lch' | 'light-dark' | 'oklab' | 'oklch' | 'rgb' | 'rgba'
type Color = {
        [value: string]: Chain
        [value: `#${string}` | `${ColorFunction}(${string})` | `var(${string})`]: Chain
        black: Chain
        currentColor: Chain
        transparent: Chain
        white: Chain
}
type Native = { [K in Exclude<keyof CSS & string, keyof Utility>]: { [value: string]: Chain } }
type Side = Chain & Scale
type Values = { [value: string]: Chain }
export type Utility = {
        absolute: Chain
        auto: { cols: Scale }
        bg: Color
        block: Chain
        border: Chain & Color & { b: Side; collapse: Chain; l: Side; r: Side; t: Side; x: Side; y: Side }
        col: Chain & Scale & { full: Chain; span: Scale }
        cols: Scale & { subgrid: Chain; [value: string]: Chain }
        colStart: Scale & { [value: string]: Chain }
        content: { center: Chain; end: Chain; start: Chain; stretch: Chain }
        css: Chain
        dark: Chain
        flex: Chain & Scale & { col: Chain; nowrap: Chain; row: Chain; wrap: Chain }
        flow: { col: Chain; row: Chain }
        font: Scale & { bold: Chain; medium: Chain; normal: Chain; sans: Chain; semibold: Chain }
        gap: Scale & { x: Scale; y: Scale }
        grid: Chain
        h: Screen
        hidden: Chain
        inline: Chain & { block: Chain; flex: Chain }
        inlineBlock: Chain
        inlineFlex: Chain
        inset: Scale & Values
        items: { center: Chain; end: Chain; start: Chain; stretch: Chain }
        justify: { between: Chain; center: Chain; end: Chain; items: { center: Chain; end: Chain; start: Chain; stretch: Chain }; start: Chain }
        leading: Scale
        left: Scale & Values
        m: Scale
        max: { h: Screen; w: Screen }
        mb: Scale
        md: Chain
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
        place: { items: { center: Chain; end: Chain; start: Chain; stretch: Chain } }
        pointer: { events: { auto: Chain; none: Chain } }
        relative: Chain
        rounded: Chain & Scale & { full: Chain }
        size: Screen
        sm: Chain
        table: Chain & { auto: Chain; fixed: Chain }
        text: Scale & Color & { base: Chain; center: Chain; left: Chain; right: Chain; sm: Chain; xs: Chain }
        tracking: { tight: Chain }
        top: Scale & Values
        translate: { x: Values; y: Values }
        w: Screen
}
type Func = (...styles: Argument[]) => CSS
export type RuntimeStyle = Record<string, any>
export type Argument = RuntimeStyle | null | undefined | false
export type Rule = (state: State, key: string) => State
export type State = { css: RuntimeStyle; dark?: boolean; greedy?: boolean; media?: string; scope?: string; read?: (key: string) => State | undefined }
export type Chain = Func & Utility & Native
