import Link from 'next/link'
import { bg, border, flex, font, gap, grid, leading, max, p, px, py, rounded, text, tracking } from 'typescriptcss/src'
import { cardSheen, color, fontMono } from '@/styles'
import { sections } from '@/const'
export default function DocsIndex() {
        return (
                <div style={flex.col.gap[10].max.w[224].py[12].px[8]({ marginInline: 'auto', width: '100%' })}>
                        <header style={flex.col.gap[4]()}>
                                <span style={text[color.cyan].font.semibold({ fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: fontMono })}>Documentation</span>
                                <h1 style={text[color.text].font.semibold.leading[10]({ fontSize: '34px', letterSpacing: '-0.02em' })}>Write styles as TypeScript, ship them as CSS.</h1>
                                <p style={text[color.muted].max.w[160].leading[8]({ fontSize: '17px' })}>typescriptcss lets you author Tailwind-like utilities as inline style chains. There is no CSS file to maintain and no class names to invent — the build step collects every chain, removes duplicates, and emits the stylesheet for you.</p>
                        </header>
                        {sections.map((group: any) => (
                                <section key={group.title} style={flex.col.gap[4]()}>
                                        <h2 style={text[color.faint].font.semibold.tracking.tight({ fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase' })}>{group.title}</h2>
                                        <div style={grid.gap[3]({ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' })}>
                                                {group.items.map((item: any) => (
                                                        <Link key={item.href} href={item.href} style={flex.col.gap[2].p[5].rounded[3].border[1].border[color.border].bg[color.panel](cardSheen, { textDecoration: 'none' })}>
                                                                <span style={text[color.text].font.semibold({ fontSize: '15px' })}>{item.label}</span>
                                                                <span style={text[color.muted].text[3.5].leading[6]()}>Read the guide</span>
                                                        </Link>
                                                ))}
                                        </div>
                                </section>
                        ))}
                </div>
        )
}
