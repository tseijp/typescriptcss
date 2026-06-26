import { mx } from 'typescriptcss/src'

export default function InstallationLayout({ children }: Readonly<{ children: React.ReactNode }>) {
        return <article style={mx.auto.px[10].py[12].max.w[260].w.full.gap[6].flex.col.boxSizing['border-box']()}>{children}</article>
}
