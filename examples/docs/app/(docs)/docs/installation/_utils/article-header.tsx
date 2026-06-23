import { font, m } from 'typescriptcss/src'
import { color } from '@/styles'

export type ArticleHeaderProps = {
        eyebrow: string
        title: string
}

export const ArticleHeader = ({ eyebrow, title }: ArticleHeaderProps) => (
        <>
                <span style={font.semibold.letterSpacing['0.1em'].text[3].text[color.cyan].textTransform.uppercase()}>{eyebrow}</span>
                <h1 style={m[0].leading[10].font.semibold.text[8].text[color.text].tracking.tight()}>{title}</h1>
        </>
)
