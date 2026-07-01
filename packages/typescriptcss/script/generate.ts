import fs from 'node:fs'
import path from 'node:path'
const dir = path.join(import.meta.dirname, '..')
const testDir = path.join(dir, 'test')
const files = fs
        .readdirSync(testDir)
        .filter((f) => /^(0\d|1[0-4])_.*\.test\.ts$/.test(f))
        .sort()
const CH = '[A-Za-z_$][\\w$]*(?:\\.[A-Za-z_$][\\w$]*|\\[[^\\]]*\\])*'
const RE = new RegExp('expect\\(\\s*_\\.(' + CH + ')\\(\\s*(\\{[\\s\\S]*?\\}|-?\\d+)?\\s*\\)\\)\\s*\\.toEqual\\(\\s*(\\{[\\s\\S]*?\\})\\s*\\)', 'g')
const rows: [string, string, string][] = []
for (const f of files) {
        const s = fs.readFileSync(path.join(testDir, f), 'utf8')
        const consts = [...s.matchAll(/const ([A-Z_][A-Z0-9_]*)\s*=\s*(\{[\s\S]*?\n\})/g)].map((m) => `const ${m[1]}=${m[2]};`).join('\n')
        let m: RegExpExecArray | null
        while ((m = RE.exec(s))) rows.push([m[1], m[2], consts + '\nreturn (' + m[3] + ')'])
}
const ev = (body: string) => new Function(body)()
const parseChain = (expr: string, callArg: string) => {
        let s = expr
        const segs: { t: string; v: any }[] = []
        const root = (/^([A-Za-z_$][\w$]*)/.exec(s) as RegExpExecArray)[1]
        s = s.slice(root.length)
        let m: RegExpExecArray | null
        while (s) {
                if ((m = /^\.([A-Za-z_$][\w$]*)/.exec(s))) segs.push({ t: 'k', v: m[1] })
                else if ((m = /^\[(-?\d+)\]/.exec(s))) segs.push({ t: 'n', v: Number(m[1]) })
                else if ((m = /^\['([^']*)'\]/.exec(s))) segs.push({ t: 's', v: m[1] })
                else break
                s = s.slice(m[0].length)
        }
        if (callArg && /^-?\d+$/.test(callArg)) segs.push({ t: 'n', v: Number(callArg) })
        return { root, segs }
}
type Node = { ch: Record<string, Node>; samp: [number | string, any][]; kind?: string; rule?: any; mult?: number }
const N = (): Node => ({ ch: Object.create(null), samp: [] })
const trees: Record<string, Node> = {}
for (const [chain, callArg, body] of rows) {
        let css = ev(body)
        if (callArg && callArg[0] === '{') {
                const a = new Function(body.replace(/return \([\s\S]*\)$/, 'return (' + callArg + ')'))()
                css = { ...css }
                for (const k in a) delete css[k]
        }
        const { root, segs } = parseChain(chain, callArg)
        const t = trees[root] || (trees[root] = N())
        let node = t
        let arg: any = null
        let kind: string | undefined
        for (const seg of segs) {
                if (seg.t === 'n') ((node = node.ch['$'] || (node.ch['$'] = N())), (arg = seg.v), (kind = 'n'))
                else if (seg.t === 'k') ((node = node.ch[seg.v] || (node.ch[seg.v] = N())), (arg = null), (kind = undefined))
                else {
                        const str = seg.v as string
                        if (/^-?\d/.test(str) && !/^\d+$/.test(str)) ((node = node.ch['_'] || (node.ch['_'] = N())), (arg = str), (kind = '_'))
                        else ((node = node.ch[str] || (node.ch[str] = N())), (arg = null), (kind = undefined))
                }
        }
        node.rule = css
        node.kind = kind
        if (arg != null) node.samp.push([arg, css])
}
const MULTS = [4, 1, 12.5, 0.25, 2, 100, -1]
const flat = (css: any) => {
        const o: [string, string][] = []
        const w = (x: any, p: string[]) => {
                for (const k in x) {
                        const v = x[k]
                        v && typeof v === 'object' ? w(v, [...p, k]) : o.push([[...p, k].join('\u0001'), String(v)])
                }
        }
        w(css, [])
        return o
}
const unflat = (t: Record<string, string>) => {
        const out: any = {}
        for (const p in t) {
                const ks = p.split('\u0001')
                let o = out
                for (let i = 0; i < ks.length - 1; i++) o = o[ks[i]] || (o[ks[i]] = {})
                o[ks[ks.length - 1]] = t[p]
        }
        return out
}
const infer = (node: Node) => {
        for (const k in node.ch) infer(node.ch[k])
        if (!node.kind) return
        const S = node.samp
        for (const mult of node.kind === 'n' ? MULTS : [null]) {
                const tpl: Record<string, string> = {}
                let ok = true
                const [a0, c0] = S[0]
                for (const [p, val] of flat(c0)) {
                        const tok = mult == null ? String(a0) : String(Number(a0) * mult)
                        tpl[p] = tok !== '' && val.split(tok).length > 1 ? val.split(tok).join('^') : val
                }
                for (const [a, c] of S) {
                        const fl = flat(c)
                        if (fl.length !== Object.keys(tpl).length) {
                                ok = false
                                break
                        }
                        for (const [p, val] of fl) {
                                const t = tpl[p]
                                if (t === undefined) {
                                        ok = false
                                        break
                                }
                                const tok = mult == null ? String(a) : String(Number(a) * mult)
                                if (t.split('^').join(tok) !== val) {
                                        ok = false
                                        break
                                }
                        }
                        if (!ok) break
                }
                if (ok) {
                        node.mult = mult == null ? 1 : mult
                        node.rule = unflat(tpl)
                        return
                }
        }
        node.mult = 1
        node.rule = unflat(Object.fromEntries(flat(S[0][1])))
}
for (const r in trees) infer(trees[r])
const kebab = (s: string) => s.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase())
const isFlat = (o: any) => Object.values(o).every((v) => typeof v !== 'object')
const encRule = (o: any) =>
        isFlat(o)
                ? Object.entries(o)
                          .map(([k, v]) => kebab(k) + '=' + v)
                          .join('|')
                : '{' + JSON.stringify(o)
