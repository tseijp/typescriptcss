import type { Callback } from './types.ts'
type Node = { ch: Record<string, Node>; mult?: number; rule?: Record<string, any> }
const camel = (s: string) => s.replace(/-([a-z])/g, (_1, c) => c.toUpperCase())
const decRule = (s: string) => {
        if (s[0] === '{') return JSON.parse(s.slice(1))
        return Object.fromEntries(s.split('|').map((p) => [camel(p.slice(0, p.indexOf('='))), p.slice(p.indexOf('=') + 1)]))
}
const parse = (dsl: string) => {
        const root: Node = { ch: {}, rule: undefined }
        const stack: Node[] = [root]
        for (const raw of dsl.split(';')) {
                if (!raw) continue
                const dots = (raw.match(/^\.*/) as RegExpMatchArray)[0].length
                const body = raw.slice(dots)
                const eq = body.indexOf('=')
                let head = eq < 0 ? body : body.slice(0, eq)
                const rule = eq < 0 ? undefined : decRule(body.slice(eq + 1))
                if (head === '') (root.rule = rule), stack.splice(1)
                if (head === '') continue
                const mm = /\*(-?[\d.]+)$/.exec(head)
                if (mm) head = head.slice(0, mm.index)
                const node: Node = { ch: {}, mult: mm ? Number(mm[1]) : 1, rule }
                stack[dots].ch[head] = node
                stack[dots + 1] = node
                stack.length = dots + 2
        }
        return root
}
const isNum = (s: string) => /^-?\d*\.?\d+$/.test(s)
const sub = (rule: Record<string, any>, tok: string): Record<string, any> => Object.fromEntries(Object.entries(rule).map(([k, v]) => [k, v && typeof v === 'object' ? sub(v, tok) : String(v).split('^').join(tok)]))
const walk = (root: Node, path: string[]) => {
        let node = root
        let last = root.rule ? root : undefined
        let tok: string | null = null
        for (const key of path) {
                let next = node.ch[key]
                let mytok: string | null = null
                if (!next && isNum(key) && node.ch['$']) (next = node.ch['$']), (mytok = String(Number(key) * (next.mult ?? 1)))
                if (!next && node.ch['_']) (next = node.ch['_']), (mytok = key)
                if (!next) break
                node = next
                if (node.rule) (last = node), (tok = mytok)
                else if (mytok !== null) tok = mytok
        }
        return last && last.rule ? sub(last.rule, tok ?? '') : {}
}
const createProxy = (callback: Callback, path: string[], option: number) => {
        const proxy: unknown = new Proxy(() => {}, {
                get(_1, key) {
                        return createProxy(callback, [...path, key as string], option)
                },
                apply(_1, _2, args) {
                        return callback({ path, args, option })
                },
        })
        return proxy
}
export const u = (dsl = ""): any => {
        const root = parse(dsl)
        const callback: Callback = ({ path, args }) => {
                const merged = args.find((a) => a && typeof a === 'object') ?? {}
                const tail = args.find((a) => typeof a === 'number' || typeof a === 'string')
                return { ...walk(root, tail === undefined ? path : [...path, String(tail)]), ...merged }
        }
        return createProxy(callback, [], 0)
}
