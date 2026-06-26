import { notFound } from 'next/navigation'
import { InstallationSteps } from '../_utils/installation-steps'
import { installationGuides, installationMethod } from '../_utils/installation-guides'

type InstallationMethodPageProps = {
        params: Promise<{ slug: string }>
}

export const generateStaticParams = () => Object.keys(installationGuides).map((slug) => ({ slug }))

export default async function InstallationMethodPage({ params }: InstallationMethodPageProps) {
        const { slug } = await params
        const method = installationMethod(slug)
        if (!method) notFound()
        return <InstallationSteps guide={installationGuides[method]} />
}
