import { color } from './tokens'
export const diagonal = {
        backgroundImage: `repeating-linear-gradient(-45deg, ${color.line}1a 0px, ${color.line}1a 1px, transparent 1px, transparent 9px)`,
}
export const grid = {
        backgroundImage: `linear-gradient(${color.line}33 1px, transparent 1px), linear-gradient(90deg, ${color.line}33 1px, transparent 1px)`,
        backgroundSize: '48px 48px',
}
export const glow = {
        backgroundImage: `radial-gradient(60% 50% at 50% 0%, rgba(34,211,238,0.12) 0%, transparent 70%)`,
}
export const noise = {
        backgroundImage: `radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)`,
        backgroundSize: '3px 3px',
}
export const vrule = {
        backgroundImage: `linear-gradient(90deg, transparent 0%, ${color.border} 50%, transparent 100%)`,
}
export const cardSheen = {
        backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 40%)`,
}
