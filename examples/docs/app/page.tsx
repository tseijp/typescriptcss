import Link from 'next/link'
import { bg, flex, inline, text } from 'typescriptcss/src'
import { color, fontMono } from '@/src/styles/tokens'
import { cardSheen } from '@/src/styles/patterns'

const Cta = ({ href, primary, children }: any) => {
        if (primary) return <Link href={href} style={flex.items.center.justify.center.px[5].py[3].rounded[2]({ textDecoration: 'none', fontWeight: 600, fontSize: '14px', color: color.bg, background: color.cyan, borderWidth: '1px', borderStyle: 'solid', borderColor: color.cyan })}>{children}</Link>
        return <Link href={href} style={flex.items.center.justify.center.px[5].py[3].rounded[2]({ textDecoration: 'none', fontWeight: 600, fontSize: '14px', color: color.text, background: 'transparent', borderWidth: '1px', borderStyle: 'solid', borderColor: color.border })}>{children}</Link>
}
const Bento = ({ title, body }: any) => (
        <div style={flex.col.gap[3].p[6].rounded[4].bg[color.panel](cardSheen, { borderWidth: '1px', borderStyle: 'solid', borderColor: color.border })}>
                <div style={text[color.text].font.semibold({ fontSize: '16px' })}>{title}</div>
                <div style={text[color.muted].leading[7]({ fontSize: '14px' })}>{body}</div>
        </div>
)
const dot = (color: '#f87171' | '#fbbf24' | '#34d399') => <span style={bg[color]({ width: '11px', height: '11px', borderRadius: '9999px' })} />

