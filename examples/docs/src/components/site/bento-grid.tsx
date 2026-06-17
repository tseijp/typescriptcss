import { flex, gap } from 'typescriptcss/src'
import { FeatureCard } from '@/components/site/feature-card'
import { Visual } from '@/components/site/visuals'
import { features } from '@/data/features'
export const BentoGrid = ({ items = features }: any) => (
        <div style={gap[4]({ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' })}>
                {items.map((item: any) => (
                        <FeatureCard key={item.title} title={item.title} body={item.body} wide={item.variant === 'wide'}>
                                <Visual kind={item.visual} />
                        </FeatureCard>
                ))}
        </div>
)
