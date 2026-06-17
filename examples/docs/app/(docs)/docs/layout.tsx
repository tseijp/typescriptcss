import { flex, min } from 'typescriptcss/src'
import { Sidebar } from '@/src/components/docs/sidebar'
import { primaryNav, sections } from '@/src/data/docs-nav'

export default function DocsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
        return (
                <div style={flex.row.min.h.full({ maxWidth: '1536px', marginLeft: 'auto', marginRight: 'auto', width: '100%' })}>
                        <Sidebar primaryNav={primaryNav} sections={sections} activePath="/docs" />
                        <main style={flex.col.min.h.full({ flex: 1, minWidth: '0px' })}>{children}</main>
                </div>
        )
}
