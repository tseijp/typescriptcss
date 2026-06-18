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
                const base = specifier.startsWith('@/') ? resolve(rootDir, specifier.slice(2)) : resolve(dirname(from), specifier)
                return ext.map((suffix) => `${base}${suffix}`).find((file) => existsSync(file)) ?? ''
        }
        const value = (node: Node | undefined, env: Env): any => {
                if (!node) return undefined
                if (Node.isStringLiteral(node) || Node.isNoSubstitutionTemplateLiteral(node)) return node.getLiteralText()
                if (Node.isNumericLiteral(node)) return Number(node.getText())
                if (node.getKind() === SyntaxKind.TrueKeyword) return true
                if (node.getKind() === SyntaxKind.FalseKeyword) return false
                if (Node.isIdentifier(node)) return env[node.getText()]
                if (Node.isAsExpression(node) || Node.isParenthesizedExpression(node)) return value(node.getExpression(), env)
                if (Node.isPropertyAccessExpression(node)) return value(node.getExpression(), env)?.[node.getName()]
                if (Node.isElementAccessExpression(node)) return value(node.getExpression(), env)?.[String(value(node.getArgumentExpression(), env))]
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
        const exported = (file: string): Env => {
                if (!file) return {}
                if (cache.has(file)) return cache.get(file) ?? {}
                const out: Env = {}
                cache.set(file, out)
                const ast = source(file, readFileSync(file, 'utf8'))
                const env = imports(ast, file)
                for (const statement of ast.getVariableStatements()) {
                        for (const declaration of statement.getDeclarations()) {
                                const name = declaration.getNameNode()
                                if (!Node.isIdentifier(name)) continue
                                const item = value(declaration.getInitializer(), env)
                                if (item === undefined) continue
                                env[name.getText()] = item
                                if (statement.hasExportKeyword()) out[name.getText()] = item
                        }
                }
                return out
        }
        const imports = (ast: any, file: string) => {
                const env: Env = {}
                for (const item of ast.getImportDeclarations()) {
                        const specifier = item.getModuleSpecifierValue()
                        const found = find(specifier, file)
                        const values = (runtimeImport(specifier, found) ? runtime : exported(found)) as Env
                        for (const name of item.getNamedImports()) {
                                const imported = name.getNameNode().getText()
                                const local = name.getAliasNode()?.getText() ?? imported
                                env[local] = values[imported]
                        }
                }
                return env
        }
        return { imports, source, value }
}
