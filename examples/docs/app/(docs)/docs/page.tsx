import Link from 'next/link'
import { bg, border, flex, font, gap, grid, leading, max, p, px, py, rounded, text } from 'typescriptcss/src'
import { cardSheen, color, fontMono } from '@/styles'
import { sections } from '@/const'
export default function DocsIndex() {
        return (
                <div style={py[12].px[8].max.w[224].gap[10].flex.col.w.full.marginInline.auto()}>
                        <header style={gap[4].flex.col()}>
                                <span style={text[3].letterSpacing['0.12em'].text[color.cyan].font.semibold.fontFamily[fontMono].textTransform.uppercase()}>Documentation</span>
                                <h1 style={leading[10].letterSpacing['-0.02em'].text[8.5].text[color.text].font.semibold()}>Write styles as TypeScript, ship them as CSS.</h1>
                                <p style={max.w[160].leading[8].text[4.25].text[color.muted]()}>typescriptcss lets you author Tailwind-like utilities as inline style chains. There is no CSS file to maintain and no class names to invent — the build step collects every chain, removes duplicates, and emits the stylesheet for you.</p>
                        </header>
                        {sections.map((group: any) => (
                                <section key={group.title} style={gap[4].flex.col()}>
                                        <h2 style={text[3].letterSpacing['0.08em'].text[color.faint].font.semibold.textTransform.uppercase()}>{group.title}</h2>
                                        <div style={gap[3].grid.gridTemplateColumns['repeat(auto-fill, minmax(220px, 1fr))']()}>
                                                {group.items.map((item: any) => (
                                                        <Link key={item.href} href={item.href} style={p[5].gap[2].flex.col.textDecoration.none.bg[color.panel].backgroundImage[cardSheen.backgroundImage].rounded[3].border[color.border]()}>
                                                                <span style={text[3.75].text[color.text].font.semibold()}>{item.label}</span>
                                                                <span style={leading[6].text[3.5].text[color.muted]()}>Read the guide</span>
                                                        </Link>
                                                ))}
                                        </div>
                                </section>
                        ))}
                </div>
        )
}
