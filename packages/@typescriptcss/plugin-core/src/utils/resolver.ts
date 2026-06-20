import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import * as runtime from 'typescriptcss/src'
import { Node, Project, SyntaxKind } from 'ts-morph'
type Env = Record<string, any>
export const createValueResolver = (rootDir: string) => {
        const cache = new Map<string, Env>()
        const ext = ['', '.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx', '/index.js', '/index.jsx']
        const source = (file: string, code: string) => new Project({ useInMemoryFileSystem: true, compilerOptions: { allowJs: true, jsx: 1 } as any }).createSourceFile(file.replace(/[^\w.-]/g, '_'), code, { overwrite: true })
        const runtimeImport = (specifier: string, file = '') => specifier.includes('typescriptcss') || /packages\/typescriptcss\/src/.test(file)
        const find = (specifier: string, from: string) => {
                if (!specifier.startsWith('.') && !specifier.startsWith('@/')) return ''
                const path = specifier.slice(2)
                const bases = specifier.startsWith('@/') ? [resolve(rootDir, 'src', path), resolve(rootDir, path)] : [resolve(dirname(from), specifier)]
                return bases.flatMap((base) => ext.map((suffix) => `${base}${suffix}`)).find((file) => existsSync(file)) ?? ''
        }
        const value = (node: Node | undefined, env: Env): any => {
                if (!node) return undefined
                if (Node.isStringLiteral(node) || Node.isNoSubstitutionTemplateLiteral(node)) return node.getLiteralText()
                if (Node.isNumericLiteral(node)) return Number(node.getText())
                if (node.getKind() === SyntaxKind.TrueKeyword) return true
                if (node.getKind() === SyntaxKind.FalseKeyword) return false
                if (Node.isIdentifier(node)) {
                        const known = env[node.getText()]
                        if (known !== undefined) return known
                        const declaration = node.getSymbol()?.getDeclarations().find(Node.isVariableDeclaration)
                        return value(declaration?.getInitializer(), env)
                }
                if (Node.isAsExpression(node) || Node.isParenthesizedExpression(node)) return value(node.getExpression(), env)
                if (Node.isPropertyAccessExpression(node)) return value(node.getExpression(), env)?.[node.getName()]
                if (Node.isElementAccessExpression(node)) return value(node.getExpression(), env)?.[String(value(node.getArgumentExpression(), env))]
                if (Node.isCallExpression(node)) {
                        const fn = value(node.getExpression(), env)
                        const args = node.getArguments().map((arg) => value(arg, env))
                        if (typeof fn !== 'function' || args.some((arg) => arg === undefined)) return undefined
                        return fn(...args)
                }
                if (Node.isTemplateExpression(node)) return `${node.getHead().getLiteralText()}${node.getTemplateSpans().map((span) => `${value(span.getExpression(), env)}${span.getLiteral().getLiteralText()}`).join('')}`
                if (!Node.isObjectLiteralExpression(node)) return undefined
                return Object.fromEntries(node.getProperties().flatMap((prop) => {
                        if (Node.isSpreadAssignment(prop)) return Object.entries(value(prop.getExpression(), env) ?? {})
                        if (Node.isShorthandPropertyAssignment(prop)) return [[prop.getName(), env[prop.getName()]]]
                        if (!Node.isPropertyAssignment(prop)) return []
                        const name = prop.getNameNode()
                        const key = Node.isStringLiteral(name) || Node.isNumericLiteral(name) ? name.getLiteralText() : name.getText()
                        return [[key, value(prop.getInitializer(), env)]]
                }))
        }
        const assignVariables = (ast: any, env: Env) => {
                const declarations = ast.getVariableStatements().flatMap((statement: any) => statement.getDeclarations())
                for (const declaration of declarations) {
                        const name = declaration.getNameNode()
                        if (!Node.isIdentifier(name)) continue
                        const item = value(declaration.getInitializer(), env)
                        if (item !== undefined) env[name.getText()] = item
                }
        }
        const exported = (file: string): Env => {
                if (!file) return {}
                if (cache.has(file)) return cache.get(file) ?? {}
                const out: Env = {}
                cache.set(file, out)
                const ast = source(file, readFileSync(file, 'utf8'))
                const env = imports(ast, file)
                for (const statement of ast.getVariableStatements()) {
                        if (!statement.hasExportKeyword()) continue
                        for (const declaration of statement.getDeclarations()) {
                                const name = declaration.getNameNode()
                                if (Node.isIdentifier(name) && env[name.getText()] !== undefined) out[name.getText()] = env[name.getText()]
                        }
                }
                return out
        }
        const assignNamed = (env: Env, item: any, values: Env) => {
                for (const name of item.getNamedImports()) {
                        const imported = name.getNameNode().getText()
                        const local = name.getAliasNode()?.getText() ?? imported
                        env[local] = values[imported]
                }
        }
        const imports = (ast: any, file: string) => {
                const env: Env = {}
                for (const item of ast.getImportDeclarations()) {
                        const specifier = item.getModuleSpecifierValue()
                        const found = find(specifier, file)
                        const isRuntime = runtimeImport(specifier, found)
                        const values = (isRuntime ? runtime : exported(found)) as Env
                        if (isRuntime) Object.assign(env, runtime)
                        assignNamed(env, item, values)
                }
                assignVariables(ast, env)
                return env
        }
        return { imports, source, value }
}
