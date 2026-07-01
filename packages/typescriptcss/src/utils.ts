import type { Callback } from './types.ts'
type Node = { ch: Record<string, Node>; mult?: number; rule?: Record<string, any> }
const roots: Record<string, Node> = {}
const camel = (s: string) => s.replace(/-([a-z])/g, (_1, c) => c.toUpperCase())
const decRule = (s: string) => (s[0] === '{' ? JSON.parse(s.slice(1)) : Object.fromEntries(s.split('|').map((p) => [camel(p.slice(0, p.indexOf('='))), p.slice(p.indexOf('=') + 1)])))
const parse = (dsl: string) => {
        const root: Node = { ch: {} }
        const stack: Node[] = [root]
        for (const raw of dsl.split(';')) {
                if (!raw) continue
                const dots = (raw.match(/^\.*/) as RegExpMatchArray)[0].length
                const body = raw.slice(dots)
                const eq = body.indexOf('=')
                let head = eq < 0 ? body : body.slice(0, eq)
                const rule = eq < 0 ? undefined : decRule(body.slice(eq + 1))
                if (head === '') {
                        root.rule = rule
                        continue
                }
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
const merge = (a: Record<string, any>, b: Record<string, any>): Record<string, any> => Object.fromEntries([...Object.entries(a), ...Object.entries(b)].map(([k, v]) => [k, v && typeof v === 'object' && a[k] && typeof a[k] === 'object' ? merge(a[k], v) : v]))
const read = (root: Node, path: string[], start: number) => {
        let node = root,
                last = root.rule ? root : undefined,
                tok: string | null = null,
                end = start
        for (let i = start; i < path.length; i++) {
                const key = path[i]
                let next = node.ch[key],
                        mytok: string | null = null
                if (!next && isNum(key) && node.ch['$']) ((next = node.ch['$']), (mytok = String(Number(key) * (next.mult ?? 1))))
                if (!next && node.ch['_']) ((next = node.ch['_']), (mytok = key))
                if (!next) break
                node = next
                if (node.rule) ((last = node), (tok = mytok), (end = i + 1))
                else if (mytok !== null) tok = mytok
        }
        return { css: last?.rule ? sub(last.rule, tok ?? '') : {}, end }
}
const run = (path: string[]) => {
        let css: Record<string, any> = {}
        for (let i = 0; i < path.length; ) {
                const root = roots[path[i]]
                if (!root) {
                        i++
                        continue
                }
                const next = read(root, path, i + 1)
                css = merge(css, next.css)
                i = Math.max(next.end, i + 1)
        }
        return css
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
export const u = (name: string, dsl = ''): any => {
        roots[name] = parse(dsl)
        const callback: Callback = ({ path, args }) => {
                const merged = args.find((a) => a && typeof a === 'object') ?? {}
                const tail = args.find((a) => typeof a === 'number' || typeof a === 'string')
                return merge(run(tail === undefined ? path : [...path, String(tail)]), merged)
        }
        return createProxy(callback, [name], 0)
}
