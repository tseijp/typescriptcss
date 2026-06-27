import fs from 'node:fs'
import path from 'node:path'

type OrderedName = {
        name: string
        order: number
}

export type DocEntry = {
        title: string
        description: string
        slug: string
        href: string
        relativePath: string
        groupKey: string
        groupTitle: string
        groupOrder: number
        order: number
}

export type DocSection = {
        title: string
        items: DocEntry[]
}

const docsDirectory = path.join(process.cwd(), 'docs')

const stripOrderPrefix = (value: string): OrderedName => {
        const match = /^(\d+)_/.exec(value)
        if (!match) return { name: value, order: Number.MAX_SAFE_INTEGER }
        return { name: value.slice(match[0].length), order: Number(match[1]) }
}

const titleCase = (value: string) =>
        value
                .split(/[-_]+/)
                .filter(Boolean)
                .map((word) => {
                        if (word.toLowerCase() === 'svg') return 'SVG'
                        return word.charAt(0).toUpperCase() + word.slice(1)
                })
                .join(' ')

const groupTitle = (name: string) => {
        if (name === 'flexbox-grid') return 'Flexbox & Grid'
        if (name === 'transitions-animation') return 'Transitions & Animation'
        return titleCase(name)
}

const readExportString = (source: string, name: string) => {
        const pattern = new RegExp(`export\\s+const\\s+${name}\\s*=\\s*(['"\`])((?:\\\\.|(?!\\1)[\\s\\S])*)\\1`)
        const match = pattern.exec(source)
        if (!match) return ''
        return match[2].replace(/\\(['"`\\])/g, '$1')
}

const walkMdxFiles = (directory: string): string[] => {
        const entries = fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))
        return entries.flatMap((entry) => {
                const absolutePath = path.join(directory, entry.name)
                if (entry.isDirectory()) return walkMdxFiles(absolutePath)
                if (entry.isFile() && entry.name.endsWith('.mdx')) return [absolutePath]
                return []
        })
}

const createDocEntry = (absolutePath: string): DocEntry => {
        const relativePath = path.relative(docsDirectory, absolutePath).split(path.sep).join('/')
        const relativeDirectory = path.posix.dirname(relativePath)
        const file = stripOrderPrefix(path.posix.basename(relativePath, '.mdx'))
        const directorySegment = relativeDirectory === '.' ? '' : relativeDirectory.split('/')[0]
        const directory = stripOrderPrefix(directorySegment)
        const source = fs.readFileSync(absolutePath, 'utf8')
        const title = readExportString(source, 'title') || titleCase(file.name)
        const description = readExportString(source, 'description')
        const inFiltersGroup = directory.name === 'filters'
        const isBackdropFilter = inFiltersGroup && file.order >= 10
        const slug = isBackdropFilter && file.name !== 'backdrop-filter' ? `backdrop-${file.name.replace(/-2$/, '')}` : file.name

        return {
                title,
                description,
                slug,
                href: `/docs/${slug}`,
                relativePath,
                groupKey: directorySegment ? (isBackdropFilter ? `${directorySegment}:backdrop` : directorySegment) : 'core-concepts',
                groupTitle: directorySegment ? (isBackdropFilter ? 'Backdrop Filters' : groupTitle(directory.name)) : 'Core Concepts',
                groupOrder: directorySegment ? directory.order + (isBackdropFilter ? 0.5 : 0) : -1,
                order: file.order,
        }
}

const createDocEntries = () => {
        const docs = walkMdxFiles(docsDirectory)
                .map(createDocEntry)
                .sort((a, b) => a.groupOrder - b.groupOrder || a.order - b.order || a.title.localeCompare(b.title))
        const slugs = new Map<string, DocEntry>()

        for (const doc of docs) {
                const previous = slugs.get(doc.slug)
                if (previous) throw new Error(`Duplicate docs slug "${doc.slug}" for ${previous.relativePath} and ${doc.relativePath}`)
                slugs.set(doc.slug, doc)
        }

        return docs
}

const createDocSections = (docs: DocEntry[]) => {
        const sections = new Map<string, DocSection>()

        for (const doc of docs) {
                const section = sections.get(doc.groupKey)
                if (section) {
                        section.items.push(doc)
                        continue
                }
                sections.set(doc.groupKey, { title: doc.groupTitle, items: [doc] })
        }

        return [...sections.values()]
}

export const docs = createDocEntries()
export const docSections = createDocSections(docs)
export const docSlugs = docs.map((doc) => doc.slug)
export const docsBySlug = new Map(docs.map((doc) => [doc.slug, doc]))

export const findDoc = (slug: string) => docsBySlug.get(slug)
