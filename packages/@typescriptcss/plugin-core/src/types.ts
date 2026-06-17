export type Target = 'inline' | 'head' | 'file' | 'auto'
export type Style = Record<string, any>
export type Edit = { start: number; end: number; text: string }
export type Span = { start: number; end: number; expr: string; cls?: string; clsStart?: number; clsEnd?: number }
export type Decl = { id: string; selector: string; body: string; media?: string }
export type Slot = { span: Span; head: Style; file: Style; klass: string }
export type Sheet = { add: (slot: Slot) => void; head: () => string; file: () => string; decls: () => Decl[] }
export type Loaded = { run: (expr: string) => Split | undefined }
export type Split = { head: Style; file: Style }
export type Resolved = { target: Target; minify: boolean; root: string; runtime: string; out: string; include: RegExp; exclude: RegExp }
export type Options = Partial<{ target: Target; minify: boolean; root: string; runtime: string; out: string; include: RegExp; exclude: RegExp }>
export type Output = { code: string; css: string; decls: Decl[] }
