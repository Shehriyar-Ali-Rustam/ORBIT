'use client'

import { SectionLabel } from '@/components/ui/SectionLabel'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal'

/**
 * The numbering stays here, unlike elsewhere on the site: this is a real
 * sequence, and the order is information the reader needs. What changed is
 * everything around it.
 *
 *  - Four centred columns became a divided list. A four-across grid forces
 *    each step down to a single sentence, which is how the old copy ended up
 *    saying "in-depth consultation" instead of what actually happens.
 *  - The connector line is gone. It was `left-1/2 top-6 w-full` on each item,
 *    so it ran a full column-width from each circle's centre and overshot the
 *    last one into empty space.
 *  - The step number sat in `text-text-primary` on `bg-accent` — white on
 *    orange in dark mode, around 2.2:1. The number is now accent-on-canvas at
 *    full contrast, and no longer needs a filled disc to sit in.
 *  - The copy names the artefact you get at each step, because "we deploy,
 *    test, and optimize" does not tell a client what lands in their inbox.
 */
const steps = [
  {
    n: '01',
    title: 'Call',
    body: 'Twenty minutes, no deck. You describe the problem and we tell you whether it is something we should be building. If it is not, we say so on this call rather than after a proposal.',
  },
  {
    n: '02',
    title: 'Scope',
    body: 'A written breakdown: what gets built, what it costs, what date it lands. Fixed before any money moves, so the number you approve is the number you pay.',
  },
  {
    n: '03',
    title: 'Build',
    body: 'A working link in week one and a demo every week after. You see the thing running while it is still cheap to change your mind about it.',
  },
  {
    n: '04',
    title: 'Hand over',
    body: 'Repository, hosting, domains and credentials transferred to your accounts, with the documentation to run it. Support afterwards is a choice, not a dependency.',
  },
]

export function Process() {
  return (
    <section className="border-t border-border bg-surface py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-x-16 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal className="lg:sticky lg:top-32">
              <SectionLabel>Process</SectionLabel>
              <SectionHeading className="mt-5">Four steps, about six weeks</SectionHeading>
              <p className="mt-5 max-w-[40ch] leading-relaxed text-text-secondary">
                The same sequence on every project, whether it is a chatbot or a full platform.
              </p>
            </Reveal>
          </div>

          <Stagger as="ol" className="lg:col-span-8">
            {steps.map((step) => (
              <StaggerItem
                key={step.n}
                as="li"
                className="grid grid-cols-[3rem_1fr] gap-x-5 border-t border-border py-7 first:border-t-0 first:pt-0 last:pb-0 sm:grid-cols-[4rem_1fr] sm:gap-x-8"
              >
                <span
                  aria-hidden
                  className="font-mono text-sm font-medium tabular-nums text-accent"
                >
                  {step.n}
                </span>
                <div>
                  <h3 className="text-lg font-semibold tracking-[-0.015em] text-text-primary">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 max-w-[62ch] leading-relaxed text-text-secondary">
                    {step.body}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  )
}
