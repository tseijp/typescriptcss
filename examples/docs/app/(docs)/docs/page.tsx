import Link from 'next/link'
import { font, gap, leading, max, p, py } from 'typescriptcss/src'
import { cardSheen, color, fontMono } from '@/styles'
import { sections } from '@/const'

export default function DocsIndex() {
        return (
                <div style={py[12].marginInline.auto.px[8].max.w[224].w.full.gap[10].flex.col()}>
                        <header style={gap[4].flex.col()}>
                                <span style={font.semibold.letterSpacing['0.12em'].text[3].text[color.cyan].fontFamily[fontMono].textTransform.uppercase()}>Documentation</span>
                                <h1 style={leading[10].letterSpacing['-0.02em'].font.semibold.text[8.5].text[color.text]()}>Write styles as TypeScript, ship them as CSS.</h1>
                                <p style={max.w[160].leading[8].text[4.25].text[color.muted]()}>typescriptcss lets you author Tailwind-like utilities as inline style chains. There is no CSS file to maintain and no class names to invent — the build step collects every chain, removes duplicates, and emits the stylesheet for you.</p>
                        </header>
                        {sections.map((group: any) => (
                                <section key={group.title} style={gap[4].flex.col()}>
                                        <h2 style={font.semibold.letterSpacing['0.08em'].text[3].text[color.faint].textTransform.uppercase()}>{group.title}</h2>
                                        <div style={gap[3].grid.gridTemplateColumns['repeat(auto-fill, minmax(220px, 1fr))']()}>
                                                {group.items.map((item: any) => (
                                                        <Link key={item.href} href={item.href} style={p[5].gap[2].flex.col.bg[color.panel].backgroundImage[cardSheen.backgroundImage].rounded[3].border[color.border].textDecoration.none()}>
                                                                <span style={font.semibold.text[3.75].text[color.text]()}>{item.label}</span>
                                                                <span style={leading[6].text[3.5].text[color.muted]()}>Read the guide</span>
                                                        </Link>
                                                ))}
                                        </div>
                                </section>
                        ))}
                </div>
        )
}
