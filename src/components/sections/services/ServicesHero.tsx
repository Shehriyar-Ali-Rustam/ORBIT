import { PageHero } from '@/components/sections/PageHero'

export function ServicesHero() {
  return (
    <PageHero
      eyebrow="Services"
      title="Five things we do"
      accent="properly"
      lede="Chatbots trained on your documents, fine-tuned models, Next.js platforms, React Native apps, and the brand work around them. If a job falls outside these, we will tell you and point you somewhere better."
      meta={[
        { label: 'Practices', value: '5' },
        { label: 'Typical build', value: '3 to 9 weeks' },
        { label: 'Scope', value: 'Fixed, up front' },
        { label: 'Handover', value: 'Code and accounts' },
      ]}
    />
  )
}
