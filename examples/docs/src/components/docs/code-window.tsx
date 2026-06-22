import { Highlight, type PrismTheme } from 'prism-react-renderer'
import { flex, text } from 'typescriptcss/src'
import { color, token, fontMono } from '@/styles/tokens'
const theme: PrismTheme = {
        plain: { color: token.plain, backgroundColor: 'transparent' },
        styles: [
                { types: ['comment', 'prolog', 'doctype', 'cdata'], style: { color: token.gray, fontStyle: 'italic' } },
                { types: ['keyword', 'builtin', 'boolean', 'operator'], style: { color: token.pink } },
                { types: ['string', 'char', 'attr-value', 'inserted'], style: { color: token.cyan } },
                { types: ['number', 'constant', 'symbol'], style: { color: token.purple } },
                { types: ['function', 'class-name', 'tag', 'attr-name'], style: { color: token.cyan } },
                { types: ['punctuation'], style: { color: token.gray } },
                { types: ['variable', 'property', 'imports'], style: { color: token.plain } },
        ],
}
const dot = (c: string) => <span style={{ width: '10px', height: '10px', borderRadius: '9999px', backgroundColor: c, flexShrink: 0 }} />
export const CodeWindow = ({ title = '', language = '', lines = [], highlights = [] }: any) => {
        const code = (Array.isArray(lines) ? lines : [lines]).join('\n')
        const isTerminal = language === 'Terminal' || title === 'Terminal'
        const lang = isTerminal ? 'bash' : 'tsx'
        return (
                <div style={flex.col.bg[color.panel].border.border[color.border]({ borderWidth: '1px', borderRadius: '8px', overflow: 'hidden', fontFamily: fontMono, fontSize: '13px', lineHeight: '22px' })}>
                        <div style={flex.items.center.justify.between.px[4].py[2].bg[color.panelHi].border.b.border[color.border]({ borderBottomWidth: '1px' })}>
                                <div style={flex.items.center.gap[2]()}>
                                        {dot('#475569')}
                                        <span style={text[3].text[color.muted]({})}>{title || language}</span>
                                </div>
                                <span style={text[3].text[color.faint]({})}>Copy</span>
                        </div>
                        <Highlight theme={theme} code={code} language={lang}>
                                {({ tokens, getLineProps, getTokenProps }) => (
                                        <div style={flex.col.py[3]()}>
                                                {tokens.map((line, i) => {
                                                        const lineProps = getLineProps({ line })
                                                        const hot = highlights.indexOf(i) !== -1
                                                        return (
                                                                <div key={i} style={flex.px[4]({ ...lineProps.style, backgroundColor: hot ? 'rgba(34,211,238,0.08)' : 'transparent', minHeight: '22px', alignItems: 'center' })}>
                                                                        <span style={text[color.faint]({ width: '28px', userSelect: 'none', flexShrink: 0 })}>{i + 1}</span>
                                                                        <span style={{ whiteSpace: 'pre' }}>
                                                                                {line.map((tk, key) => {
                                                                                        const tokenProps = getTokenProps({ token: tk })
                                                                                        return <span key={key} style={tokenProps.style}>{tokenProps.children}</span>
                                                                                })}
                                                                        </span>
                                                                </div>
                                                        )
                                                })}
                                        </div>
                                )}
                        </Highlight>
                </div>
        )
}
