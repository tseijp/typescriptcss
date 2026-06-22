import { gap, max, mx, px, py, w } from 'typescriptcss/src'

export default function InstallationLayout({ children }: Readonly<{ children: React.ReactNode }>) {
        return <article style={mx.auto.px[10].py[12].w.full.max.w[260].gap[6].boxSizing['border-box'].flex.col()}>{children}</article>
}
