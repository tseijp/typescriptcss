'use client'

import { useEffect, useState } from 'react'

export default function AnimatedIcon({ src, width, height, children }: { src: string; width: number; height: number; children: React.ReactNode }) {
        const [isReady, setIsReady] = useState(false)
        const [visible, setVisible] = useState(false)

        // Only mount the <video> once the page has loaded and the browser is idle,
        // so the webm download never competes with the rest of the page network.
        useEffect(() => {
                // Respect users who opt out of motion: keep the static webp.
                if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

                let idleId: number | undefined
                const ric = window.requestIdleCallback
                const cic = window.cancelIdleCallback
                const schedule = () => (idleId = ric ? ric(() => setIsReady(true), { timeout: 3000 }) : window.setTimeout(() => setIsReady(true), 1500))
                const cancel = () => (idleId !== undefined ? (cic ? cic(idleId) : window.clearTimeout(idleId)) : undefined)

                if (document.readyState === 'complete') schedule()
                else window.addEventListener('load', schedule, { once: true })

                return () => {
                        window.removeEventListener('load', schedule)
                        cancel()
                }
        }, [])

        return (
                <span style={{ position: 'relative', display: 'inline-flex', width, height, flexShrink: 0 }}>
                        {/* webp (transparent) is hidden once the webm can play, so the two never show stacked. */}
                        <span style={{ display: 'inline-flex', opacity: visible ? 0 : 1, transition: 'opacity 200ms ease' }}>{children}</span>
                        {isReady ? <video src={src} width={width} height={height} autoPlay muted loop playsInline preload="auto" aria-hidden onCanPlay={() => setVisible(true)} style={{ position: 'absolute', inset: 0, objectFit: 'cover', opacity: visible ? 1 : 0, transition: 'opacity 200ms ease' }} /> : null}
                </span>
        )
}
