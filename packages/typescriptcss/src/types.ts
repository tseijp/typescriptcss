type PrimitiveStyleValue = string | number
type StyleValue = PrimitiveStyleValue | { [key: string]: StyleValue }
type CSSKey = Exclude<keyof CSSStyleDeclaration, 'cssText'> & string
type CSS = Partial<Record<CSSKey, PrimitiveStyleValue>>
type StyleObject = {}
type Func = (...styles: Argument[]) => StyleObject
type ValueFunc = (value: string | number) => StyleObject
type Values = { [value: string]: C }
type Scale = { [value: number]: C } & { [value in `${number}`]: C }
type Unit = 'px' | 'rem' | 'em' | '%' | 'vw' | 'vh' | 'dvw' | 'dvh' | 'lvw' | 'lvh' | 'svw' | 'svh' | 'lh' | 'rlh' | 'ch' | 'ex' | 'cap' | 'ic' | 'vmin' | 'vmax' | 'cm' | 'mm' | 'in' | 'pt' | 'pc'
type LengthValue = `${number}${Unit}` | '0' | 'auto' | 'px' | 'full' | 'screen' | 'dvw' | 'dvh' | 'lvw' | 'lvh' | 'svw' | 'svh' | 'min' | 'max' | 'fit' | 'min-content' | 'max-content' | 'fit-content' | 'none'
type Length = Scale & { [value in LengthValue]: C }
type ColorFunction = 'alpha' | 'color' | 'color-mix' | 'contrast-color' | 'device-cmyk' | 'hsl' | 'hsla' | 'hwb' | 'lab' | 'lch' | 'light-dark' | 'oklab' | 'oklch' | 'rgb' | 'rgba'
type ColorLiteral = `#${string}` | `${ColorFunction}(${string})` | `var(${string})`
type ColorName = 'inherit' | 'current' | 'currentColor' | 'transparent' | 'black' | 'white' | 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone' | 'red' | 'orange' | 'amber' | 'yellow' | 'lime' | 'green' | 'emerald' | 'teal' | 'cyan' | 'sky' | 'blue' | 'indigo' | 'violet' | 'purple' | 'fuchsia' | 'pink' | 'rose'
type Color = C & Values & { [value in ColorLiteral | ColorName]: C }
type Axis<T = Length> = { x: T; y: T }
type Sides<T = Length> = { t: T; r: T; b: T; l: T; s: T; e: T; bs: T; be: T; x: T; y: T }
type InsetSides<T = Length> = { x: T; y: T; s: T; e: T; bs: T; be: T }
type Corner<T = Length> = { t: T; r: T; b: T; l: T; s: T; e: T; tl: T; tr: T; br: T; bl: T; ss: T; se: T; ee: T; es: T }
type AlignKeyword = 'flex-start' | 'flex-end' | 'safe center' | 'safe end' | 'safe flex-end' | 'last baseline'
type SafeC = C & { safe: C }
type LastC = C & { last: C }
type Align = C & { center: SafeC; end: SafeC; start: C; stretch: C; normal: C; baseline: LastC } & { [value in AlignKeyword]: C }
type AlignContent = C & { normal: C; center: C; start: C; end: C; between: C; around: C; evenly: C; baseline: C; stretch: C }
type JustifyContent = C & { start: C; end: SafeC; center: SafeC; between: C; around: C; evenly: C; stretch: C; baseline: C; normal: C }
type PlaceContent = C & { center: SafeC; start: C; end: SafeC; between: C; around: C; evenly: C; baseline: C; stretch: C; normal: C }
type PositionValue = Length & { auto: C }
type ObjectPositionKeyword = 'top left' | 'top right' | 'bottom left' | 'bottom right'
type ObjectPositionEdge = C & { left: C; right: C }
type ObjectPosition = C & Values & { contain: C; cover: C; fill: C; none: C; top: ObjectPositionEdge; right: C; bottom: ObjectPositionEdge; left: C; center: C; scale: C & { down: C } } & { [value in ObjectPositionKeyword]: C }
type Repeat = C & { repeat: C; 'repeat-x': C; 'repeat-y': C; space: C; round: C; 'no-repeat': C }
type Box = C & { 'border-box': C; 'padding-box': C; 'content-box': C }
type Track = Values & Scale & { auto: C; none: C; subgrid: C; min: C; max: C; fr: C; 'min-content': C; 'max-content': C; 'minmax(0, 1fr)': C }
type GridLine = Values & Scale & { auto: C }
type GridSpan = Scale & { full: C }
type GridArea = Values & Scale & { auto: C; span: GridSpan; start: GridLine; end: GridLine }
type GridRowArea = Values & Scale & { auto: C; full: C; span: Scale; start: GridLine; end: GridLine }
type ReverseC = C & { reverse: C }
type DenseC = C & { dense: C }
type FlexScale = { [value: number]: Flex } & { [value in `${number}`]: Flex }
type Flex = C & FlexScale & { row: ReverseC; col: ReverseC; column: ReverseC; 'row-reverse': C; 'column-reverse': C; nowrap: C; wrap: ReverseC; 'wrap-reverse': C; auto: C; initial: C; none: C; '0 auto': C }
type Flow = Values & { root: C; row: DenseC; column: DenseC; col: DenseC; dense: C }
type TableGroup = C & { group: C }
type Table = C & { auto: C; fixed: C; caption: C; cell: C; column: TableGroup; footer: TableGroup; header: TableGroup; row: TableGroup }
type Grid = C & { cols: Track; rows: Track; flow: Flow }
type Inline = C & Size & { block: C; flex: Flex; grid: Grid; table: Table }
type Font = C & Scale & { sans: C; serif: C; mono: C; bold: C; semibold: C; medium: C; normal: C; features: Values; stretch: Values & { 'ultra-condensed': C; 'extra-condensed': C; condensed: C; 'semi-condensed': C; normal: C; 'semi-expanded': C; expanded: C; 'extra-expanded': C; 'ultra-expanded': C } }
type Text = Color & Scale & { base: C; xs: C; sm: C; lg: C; xl: C; left: C; center: C; right: C; justify: C; start: C; end: C; ellipsis: C; clip: C; wrap: C; nowrap: C; balance: C; pretty: C; shadow: Values & Scale & { none: C } }
type Background = Color & { fixed: C; local: C; scroll: C; auto: C; cover: C; contain: C; blend: Blend; clip: Box & { text: C }; origin: Box; position: ObjectPosition; repeat: Repeat; size: Scale }
type Blend = C & { normal: C; multiply: C; screen: C; overlay: C; darken: C; lighten: C; 'color-dodge': C; 'color-burn': C; 'hard-light': C; 'soft-light': C; difference: C; exclusion: C; hue: C; saturation: C; color: C; luminosity: C; 'plus-darker': C; 'plus-lighter': C }
type BorderPart = Length & Color
type Border = Color & Length & Sides<BorderPart> & { collapse: C; separate: C; solid: C; dashed: C; dotted: C; double: C; hidden: C; none: C }
type Rounded = C & Length & { full: C } & Corner<Length & { full: C; none: C }>
type Outline = Color & Length & { solid: C; dashed: C; dotted: C; double: C; none: C; hidden: C; offset: Length & { auto: C } }
type Divide = Color & Length & Axis<Length> & { solid: C; dashed: C; dotted: C; double: C; hidden: C; none: C }
type Filter = Values & Scale & { none: C }
type FilterRoot = Filter & { grayscale: C; invert: C; sepia: C }
type Backdrop = C & { filter: Filter; blur: Filter; brightness: Filter; contrast: Filter; grayscale: Filter; invert: Filter; opacity: Filter; saturate: Filter; sepia: Filter; hue: { rotate: Filter } }
type Mask = Values & Scale & { none: C; add: C; subtract: C; intersect: C; exclude: C; alpha: C; luminance: C; 'match-source': C; auto: C; cover: C; contain: C; radial: Scale; clip: Box & { 'fill-box': C; 'stroke-box': C; 'view-box': C; 'no-clip': C }; origin: Box & { 'fill-box': C; 'stroke-box': C; 'view-box': C }; position: ObjectPosition; repeat: Repeat; size: Scale }
type Cursor = Values & { auto: C; default: C; pointer: C; wait: C; text: C; move: C; help: C; none: C; alias: C; copy: C; progress: C; cell: C; crosshair: C; grab: C; grabbing: C; not: { allowed: C }; context: { menu: C }; no: { drop: C }; all: { scroll: C }; col: { resize: C }; row: { resize: C }; vertical: { text: C }; zoom: { in: C; out: C }; n: { resize: C }; e: { resize: C }; s: { resize: C }; w: { resize: C }; ne: { resize: C }; nw: { resize: C }; se: { resize: C }; sw: { resize: C }; ew: { resize: C }; ns: { resize: C }; nesw: { resize: C }; nwse: { resize: C } }
type Scheme = C & { normal: C; dark: C; light: C & { dark: C }; only: { dark: C; light: C } }
type Scrollbar = C & { auto: C; thin: C; none: C; thumb: Color; track: Color; gutter: { auto: C; stable: C; both: C } }
type Snap = C & { start: C; end: C; center: C; none: C; normal: C; always: C; align: { none: C } }
type Touch = C & { auto: C; none: C; manipulation: C; pan: { x: C; left: C; right: C; y: C; up: C; down: C }; pinch: { zoom: C } }
type Origin = Values & { center: C; top: C & { right: C; left: C }; right: C; bottom: C & { right: C; left: C }; left: C }
type Size = Length & { auto: C; px: C; full: C; screen: C; dvw: C; dvh: C; lvw: C; lvh: C; svw: C; svh: C; min: C; max: C; fit: C }
type Block = C & Size
type Transition = Values & Scale & { all: C; opacity: C; shadow: C; transform: C; none: C; normal: C; discrete: C }
type Ease = Values & { linear: C; in: C & { out: C }; out: C; initial: C }
type Transform = Values & Scale & { none: C; '3d': C; flat: C }
type Translate = Transform & { x: Length; y: Length; full: C; px: C }
type Skew = Transform & { x: Scale; y: Scale }
type BreakAvoid = C & { page: C; column: C }
type BreakValues = Values & { auto: C; avoid: BreakAvoid; all: C; page: C; left: C; right: C; column: C; 'avoid-page': C; 'avoid-column': C }
type Break = C & { after: BreakValues; before: BreakValues; inside: BreakValues; normal: C; 'break-all': C; 'keep-all': C }
type Native = { [K in Exclude<CSSKey, keyof U>]: Values }
export type RuntimeStyle = CSS & Record<string, StyleValue>
export type Argument = RuntimeStyle | string | number | null | undefined | false
export type Rule = (state: State) => State
export type State = { call?: (key: string) => State | undefined; css: RuntimeStyle; dark?: boolean; greedy?: boolean; read?: (key: string) => State | undefined; scope?: string; wraps?: string[] }
export type C = Func & U & Native
export type U = {
        absolute: C
        blur: C
        fixed: C
        relative: C
        sticky: C
        static: C
        block: Block
        contents: C
        hidden: C
        inline: Inline
        inlineBlock: C
        inlineFlex: C
        grid: Grid
        flex: Flex
        table: Table
        display: Values
        position: Values
        float: Values
        clear: Values
        isolation: Values
        isolate: C
        visibility: Values
        visible: C
        invisible: C
        collapse: C
        container: C
        active: C
        after: C
        aria: C
        ariaChecked: C
        ariaDisabled: C
        ariaExpanded: C
        ariaSelected: C
        atLg: C
        atMd: C
        atSm: C
        autofill: C
        before: C
        checked: C
        child: C
        contrastLess: C
        contrastMore: C
        css: C
        dark: C
        data: C
        dataActive: C
        descendant: C
        disabled: C
        empty: C
        enabled: C
        even: C
        file: C
        first: C
        firstLetter: C
        firstLine: C
        firstOfType: C
        focus: C
        focusVisible: C
        focusWithin: C
        forcedColors: C
        group: C
        groupFocus: C
        groupHover: C
        has: C
        hover: C
        indeterminate: C
        invalid: C
        landscape: C
        last: C
        lastOfType: C
        lg: C
        light: C
        ltr: C
        maxMd: C
        maxSm: C
        md: C
        motionReduce: C
        motionSafe: C
        odd: C
        only: C
        onlyOfType: C
        optional: C
        peer: C
        peerFocus: C
        peerHover: C
        placeholder: C
        placeholderShown: C
        pointerCoarse: C
        pointerFine: C
        portrait: C
        prefersDark: C
        print: C
        readOnly: C
        required: C
        rtl: C
        selection: C
        sm: C
        supports: C
        target: C
        valid: C
        visited: C
        xl: C
        xl2: C
        accent: Color
        align: Values
        animate: Values & { spin: C; ping: C; pulse: C; bounce: C; none: C }
        appearance: Values & { none: C; auto: C }
        aspect: Values & Scale & { auto: C; square: C; video: C }
        auto: C & { cols: Track; rows: Track }
        backdrop: Backdrop
        backface: Values
        basis: Length
        bg: Background
        border: Border
        bottom: PositionValue
        box: C & { decoration: { clone: C; slice: C }; border: C; content: C; 'border-box': C; 'content-box': C }
        break: Break
        brightness: Filter
        caption: Values
        caret: Color
        col: GridArea
        columns: Values & Scale & { auto: C }
        color: Color
        cols: Track
        colStart: GridLine
        content: Values & AlignContent & { none: C }
        contrast: Filter
        cursor: Cursor
        decoration: Color & Values
        delay: Scale
        divide: Divide
        duration: Scale & { initial: C }
        ease: Ease
        end: PositionValue
        field: C & { sizing: { fixed: C; content: C } }
        fill: Color
        filter: FilterRoot
        flow: Flow
        font: Font
        forcedColorAdjust: Values
        from: Color
        gap: Scale & ValueFunc & Axis<Scale & ValueFunc>
        grayscale: Filter
        grow: C & Scale
        h: Size
        height: Size
        hue: C & { rotate: Filter }
        hyphens: Values
        indent: Length
        inset: PositionValue & InsetSides<PositionValue>
        invert: Filter
        items: Align
        justify: JustifyContent & { items: Align; self: Align }
        leading: Scale
        left: PositionValue
        line: { clamp: Scale & { none: C } }
        list: Values & { image: Values & { none: C }; inside: C; outside: C; disc: C; decimal: C; item: C; none: C }
        m: Length
        margin: Length
        marker: C
        mask: Mask
        max: C & { block: Size; h: Size; inline: Size; w: Size; size: Size }
        mb: Length
        mbe: Length
        mbs: Length
        me: Length
        min: C & { block: Size; h: Size; inline: Size; w: Size; size: Size }
        mix: { blend: Blend }
        ml: Length
        mr: Length
        ms: Length
        mt: Length
        mx: Length & { auto: C }
        my: Length & { auto: C }
        none: C
        normal: C
        not: C & { sr: { only: C } }
        notSr: { only: C }
        object: Values & ObjectPosition
        opacity: Scale
        order: Values & Scale & { first: C; last: C; none: C }
        origin: Origin
        outline: Outline
        overflow: Values & Axis<Values>
        overscroll: Values & Axis<Values>
        p: Length
        padding: Length
        pb: Length
        pbe: Length
        pbs: Length
        pe: Length
        perspective: Values & Scale & { origin: Origin }
        place: { content: PlaceContent; items: Align; self: Align }
        pl: Length
        pointer: { events: { auto: C; none: C } }
        pr: Length
        ps: Length
        pt: Length
        px: Length
        py: Length
        resize: Values
        right: PositionValue
        rotate: Transform
        rounded: Rounded
        row: GridRowArea
        rows: Track
        saturate: Filter
        scale: Transform
        scheme: Scheme
        scroll: Values
        scrollbar: Scrollbar
        select: Values
        self: Align
        sepia: Filter
        shadow: Values & Scale & { none: C; lg: C }
        shrink: C & Scale
        size: Size
        skew: Skew
        snap: Snap
        sr: { only: C }
        start: PositionValue
        stroke: Color
        subpixel: { antialiased: C }
        tab: Scale
        text: Text
        to: Color
        top: PositionValue
        touch: Touch
        tracking: Scale & Values
        transform: Transform
        transition: Transition
        translate: Translate
        underline: C & { offset: Length & { auto: C } }
        w: Size
        whitespace: Values
        width: Size
        will: { change: Values }
        wrap: Values
        z: Values & Scale & { auto: C }
        zoom: Values & Scale
        antialiased: C
        capitalize: C
        italic: C
        lineThrough: C
        liningNums: C
        lowercase: C
        oldstyleNums: C
        ordinal: C
        overline: C
        proportionalNums: C
        slashedZero: C
        stackedFractions: C
        tabularNums: C
        truncate: C
        uppercase: C
}
