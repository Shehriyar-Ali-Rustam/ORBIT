import { PageHero } from '@/components/sections/PageHero'

export function PortfolioHero() {
  return (
    <PageHero
      eyebrow="Work"
      title="Ten projects, and what"
      accent="each one cost"
      lede="Chatbots, a virtual try-on tool, an adventure-sports marketplace, a resume matcher. Every case study lists the stack, the timeline and the part that turned out harder than we planned for."
      meta={[
        { label: 'Case studies', value: '10' },
        { label: 'Earliest', value: '2024' },
        { label: 'Stacks', value: 'Next, RN, Python' },
        { label: 'Client rating', value: '4.9 / 5' },
      ]}
    />
  )
}
