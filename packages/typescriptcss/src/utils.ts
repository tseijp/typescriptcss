import type { Callback } from './types.ts'
type Node = { ch: Record<string, Node>; pre?: Record<string, 1>; mult?: number; enc?: string }
const roots: Record<string, Node> = {}
const norm = (x: string) => (x === 'col' ? 'column' : x === 'cols' ? 'columns' : x)
const dcamel = (s: string) => s.replace(/-([a-z])/g, (_1, c) => c.toUpperCase())
const resolveDots = (piece: string, path: string[], pos: number, tok: string | null) =>
        piece.replace(/\.+/g, (run, idx) => {
                const prev = piece[idx - 1], next = piece[idx + run.length]
                if (/[0-9]/.test(prev || '') || /[0-9]/.test(next || '')) return run
                const L = run.length
                if (L === 1) return tok != null ? tok : norm(path[pos])
                const seg = path[pos - (L - 1)]
                return seg === '$' || seg === '_' ? (tok as string) : norm(seg)
        })
const decRule = (enc: string, path: string[], pos: number, tok: string | null): Record<string, any> => {
        if (enc[0] === '{') return JSON.parse(enc.slice(1))
        const o: Record<string, any> = {}
        for (const decl of enc.split('|')) { const c = decl.indexOf(':'); o[dcamel(resolveDots(decl.slice(0, c), path, pos, tok))] = resolveDots(decl.slice(c + 1), path, pos, tok) }
        return o
}
const parse = (dsl: string) => {
        const root: Node = { ch: {} }
        const stack: Node[] = [root]
        for (const raw of dsl.split(';')) {
                if (!raw) continue
                const dots = (raw.match(/^\.*/) as RegExpMatchArray)[0].length
                const body = raw.slice(dots)
                const eq = body.indexOf('=')
                let head = eq < 0 ? body : body.slice(0, eq)
                const enc = eq < 0 ? undefined : body.slice(eq + 1)
                if (head === '') { root.enc = enc; continue }
                const mm = /\*(-?[\d.]+)$/.exec(head)
                if (mm) head = head.slice(0, mm.index)
                const node: Node = { ch: {}, mult: mm ? Number(mm[1]) : 1, enc }
                stack[dots + 1] = node
                stack.length = dots + 2
                for (const rawKey of head.split('~')) {
                        const short = rawKey.endsWith('?')
                        const kk = short ? rawKey.slice(0, -1) : rawKey
                        stack[dots].ch[kk] = node
                        if (short) (stack[dots].pre ??= {})[kk] = 1
                }
        }
        return root
}
const isNum = (s: string) => /^-?\d*\.?\d+$/.test(s)
const merge = (a: Record<string, any>, b: Record<string, any>): Record<string, any> => { const o = { ...a }; for (const k in b) o[k] = b[k] && typeof b[k] === 'object' && a[k] && typeof a[k] === 'object' ? merge(a[k], b[k]) : b[k]; return o }
const read = (root: Node, name: string, path: string[], start: number) => {
        let node = root, last = root.enc != null ? root : undefined, tok: string | null = null, end = start
        const seg = [name]; let chosen = [name]
        for (let i = start; i < path.length; i++) {
                const key = path[i]; let next = node.ch[key], mytok: string | null = null, sk = key
                if (!next) { const pk = Object.keys(node.pre ?? {}).find((k) => key.startsWith(k)); if (pk) next = node.ch[pk] }
                if (!next && isNum(key) && node.ch['$']) (next = node.ch['$']), (mytok = String(Number(key) * (next.mult ?? 1))), (sk = '$')
                if (!next && node.ch['_']) (next = node.ch['_']), (mytok = key), (sk = '_')
                if (!next) break
                node = next; seg.push(sk)
                if (node.enc != null) (last = node), (tok = mytok), (end = i + 1), (chosen = seg.slice())
                else if (mytok !== null) tok = mytok
        }
        return { css: last?.enc != null ? decRule(last.enc, chosen, chosen.length - 1, tok) : {}, end }
}
const run = (path: string[]) => {
        let css: Record<string, any> = {}
        for (let i = 0; i < path.length; ) { const root = roots[path[i]]; if (!root) { i++; continue } const nx = read(root, path[i], path, i + 1); css = merge(css, nx.css); i = Math.max(nx.end, i + 1) }
        return css
}
const createProxy = (callback: Callback, path: string[], option: number) => {
        const proxy: unknown = new Proxy(() => {}, {
                get(_1, key) { return createProxy(callback, [...path, key as string], option) },
                apply(_1, _2, args) { return callback({ path, args, option }) },
        })
        return proxy
}
export const u = (name: string, dsl = ''): any => {
        roots[name] = parse(dsl)
        const callback: Callback = ({ path, args }) => { const merged = args.find((a) => a && typeof a === 'object') ?? {}; const tail = args.find((a) => typeof a === 'number' || typeof a === 'string'); return merge(run(tail === undefined ? path : [...path, String(tail)]), merged) }
        return createProxy(callback, [name], 0)
}
