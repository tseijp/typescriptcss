export const cardSheen = {
	backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 40%)`,
}

export const color = {
	bg: '#020617',
	panel: '#0b1120',
	panelHi: '#111a2e',
	border: '#1f2937',
	borderHi: '#334155',
	text: '#f8fafc',
	muted: '#9ca3af',
	faint: '#64748b',
	cyan: '#22d3ee',
	pink: '#f472b6',
	purple: '#c084fc',
	line: '#1e293b',
} as const

export const token = {
	cyan: '#67e8f9',
	pink: '#f9a8d4',
	purple: '#d8b4fe',
	gray: '#94a3b8',
	plain: '#e2e8f0',
} as const

export const fontMono = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'

export const prismTheme = {
	plain: { color: token.plain, backgroundColor: 'transparent' },
	styles: [
		{ types: ['comment', 'prolog', 'doctype', 'cdata'], style: { color: token.gray, fontStyle: 'italic' as const } },
		{ types: ['keyword', 'builtin', 'boolean', 'operator'], style: { color: token.pink } },
		{ types: ['string', 'char', 'attr-value', 'inserted'], style: { color: token.cyan } },
		{ types: ['number', 'constant', 'symbol'], style: { color: token.purple } },
		{ types: ['function', 'class-name', 'tag', 'attr-name'], style: { color: token.cyan } },
		{ types: ['punctuation'], style: { color: token.gray } },
		{ types: ['variable', 'property', 'imports'], style: { color: token.plain } },
	],
}
