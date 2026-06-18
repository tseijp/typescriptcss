import { Node, SyntaxKind } from 'ts-morph'
import type { CssTarget, EmitClass, RuntimeStyle, TransformResult, TypescriptcssOptions } from '../types.ts'
import { createStyleTools } from './style.ts'
import { createValueResolver } from './resolver.ts'
type Part = { type: 'name' | 'value'; value: string }
export const createTransformer = (options: TypescriptcssOptions, emitClass: EmitClass) => {
        const tools = createStyleTools()
        const resolver = createValueResolver(options.root ?? process.cwd())
        const baseTarget = () => (options.output === 'file' || options.output === 'inline' ? options.output : 'head')
        const attrName = (attr: any) => Node.isJsxAttribute(attr) ? attr.getNameNode().getText() : ''
        const partsOf = (node: Node, env: Record<string, any>): Part[] | null => {
                if (Node.isIdentifier(node)) return [{ type: 'name', value: node.getText() }]
                if (Node.isPropertyAccessExpression(node)) {
                        const left = partsOf(node.getExpression(), env)
                        if (!left) return null
                        return [...left, { type: 'name', value: node.getName() }]
                }
                if (!Node.isElementAccessExpression(node)) return null
                const left = partsOf(node.getExpression(), env)
                const value = resolver.value(node.getArgumentExpression(), env)
                if (!left || value === undefined) return null
                return [...left, { type: 'value', value: String(value) }]
        }
        const run = (parts: Part[], env: Record<string, any>): RuntimeStyle | null => {
                if (!parts.length || parts[0].type !== 'name') return null
                let chain = env[parts[0].value]
                for (const part of parts.slice(1)) {
                        if (!chain) return null
                        chain = chain[part.value]
                }
                if (typeof chain !== 'function') return null
                return chain()
        }
        const sections = (parts: Part[], env: Record<string, any>) => {
                const index = parts.findIndex((part) => part.type === 'name' && part.value === 'css')
                const items = [{ parts: index < 0 ? parts : parts.slice(0, index), target: baseTarget() as CssTarget }, { parts: index < 0 ? [] : parts.slice(index + 1), target: 'file' as CssTarget }]
                return items.flatMap((item) => {
                        const style = run(item.parts, env)
                        if (!style) return []
                        const block = tools.block(style)
                        if (tools.empty(block)) return []
                        return [{ block, target: item.target, style }]
                })
        }
        const styleText = (style: RuntimeStyle | null, args: Node[]) => {
                const entries = style ? Object.entries(tools.clean(style)).map(([key, value]) => `${JSON.stringify(key)}:${JSON.stringify(value)}`) : []
                const spreads = args.map((arg) => `...(${arg.getText()} || {})`)
                if (!entries.length && !spreads.length) return null
                return `({${[...entries, ...spreads].join(',')}})`
        }
        const addClass = (attr: any, classes: string[]) => {
                if (!classes.length) return
                const tag = attr.getParent().getParent()
                const current = tag.getAttributes().find((item: any) => attrName(item) === 'className')
                const value = classes.join(' ')
                if (!current) return tag.addAttribute({ name: 'className', initializer: JSON.stringify(value) })
                const init = current.getInitializer()
                if (!init) return current.setInitializer(JSON.stringify(value))
                if (Node.isStringLiteral(init)) return current.setInitializer(JSON.stringify(`${init.getLiteralText()} ${value}`))
                if (Node.isJsxExpression(init) && init.getExpression()) return current.setInitializer(`{[${init.getExpression()?.getText()}, ${JSON.stringify(value)}].filter(Boolean).join(' ')}`)
                return current.setInitializer(JSON.stringify(value))
        }
        const rewrite = (attr: any, env: Record<string, any>) => {
                const init = attr.getInitializer()
                if (!init || !Node.isJsxExpression(init)) return false
                const call = init.getExpression()
                if (!call || !Node.isCallExpression(call)) return false
                const parts = partsOf(call.getExpression(), env)
                if (!parts) return false
                const built = sections(parts, env)
                const inline = built.find((item) => item.target === 'inline')?.style ?? null
                const classes = built.filter((item) => item.target !== 'inline').map((item) => emitClass(item.block, item.target as Exclude<CssTarget, 'inline'>))
                if (!inline && !classes.length) return false
                addClass(attr, classes)
                const text = styleText(inline, call.getArguments())
                if (text) attr.setInitializer(`{${text}}`)
                if (!text) attr.remove()
                return true
        }
        return (code: string, id: string): TransformResult | null => {
                if (!/\.[cm]?[jt]sx?($|\?)/.test(id)) return null
                const file = id.split('?')[0] ?? id
                const ast = resolver.source(file, code)
                const env = resolver.imports(ast, file)
                let changed = false
                for (const attr of ast.getDescendantsOfKind(SyntaxKind.JsxAttribute)) {
                        if (attrName(attr) !== 'style') continue
                        changed = rewrite(attr, env) || changed
                }
                if (!changed) return null
                return { changed, code: ast.getFullText(), css: '', map: null }
        }
}
