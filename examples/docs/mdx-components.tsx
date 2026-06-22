import type { MDXComponents } from 'mdx/types'
import { text } from 'typescriptcss/src'
import { color, fontMono } from '@/styles'
import { CodeBlock } from '@/_mdx/code-block'

export function useMDXComponents(components: MDXComponents): MDXComponents {
        return {
                ...components,
                h1: (props) => <h1 style={text[8].text[color.text].font.semibold.tracking.tight({ margin: '0 0 24px' })} {...props} />,
                h2: (props) => <h2 style={text[6].text[color.text].font.semibold.tracking.tight({ margin: '40px 0 16px' })} {...props} />,
                h3: (props) => <h3 style={text[5].text[color.text].font.semibold({ margin: '32px 0 12px' })} {...props} />,
                p: (props) => <p style={{ margin: '16px 0', color: color.muted, lineHeight: 1.7 }} {...props} />,
                a: (props) => <a style={{ color: color.cyan, textDecoration: 'none' }} {...props} />,
                strong: (props) => <strong style={{ color: color.text, fontWeight: 600 }} {...props} />,
                ul: (props) => <ul style={{ margin: '16px 0', paddingLeft: '24px', color: color.muted, lineHeight: 1.7 }} {...props} />,
                ol: (props) => <ol style={{ margin: '16px 0', paddingLeft: '24px', color: color.muted, lineHeight: 1.7 }} {...props} />,
                li: (props) => <li style={{ margin: '6px 0' }} {...props} />,
                pre: (props) => <CodeBlock {...props} />,
                code: (props) => <code style={{ fontFamily: fontMono, fontSize: '0.875em', color: color.text, backgroundColor: color.panelHi, padding: '2px 6px', borderRadius: '4px' }} {...props} />,
                table: (props) => <table style={{ width: '100%', borderCollapse: 'collapse', margin: '24px 0', fontSize: '14px' }} {...props} />,
                thead: (props) => <thead {...props} />,
                tbody: (props) => <tbody {...props} />,
                tr: (props) => <tr style={{ borderBottom: `1px solid ${color.border}` }} {...props} />,
                th: (props) => <th style={{ textAlign: 'left', padding: '10px 16px', color: color.text, fontWeight: 600, borderBottom: `1px solid ${color.borderHi}` }} {...props} />,
                td: (props) => <td style={{ textAlign: 'left', padding: '10px 16px', color: color.muted }} {...props} />,
        }
}
