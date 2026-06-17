import hashString from '@emotion/hash'
import { Style } from './types'
const kebab = (key: string): string => (key.startsWith('--') ? key : key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`))
const isEmpty = (value: any): boolean => value === undefined || value === null || value === ''
const stable = (style: Style): string =>
        Object.keys(style)
                .filter((key) => !isEmpty(style[key]))
                .sort()
                .map((key) => `${kebab(key)}:${style[key]}`)
                .join(';')
export const klass = (style: Style): string => `tcss-${hashString(stable(style))}`
export const toBody = (style: Style): string =>
        Object.keys(style)
                .filter((key) => !isEmpty(style[key]))
                .sort()
                .map((key) => `${kebab(key)}: ${style[key]};`)
                .join(' ')
