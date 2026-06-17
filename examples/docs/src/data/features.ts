export const features = [
        {
                title: 'No CSS files',
                body: 'Author every style inline as a chain. The build step collects them into one stylesheet, so there is no file to keep in sync with your components.',
                variant: 'wide',
                visual: 'code',
        },
        {
                title: 'Type-safe utilities',
                body: 'Each utility is a typed property. Your editor completes the next step and the compiler rejects names that do not exist.',
                variant: 'normal',
                visual: 'matrix',
        },
        {
                title: 'Responsive in the chain',
                body: 'Drop a breakpoint into the chain and the utilities after it apply from that width up. The media query is generated for you.',
                variant: 'normal',
                visual: 'bars',
        },
        {
                title: 'Dark mode in one declaration',
                body: 'A light value and its dark counterpart compile to a single light-dark() rule, so one chain covers both themes.',
                variant: 'normal',
                visual: 'palette',
        },
        {
                title: 'Zero runtime on the server',
                body: 'Chains render to plain style objects during SSR. Nothing from the styling layer ships to the client.',
                variant: 'normal',
                visual: 'avatars',
        },
        {
                title: 'Deduplicated output',
                body: 'Identical chains hash to the same class, so repeated patterns collapse and the generated CSS stays small as the app grows.',
                variant: 'wide',
                visual: 'code',
        },
]
