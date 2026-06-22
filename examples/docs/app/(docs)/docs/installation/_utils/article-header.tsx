import { m, text } from 'typescriptcss/src'
import { color } from '@/styles'

export type ArticleHeaderProps = {
        eyebrow: string
        title: string
}

export const ArticleHeader = ({ eyebrow, title }: ArticleHeaderProps) => (
        <>
                <span style={text[3].text[color.cyan].letterSpacing['0.1em'].textTransform.uppercase.font.semibold()}>{eyebrow}</span>
                <h1 style={m[0].text[8].text[color.text].leading[10].font.semibold.tracking.tight()}>{title}</h1>
        </>
)
