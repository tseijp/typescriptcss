export type Item = { type: 'head' | 'dot'; name: string } | { type: 'index'; raw: string }
export type Segment = { conditions: Item[][]; units: Item[][] }
export type State = { any?: boolean; condition?: boolean; custom?: boolean; greedy?: boolean; length?: boolean; number?: boolean; scope?: string }
