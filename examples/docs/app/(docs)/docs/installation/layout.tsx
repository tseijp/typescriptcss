import { flex } from 'typescriptcss/src'

export default function InstallationLayout({ children }: Readonly<{ children: React.ReactNode }>) {
        return <article style={flex.col.gap[6].px[10].py[12]({ width: '100%', maxWidth: '1040px', boxSizing: 'border-box', marginLeft: 'auto', marginRight: 'auto' })}>{children}</article>
}
