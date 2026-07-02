import type { Callback } from './types.ts'
type Node = [Record<string, Node>, number, string?]
const roots: Record<string, Node | string> = {}
const sems: Record<string, string> = {}
const S1 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ+<['
const S2 = '!#$%&()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~'
const PRE = ']^'
export const code = (i: number) => (i < S1.length ? S1[i] : PRE[((i - S1.length) / S2.length) | 0] + S2[(i - S1.length) % S2.length])
const expand = (dict: string, src: string) => {
        const defs = dict ? dict.split('\n') : []
        const exp = (s: string): string => {
                let out = ''
                for (let i = 0; i < s.length; i++) {
                        const p = PRE.indexOf(s[i])
                        const k = p < 0 ? S1.indexOf(s[i]) : S1.length + p * S2.length + S2.indexOf(s[i + 1])
                        if (p >= 0) i++
                        out += k < 0 || defs[k] == null ? s[i] : (defs[k] = exp(defs[k]))
                }
                return out
        }
        return exp(src).replace(/!(.)/g, (_1, c) => c.toUpperCase())
}
const norm = (x: string) => (x === 'col' ? 'column' : x === 'cols' ? 'columns' : x)
const dcamel = (s: string) => s.replace(/-([a-z])/g, (_1, c) => c.toUpperCase())
const resolveDots = (piece: string, path: string[], pos: number, tok: string | null) =>
        piece.replace(/\.+/g, (run, idx) => {
                if (/[0-9]/.test(piece[idx - 1] || '') || /[0-9]/.test(piece[idx + run.length] || '')) return run
                if (run.length === 1) return tok != null ? tok : norm(path[pos])
                const seg = path[pos - (run.length - 1)]
                return seg === '$' || seg === '_' ? (tok as string) : norm(seg)
        })
const splitTop = (s: string) => {
        const out: string[] = []
        let depth = 0,
                last = 0
        for (let i = 0; i < s.length; i++) {
                if (s[i] === '{') depth++
                if (s[i] === '}') depth--
                if (s[i] === '|' && !depth) (out.push(s.slice(last, i)), (last = i + 1))
        }
        return [...out, s.slice(last)]
}
const decRule = (enc: string, path: string[], pos: number, tok: string | null): Record<string, any> => {
        const o: Record<string, any> = {}
        for (const item of splitTop(enc)) {
                const b = item.indexOf('{')
                if (b >= 0 && item.endsWith('}')) {
                        o[item.slice(0, b)] = decRule(item.slice(b + 1, -1), path, pos, tok)
                        continue
                }
                const c = item.indexOf(':')
                const v = resolveDots(item.slice(c + 1), path, pos, tok)
                for (const k of resolveDots(item.slice(0, c), path, pos, tok).split(',')) o[dcamel(k)] = v
        }
        return o
}
const parse = (dsl: string) => {
        const root: Node = [{}, 1]
        const stack: Node[] = [root]
        for (const raw of dsl.split(';')) {
                if (!raw) continue
                const dots = (raw.match(/^\.*/) as RegExpMatchArray)[0].length,
                        body = raw.slice(dots),
                        eq = body.indexOf('=')
                let head = eq < 0 ? body : body.slice(0, eq)
                const enc = eq < 0 ? undefined : body.slice(eq + 1)
                if (head === '') {
                        root[2] = enc
                        continue
                }
                const mm = /\*(-?[\d.]+)$/.exec(head)
                if (mm) head = head.slice(0, mm.index)
                const node: Node = [{}, mm ? Number(mm[1]) : 1, enc]
                stack[dots + 1] = node
                stack.length = dots + 2
                for (const rawKey of head.split('~')) stack[dots][0][rawKey] = node
        }
        return root
}
const isNum = (s: string) => /^-?\d*\.?\d+$/.test(s)
const merge = (a: Record<string, any>, b: Record<string, any>): Record<string, any> => {
        const o = { ...a }
        for (const k in b) o[k] = b[k] && typeof b[k] === 'object' && a[k] && typeof a[k] === 'object' ? merge(a[k], b[k]) : b[k]
        return o
}
const read = (root: Node, name: string, path: string[], start: number) => {
        let node = root,
                last = root[2] != null ? root : undefined,
                tok: string | null = null,
                end = start
        const seg = [name]
        let chosen = [name]
        for (let i = start; i < path.length; i++) {
                const key = path[i]
                let next = node[0][key],
                        mytok: string | null = null,
                        sk = key
                if (!next)
                        for (const k in node[0])
                                if (k.endsWith('?') && key.startsWith(k.slice(0, -1))) {
                                        next = node[0][k]
                                        break
                                }
                if (!next && isNum(key) && node[0]['$']) ((next = node[0]['$']), (mytok = String(Number(key) * next[1])), (sk = '$'))
                if (!next && node[0]['_']) ((next = node[0]['_']), (mytok = key), (sk = '_'))
                if (!next) break
                node = next
                seg.push(sk)
                if (node[2] != null) ((last = node), (tok = mytok), (end = i + 1), (chosen = seg.slice()))
                else if (mytok !== null) tok = mytok
        }
        return [last?.[2] != null ? decRule(last[2], chosen, chosen.length - 1, tok) : {}, end] as const
}
const run = (path: string[]) => {
        let css: Record<string, any> = {}
        for (let i = 0; i < path.length; ) {
                const r = roots[path[i]]
                if (r == null) {
                        i++
                        continue
                }
                const root = typeof r === 'string' ? (roots[path[i]] = parse(r)) : r
                const nx = read(root, sems[path[i]] ?? path[i], path, i + 1)
                css = merge(css, nx[0])
                i = Math.max(nx[1], i + 1)
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
export const u = (name: string, dsl = '', option = 0, sem = name): any => {
        roots[name] = dsl
        sems[name] = sem
        const callback: Callback = ({ path, args }) => {
                const merged = args.find((a) => a && typeof a === 'object') ?? {}
                const tail = args.find((a) => typeof a === 'number' || typeof a === 'string')
                return merge(run(tail === undefined ? path : [...path, String(tail)]), merged)
        }
        return createProxy(callback, [name], option)
}
export const mk = (dict: string, src: string): any => {
        const [keys, body] = expand(dict, src).split('\n')
        const names = keys.split(',')
        const segs = body.split(';;')
        let i = 0
        return () => {
                const name = '$' + i
                return u(name, segs[i], 0, names[i++] || name)
        }
}
