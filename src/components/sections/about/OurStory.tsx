'use client'

import { SectionLabel } from '@/components/ui/SectionLabel'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal'

/**
 * The right half of this section used to be three dashed rings spinning at
 * different speeds around a gradient-filled square with an "O" in it. It ran
 * two counter-rotating CSS animations forever, on every visit, and said
 * nothing — the same ornament also appears on the Coming Soon screen.
 *
 * It is replaced with the actual timeline, which is information: four dated
 * entries, in a monospace column so the years line up. That also fixes the
 * `text-text-primary` on `bg-gradient-brand` contrast problem in the old mark.
 */
const timeline = [
  { year: '2023', event: 'Freelance work on Fiverr. Logos and banners, then websites.' },
  { year: '2024', event: 'Orbit Innovations registered. Three founders, first retained client.' },
  { year: '2025', event: 'First AI work: chatbots trained on client documents, then fine-tuning.' },
  { year: '2026', event: 'Five people. Clients across eight countries, most of them repeat.' },
]

export function OurStory() {
  return (
    <section id="story" className="scroll-mt-24 border-t border-border bg-background py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-x-16 gap-y-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Reveal>
              <SectionLabel>Story</SectionLabel>
              <SectionHeading className="mt-5">
                It started with logo work on <span className="text-accent">Fiverr</span>
              </SectionHeading>
            </Reveal>

            <Reveal delay={0.06}>
              <div className="mt-6 max-w-[58ch] space-y-4 leading-relaxed text-text-secondary">
                <p>
                  Shehriyar Ali Rustam, Saqib Nawaz Khan and Abdul Ahad were engineering students
                  taking design jobs on Fiverr. Clients kept coming back asking for the website next.
                </p>
                <p>
                  Five people now, not an agency, and the founders still write code.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <Stagger as="dl" className="lg:pt-2">
              {timeline.map((item) => (
                <StaggerItem
                  key={item.year}
                  className="grid grid-cols-[3.5rem_1fr] gap-x-5 border-t border-border py-5 first:border-t-0 first:pt-0 last:pb-0"
                >
                  <dt className="font-mono text-sm font-medium tabular-nums text-accent">
                    {item.year}
                  </dt>
                  <dd className="text-[0.9375rem] leading-relaxed text-text-secondary">
                    {item.event}
                  </dd>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </div>
    </section>
  )
}