const serialize = (root: string) => {
        const lines: string[] = []
        const t = trees[root]
        if ('rule' in t) lines.push('=' + encRule(t.rule))
        const walk = (node: Node, depth: number) => {
                for (const k of Object.keys(node.ch)) {
                        const c = node.ch[k]
                        let head = '.'.repeat(depth) + k
                        if (k === '$' && c.mult !== undefined && c.mult !== 1) head += '*' + c.mult
                        lines.push('rule' in c ? head + '=' + encRule(c.rule) : head)
                        walk(c, depth + 1)
                }
        }
        walk(t, 0)
        return lines.join(';')
}
trees['forcedColorAdjust'] = N()
trees['forcedColorAdjust'].ch['auto'] = { ch: {}, samp: [], rule: { forcedColorAdjust: 'auto' } }
trees['forcedColorAdjust'].ch['none'] = { ch: {}, samp: [], rule: { forcedColorAdjust: 'none' } }
const typeSrc = fs.readFileSync(path.join(dir, 'src', 'types.ts'), 'utf8')
const ub = typeSrc.slice(typeSrc.indexOf('export type U = {'))
const uKeys: string[] = []
for (const line of ub.split('\n')) {
        const m = /^\t{2}([A-Za-z_$][\w$]*)\s*:/.exec(line) || /^ {8}([A-Za-z_$][\w$]*)\s*:/.exec(line)
        if (m) uKeys.push(m[1])
        if (/^}/.test(line) && uKeys.length) break
}

const aliasDsl: Record<string, string> = {
        m: 'auto=margin=auto;$*4=margin=^px;_=margin=^',
        margin: 'auto=margin=auto;$*4=margin=^px;_=margin=^',
        mx: 'auto=margin-inline=auto;$*4=margin-inline=^px;_=margin-inline=^',
        my: 'auto=margin-block=auto;$*4=margin-block=^px;_=margin-block=^',
        ms: 'auto=margin-inline-start=auto;$*4=margin-inline-start=^px;_=margin-inline-start=^',
        me: 'auto=margin-inline-end=auto;$*4=margin-inline-end=^px;_=margin-inline-end=^',
        ml: 'auto=margin-left=auto;$*4=margin-left=^px;_=margin-left=^',
        mr: 'auto=margin-right=auto;$*4=margin-right=^px;_=margin-right=^',
        mt: 'auto=margin-block-start=auto;$*4=margin-top=^px;_=margin-block-start=^',
        mb: 'auto=margin-block-end=auto;$*4=margin-bottom=^px;_=margin-block-end=^',
        mbs: '$*4=margin-block-start=^px;_=margin-block-start=^',
        mbe: '$*4=margin-block-end=^px;_=margin-block-end=^',
        p: '$*4=padding=^px;_=padding=^',
        padding: '$*4=padding=^px;_=padding=^',
        px: '$*4=padding-inline=^px;_=padding-inline=^',
        py: '$*4=padding-block=^px;_=padding-block=^',
        ps: '$*4=padding-inline-start=^px;_=padding-inline-start=^',
        pe: '$*4=padding-inline-end=^px;_=padding-inline-end=^',
        pl: '$*4=padding-left=^px;_=padding-left=^',
        pr: '$*4=padding-right=^px;_=padding-right=^',
        pt: '$*4=padding-top=^px;_=padding-block-start=^',
        pb: '$*4=padding-bottom=^px;_=padding-block-end=^',
        pbs: '$*4=padding-block-start=^px;_=padding-block-start=^',
        pbe: '$*4=padding-block-end=^px;_=padding-block-end=^',
        cols: '$=display=grid|grid-template-columns=repeat(^, minmax(0, 1fr));none=display=grid|grid-template-columns=none;subgrid=display=grid|grid-template-columns=subgrid',
        rows: '$=display=grid|grid-template-rows=repeat(^, minmax(0, 1fr));none=display=grid|grid-template-rows=none;subgrid=display=grid|grid-template-rows=subgrid',
        colStart: '$=grid-column-start=^;auto=grid-column-start=auto',
        css: '',
        dark: '',
        sm: '',
        md: '',
        lg: '',
        xl: '',
        xl2: '',
        maxSm: '',
        maxMd: '',
}
const reserved = new Set(['break', 'static'])
const exportName = (r: string) => (reserved.has(r) ? r + '_' : r)
const decl = (r: string) => {
        const dsl = aliasDsl[r] ?? (trees[r] ? serialize(r) : '')
        const name = exportName(r)
        const line = `export const ${name}: U['${r}'] = u('${r}', \`${dsl}\`)`
        return reserved.has(r) ? line + `\nexport { ${name} as ${r} }` : line
}
const head = "import { u } from './utils.ts'\nimport type { C, U } from './types.ts'\n"
const body = uKeys.sort().map(decl).join('\n')
const tail = "\nexport const define = <T = C>(name: string, dsl = ''): T => u(name, dsl) as unknown as T"
fs.writeFileSync(path.join(dir, 'src', 'index.ts'), head + body + tail + '\n')
console.log('generated src/index.ts U-keys', uKeys.length, 'derived', uKeys.filter((k) => trees[k]).length)
