import { PageHero } from '@/components/sections/PageHero'

export function ContactHero() {
  return (
    <PageHero
      eyebrow="Contact"
      title="Tell us what you are"
      accent="trying to build"
      lede="The form below takes about a minute. You get a written reply within one working day, and if we are not the right studio for the job we will say so in that first reply rather than after a call."
      meta={[
        { label: 'Reply within', value: '24 hours' },
        { label: 'First call', value: '20 minutes' },
        { label: 'Hours', value: 'Mon to Sat' },
        { label: 'Timezone', value: 'PKT · UTC+5' },
      ]}
    />
  )
}
