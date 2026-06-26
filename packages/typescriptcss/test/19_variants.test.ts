import { describe, expect, test } from 'vitest'
import { bg } from '../src'

// Chapter E — variant surface (RED ledger).
// Variants are unimplemented. Each variant family is fully enumerated (one
// representative utility, no utility×variant product) so the missing surface is
// counted case by case, exactly like the mechanical 00–13 suites enumerate
// every documented utility. Reading an unimplemented variant segment yields
// undefined, so `bg[seg].bg['#000']()` throws → honest RED.

const VARIANTS: Record<string, string[]> = {
	interaction: ['hover', 'focus', 'focusWithin', 'focusVisible', 'active', 'visited', 'target'],
	structure: ['first', 'last', 'only', 'odd', 'even', 'firstOfType', 'lastOfType', 'onlyOfType', 'nth', 'nthLast', 'nthOfType', 'nthLastOfType', 'empty'],
	form: ['disabled', 'enabled', 'checked', 'indeterminate', 'defaultPseudo', 'optional', 'required', 'valid', 'invalid', 'userValid', 'userInvalid', 'inRange', 'outOfRange', 'placeholderShown', 'detailsContent', 'autofill', 'readOnly'],
	relational: ['has', 'notVariant', 'group', 'groupHover', 'peer', 'peerChecked', 'groupHas', 'peerHas', 'inert'],
	pseudoElement: ['before', 'after', 'firstLetter', 'firstLine', 'marker', 'selection', 'fileVariant', 'backdrop', 'placeholder'],
	child: ['child', 'descendant'],
	viewport: ['minArbitrary', 'maxDefault', 'maxArbitrary', 'rangeViewport'],
	container: ['container', 'containerSize', 'namedContainer', 'containerMin', 'containerMax'],
	preference: ['motionSafe', 'motionReduce', 'contrastMore', 'contrastLess', 'forcedColors', 'notForcedColors', 'invertedColors'],
	device: ['pointerFine', 'pointerCoarse', 'pointerNone', 'anyPointerFine', 'portrait', 'landscape', 'noscript', 'print'],
	feature: ['supports', 'supportsValue', 'supportsAnd', 'supportsNot', 'startingStyle'],
	attribute: ['ariaChecked', 'ariaArbitrary', 'dataPresence', 'dataValue', 'rtl', 'ltr', 'open', 'popover'],
	arbitrary: ['arbitrarySelector', 'arbitraryAtRule', 'registeredVariant'],
}

for (const [family, segs] of Object.entries(VARIANTS)) {
	describe(`VAR ${family}`, () => {
		test.each(segs)('[RED unsupported] %s applies a condition to the chain', (seg) => {
			const out = (bg as any)[seg].bg['#000']()
			expect(out).toBeTypeOf('object')
		})
	})
}
