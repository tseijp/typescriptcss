import { m, text } from 'typescriptcss/src'
import { color } from '@/styles'

export type ArticleHeaderProps = {
        eyebrow: string
        title: string
}

export const ArticleHeader = ({ eyebrow, title }: ArticleHeaderProps) => (
        <>
                <span style={text[3].letterSpacing['0.1em'].text[color.cyan].font.semibold.textTransform.uppercase()}>{eyebrow}</span>
                <h1 style={m[0].leading[10].text[8].text[color.text].font.semibold.tracking.tight()}>{title}</h1>
        </>
)
