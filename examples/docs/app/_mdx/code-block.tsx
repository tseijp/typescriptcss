import { Highlight } from 'prism-react-renderer'
import { px, py, text, w } from 'typescriptcss/src'
import { color, fontMono, prismTheme } from '@/styles'

const languageOf = (className?: string) => {
        const match = /language-(\w+)/.exec(className ?? '')
        return match?.[1] ?? 'tsx'
}

export const CodeBlock = ({ children }: { children?: any }) => {
        // MDX renders fenced code as <pre><code className="language-xxx">...</code></pre>
        const code = children?.props?.children ?? ''
        const language = languageOf(children?.props?.className)
        const source = typeof code === 'string' ? code.replace(/\n$/, '') : ''

        return (
                <div style={w.full.max.w.full.min.w[0].margin['20px 0'].flex.col.fontFamily[fontMono].fontSize['13px'].lineHeight['22px'].bg[color.panel].rounded[2].border.border[color.border].overflow.hidden()}>
                        <Highlight theme={prismTheme} code={source} language={language}>
                                {({ tokens, getLineProps, getTokenProps }) => (
                                        <div style={py[3].w.full.max.w.full.min.w[0].flex.col.overflowX.auto()}>
                                                {tokens.map((line, i) => (
                                                        <div key={i} style={px[4].flex({ ...getLineProps({ line }).style, backgroundColor: 'transparent', minHeight: '22px', alignItems: 'center' })}>
                                                                <span style={text[color.faint].width['28px'].userSelect.none.flexShrink[0]()}>{i + 1}</span>
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
                                                ))}
                                        </div>
                                )}
                        </Highlight>
                </div>
        )
}
