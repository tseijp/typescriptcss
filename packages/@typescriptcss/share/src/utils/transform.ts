import { Node, SyntaxKind } from 'ts-morph'
import type { CssTarget, EmitClass, RuntimeStyle, TransformResult, TypescriptcssOptions } from '../types.ts'
import { createStyleTools } from './style.ts'
import { createValueResolver } from './resolver.ts'
type Part = { type: 'name' | 'value'; value: string }
export const createTransformer = (options: TypescriptcssOptions, emitClass: EmitClass, splitTarget: CssTarget = 'file') => {
        const tools = createStyleTools()
        const resolver = createValueResolver(options.root ?? process.cwd())
        const baseTarget = () => (options.output === 'file' || options.output === 'inline' ? options.output : 'head')
        const attrName = (attr: any) => (Node.isJsxAttribute(attr) ? attr.getNameNode().getText() : '')
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
        const sections = (parts: Part[], env: Record<string, any>, extra: RuntimeStyle) => {
                const index = parts.findIndex((part) => part.type === 'name' && part.value === 'css')
                const items = [
                        { parts: index < 0 ? parts : parts.slice(0, index), target: baseTarget() as CssTarget },
                        { parts: index < 0 ? [] : parts.slice(index + 1), target: splitTarget },
                ]
                const built = items.flatMap((item) => {
                        const style = run(item.parts, env)
                        if (!style) return []
                        const block = tools.block(style)
                        if (tools.empty(block)) return []
                        return [{ block, target: item.target, style }]
                })
                const clean = tools.clean(extra)
                if (!Object.keys(clean).length) return built
                const target = index < 0 ? baseTarget() : splitTarget
                const last = [...built].reverse().find((item) => item.target === target)
                if (!last) return [...built, { block: tools.block(clean), target, style: clean }]
                last.style = { ...last.style, ...extra }
                last.block = tools.block(last.style)
                return built
        }
        const complete = (value: any): boolean => !!value && typeof value === 'object' && !Array.isArray(value) && Object.values(value).every((item) => item !== undefined && (typeof item !== 'object' || complete(item)))
        const staticArgs = (args: Node[], env: Record<string, any>) => {
                const values = args.map((arg) => resolver.value(arg, env))
                if (!values.every(complete)) return { args, style: {} }
                return { args: [], style: Object.assign({}, ...values) }
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
        const rewriteStatic = (attr: any, expression: Node, env: Record<string, any>) => {
                if (baseTarget() === 'inline') return false
                const style = resolver.value(expression, env)
                if (!complete(style)) return false
                const block = tools.block(style)
                if (tools.empty(block)) return false
                addClass(attr, [emitClass(block, baseTarget() as Exclude<CssTarget, 'inline'>)])
                attr.remove()
                return true
        }
        const rewrite = (attr: any, env: Record<string, any>) => {
                const init = attr.getInitializer()
                if (!init || !Node.isJsxExpression(init)) return false
                const expression = init.getExpression()
                if (!expression) return false
                if (!Node.isCallExpression(expression)) return rewriteStatic(attr, expression, env)
                const call = expression
                const parts = partsOf(call.getExpression(), env)
                if (!parts) return rewriteStatic(attr, expression, env)
                const resolved = staticArgs(call.getArguments(), env)
                const built = sections(parts, env, resolved.style)
                const inlineStyles = built.filter((item) => item.target === 'inline').map((item) => item.style)
                const inline = inlineStyles.length ? Object.assign({}, ...inlineStyles) : null
                const classes = built.filter((item) => item.target !== 'inline').map((item) => emitClass(item.block, item.target as Exclude<CssTarget, 'inline'>))
                if (!inline && !classes.length) return false
                addClass(attr, classes)
                const text = styleText(inline, resolved.args)
                if (text) attr.setInitializer(`{${text}}`)
                if (!text) attr.remove()
                return true
        }
        const unused = (node: any) => !node.findReferencesAsNodes().length
        const cleanVariables = (ast: any, env: Record<string, any>) => {
                const declarations = ast.getDescendantsOfKind(SyntaxKind.VariableDeclaration).reverse()
                for (const declaration of declarations) {
                        const name = declaration.getNameNode()
                        if (!Node.isIdentifier(name) || !unused(name)) continue
                        if (!complete(resolver.value(declaration.getInitializer(), env))) continue
                        declaration.remove()
                }
        }
        const cleanImports = (ast: any, env: Record<string, any>) => {
                for (const item of ast.getImportDeclarations()) {
                        const runtime = item.getModuleSpecifierValue().includes('typescriptcss')
                        for (const specifier of item.getNamedImports()) {
                                const local = specifier.getAliasNode() ?? specifier.getNameNode()
                                if (!unused(local)) continue
                                if (!runtime && !complete(env[local.getText()])) continue
                                specifier.remove()
                        }
                        if (!item.getNamedImports().length && !item.getDefaultImport() && !item.getNamespaceImport()) item.remove()
                }
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
                cleanVariables(ast, env)
                cleanImports(ast, env)
                return { changed, code: ast.getFullText(), css: '', map: null }
        }
}
