import { describe, expect, test } from 'vitest'
import * as _ from '../src'
// Generated mechanically from docs/08_filters/*.mdx — chain() returns a style object.
// Unimplemented utilities return undefined and stay RED until added to src.

describe('filter', () => {
        test('filter.none', () => {
                expect(_.filter.none()).toEqual({ filter: 'none' })
        })
        test('filter[4]', () => {
                expect(_.filter[4]()).toEqual({ filter: 'var(4)' })
        })
})

describe('blur', () => {
        test('blur.none', () => {
                expect(_.blur.none()).toEqual({ filter: '' })
        })
})

describe('brightness', () => {
        test('brightness[4]', () => {
                expect(_.brightness[4]()).toEqual({ filter: 'brightness(4%)' })
        })
})

describe('contrast', () => {
        test('contrast[4]', () => {
                expect(_.contrast[4]()).toEqual({ filter: 'contrast(4%)' })
        })
})

describe('drop-shadow', () => {
        test("filter['drop-shadow(0 0 #0000)']", () => {
                expect(_.filter['drop-shadow(0 0 #0000)']()).toEqual({ filter: 'drop-shadow(0 0 #0000)' })
        })
})

describe('grayscale', () => {
        test("filter['grayscale(100%)']", () => {
                expect(_.filter['grayscale(100%)']()).toEqual({ filter: 'grayscale(100%)' })
        })
        test('grayscale[4]', () => {
                expect(_.grayscale[4]()).toEqual({ filter: 'grayscale(4%)' })
        })
})

describe('hue-rotate', () => {
        test('hue.rotate[4]', () => {
                expect(_.hue.rotate[4]()).toEqual({ filter: 'hue-rotate(4deg)' })
        })
})

describe('invert', () => {
        test("filter['invert(100%)']", () => {
                expect(_.filter['invert(100%)']()).toEqual({ filter: 'invert(100%)' })
        })
        test('invert[4]', () => {
                expect(_.invert[4]()).toEqual({ filter: 'invert(4%)' })
        })
})

describe('saturate', () => {
        test('saturate[4]', () => {
                expect(_.saturate[4]()).toEqual({ filter: 'saturate(4%)' })
        })
})

describe('sepia', () => {
        test('sepia', () => {
                expect(_.sepia()).toEqual({ filter: 'sepia(100%)' })
        })
        test('sepia[4]', () => {
                expect(_.sepia[4]()).toEqual({ filter: 'sepia(4%)' })
        })
})

describe('backdrop-filter', () => {
        test('backdrop.filter.none', () => {
                expect(_.backdrop.filter.none()).toEqual({ backdropFilter: 'none' })
        })
        test('backdrop.filter[4]', () => {
                expect(_.backdrop.filter[4]()).toEqual({ backdropFilter: 'var(4)' })
        })
})

describe('blur', () => {
        test('backdrop.blur.none', () => {
                expect(_.backdrop.blur.none()).toEqual({ backdropFilter: '' })
        })
})

describe('brightness', () => {
        test('backdrop.brightness[4]', () => {
                expect(_.backdrop.brightness[4]()).toEqual({ backdropFilter: 'brightness(4%)' })
        })
})

describe('contrast', () => {
        test('backdrop.contrast[4]', () => {
                expect(_.backdrop.contrast[4]()).toEqual({ backdropFilter: 'contrast(4%)' })
        })
})

describe('grayscale', () => {
        test('backdrop.grayscale', () => {
                expect(_.backdrop.grayscale()).toEqual({ backdropFilter: 'grayscale(100%)' })
        })
        test('backdrop.grayscale[4]', () => {
                expect(_.backdrop.grayscale[4]()).toEqual({ backdropFilter: 'grayscale(4%)' })
        })
})

describe('hue-rotate', () => {
        test('backdrop.hue.rotate[4]', () => {
                expect(_.backdrop.hue.rotate[4]()).toEqual({ backdropFilter: 'hue-rotate(4deg)' })
        })
})

describe('invert', () => {
        test('backdrop.invert', () => {
                expect(_.backdrop.invert()).toEqual({ backdropFilter: 'invert(100%)' })
        })
        test('backdrop.invert[4]', () => {
                expect(_.backdrop.invert[4]()).toEqual({ backdropFilter: 'invert(4%)' })
        })
})

describe('opacity', () => {
        test('backdrop.opacity[4]', () => {
                expect(_.backdrop.opacity[4]()).toEqual({ backdropFilter: 'opacity(4%)' })
        })
})

describe('saturate', () => {
        test('backdrop.saturate[4]', () => {
                expect(_.backdrop.saturate[4]()).toEqual({ backdropFilter: 'saturate(4%)' })
        })
})

describe('sepia', () => {
        test('backdrop.sepia', () => {
                expect(_.backdrop.sepia()).toEqual({ backdropFilter: 'sepia(100%)' })
        })
        test('backdrop.sepia[4]', () => {
                expect(_.backdrop.sepia[4]()).toEqual({ backdropFilter: 'sepia(4%)' })
        })
})
