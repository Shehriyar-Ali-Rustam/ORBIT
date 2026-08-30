import { PageHero } from '@/components/sections/PageHero'

export function AboutHero() {
  return (
    <PageHero
      eyebrow="About"
      title="A five-person studio in"
      accent="Islamabad"
      lede="We build AI systems, web platforms and mobile apps for clients who need the work to actually ship. Small enough that the people who scope your project are the people who write it."
      meta={[
        { label: 'Founded', value: '2024' },
        { label: 'Team', value: '5' },
        { label: 'Based', value: 'Islamabad, PK' },
        { label: 'Clients in', value: '8 countries' },
      ]}
    />
  )
}
