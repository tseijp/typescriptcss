type StyleValue = string | number
type CSS = Partial<Record<Exclude<keyof CSSStyleDeclaration, 'cssText'> & string, StyleValue>>
type Func = (...styles: Argument[]) => RuntimeStyle
type Values = { [value: string]: Chain }
type Scale = { [value: number]: Chain } & { [value in `${number}`]: Chain }
type Unit = 'px' | 'rem' | 'em' | '%' | 'vw' | 'vh' | 'dvw' | 'dvh' | 'lvw' | 'lvh' | 'svw' | 'svh' | 'lh' | 'rlh' | 'ch' | 'ex' | 'cap' | 'ic' | 'vmin' | 'vmax' | 'cm' | 'mm' | 'in' | 'pt' | 'pc'
type LengthValue = `${number}${Unit}` | '0' | 'auto' | 'px' | 'full' | 'screen' | 'dvw' | 'dvh' | 'lvw' | 'lvh' | 'svw' | 'svh' | 'min' | 'max' | 'fit' | 'min-content' | 'max-content' | 'fit-content' | 'none'
type Length = Scale & { [value in LengthValue]: Chain }
type ColorFunction = 'alpha' | 'color' | 'color-mix' | 'contrast-color' | 'device-cmyk' | 'hsl' | 'hsla' | 'hwb' | 'lab' | 'lch' | 'light-dark' | 'oklab' | 'oklch' | 'rgb' | 'rgba'
type ColorLiteral = `#${string}` | `${ColorFunction}(${string})` | `var(${string})`
type ColorName = 'inherit' | 'current' | 'currentColor' | 'transparent' | 'black' | 'white' | 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone' | 'red' | 'orange' | 'amber' | 'yellow' | 'lime' | 'green' | 'emerald' | 'teal' | 'cyan' | 'sky' | 'blue' | 'indigo' | 'violet' | 'purple' | 'fuchsia' | 'pink' | 'rose'
type Color = Chain & Values & { [value in ColorLiteral | ColorName]: Chain }
type Axis<T = Length> = { x: T; y: T }
type Sides<T = Length> = { t: T; r: T; b: T; l: T; s: T; e: T; bs: T; be: T; x: T; y: T }
type Corner<T = Length> = { t: T; r: T; b: T; l: T; s: T; e: T; tl: T; tr: T; br: T; bl: T; ss: T; se: T; ee: T; es: T }
type AlignKeyword = 'flex-start' | 'flex-end' | 'safe center' | 'safe end' | 'safe flex-end' | 'last baseline'
type ContentKeyword = 'space-between' | 'space-be_een' | 'space-around' | 'space-evenly'
type Align = Chain & { center: Chain; end: Chain; start: Chain; stretch: Chain; normal: Chain; baseline: Chain } & { [value in AlignKeyword]: Chain }
type ContentAlign = Align & { [value in ContentKeyword]: Chain }
type PositionValue = Length & { auto: Chain }
type ObjectPositionKeyword = 'top left' | 'top right' | 'bottom left' | 'bottom right'
type ObjectPosition = Chain & Values & { top: Chain; right: Chain; bottom: Chain; left: Chain; center: Chain } & { [value in ObjectPositionKeyword]: Chain }
type Repeat = Chain & { repeat: Chain; 'repeat-x': Chain; 'repeat-y': Chain; space: Chain; round: Chain; 'no-repeat': Chain }
type Box = Chain & { 'border-box': Chain; 'padding-box': Chain; 'content-box': Chain }
type Track = Values & Scale & { auto: Chain; none: Chain; subgrid: Chain; 'min-content': Chain; 'max-content': Chain; 'minmax(0, 1fr)': Chain }
type GridLine = Values & Scale & { auto: Chain }
type GridArea = Values & Scale & { auto: Chain; full: Chain; span: Scale; start: GridLine; end: GridLine }
type Flex = Chain & Scale & { row: Chain; col: Chain; column: Chain; 'row-reverse': Chain; 'column-reverse': Chain; nowrap: Chain; wrap: Chain; 'wrap-reverse': Chain; auto: Chain; none: Chain; '0 auto': Chain }
type Font = Chain & Scale & { sans: Chain; serif: Chain; mono: Chain; bold: Chain; semibold: Chain; medium: Chain; normal: Chain; features: Values; stretch: Values & { 'ultra-condensed': Chain; 'extra-condensed': Chain; condensed: Chain; 'semi-condensed': Chain; normal: Chain; 'semi-expanded': Chain; expanded: Chain; 'extra-expanded': Chain; 'ultra-expanded': Chain } }
type Text = Color & Scale & { base: Chain; xs: Chain; sm: Chain; lg: Chain; xl: Chain; left: Chain; center: Chain; right: Chain; justify: Chain; start: Chain; end: Chain; ellipsis: Chain; clip: Chain; wrap: Chain; nowrap: Chain; balance: Chain; pretty: Chain; shadow: Values & Scale & { none: Chain } }
type Background = Color & { fixed: Chain; local: Chain; scroll: Chain; auto: Chain; cover: Chain; contain: Chain; blend: Blend; clip: Box & { text: Chain }; origin: Box; position: ObjectPosition; repeat: Repeat; size: Scale }
type Blend = Chain & { normal: Chain; multiply: Chain; screen: Chain; overlay: Chain; darken: Chain; lighten: Chain; 'color-dodge': Chain; 'color-burn': Chain; 'hard-light': Chain; 'soft-light': Chain; difference: Chain; exclusion: Chain; hue: Chain; saturation: Chain; color: Chain; luminosity: Chain; 'plus-darker': Chain; 'plus-lighter': Chain }
type BorderPart = Length & Color
type Border = Color & Length & Sides<BorderPart> & { collapse: Chain; separate: Chain; solid: Chain; dashed: Chain; dotted: Chain; double: Chain; hidden: Chain; none: Chain }
type Rounded = Chain & Length & { full: Chain } & Corner<Length & { full: Chain; none: Chain }>
type Outline = Color & Length & { solid: Chain; dashed: Chain; dotted: Chain; double: Chain; none: Chain; hidden: Chain; offset: Length & { auto: Chain } }
type Divide = Color & Length & Axis<Length> & { solid: Chain; dashed: Chain; dotted: Chain; double: Chain; hidden: Chain; none: Chain }
type Filter = Values & Scale & { none: Chain }
type FilterRoot = Filter & { grayscale: Chain; invert: Chain; sepia: Chain }
type Backdrop = Chain & { filter: Filter; blur: Filter; brightness: Filter; contrast: Filter; grayscale: Filter; invert: Filter; opacity: Filter; saturate: Filter; sepia: Filter; hue: { rotate: Filter } }
type Mask = Values & Scale & { none: Chain; add: Chain; subtract: Chain; intersect: Chain; exclude: Chain; alpha: Chain; luminance: Chain; 'match-source': Chain; auto: Chain; cover: Chain; contain: Chain; radial: Scale; clip: Box & { 'fill-box': Chain; 'stroke-box': Chain; 'view-box': Chain; 'no-clip': Chain }; origin: Box & { 'fill-box': Chain; 'stroke-box': Chain; 'view-box': Chain }; position: ObjectPosition; repeat: Repeat; size: Scale }
type Cursor = Values & { auto: Chain; default: Chain; pointer: Chain; wait: Chain; text: Chain; move: Chain; help: Chain; none: Chain; alias: Chain; copy: Chain; progress: Chain; cell: Chain; crosshair: Chain; grab: Chain; grabbing: Chain; not: { allowed: Chain }; context: { menu: Chain }; no: { drop: Chain }; all: { scroll: Chain }; col: { resize: Chain }; row: { resize: Chain }; vertical: { text: Chain }; zoom: { in: Chain; out: Chain }; n: { resize: Chain }; e: { resize: Chain }; s: { resize: Chain }; w: { resize: Chain }; ne: { resize: Chain }; nw: { resize: Chain }; se: { resize: Chain }; sw: { resize: Chain }; ew: { resize: Chain }; ns: { resize: Chain }; nesw: { resize: Chain }; nwse: { resize: Chain } }
type Scheme = Chain & { normal: Chain; dark: Chain; light: Chain & { dark: Chain }; only: { dark: Chain; light: Chain } }
type Scrollbar = Chain & { auto: Chain; thin: Chain; none: Chain; thumb: Color; track: Color; gutter: { auto: Chain; stable: Chain; both: Chain } }
type Snap = Chain & { start: Chain; end: Chain; center: Chain; none: Chain; normal: Chain; always: Chain; align: { none: Chain } }
type Touch = Chain & { auto: Chain; none: Chain; manipulation: Chain; pan: { x: Chain; left: Chain; right: Chain; y: Chain; up: Chain; down: Chain }; pinch: { zoom: Chain } }
type Origin = Values & { center: Chain; top: Chain & { right: Chain; left: Chain }; right: Chain; bottom: Chain & { right: Chain; left: Chain }; left: Chain }
type Size = Length & { auto: Chain; px: Chain; full: Chain; screen: Chain; dvw: Chain; dvh: Chain; lvw: Chain; lvh: Chain; svw: Chain; svh: Chain; min: Chain; max: Chain; fit: Chain }
type Transition = Values & Scale & { all: Chain; opacity: Chain; shadow: Chain; transform: Chain; none: Chain; normal: Chain; discrete: Chain }
type Ease = Values & { linear: Chain; in: Chain & { out: Chain }; out: Chain; initial: Chain }
type Transform = Values & Scale & { none: Chain; '3d': Chain; flat: Chain }
type Translate = Transform & { x: Length; y: Length; full: Chain; px: Chain }
type Skew = Transform & { x: Scale; y: Scale }
type Break = Chain & { after: Values; before: Values; inside: Values; normal: Chain; 'break-all': Chain; 'keep-all': Chain }
type Native = { [K in Exclude<keyof CSS & string, keyof Utility>]: Values }
export type RuntimeStyle = CSS & Record<string, StyleValue>
export type Argument = RuntimeStyle | null | undefined | false
export type Rule = (state: State) => State
export type State = { css: RuntimeStyle; dark?: boolean; greedy?: boolean; read?: (key: string) => State | undefined; scope?: string; wraps?: string[] }
export type Chain = Func & Utility & Native
export type Utility = {
        absolute: Chain
        fixed: Chain
        relative: Chain
        static: Chain
        block: Chain
        hidden: Chain
        inline: Chain & { block: Chain; flex: Chain }
        inlineBlock: Chain
        inlineFlex: Chain
        grid: Chain & { cols: Track; rows: Track; flow: Values }
        flex: Flex
        table: Chain & { auto: Chain; fixed: Chain }
        display: Values
        position: Values
        float: Values
        clear: Values
        isolation: Values
        visibility: Values
        container: Chain
        active: Chain
        after: Chain
        aria: Chain
        ariaChecked: Chain
        ariaDisabled: Chain
        ariaExpanded: Chain
        ariaSelected: Chain
        atLg: Chain
        atMd: Chain
        atSm: Chain
        autofill: Chain
        before: Chain
        checked: Chain
        child: Chain
        contrastLess: Chain
        contrastMore: Chain
        css: Chain
        dark: Chain
        data: Chain
        dataActive: Chain
        descendant: Chain
        disabled: Chain
        empty: Chain
        enabled: Chain
        even: Chain
        file: Chain
        first: Chain
        firstLetter: Chain
        firstLine: Chain
        firstOfType: Chain
        focus: Chain
        focusVisible: Chain
        focusWithin: Chain
        forcedColors: Chain
        group: Chain
        groupFocus: Chain
        groupHover: Chain
        has: Chain
        hover: Chain
        indeterminate: Chain
        invalid: Chain
        landscape: Chain
        last: Chain
        lastOfType: Chain
        lg: Chain
        light: Chain
        ltr: Chain
        maxMd: Chain
        maxSm: Chain
        md: Chain
        motionReduce: Chain
        motionSafe: Chain
        odd: Chain
        only: Chain
        onlyOfType: Chain
        optional: Chain
        peer: Chain
        peerFocus: Chain
        peerHover: Chain
        placeholder: Chain
        placeholderShown: Chain
        pointerCoarse: Chain
        pointerFine: Chain
        portrait: Chain
        prefersDark: Chain
        print: Chain
        readOnly: Chain
        required: Chain
        rtl: Chain
        selection: Chain
        sm: Chain
        supports: Chain
        target: Chain
        valid: Chain
        visited: Chain
        xl: Chain
        xl2: Chain
        accent: Color
        align: Values
        animate: Values & { spin: Chain; ping: Chain; pulse: Chain; bounce: Chain; none: Chain }
        appearance: Values & { none: Chain; auto: Chain }
        aspect: Values & Scale & { auto: Chain; video: Chain }
        auto: Chain & { cols: Track; rows: Track }
        backdrop: Backdrop
        backface: Values
        basis: Length
        bg: Background
        border: Border
        bottom: PositionValue
        box: Chain & { decoration: { clone: Chain; slice: Chain }; 'border-box': Chain; 'content-box': Chain }
        break: Break
        brightness: Filter
        caption: Values
        caret: Color
        col: GridArea
        columns: Values & Scale & { auto: Chain }
        color: Color
        cols: Track
        colStart: GridLine
        content: Values & ContentAlign & { none: Chain }
        contrast: Filter
        cursor: Cursor
        decoration: Color & Values
        delay: Scale
        divide: Divide
        duration: Scale & { initial: Chain }
        ease: Ease
        end: PositionValue
        field: Chain & { sizing: { fixed: Chain; content: Chain } }
        fill: Color
        filter: FilterRoot
        flow: Values
        font: Font
        forcedColorAdjust: Values
        from: Color
        gap: Scale & Axis<Scale>
        grayscale: Filter
        grow: Values & Scale
        h: Size
        height: Size
        hue: Chain & { rotate: Filter }
        hyphens: Values
        indent: Length
        inset: PositionValue & Axis<PositionValue>
        invert: Filter
        items: Align
        justify: ContentAlign & { items: Align; self: Align }
        leading: Scale
        left: PositionValue
        line: { clamp: Scale & { none: Chain } }
        list: Values & { image: Values & { none: Chain }; inside: Chain; outside: Chain; disc: Chain; decimal: Chain; none: Chain }
        m: Length
        margin: Length
        marker: Chain
        mask: Mask
        max: Chain & { h: Size; w: Size; size: Size }
        mb: Length
        me: Length
        min: Chain & { h: Size; w: Size; size: Size }
        mix: { blend: Blend }
        ml: Length
        mr: Length
        ms: Length
        mt: Length
        mx: Length & { auto: Chain }
        my: Length & { auto: Chain }
        none: Chain
        normal: Chain
        not: Chain & { sr: { only: Chain } }
        notSr: { only: Chain }
        object: Values & ObjectPosition
        opacity: Scale
        order: Values & Scale
        origin: Origin
        outline: Outline
        overflow: Values & Axis<Values>
        overscroll: Values & Axis<Values>
        p: Length
        padding: Length
        pb: Length
        pe: Length
        perspective: Values & Scale & { origin: Origin }
        place: { content: ContentAlign; items: Align; self: Align }
        pl: Length
        pointer: { events: { auto: Chain; none: Chain } }
        pr: Length
        ps: Length
        pt: Length
        px: Length
        py: Length
        resize: Values
        right: PositionValue
        rotate: Transform
        rounded: Rounded
        row: GridArea
        rows: Track
        saturate: Filter
        scale: Transform
        scheme: Scheme
        scroll: Values
        scrollbar: Scrollbar
        select: Values
        self: Align
        sepia: Filter
        shadow: Values & Scale & { none: Chain; lg: Chain }
        shrink: Values & Scale
        size: Size
        skew: Skew
        snap: Snap
        sr: { only: Chain }
        start: PositionValue
        stroke: Color
        subpixel: { antialiased: Chain }
        tab: Scale
        text: Text
        to: Color
        top: PositionValue
        touch: Touch
        tracking: Scale & Values
        transform: Transform
        transition: Transition
        translate: Translate
        underline: Chain & { offset: Length & { auto: Chain } }
        w: Size
        whitespace: Values
        width: Size
        will: { change: Values }
        wrap: Values
        z: Values & Scale & { auto: Chain }
        zoom: Values & Scale
        antialiased: Chain
        capitalize: Chain
        italic: Chain
        lineThrough: Chain
        liningNums: Chain
        lowercase: Chain
        oldstyleNums: Chain
        ordinal: Chain
        overline: Chain
        proportionalNums: Chain
        slashedZero: Chain
        stackedFractions: Chain
        tabularNums: Chain
        truncate: Chain
        uppercase: Chain
}
