export type RuntimeStyle = Record<string, any>
export type Argument = RuntimeStyle | null | undefined | false
export type Func = (...styles: Argument[]) => RuntimeStyle
export type Utility = Record<string, any>
export type Native = Record<string, any>
export type Rule = (state: State) => State
export type State = { css: RuntimeStyle; dark?: boolean; greedy?: boolean; read?: (key: string) => State | undefined; scope?: string; wraps?: string[] }
export type Chain = Func & Utility & Native
