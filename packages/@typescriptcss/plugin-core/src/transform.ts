import { Node, Project, SyntaxKind } from 'ts-morph'
import { emptyBlock, hasMedia, inlineCss } from './css'
import { evaluateChain } from './utility'
import { ChainPart, CssBlock, CssTarget, EmitClass, TransformResult, TypescriptcssOptions } from './types'
type Section = { block: CssBlock; target: CssTarget }
type TransformContext = { emitClass: EmitClass; options: TypescriptcssOptions }
const baseTarget = (output: TypescriptcssOptions['output']): CssTarget => (output === 'file' || output === 'inline' ? output : 'head')
const stringValue = (node: Node | undefined) => {
        if (!node) return undefined
        if (Node.isStringLiteral(node) || Node.isNoSubstitutionTemplateLiteral(node)) return node.getLiteralText()
        if (Node.isNumericLiteral(node)) return node.getText()
        return undefined
}
const chainParts = (node: Node): ChainPart[] | null => {
        if (Node.isIdentifier(node)) return [{ type: 'name', value: node.getText() }]
        if (Node.isPropertyAccessExpression(node)) {
                const left = chainParts(node.getExpression())
                if (!left) return null
                return [...left, { type: 'name', value: node.getName() }]
        }
        if (Node.isElementAccessExpression(node)) {
                const left = chainParts(node.getExpression())
                const value = stringValue(node.getArgumentExpression())
                if (!left || value === undefined) return null
                return [...left, { type: 'value', value }]
        }
        return null
}
const splitParts = (parts: ChainPart[], output: TypescriptcssOptions['output']): Section[] | null => {
        const index = parts.findIndex((part) => part.type === 'name' && part.value === 'css')
        const head = index < 0 ? parts : parts.slice(0, index)
        const file = index < 0 ? [] : parts.slice(index + 1)
        const sections = [
                { parts: head, target: baseTarget(output) },
                { parts: file, target: 'file' as CssTarget },
        ].filter((section) => section.parts.length)
        const built = sections.map((section) => ({ block: evaluateChain(section.parts), target: section.target }))
        if (built.some((section) => !section.block)) return null
        const active = built.map((section) => ({ block: section.block as CssBlock, target: section.target })).filter((section) => !emptyBlock(section.block))
        if (!active.length) return null
        return active
}
const styleExpr = (block: CssBlock | null, args: Node[]) => {
        const entries = block ? Object.entries(inlineCss(block)).map(([key, value]) => `${JSON.stringify(key)}:${JSON.stringify(value)}`) : []
        const spreads = args.map((arg) => `...(${arg.getText()} || {})`)
        if (!entries.length && !spreads.length) return null
        return `({${[...entries, ...spreads].join(',')}})`
}
const attrName = (attr: any) => (Node.isJsxAttribute(attr) ? attr.getNameNode().getText() : '')
const classText = (classes: string[]) => classes.join(' ')
const setClass = (attr: any, classes: string[]) => {
        if (!classes.length) return
        const element = attr.getParent().getParent()
        const current = element.getAttributes().find((item: any) => attrName(item) === 'className')
        const value = classText(classes)
        if (!current) return element.addAttribute({ name: 'className', initializer: JSON.stringify(value) })
        const init = current.getInitializer()
        if (!init) return current.setInitializer(JSON.stringify(value))
        if (Node.isStringLiteral(init)) return current.setInitializer(JSON.stringify(`${init.getLiteralText()} ${value}`))
        if (Node.isJsxExpression(init) && init.getExpression()) return current.setInitializer(`{[${init.getExpression()?.getText()}, ${JSON.stringify(value)}].filter(Boolean).join(' ')}`)
        return current.setInitializer(JSON.stringify(value))
}
const setStyle = (attr: any, expr: string | null) => {
        if (!expr) return attr.remove()
        return attr.setInitializer(`{${expr}}`)
}
const transformStyle = (attr: any, context: TransformContext) => {
        const init = attr.getInitializer()
        if (!init || !Node.isJsxExpression(init)) return false
        const call = init.getExpression()
        if (!call || !Node.isCallExpression(call)) return false
        const parts = chainParts(call.getExpression())
        if (!parts) return false
        const sections = splitParts(parts, context.options.output)
        if (!sections) return false
        const inline = sections.find((section) => section.target === 'inline')?.block ?? null
        if (inline && hasMedia(inline)) return false
        const classes = sections.filter((section) => section.target !== 'inline').map((section) => context.emitClass(section.block, section.target as Exclude<CssTarget, 'inline'>))
        setClass(attr, classes)
        setStyle(attr, styleExpr(inline, call.getArguments()))
        return true
}
export const transformSource = (code: string, id: string, context: TransformContext): TransformResult | null => {
        if (!/\.[cm]?[jt]sx?$/.test(id)) return null
        const project = new Project({ useInMemoryFileSystem: true, compilerOptions: { allowJs: true, jsx: 1 } as any })
        const source = project.createSourceFile(id.replace(/[^\w.-]/g, '_'), code, { overwrite: true })
        let changed = false
        for (const attr of source.getDescendantsOfKind(SyntaxKind.JsxAttribute)) {
                if (attrName(attr) !== 'style') continue
                changed = transformStyle(attr, context) || changed
        }
        if (!changed) return null
        return { changed, code: source.getFullText(), map: null }
}
