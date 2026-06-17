import { flex, px, py } from 'typescriptcss/src'

export default function InstallationLayout({ children }: Readonly<{ children: React.ReactNode }>) {
        return (
                <div style={flex.col.px[10].py[12]({ width: '100%', maxWidth: '960px', marginLeft: 'auto', marginRight: 'auto' })}>{children}</div>
        )
}
