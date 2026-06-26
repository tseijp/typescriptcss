import Link from 'next/link'
import { bg, flex, font, gap, inline, inlineBlock, leading, max, min, ml, p, px, py, text, w } from 'typescriptcss/src'
import { cardSheen, color, fontMono } from '@/styles'

const Cta = ({ href, primary, children }: any) => {
        if (primary)
                return (
                        <Link href={href} style={px[5].py[3].font[600].text[3.5].text[color.bg].flex.items.center.justify.center.bg[color.cyan].rounded[2].border[color.cyan].textDecoration.none()}>
                                {children}
                        </Link>
                )
        return (
                <Link href={href} style={px[5].py[3].font[600].text[3.5].text[color.text].flex.items.center.justify.center.bg.transparent.rounded[2].border[color.border].textDecoration.none()}>
                        {children}
                </Link>
        )
}
const Bento = ({ title, body }: any) => (
        <div style={p[6].gap[3].flex.col.bg[color.panel].backgroundImage[cardSheen.backgroundImage].rounded[4].border[color.border]()}>
                <div style={font.semibold.text[4].text[color.text]()}>{title}</div>
                <div style={leading[7].text[3.5].text[color.muted]()}>{body}</div>
        </div>
)
const dot = (color: '#f87171' | '#fbbf24' | '#34d399') => <span style={bg[color].width['11px'].height['11px'].rounded.full()} />

