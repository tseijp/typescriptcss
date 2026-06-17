import { flex, text, font, gap, py, leading, tracking } from 'typescriptcss/src'
import { color } from '@/styles/tokens'
export const Article = ({ eyebrow = '', title = '', lead = '', children }: any) => (
        <article style={flex.col.gap[6].py[12]({ maxWidth: '960px', width: '100%' })}>
                {eyebrow ? <span style={text[3].text[color.cyan].font.semibold({ textTransform: 'uppercase', letterSpacing: '0.1em' })}>{eyebrow}</span> : null}
                {title ? <h1 style={text[8].text[color.text].font.semibold.tracking.tight.leading[10]({ margin: 0 })}>{title}</h1> : null}
                {lead ? <p style={text[4.5].text[color.muted].leading[8]({ margin: 0, maxWidth: '720px' })}>{lead}</p> : null}
                {children}
        </article>
)
