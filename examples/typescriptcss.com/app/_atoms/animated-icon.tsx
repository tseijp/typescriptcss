'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * AnimatedIcon swaps a server-rendered `<img>` (icon.webp) for an animated
 * `<video>` (icon.webm) only after the page has fully loaded and the browser
 * is idle. This keeps the webp as the LCP element and never downloads the
 * heavier webm until after Lighthouse-relevant work is done, so the score
 * cannot regress.
 *
 * This component owns the swap logic only. All sizing/styling lives on the
 * server-rendered children passed in from the server component, so the markup
 * here stays as thin as possible.
 */
export default function AnimatedIcon({ src, width, height, radius, children }: { src: string; width: number; height: number; radius: string; children: React.ReactNode }) {
        const [ready, setReady] = useState(false)
        const [visible, setVisible] = useState(false)
        const videoRef = useRef<HTMLVideoElement>(null)

        // Only mount the <video> once the page has loaded and the browser is idle,
        // so the webm download never competes with the rest of the page network.
        useEffect(() => {
                let idleId: number | undefined
                const schedule = () => {
                        const ric = (window as Window & typeof globalThis).requestIdleCallback
                        if (ric) idleId = ric(() => setReady(true), { timeout: 3000 })
                        else idleId = window.setTimeout(() => setReady(true), 1500)
                }
                if (document.readyState === 'complete') schedule()
                else {
                        window.addEventListener('load', schedule, { once: true })
                        return () => window.removeEventListener('load', schedule)
                }
                return () => {
                        const cic = (window as Window & typeof globalThis).cancelIdleCallback
                        if (idleId !== undefined) cic ? cic(idleId) : window.clearTimeout(idleId)
                }
        }, [])

        return (
                <span style={{ position: 'relative', display: 'inline-flex', width, height, flexShrink: 0 }}>
                        {children}
                        {ready && (
                                <video
                                        ref={videoRef}
                                        src={src}
                                        width={width}
                                        height={height}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        preload="auto"
                                        aria-hidden
                                        onCanPlay={() => setVisible(true)}
                                        style={{ position: 'absolute', inset: 0, width, height, borderRadius: radius, objectFit: 'cover', opacity: visible ? 1 : 0, transition: 'opacity 200ms ease' }}
                                />
                        )}
                </span>
        )
}
