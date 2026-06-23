import { gap, max, mx, px, py, w } from 'typescriptcss/src'

export default function InstallationLayout({ children }: Readonly<{ children: React.ReactNode }>) {
        return <article style={px[10].py[12].max.w[260].gap[6].flex.col.mx.auto.w.full.boxSizing['border-box']()}>{children}</article>
}
