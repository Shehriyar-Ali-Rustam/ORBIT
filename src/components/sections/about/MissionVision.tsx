'use client'

import { SectionLabel } from '@/components/ui/SectionLabel'
import { Reveal } from '@/components/motion/Reveal'

/**
 * Was two equal glass cards, each with an icon in a tinted rounded square, a
 * bold heading, and a paragraph — the mission/vision pair every company page
 * ships. The copy was the real problem: "deliver world-class AI-powered
 * software solutions that empower businesses to grow, innovate, and compete
 * globally" is four filler verbs and no claim a reader can check.
 *
 * It is now a single statement set at reading size against a hairline, which
 * is what a position actually looks like on the page. One idea, stated once,
 * with the specific part — where the work is done and who it competes with —
 * carrying the accent instead of a gradient.
 */
export function MissionVision() {
  return (
    <section id="mission" className="border-t border-border bg-background py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-x-16 gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Reveal>
              <SectionLabel>Position</SectionLabel>
            </Reveal>
          </div>

          <div className="lg:col-span-9">
            <Reveal delay={0.05}>
              <p className="max-w-[30ch] text-balance text-[1.75rem] font-medium leading-[1.25] tracking-[-0.025em] text-text-primary sm:text-[2.125rem] sm:max-w-[24ch]">
                Good software is not cheaper because it was built in{' '}
                <span className="text-accent">Islamabad</span>. It is just built here.
              </p>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="mt-10 max-w-[64ch] space-y-5 border-t border-border pt-8 leading-relaxed text-text-secondary">
                <p>
                  Most of our clients are not in Pakistan. They come because the work holds up
                  against studios charging four times as much, and stay because the second project
                  runs like the first.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