export default function Home() {
        return (
                <div style={flex.col.items.center({ width: '100%' })}>
                        <section
                                style={flex.col.items.center.gap[6].px[6].py[20].max.w[240]({
                                        width: '100%',
                                        position: 'relative',
                                        backgroundImage: 'radial-gradient(60% 50% at 50% 0%, rgba(34,211,238,0.12) 0%, transparent 70%)',
                                })}
                        >
                                <span style={flex.items.center.gap[2].px[3].py[1].rounded.full({ borderWidth: '1px', borderStyle: 'solid', borderColor: color.border, fontFamily: fontMono, fontSize: '12px', color: color.cyan })}>v0.1 — TypeScript-authored styles</span>
                                <h1 style={text[color.text].font.semibold.max.w[208]({ fontSize: '56px', lineHeight: '1.05', letterSpacing: '-0.03em', textAlign: 'center' })}>Write your styles in TypeScript. Ship them as CSS.</h1>
                                <p style={text[color.muted].max.w[160].leading[8]({ fontSize: '19px', textAlign: 'center' })}>typescriptcss turns Tailwind-like utility chains into a real stylesheet at build time — type-checked, deduplicated, and rendered on the server with no runtime.</p>
                                <div style={flex.gap[3].py[2]()}>
                                        <Cta href="/docs" primary>Get started</Cta>
                                        <Cta href="/docs/styling-with-utility-classes">Read the docs</Cta>
                                </div>
                        </section>
                        <section style={flex.gap[6].px[6].max.w[240].py[6]({ width: '100%', alignItems: 'stretch' })}>
                                <div style={flex.col({ flex: 2, minWidth: '0px' })}>
                                        <div style={flex.col.bg[color.panel]({ borderWidth: '1px', borderStyle: 'solid', borderColor: color.border, borderRadius: '12px', overflow: 'hidden', fontFamily: fontMono, fontSize: '13px', lineHeight: '22px', boxShadow: '0 20px 60px -20px rgba(0,0,0,0.6)' })}>
                                                <div style={flex.items.center.px[4].py[3].bg[color.panelHi]({ gap: '8px', borderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: color.border })}>
                                                        {dot('#f87171')}
                                                        {dot('#fbbf24')}
                                                        {dot('#34d399')}
                                                        <span style={text[color.faint]({ marginLeft: '8px', fontSize: '12px' })}>card.tsx</span>
                                                </div>
                                                <div style={flex.col.py[4]()}>
                                                        {[
                                                                [{ t: 'kw', v: 'export default' }, { v: ' ' }, { t: 'kw', v: 'function' }, { v: ' ' }, { t: 'fn', v: 'Card' }, { v: '() {' }],
                                                                [{ v: '  ' }, { t: 'kw', v: 'return' }, { v: ' (' }],
                                                                [{ v: '    <' }, { t: 'fn', v: 'div' }, { v: ' style={' }, { t: 'fn', v: 'flex' }, { t: 'mut', v: '.col.items.center' }],
                                                                [{ v: '      ' }, { t: 'mut', v: '.gap' }, { v: '[' }, { t: 'str', v: '4' }, { v: ']' }, { t: 'mut', v: '.p' }, { v: '[' }, { t: 'str', v: '6' }, { v: ']' }, { t: 'mut', v: '.rounded' }, { v: '[' }, { t: 'str', v: '4' }, { v: ']' }],
                                                                [{ v: '      ' }, { t: 'mut', v: '.bg' }, { v: '[' }, { t: 'str', v: "'#0b1120'" }, { v: ']' }, { t: 'mut', v: '.dark.bg.black' }, { v: '()}>' }],
                                                                [{ v: '      <' }, { t: 'fn', v: 'h2' }, { v: ' style={' }, { t: 'fn', v: 'text' }, { v: '[' }, { t: 'str', v: "'#fff'" }, { v: ']' }, { t: 'mut', v: '.font.semibold' }, { v: '()}>' }],
                                                                [{ v: '        Zero runtime' }],
                                                                [{ v: '      </' }, { t: 'fn', v: 'h2' }, { v: '>' }],
                                                                [{ v: '    </' }, { t: 'fn', v: 'div' }, { v: '>' }],
                                                                [{ v: '  )' }],
                                                                [{ v: '}' }],
                                                        ].map((segments: any[], lineIndex: number) => (
                                                                <div key={lineIndex} style={flex.px[5]({ minHeight: '22px', alignItems: 'center' })}>
                                                                        <span style={text[color.faint]({ width: '30px', flexShrink: 0, userSelect: 'none' })}>{lineIndex + 1}</span>
                                                                        <span style={inline.whiteSpace.pre()}>
                                                                                {segments.map((segment: any, segmentIndex: number) => {
                                                                                        if (segment.t === 'kw') return <span key={segmentIndex} style={text[color.pink]()}>{segment.v}</span>
                                                                                        if (segment.t === 'fn') return <span key={segmentIndex} style={text[color.cyan]()}>{segment.v}</span>
                                                                                        if (segment.t === 'str') return <span key={segmentIndex} style={text[color.purple]()}>{segment.v}</span>
                                                                                        if (segment.t === 'mut') return <span key={segmentIndex} style={text[color.faint]()}>{segment.v}</span>
                                                                                        return <span key={segmentIndex} style={text[color.text]()}>{segment.v}</span>
                                                                                })}
                                                                        </span>
                                                                </div>
                                                        ))}
                                                </div>
                                        </div>
                                </div>
                                <div style={flex.col.justify.center({ flex: 1, minWidth: '0px' })}>
                                        <div style={flex.col.items.center.gap[4].p[6].rounded[4].bg['#0b1120'].dark.bg.black({ borderWidth: '1px', borderStyle: 'solid', borderColor: color.border })}>
                                                <div style={bg[color.cyan].rounded.full({ width: '48px', height: '48px' })} />
                                                <div style={text['#fff'].font.semibold({ fontSize: '18px' })}>Zero runtime</div>
                                                <div style={text[color.muted]({ fontSize: '14px', textAlign: 'center' })}>Rendered from the chain on the left. No CSS file, no class names.</div>
                                        </div>
                                </div>
                        </section>
                        <section style={flex.col.gap[8].px[6].py[20].max.w[240]({ width: '100%' })}>
                                <div style={flex.col.gap[3]()}>
                                        <span style={text[color.cyan].font.semibold({ fontFamily: fontMono, fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase' })}>Why typescriptcss</span>
                                        <h2 style={text[color.text].font.semibold.max.w[176]({ fontSize: '34px', letterSpacing: '-0.02em' })}>The ergonomics of utilities, without the stylesheet to maintain.</h2>
                                </div>
                                <div style={flex.gap[4]({ flexWrap: 'wrap' })}>
                                        <div style={flex.col({ flex: 1, minWidth: '260px' })}><Bento title="No CSS files" body="Author styles inline as chains. The build step collects them into one stylesheet — there is no file to keep in sync with your components." /></div>
                                        <div style={flex.col({ flex: 1, minWidth: '260px' })}><Bento title="Typed and completed" body="Every utility is a property your editor completes and the compiler validates. Invalid styles fail to type-check before they ship." /></div>
                                        <div style={flex.col({ flex: 1, minWidth: '260px' })}><Bento title="Zero runtime" body="Chains render to plain style objects on the server and collapse to classes at build. Nothing extra runs in the browser." /></div>
                                </div>
                        </section>
                </div>
        )
}
