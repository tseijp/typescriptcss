import type { Item, State } from './types.ts'

export const utility = new Set('bg block border col cols colStart css flex font grid h hidden inline inlineBlock items justify gap leading m max mb min ml mr mt mx my overflow p pb pl pr pt px py rounded size table text tracking w'.split(' '))
export const native = new Set('position zIndex top right bottom left width height minWidth maxWidth minHeight maxHeight fontSize fontFamily fontWeight lineHeight letterSpacing boxShadow background backgroundColor backgroundImage color colorScheme overflow overflowX overflowY textDecoration textTransform whiteSpace userSelect outline pointerEvents cursor transition opacity margin marginInline marginLeft marginRight marginTop marginBottom padding boxSizing alignSelf flexShrink flexGrow flexBasis gridTemplateColumns gridTemplateRows gridColumn gridRow borderBottom borderTop borderLeft borderRight borderLeftWidth borderColor borderWidth borderStyle borderRadius'.split(' '))
export const responsive = new Set('sm md lg xl'.split(' '))
export const pseudo = new Set('hover focus active visited focusWithin focusVisible first last odd even required invalid disabled checked readOnly has group peer peerHas hasChecked not before after placeholder selection nth'.split(' '))
export const conditions = new Set(['dark', ...responsive, ...pseudo])
export const roots = new Set([...utility, ...native, ...conditions])
export const scoped: Record<string, Set<string>> = {
        border: new Set('b collapse l r t x y'.split(' ')),
        col: new Set(['full']),
        cols: new Set(['subgrid']),
        flex: new Set('col nowrap row wrap'.split(' ')),
        font: new Set('bold medium normal sans semibold'.split(' ')),
        gap: new Set('x y'.split(' ')),
        items: new Set('center end start stretch'.split(' ')),
        justify: new Set('between center end start'.split(' ')),
        max: new Set('h w'.split(' ')),
        min: new Set('h w'.split(' ')),
        mx: new Set(['auto']),
        my: new Set(['auto']),
        overflow: new Set('auto hidden scroll visible'.split(' ')),
        rounded: new Set('none sm md lg xl full'.split(' ')),
        table: new Set('auto fixed'.split(' ')),
        text: new Set('base center left right sm xs'.split(' ')),
        tracking: new Set(['tight']),
}

export const stateOf = (name: string): State => {
        if (conditions.has(name)) return { condition: true, any: name === 'group' || name === 'peer' || name === 'nth' }
        if (name === 'bg') return { greedy: true }
        if (name === 'text') return { scope: 'text', greedy: true }
        if (name === 'border') return { scope: 'border', any: true }
        if ('flex items justify max min mx my overflow table tracking font gap rounded cols col'.split(' ').includes(name)) return { scope: name }
        if ('w h size'.split(' ').includes(name)) return { length: true }
        if ('leading m mb ml mr mt p pb pl pr pt px py colStart'.split(' ').includes(name)) return { number: true }
        if (native.has(name)) return { greedy: true }
        return { custom: true }
}

export const first = (unit: Item[]) => unit[0]?.type !== 'index' ? unit[0]?.name : ''

const raw = (unit: Item[]) => unit.find((item) => item.type === 'index')?.raw ?? ''
const numeric = (value: string) => /^\[\s*-?\d+(?:\.\d+)?\s*\]$/.test(value)

export const bucket = (unit: Item[]) => {
        const name = first(unit)
        const text = unit.map((item) => item.type === 'index' ? item.raw : item.name).join('.')
        const value = raw(unit)
        if (/`|\$\{/.test(text)) return 130
        if (!utility.has(name) && !native.has(name) && !conditions.has(name)) return 1
        if (['block', 'hidden', 'inline', 'inlineBlock', 'table', 'position'].includes(name)) return 20
        if (name === 'zIndex') return 31
        if (['m', 'mb', 'ml', 'mr', 'mt', 'mx', 'my', 'margin', 'marginInline', 'marginLeft', 'marginRight', 'marginTop', 'marginBottom'].includes(name)) return 32
        if (['p', 'pb', 'pl', 'pr', 'pt', 'px', 'py', 'padding'].includes(name)) return 33
        if (['w', 'width', 'minWidth', 'maxWidth', 'size'].includes(name) || /^m(in|ax)\.w/.test(text)) return 34
        if (['h', 'height', 'minHeight', 'maxHeight'].includes(name) || /^m(in|ax)\.h/.test(text)) return 35
        if (['top', 'right', 'bottom', 'left'].includes(name)) return 36
        if (['font', 'fontWeight', 'leading', 'lineHeight', 'letterSpacing'].includes(name)) return 37
        if (name === 'fontSize' || (name === 'text' && (numeric(value) || /^text\.(base|sm|xs)$/.test(text)))) return 38
        if (name === 'color' || (name === 'text' && value && !numeric(value))) return 39
        if (name === 'gap' || text.startsWith('gap.')) return 40
        if (name === 'flex') return 41
        if (['items', 'justify', 'flexShrink', 'flexGrow', 'flexBasis', 'alignSelf'].includes(name)) return 42
        if (name === 'grid') return 51
        if (['cols', 'col', 'colStart', 'gridTemplateColumns', 'gridTemplateRows', 'gridColumn', 'gridRow'].includes(name)) return 52
        if (['bg', 'background', 'backgroundColor', 'backgroundImage'].includes(name)) return 70
        if (name === 'rounded' || name === 'borderRadius') return 80
        if (name === 'border' || /^border/.test(name) || name === 'outline') return 90
        if (['pointerEvents', 'cursor', 'overflow', 'overflowX', 'overflowY', 'textDecoration', 'whiteSpace', 'textTransform', 'userSelect', 'colorScheme', 'boxSizing', 'transition'].includes(name)) return 100
        return 60
}
