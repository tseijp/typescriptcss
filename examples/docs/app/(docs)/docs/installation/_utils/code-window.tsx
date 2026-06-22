import { Highlight } from 'prism-react-renderer'
import { gap, min, px, py, text, w } from 'typescriptcss/src'
import { color, token, fontMono } from '@/styles'

export type CodeWindowProps = {
        title: string
        language: string
        lines: readonly string[]
}

export const CodeWindow = ({ title, language, lines }: CodeWindowProps) => {
        return (
                <div style={min.w[0].lineHeight['22px'].fontSize['13px'].flex.col.w.full.max.w.full.overflow.hidden.fontFamily[fontMono].bg[color.panel].rounded[2].border[color.border]()}>
                        <div style={px[4].py[2].flex.items.center.justify.between.bg[color.panelHi].border.b.border[color.border]()}>
                                <div style={gap[2].flex.items.center()}>
                                        <span style={{ width: '10px', height: '10px', borderRadius: '9999px', backgroundColor: '#475569', flexShrink: 0 }} />
                                        <span style={text[3].text[color.muted]()}>{title || language}</span>
                                </div>
                                <span style={text[3].text[color.faint]()}>Copy</span>
                        </div>
                        <Highlight
                                theme={{
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
                                }}
                                code={lines.join('\n')}
                                language={language === 'Terminal' || title === 'Terminal' ? 'bash' : 'tsx'}
                        >
                                {({ tokens, getLineProps, getTokenProps }) => (
                                        <div style={py[3].min.w[0].flex.col.w.full.max.w.full.overflowX.auto()}>
                                                {tokens.map((line, i) => {
                                                        return (
                                                                <div key={i} style={px[4].flex({ ...getLineProps({ line }).style, backgroundColor: 'transparent', minHeight: '22px', alignItems: 'center' })}>
                                                                        <span style={w[7].flexShrink[0].text[color.faint].userSelect.none()}>{i + 1}</span>
                                                                        <span style={{ whiteSpace: 'pre' }}>
                                                                                {line.map((tk, key) => {
                                                                                        const tokenProps = getTokenProps({ token: tk })
                                                                                        return (
                                                                                                <span key={key} style={tokenProps.style}>
                                                                                                        {tokenProps.children}
                                                                                                </span>
                                                                                        )
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
