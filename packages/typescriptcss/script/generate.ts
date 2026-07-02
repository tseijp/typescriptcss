import fs from 'node:fs'
import path from 'node:path'
import { code, mk } from '../src/utils.ts'
const dir = path.join(import.meta.dirname, '..')
const testDir = path.join(dir, 'test')
const files = fs
        .readdirSync(testDir)
        .filter((f) => /^(0\d|1[0-4])_.*\.test\.ts$/.test(f))
        .sort()
const CH = '[A-Za-z_$][\\w$]*(?:\\.[A-Za-z_$][\\w$]*|\\[[^\\]]*\\])*'
const RE = new RegExp('expect\\(\\s*_\\.(' + CH + ')\\(\\s*(\\{[\\s\\S]*?\\}|-?\\d+)?\\s*\\)\\)\\s*\\.toEqual\\(\\s*(\\{[\\s\\S]*?\\})\\s*\\)', 'g')
const rows: [string, string, string, string][] = []
for (const f of files) {
        const s = fs.readFileSync(path.join(testDir, f), 'utf8')
        const consts = [...s.matchAll(/const ([A-Z_][A-Z0-9_]*)\s*=\s*(\{[\s\S]*?\n\})/g)].map((m) => `const ${m[1]}=${m[2]};`).join('\n')
        let m: RegExpExecArray | null
        while ((m = RE.exec(s))) rows.push([m[1], m[2] ?? '', consts, m[3]])
}
const ev = (consts: string, expr: string) => new Function(consts + '\nreturn(' + expr + ')')()
const parseChain = (expr: string, ca: string) => {
        let s = expr
        const segs: { t: string; v: any }[] = []
        const root = (/^([A-Za-z_$][\w$]*)/.exec(s) as RegExpExecArray)[1]
        s = s.slice(root.length)
        let m: RegExpExecArray | null
        while (s) {
                if ((m = /^\.([A-Za-z_$][\w$]*)/.exec(s))) segs.push({ t: 'k', v: m[1] })
                else if ((m = /^\[(-?\d+)\]/.exec(s))) segs.push({ t: 'n', v: +m[1] })
                else if ((m = /^\['([^']*)'\]/.exec(s))) segs.push({ t: 's', v: m[1] })
                else break
                s = s.slice(m[0].length)
        }
        if (ca && /^-?\d+$/.test(ca)) segs.push({ t: 'n', v: +ca })
        return { root, segs }
}
type Node = { ch: Record<string, Node>; samp: [any, any][]; kind?: string | null; rule?: any; path?: string[]; enc?: string; mult?: number }
const N = (): Node => ({ ch: Object.create(null), samp: [] })
const trees: Record<string, Node> = {}
for (const [chain, ca, consts, expr] of rows) {
        let css = ev(consts, expr)
        if (ca && ca[0] === '{') {
                const a = ev(consts, ca)
                css = { ...css }
                for (const k in a) delete css[k]
        }
        const { root, segs } = parseChain(chain, ca)
        const t = trees[root] || (trees[root] = N())
        let node = t,
                arg: any = null,
                kind: string | null = null
        const p = [root]
        for (const seg of segs) {
                if (seg.t === 'n') ((node = node.ch['$'] || (node.ch['$'] = N())), (arg = seg.v), (kind = 'n'), p.push('$'))
                else if (seg.t === 'k') ((node = node.ch[seg.v] || (node.ch[seg.v] = N())), (arg = null), (kind = null), p.push(seg.v))
                else {
                        const str = seg.v as string
                        if (/^-?\d/.test(str) && !/^\d+$/.test(str)) ((node = node.ch['_'] || (node.ch['_'] = N())), (arg = str), (kind = '_'), p.push('_'))
                        else ((node = node.ch[str] || (node.ch[str] = N())), (arg = null), (kind = null), p.push(str))
                }
        }
        node.rule = css
        node.kind = kind
        node.path = p.slice()
        if (arg != null) node.samp.push([arg, css])
}
const norm = (x: string) => (x === 'col' ? 'column' : x === 'cols' ? 'columns' : x)
const kebab = (s: string) => s.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase())
const dcamel = (s: string) => s.replace(/-([a-z])/g, (_1, c) => c.toUpperCase())
const MULTS = [4, 1, 12.5]
const SENT = '\u0001'
const encWord = (word: string, p: string[], pos: number) => {
        for (let k = 0; pos - k >= 0; k++) {
                const seg = p[pos - k]
                if (seg === '$' || seg === '_') continue
                if (norm(seg) === word) return '.'.repeat(k + 1)
        }
        return null
}
const encStr = (str: string, p: string[], pos: number, tok: string | null, isVal: boolean) => {
        let s = str
        if (tok != null && tok !== '' && s.includes(tok)) s = s.split(tok).join(SENT)
        let out = '',
                last = 0,
                m: RegExpExecArray | null
        const re = /[A-Za-z]+/g
        while ((m = re.exec(s))) {
                out += s.slice(last, m.index)
                const unit = isVal && /[0-9]/.test(s[m.index - 1] || '')
                out += (unit ? null : encWord(m[0], p, pos)) ?? m[0]
                last = re.lastIndex
        }
        out += s.slice(last)
        return out.split(SENT).join('.')
}
const encRule = (css: any, p: string[], pos: number, tok: string | null): string => {
        const out: string[] = []
        const vals = new Map<string, string[]>()
        for (const [k, v] of Object.entries(css)) {
                if (v && typeof v === 'object') {
                        out.push(k + '{' + encRule(v, p, pos, tok) + '}')
                        continue
                }
                const val = encStr(String(v), p, pos, tok, true)
                if (!vals.has(val)) vals.set(val, [])
                ;(vals.get(val) as string[]).push(encStr(kebab(k), p, pos, null, false))
        }
        for (const [v, keys] of vals) out.push(keys.join(',') + ':' + v)
        return out.join('|')
}
const resolveDots = (piece: string, p: string[], pos: number, tok: string | null) =>
        piece.replace(/\.+/g, (run, idx) => {
                if (/[0-9]/.test(piece[idx - 1] || '') || /[0-9]/.test(piece[idx + run.length] || '')) return run
                if (run.length === 1) return tok != null ? tok : norm(p[pos])
                const seg = p[pos - (run.length - 1)]
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
const decodeCheck = (enc: string, p: string[], pos: number, tok: string | null): any => {
        const o: any = {}
        for (const item of splitTop(enc)) {
                const b = item.indexOf('{')
                if (b >= 0 && item.endsWith('}')) {
                        o[item.slice(0, b)] = decodeCheck(item.slice(b + 1, -1), p, pos, tok)
                        continue
                }
                const c = item.indexOf(':')
                const v = resolveDots(item.slice(c + 1), p, pos, tok)
                for (const k of resolveDots(item.slice(0, c), p, pos, tok).split(',')) o[dcamel(k)] = v
        }
        return o
}
const encodeNode = (node: Node) => {
        const p = node.path as string[],
                pos = p.length - 1
        if (node.kind === '_') {
                node.enc = encRule(node.samp[0][1], p, pos, String(node.samp[0][0]))
                return
        }
        if (node.kind === 'n') {
                for (const mult of MULTS) {
                        const tok0 = String(Number(node.samp[0][0]) * mult)
                        if (!JSON.stringify(node.samp[0][1]).includes(tok0)) continue
                        const enc = encRule(node.samp[0][1], p, pos, tok0)
                        let ok = true
                        for (const [a, css] of node.samp)
                                if (JSON.stringify(decodeCheck(enc, p, pos, String(Number(a) * mult))) !== JSON.stringify(css)) {
                                        ok = false
                                        break
                                }
                        if (ok) {
                                node.enc = enc
                                node.mult = mult
                                return
                        }
                }
                node.enc = encRule(node.samp[0][1], p, pos, null)
                node.mult = 1
                return
        }
        node.enc = encRule(node.rule, p, pos, null)
}
const walkEnc = (node: Node) => {
        for (const k in node.ch) walkEnc(node.ch[k])
        if ('rule' in node) encodeNode(node)
}
for (const r in trees) walkEnc(trees[r])
let topKeys: string[] = []
const prefixMap = (keys: string[], canBreak: boolean) => {
        const out: Record<string, string> = {}
        for (const key of keys) {
                if (key === '$' || key === '_' || /^-?\d/.test(key)) {
                        out[key] = key
                        continue
                }
                let hit = key
                for (let i = 1; i <= key.length; i++) {
                        const p = key.slice(0, i)
                        const localHit = keys.some((k) => k !== key && k.startsWith(p))
                        const topHit = canBreak && topKeys.some((k) => k !== key && k.startsWith(p))
                        if ((localHit || topHit) && p !== key) continue
                        hit = p === key ? key : p + '?'
                        break
                }
                out[key] = hit
        }
        return out
}
const serialize = (root: string) => {
        const lines: string[] = []
        const t = trees[root]
        if ('rule' in t) lines.push('=' + t.enc)
        const emit = (node: Node, depth: number, canBreak: boolean): string[] => {
                const out: string[] = []
                const kids = Object.keys(node.ch)
                const keyOf = prefixMap(kids, canBreak)
                const leaf = kids.filter((k) => Object.keys(node.ch[k].ch).length === 0 && 'rule' in node.ch[k])
                const branch = kids.filter((k) => !leaf.includes(k))
                const grp = new Map<string, { keys: string[]; enc?: string; mult?: number }>()
                for (const k of leaf) {
                        const c = node.ch[k]
                        const sig = (c.enc || '') + '#' + (c.mult || '')
                        if (!grp.has(sig)) grp.set(sig, { keys: [], enc: c.enc, mult: c.mult })
                        ;(grp.get(sig) as any).keys.push(k)
                }
                const stringLeaf = leaf.filter((k) => k !== '$' && k !== '_')
                const wildcard = [...grp.values()].find((g) => stringLeaf.length > 0 && stringLeaf.every((k) => g.keys.includes(k)) && !leaf.includes('_'))
                if (wildcard) wildcard.keys = [...wildcard.keys.filter((k) => k === '$'), '_']
                for (const g of grp.values()) {
                        let head = '.'.repeat(depth) + g.keys.map((k) => keyOf[k] ?? k).join('~')
                        if (g.keys.includes('$') && g.mult && g.mult !== 1) head += '*' + g.mult
                        out.push(head + '=' + g.enc)
                }
                const bgrp = new Map<string, { keys: string[]; enc?: string; body: string[] }>()
                for (const k of branch) {
                        const c = node.ch[k]
                        const body = emit(c, depth + 1, canBreak || 'rule' in c)
                        const sig = (('rule' in c ? c.enc : '') || '') + '\n' + body.join('\n')
                        if (!bgrp.has(sig)) bgrp.set(sig, { keys: [], enc: c.enc, body })
                        ;(bgrp.get(sig) as any).keys.push(k)
                }
                for (const g of bgrp.values()) {
                        const head = '.'.repeat(depth) + g.keys.map((k) => keyOf[k] ?? k).join('~')
                        out.push(g.enc ? head + '=' + g.enc : head, ...g.body)
                }
                return out
        }
        lines.push(...emit(t, 0, 'rule' in t))
        return lines.join(';')
}
trees['forcedColorAdjust'] = { ...N(), ch: { auto: { ...N(), rule: { forcedColorAdjust: 'auto' }, kind: null, path: ['forcedColorAdjust', 'auto'] }, none: { ...N(), rule: { forcedColorAdjust: 'none' }, kind: null, path: ['forcedColorAdjust', 'none'] } } }
walkEnc(trees['forcedColorAdjust'])
const alias: Record<string, string> = {
        m: 'auto=margin:auto;$*4=margin:.px;_=margin:.',
        margin: 'auto=margin:auto;$*4=margin:.px;_=margin:.',
        mx: 'auto=margin-inline:auto;$*4=margin-inline:.px;_=margin-inline:.',
        my: 'auto=margin-block:auto;$*4=margin-block:.px;_=margin-block:.',
        ms: 'auto=margin-inline-start:auto;$*4=margin-inline-start:.px;_=margin-inline-start:.',
        me: 'auto=margin-inline-end:auto;$*4=margin-inline-end:.px;_=margin-inline-end:.',
        ml: 'auto=margin-left:auto;$*4=margin-left:.px;_=margin-left:.',
        mr: 'auto=margin-right:auto;$*4=margin-right:.px;_=margin-right:.',
        mt: 'auto=margin-block-start:auto;$*4=margin-top:.px;_=margin-block-start:.',
        mb: 'auto=margin-block-end:auto;$*4=margin-bottom:.px;_=margin-block-end:.',
        mbs: '$*4=margin-block-start:.px;_=margin-block-start:.',
        mbe: '$*4=margin-block-end:.px;_=margin-block-end:.',
        p: '$*4=padding:.px;_=padding:.',
        padding: '$*4=padding:.px;_=padding:.',
        px: '$*4=padding-inline:.px;_=padding-inline:.',
        py: '$*4=padding-block:.px;_=padding-block:.',
        ps: '$*4=padding-inline-start:.px;_=padding-inline-start:.',
        pe: '$*4=padding-inline-end:.px;_=padding-inline-end:.',
        pl: '$*4=padding-left:.px;_=padding-left:.',
        pr: '$*4=padding-right:.px;_=padding-right:.',
        pt: '$*4=padding-top:.px;_=padding-block-start:.',
        pb: '$*4=padding-bottom:.px;_=padding-block-end:.',
        pbs: '$*4=padding-block-start:.px;_=padding-block-start:.',
        pbe: '$*4=padding-block-end:.px;_=padding-block-end:.',
        cols: '$=display:grid|grid-template-columns:repeat(., minmax(0, 1fr));none~subgrid=display:grid|grid-template-columns:.',
        rows: '$=display:grid|grid-template-rows:repeat(., minmax(0, 1fr));none~subgrid=display:grid|grid-template-rows:.',
        colStart: '$=grid-column-start:.;auto=grid-column-start:auto',
        backface: '_=..-visibility:.',
        caption: '_=..-side:.',
        clear: 'lef?~ri?~both~non?=..:.;star?~end=..:inline-.',
        cursor: '_=..:.;$=..:var(.);not;._=...:..-.;context;._=...:..-.;vertical;._=...:..-.;no;._=...:..-.;all;._=...:..-.;zoom;._=...:..-.;col;.resize=...:col-.;row~n~e~s~w~ne~nw~se~sw~ew~ns~nesw~nwse;._=...:..-.',
        float: 'lef?~ri?~non?=..:.;star?~end=..:inline-.',
        hyphens: '_=..:.',
        mix: 'blend;._=...-..-mode:.',
        scroll: '_=..-behavior:.',
        select: '_=user-..:.',
        wrap: '_=overflow-..:.',
}
const typeSrc = fs.readFileSync(path.join(dir, 'src', 'types.ts'), 'utf8')
const ub = typeSrc.slice(typeSrc.indexOf('export type U = {'))
const uKeys: string[] = []
for (const line of ub.split('\n')) {
        const m = /^\t{2}([A-Za-z_$][\w$]*)\s*:/.exec(line) || /^ {8}([A-Za-z_$][\w$]*)\s*:/.exec(line)
        if (m) uKeys.push(m[1])
        if (/^}/.test(line) && uKeys.length) break
}
uKeys.sort()
topKeys = uKeys.slice()
const dsls = uKeys.map((k) => alias[k] ?? (trees[k] ? serialize(k) : ''))
const needsRoot = (dsl: string) => {
        let pathLen = 1
        const lens = [1]
        for (const raw of dsl.split(';')) {
                if (!raw) continue
                const dots = (raw.match(/^\.*/) as RegExpMatchArray)[0].length
                const body = raw.slice(dots)
                const eq = body.indexOf('=')
                if (body && (eq < 0 || body.slice(0, eq))) {
                        pathLen = dots + 2
                        lens[dots + 1] = pathLen
                        lens.length = dots + 2
                } else pathLen = lens[dots] ?? 1
                if (eq < 0) continue
                const enc = body.slice(eq + 1)
                let yes = false
                enc.replace(/\.+/g, (run, idx) => {
                        if (/[0-9]/.test(enc[idx - 1] || '') || /[0-9]/.test(enc[idx + run.length] || '')) return run
                        const pos = pathLen - 1
                        if ((run.length === 1 ? pos : pos - (run.length - 1)) === 0) yes = true
                        return run
                })
                if (yes) return true
        }
        return false
}
const sems = dsls.map((dsl, i) => (needsRoot(dsl) ? uKeys[i] : ''))
const joined = dsls.join(';;')
const source = sems.join(',') + '\n' + joined
const escaped = source.replace(/[A-Z]/g, (c) => '!' + c.toLowerCase())
const PRE = ']^'
const occAt = (text: string, sub: string) => {
        const pos: number[] = []
        let i = 0
        while ((i = text.indexOf(sub, i)) >= 0) {
                if (PRE.includes(text[i - 1] || '')) {
                        i++
                        continue
                }
                pos.push(i)
                i += sub.length
        }
        return pos
}
const replaceAt = (text: string, sub: string, tok: string) => {
        const pos = occAt(text, sub)
        let out = '',
                last = 0
        for (const i of pos) ((out += text.slice(last, i) + tok), (last = i + sub.length))
        return out + text.slice(last)
}
const compress = (input: string) => {
        const dict: string[] = []
        let text = input
        while (dict.length < 217) {
                const cl = code(dict.length).length
                const cand = new Map<string, number>()
                let prev: Set<string> | null = null
                for (let L = 2; L <= 140; L++) {
                        if (L - cl < 1) continue
                        const cnt = new Map<string, number>()
                        for (let i = 0; i + L <= text.length; i++) {
                                if (PRE.includes(text[i - 1] || '')) continue
                                if (prev && !prev.has(text.slice(i, i + L - 1))) continue
                                const sub = text.slice(i, i + L)
                                if (sub.includes('\n') || PRE.includes(sub[L - 1])) continue
                                cnt.set(sub, (cnt.get(sub) ?? 0) + 1)
                        }
                        prev = new Set()
                        for (const [sub, c] of cnt) {
                                if (c < 2) continue
                                prev.add(sub)
                                const est = c * (sub.length - cl) - (sub.length + 2)
                                if (est > 1) cand.set(sub, est)
                        }
                        if (!prev.size) break
                }
                const top = [...cand.entries()].sort((a, b) => b[1] - a[1]).slice(0, 1200)
                let best = '',
                        bestNet = 1
                for (const [sub] of top) {
                        const net = occAt(text, sub).length * (sub.length - cl) - (sub.length + 2)
                        if (net > bestNet) ((best = sub), (bestNet = net))
                }
                if (!best) break
                text = replaceAt(text, best, code(dict.length))
                dict.push(best)
        }
        return { dict, packed: text }
}
const tokenIndex = (s: string, i: number) => {
        const p = PRE.indexOf(s[i])
        if (p >= 0) return S1.length + p * S2.length + S2.indexOf(s[i + 1])
        const u = S1.indexOf(s[i])
        return u >= 0 ? u : -1
}
const S1 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ+<['
const S2 = '!#$%&()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~'
const relabel = (s: string, remap: number[]) => {
        let out = ''
        for (let i = 0; i < s.length; i++) {
                const k = tokenIndex(s, i)
                if (k < 0) {
                        out += s[i]
                        continue
                }
                out += code(remap[k])
                if (PRE.includes(s[i])) i++
        }
        return out
}
const optimize = (dict0: string[], packed0: string) => {
        const dict = dict0.slice()
        let packed = packed0
        const expLen = dict0.map((e) => expandFix(dict0, e).length)
        for (let a = 0; a < dict.length; a++)
                for (let b = 0; b < dict.length; b++) {
                        if (a === b || dict[b].length <= code(b).length || expLen[b] >= expLen[a]) continue
                        if (!dict[a].includes(dict[b])) continue
                        dict[a] = replaceAt(dict[a], dict[b], code(b))
                }
        const count = new Array(dict.length).fill(0)
        const scan = (s: string) => {
                for (let i = 0; i < s.length; i++) {
                        const k = tokenIndex(s, i)
                        if (k < 0) continue
                        count[k]++
                        if (PRE.includes(s[i])) i++
                }
        }
        scan(packed)
        for (const e of dict) scan(e)
        const order = dict.map((_1, k) => k).sort((x, y) => count[y] - count[x])
        const remap: number[] = []
        order.forEach((oldIdx, rank) => (remap[oldIdx] = rank))
        const dict2: string[] = []
        for (let k = 0; k < dict.length; k++) dict2[remap[k]] = relabel(dict[k], remap)
        packed = relabel(packed, remap)
        return { dict: dict2, packed }
}
const expandFix = (dict: string[], src: string) => {
        const defs = dict.slice()
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
        return exp(src)
}
const raw = compress(escaped)
const { dict, packed } = optimize(raw.dict, raw.packed)
if (expandFix(dict, packed) !== escaped) {
        process.stdout.write('pack roundtrip failed\n')
        process.exit(1)
}
const api: Record<string, any> = {}
const next = mk(dict.join('\n'), packed)
for (const k of uKeys) api[k] = next()
const stable = (x: any): string =>
        x && typeof x === 'object'
                ? '{' +
                  Object.keys(x)
                          .sort()
                          .map((k) => JSON.stringify(k) + ':' + stable(x[k]))
                          .join(',') +
                  '}'
                : JSON.stringify(x)
let bad = 0
for (const [chain, ca, consts, expr] of rows) {
        const expected = ev(consts, expr)
        const { root, segs } = parseChain(chain, '')
        let f: any = api[root]
        for (const seg of segs) f = f[seg.v]
        const got = ca === '' ? f() : ca[0] === '{' ? f(ev(consts, ca)) : f(Number(ca))
        if (stable(got) !== stable(expected)) {
                bad++
                if (bad < 8) process.stdout.write('MISMATCH ' + chain + '(' + ca + ')\n')
        }
}
if (bad) {
        process.stdout.write('verify failed: ' + bad + '/' + rows.length + '\n')
        process.exit(1)
}
const reserved: Record<string, string> = { break: 'break_', static: 'static_' }
const decl = (k: string) => {
        const name = reserved[k] ?? k
        const line = `export const ${name}: U['${k}'] = $()`
        return reserved[k] ? line + `\nexport { ${name} as ${k} }` : line
}
const out = ["import { mk, u } from './utils.ts'", "import type { C, U } from './types.ts'", 'const $ = mk(', '\t' + JSON.stringify(dict.join('\n')) + ',', '\t' + JSON.stringify(packed) + ',', ')', ...uKeys.map(decl), "export const define = <T = C>(name: string, dsl = ''): T => u(name, dsl) as unknown as T", ''].join('\n')
fs.writeFileSync(path.join(dir, 'src', 'index.ts'), out)
process.stdout.write('keys ' + uKeys.length + ' rows ' + rows.length + ' dict ' + dict.length + ' dsl ' + joined.length + ' -> ' + (packed.length + dict.join(';').length) + ' bytes, index.ts ' + fs.statSync(path.join(dir, 'src', 'index.ts')).size + ' bytes\n')
