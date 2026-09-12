'use client'

import { SectionLabel } from '@/components/ui/SectionLabel'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal'

/**
 * Replaces a 334-line 3D coverflow carousel.
 *
 * The old version rotated five cards through `rotateY` slots between -54° and
 * +54°, each filled with its own gradient: violet, rose, amber, cyan, emerald.
 * Two problems, and the second is the serious one.
 *
 * The gradients put five colours on a site with a single orange accent, and
 * the violet in particular (`#7C3AED → #A78BFA`) is the exact hue that reads
 * as machine-generated. This is not a theme change — the theme is orange on
 * the neutral tokens, and the carousel was the thing departing from it.
 *
 * The bigger problem was the numbers. Each card carried a "stat": `#1`,
 * `100%`, `5.0★`, `10×`, `∞`. None of them measure anything. A visitor reads
 * `100%` next to Integrity as a claim, and it is not one — it is a decoration
 * shaped like evidence. They are gone rather than replaced, because the honest
 * version of "our values" has no numbers in it.
 *
 * The layout is now a sticky heading against a divided list: no cards, no
 * three-equal-column grid, and the values stay readable at every width without
 * a carousel to page through.
 */

const values = [
  {
    title: 'Say the hard thing early',
    body: 'Wrong scope, unrealistic deadline, wrong studio: you hear it in the first conversation. A late no costs you more than an early one.',
  },
  {
    title: 'Ship something every week',
    body: 'A working link from week one, a demo every week after. No invoice for work you have not seen running.',
  },
  {
    title: 'Write it down',
    body: 'Scope, price and date fixed in writing before any money moves. Changes get their own estimate.',
  },
  {
    title: 'Build it to be handed over',
    body: 'Code, accounts and docs are yours at the end. Support is because you want it, not because you are stuck.',
  },
  {
    title: 'Small team, named people',
    body: 'The people who scope your project are the people who write it. No account layer in between.',
  },
]

export function Values() {
  return (
    <section id="values" className="border-t border-border bg-background py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-x-16 gap-y-12 lg:grid-cols-12">
          {/* Sticky on desktop so the heading stays with the list it labels. */}
          <div className="lg:col-span-4">
            <Reveal className="lg:sticky lg:top-32">
              <SectionLabel>How we work</SectionLabel>
              <SectionHeading className="mt-5">Five rules we do not bend</SectionHeading>
              <p className="mt-5 max-w-[42ch] leading-relaxed text-text-secondary">
                The five that have actually cost us work.
              </p>
            </Reveal>
          </div>

          <Stagger as="dl" className="lg:col-span-8">
            {values.map((value) => (
              <StaggerItem
                key={value.title}
                className="group border-t border-border py-7 first:border-t-0 first:pt-0 last:pb-0"
              >
                <dt className="text-lg font-semibold tracking-[-0.015em] text-text-primary">
                  {value.title}
                </dt>
                <dd className="mt-2.5 max-w-[62ch] leading-relaxed text-text-secondary">
                  {value.body}
                </dd>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  )
}
