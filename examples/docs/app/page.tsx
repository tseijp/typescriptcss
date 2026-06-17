import Link from 'next/link'
import { flex, text, bg,  } from 'typescriptcss/src'
import { color, fontMono } from '@/src/styles/tokens'
import { glow, cardSheen } from '@/src/styles/patterns'
import { HeroCode } from '@/src/components/site/hero-code'
const Pill = ({ children }: any) => (
        <span style={flex.items.center.gap[2].px[3].py[1].rounded.full({ borderWidth: '1px', borderStyle: 'solid', borderColor: color.border, fontFamily: fontMono, fontSize: '12px', color: color.cyan })}>{children}</span>
)
const Cta = ({ href, primary, children }: any) => (
        <Link href={href} style={flex.items.center.justify.center.px[5].py[3].rounded[2]({ textDecoration: 'none', fontWeight: 600, fontSize: '14px', color: primary ? color.bg : color.text, background: primary ? color.cyan : 'transparent', borderWidth: '1px', borderStyle: 'solid', borderColor: primary ? color.cyan : color.border })}>{children}</Link>
)
const Preview = () => (
        <div style={flex.col.items.center.gap[4].p[6].rounded[4].bg['#0b1120'].dark.bg.black({ borderWidth: '1px', borderStyle: 'solid', borderColor: color.border })}>
                <div style={bg[color.cyan].rounded.full({ width: '48px', height: '48px' })} />
                <div style={text['#fff'].font.semibold({ fontSize: '18px' })}>Zero runtime</div>
                <div style={text[color.muted]({ fontSize: '14px', textAlign: 'center' })}>Rendered from the chain on the left. No CSS file, no class names.</div>
        </div>
)
const Bento = ({ title, body }: any) => (
        <div style={flex.col.gap[3].p[6].rounded[4].bg[color.panel](cardSheen, { borderWidth: '1px', borderStyle: 'solid', borderColor: color.border })}>
                <div style={text[color.text].font.semibold({ fontSize: '16px' })}>{title}</div>
                <div style={text[color.muted].leading[7]({ fontSize: '14px' })}>{body}</div>
        </div>
)
export default function Home() {
        return (
                <div style={flex.col.items.center({ width: '100%' })}>
                        <section style={flex.col.items.center.gap[6].px[6].py[20].max.w[240]({ width: '100%', position: 'relative', ...glow })}>
                                <Pill>v0.1 — TypeScript-authored styles</Pill>
                                <h1 style={text[color.text].font.semibold.max.w[208]({ fontSize: '56px', lineHeight: '1.05', letterSpacing: '-0.03em', textAlign: 'center' })}>Write your styles in TypeScript. Ship them as CSS.</h1>
                                <p style={text[color.muted].max.w[160].leading[8]({ fontSize: '19px', textAlign: 'center' })}>typescriptcss turns Tailwind-like utility chains into a real stylesheet at build time — type-checked, deduplicated, and rendered on the server with no runtime.</p>
                                <div style={flex.gap[3].py[2]()}>
                                        <Cta href="/docs" primary>Get started</Cta>
                                        <Cta href="/docs/styling-with-utility-classes">Read the docs</Cta>
                                </div>
                        </section>
                        <section style={flex.gap[6].px[6].max.w[240].py[6]({ width: '100%', alignItems: 'stretch' })}>
                                <div style={flex.col({ flex: 2, minWidth: '0px' })}><HeroCode /></div>
                                <div style={flex.col.justify.center({ flex: 1, minWidth: '0px' })}><Preview /></div>
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