export default function Home() {
        return (
                <div style={w.full.flex.col.items.center()}>
                        <section style={py[20].w.full.max.w[240].gap[6].flex.col.items.center.backgroundImage['radial-gradient(60% 50% at 50% 0%, rgba(34,211,238,0.12) 0%, transparent 70%)']()}>
                                <span style={px[3].py[1].text[3].text[color.cyan].gap[2].flex.items.center.fontFamily[fontMono].rounded.full.border[color.border]()}>v0.1 — TypeScript-authored styles</span>
                                <h1 style={max.w[208].lineHeight['1.05'].letterSpacing['-0.03em'].font.semibold.text[14].text[color.text].text.center()}>
                                        <span style={inlineBlock()}>Write your styles in TypeScript.</span>
                                        <span style={inlineBlock()}>Ship them as CSS.</span>
                                </h1>
                                <p style={max.w[160].leading[8].fontSize['19px'].text[color.muted].text.center()}>typescriptcss turns Tailwind-like utility chains into a real stylesheet at build time — type-checked, deduplicated, and rendered on the server with no runtime.</p>
                                <div style={py[2].gap[3].flex()}>
                                        <Cta href="/docs" primary>
                                                Get started
                                        </Cta>
                                        <Cta href="/docs/styling-with-utility-classes">Read the docs</Cta>
                                </div>
                        </section>
                        <section style={py[6].w.full.max.w[240].gap[6].flex.items.stretch()}>
                                <div style={min.w[0].flex[2].col()}>
                                        <div style={flex.col.lineHeight['22px'].fontSize['13px'].fontFamily[fontMono].boxShadow['0 20px 60px -20px rgba(0,0,0,0.6)'].bg[color.panel].rounded[3].border[color.border].overflow.hidden()}>
                                                <div style={px[4].py[3].gap[2].flex.items.center.bg[color.panelHi]()}>
                                                        {dot('#f87171')}
                                                        {dot('#fbbf24')}
                                                        {dot('#34d399')}
                                                        <span style={ml[2].text[3].text[color.faint]()}>card.tsx</span>
                                                </div>
                                                <div style={py[4].flex.col()}>
                                                        {[[{ t: 'kw', v: 'export default' }, { v: ' ' }, { t: 'kw', v: 'function' }, { v: ' ' }, { t: 'fn', v: 'Card' }, { v: '() {' }], [{ v: '  ' }, { t: 'kw', v: 'return' }, { v: ' (' }], [{ v: '    <' }, { t: 'fn', v: 'div' }, { v: ' style={' }, { t: 'fn', v: 'p' }, { v: '[' }, { t: 'str', v: '6' }, { v: ']' }, { t: 'mut', v: '.gap' }, { v: '[' }, { t: 'str', v: '4' }, { v: ']' }], [{ v: '      ' }, { t: 'mut', v: '.flex.col.items.center' }], [{ v: '      ' }, { t: 'mut', v: '.bg' }, { v: '[' }, { t: 'str', v: "'#0b1120'" }, { v: ']' }, { t: 'mut', v: '.rounded' }, { v: '[' }, { t: 'str', v: '4' }, { v: ']' }, { t: 'mut', v: '.dark.bg.black' }, { v: '()}>' }], [{ v: '      <' }, { t: 'fn', v: 'h2' }, { v: ' style={' }, { t: 'fn', v: 'text' }, { v: '[' }, { t: 'str', v: "'#fff'" }, { v: ']' }, { t: 'mut', v: '.font.semibold' }, { v: '()}>' }], [{ v: '        Zero runtime' }], [{ v: '      </' }, { t: 'fn', v: 'h2' }, { v: '>' }], [{ v: '    </' }, { t: 'fn', v: 'div' }, { v: '>' }], [{ v: '  )' }], [{ v: '}' }]].map((segments: any[], lineIndex: number) => (
                                                                <div key={lineIndex} style={px[5].minHeight['22px'].flex.items.center()}>
                                                                        <span style={text[color.faint].width['30px'].flexShrink[0].userSelect.none()}>{lineIndex + 1}</span>
                                                                        <span style={inline.whiteSpace.pre()}>
                                                                                {segments.map((segment: any, segmentIndex: number) => {
                                                                                        if (segment.t === 'kw')
                                                                                                return (
                                                                                                        <span key={segmentIndex} style={text[color.pink]()}>
                                                                                                                {segment.v}
                                                                                                        </span>
                                                                                                )
                                                                                        if (segment.t === 'fn')
                                                                                                return (
                                                                                                        <span key={segmentIndex} style={text[color.cyan]()}>
                                                                                                                {segment.v}
                                                                                                        </span>
                                                                                                )
                                                                                        if (segment.t === 'str')
                                                                                                return (
                                                                                                        <span key={segmentIndex} style={text[color.purple]()}>
                                                                                                                {segment.v}
                                                                                                        </span>
                                                                                                )
                                                                                        if (segment.t === 'mut')
                                                                                                return (
                                                                                                        <span key={segmentIndex} style={text[color.faint]()}>
                                                                                                                {segment.v}
                                                                                                        </span>
                                                                                                )
                                                                                        return (
                                                                                                <span key={segmentIndex} style={text[color.text]()}>
                                                                                                        {segment.v}
                                                                                                </span>
                                                                                        )
                                                                                })}
                                                                        </span>
                                                                </div>
                                                        ))}
                                                </div>
                                        </div>
                                </div>
                                <div style={min.w[0].flex[1].col.justify.center()}>
                                        <div style={p[6].gap[4].flex.col.items.center.bg['#0b1120'].rounded[4].border[color.border].dark.bg.black()}>
                                                <img src="/icon.webp" alt="" width={128} height={128} style={{ borderRadius: '9999px', flexShrink: 0 }} />
                                                <div style={font.semibold.fontSize['18px'].text['#fff']()}>Zero runtime</div>
                                                <div style={text[3.5].text[color.muted].text.center()}>Rendered from the chain on the left. No CSS file, no class names.</div>
                                        </div>
                                </div>
                        </section>
                        <section style={py[20].w.full.max.w[240].gap[8].flex.col()}>
                                <div style={gap[3].flex.col()}>
                                        <span style={font.semibold.letterSpacing['0.12em'].text[3].text[color.cyan].fontFamily[fontMono].textTransform.uppercase()}>Why typescriptcss</span>
                                        <h2 style={max.w[176].letterSpacing['-0.02em'].font.semibold.fontSize['34px'].text[color.text]()}>The ergonomics of utilities, without the stylesheet to maintain.</h2>
                                </div>
                                <div style={gap[4].flex.wrap()}>
                                        <div style={flex[1].col.minWidth['260px']()}>
                                                <Bento title="No CSS files" body="Author styles inline as chains. The build step collects them into one stylesheet — there is no file to keep in sync with your components." />
                                        </div>
                                        <div style={flex[1].col.minWidth['260px']()}>
                                                <Bento title="Typed and completed" body="Every utility is a property your editor completes and the compiler validates. Invalid styles fail to type-check before they ship." />
                                        </div>
                                        <div style={flex[1].col.minWidth['260px']()}>
                                                <Bento title="Zero runtime" body="Chains render to plain style objects on the server and collapse to classes at build. Nothing extra runs in the browser." />
                                        </div>
                                </div>
                        </section>
                </div>
        )
}
