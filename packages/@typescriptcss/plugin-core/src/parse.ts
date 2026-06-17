import { Project, SyntaxKind } from 'ts-morph'
import { Span } from './types'
const isTsx = (id: string) => /\.[mc]?tsx?$/.test(id)
const root = (node: any): any => {
        if (node.getKind() === SyntaxKind.Identifier) return node
        if (node.getKind() === SyntaxKind.PropertyAccessExpression) return root(node.getExpression())
        if (node.getKind() === SyntaxKind.ElementAccessExpression) return root(node.getExpression())
        return undefined
}
const chain = (call: any): boolean => {
        const callee = call.getExpression()
        const base = root(callee)
        return Boolean(base) && base.getKind() === SyntaxKind.Identifier
}
const exprOf = (attr: any): any => {
        const init = attr.getInitializer()
        if (!init || init.getKind() !== SyntaxKind.JsxExpression) return undefined
        const expr = init.getExpression()
        if (!expr || expr.getKind() !== SyntaxKind.CallExpression) return undefined
        return chain(expr) ? expr : undefined
}
const valOf = (attr: any): any => {
        const init = attr.getInitializer()
        if (!init) return undefined
        if (init.getKind() === SyntaxKind.StringLiteral) return init
        return init.getExpression()
}
const clsOf = (attr: any): any => {
        const tag = attr.getParent().getParent()
        const found = tag.getAttributes().find((a: any) => a.getKind() === SyntaxKind.JsxAttribute && a.getNameNode().getText() === 'className')
        if (!found) return undefined
        const val = valOf(found)
        return val ? { attr: found, val } : undefined
}
const styles = (source: any): any[] =>
        source
                .getDescendantsOfKind(SyntaxKind.JsxAttribute)
                .filter((attr: any) => attr.getNameNode().getText() === 'style')
                .map((attr: any) => ({ attr, expr: exprOf(attr), cls: clsOf(attr) }))
                .filter((hit: any) => Boolean(hit.expr))
export const parse = (code: string, id: string): Span[] => {
        if (!isTsx(id)) return []
        const project = new Project({ useInMemoryFileSystem: true })
        const source = project.createSourceFile(id, code, { overwrite: true })
        return styles(source).map((hit: any) => ({ start: hit.attr.getStart(), end: hit.attr.getEnd(), expr: hit.expr.getText(), cls: hit.cls ? hit.cls.val.getText() : undefined, clsStart: hit.cls ? hit.cls.attr.getStart() : undefined, clsEnd: hit.cls ? hit.cls.attr.getEnd() : undefined }))
}
