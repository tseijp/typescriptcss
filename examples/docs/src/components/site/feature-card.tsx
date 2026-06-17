import { flex, text, bg, p, gap, font, leading } from 'typescriptcss/src'
import { color } from '@/styles/tokens'
import { cardSheen } from '@/styles/patterns'
export const FeatureCard = ({ title, body, children, wide }: any) => {
        const span = wide ? { gridColumn: 'span 2' } : {}
        return (
                <div style={flex.col.gap[4].p[6].bg[color.panel](cardSheen, { borderWidth: '1px', borderStyle: 'solid', borderColor: color.border, borderRadius: '12px', overflow: 'hidden', ...span })}>
                        <div style={flex.col.gap[2]()}>
                                <div style={text[color.text].font.semibold({ fontSize: '16px' })}>{title}</div>
                                <div style={text[color.muted].leading[6]({ fontSize: '14px' })}>{body}</div>
                        </div>
                        <div style={flex.col({ flex: 1, justifyContent: 'flex-end' })}>{children}</div>
                </div>
        )
}
