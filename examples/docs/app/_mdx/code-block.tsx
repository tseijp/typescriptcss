import { Highlight } from 'prism-react-renderer'
import { flex, text } from 'typescriptcss/src'
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
                <div style={flex.col.bg[color.panel].border.border[color.border]({ borderWidth: '1px', borderRadius: '8px', overflow: 'hidden', fontFamily: fontMono, fontSize: '13px', lineHeight: '22px', width: '100%', maxWidth: '100%', minWidth: 0, margin: '20px 0' })}>
                        <Highlight theme={prismTheme} code={source} language={language}>
                                {({ tokens, getLineProps, getTokenProps }) => (
                                        <div style={flex.col.py[3]({ width: '100%', maxWidth: '100%', minWidth: 0, overflowX: 'auto' })}>
                                                {tokens.map((line, i) => (
                                                        <div key={i} style={flex.px[4]({ ...getLineProps({ line }).style, backgroundColor: 'transparent', minHeight: '22px', alignItems: 'center' })}>
                                                                <span style={text[color.faint]({ width: '28px', userSelect: 'none', flexShrink: 0 })}>{i + 1}</span>
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
