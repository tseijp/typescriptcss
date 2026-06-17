import { transform } from 'lightningcss'
import { klass, toBody } from './hash'
import { Decl, Sheet, Slot, Style } from './types'
const isEmpty = (style: Style): boolean => Object.keys(style).filter((key) => style[key] !== undefined && style[key] !== '').length === 0
const toDecl = (style: Style): Decl => {
        const id = klass(style)
        return { id, selector: `.${id}`, body: toBody(style) }
}
const stringify = (decls: Decl[]): string => decls.map((decl) => `${decl.selector} { ${decl.body} }`).join('\n')
const compress = (css: string, minify: boolean): string => {
        if (!minify || !css) return css
        const out = transform({ code: Buffer.from(css), minify: true, errorRecovery: true, filename: 'tcss.css' })
        return Buffer.from(out.code).toString()
}
export const createSheet = (minify: boolean): Sheet => {
        const heads = new Map<string, Decl>()
        const files = new Map<string, Decl>()
        const register = (store: Map<string, Decl>, style: Style) => {
                if (isEmpty(style)) return
                const decl = toDecl(style)
                if (!store.has(decl.id)) store.set(decl.id, decl)
        }
        const add = (slot: Slot) => {
                register(heads, slot.head)
                register(files, slot.file)
        }
        const head = () => compress(stringify([...heads.values()]), minify)
        const file = () => compress(stringify([...files.values()]), minify)
        const decls = () => [...heads.values(), ...files.values()]
        return { add, head, file, decls }
}
