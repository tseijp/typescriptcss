import { text } from 'typescriptcss/src'
import { color } from '@/styles/tokens'

export type ArticleHeaderProps = {
        eyebrow: string
        title: string
}

export const ArticleHeader = ({ eyebrow, title }: ArticleHeaderProps) => (
        <>
                <span style={text[3].text[color.cyan].font.semibold({ textTransform: 'uppercase', letterSpacing: '0.1em' })}>{eyebrow}</span>
                <h1 style={text[8].text[color.text].font.semibold.tracking.tight.leading[10]({ margin: 0 })}>{title}</h1>
        </>
)
