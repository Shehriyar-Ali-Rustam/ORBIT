'use client'

import { useState } from 'react'
import { PublicReviewForm } from '@/components/forms/PublicReviewForm'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Reveal } from '@/components/motion/Reveal'

/**
 * The front door to the testimonial flow.
 *
 * `PublicReviewForm` used to live inside the parked `/home` page, which meant
 * four working API routes — submit, approve, decline, and the approved feed —
 * plus a Supabase table had no reachable entry point at all. Deleting `/home`
 * without moving this would have quietly orphaned the whole chain.
 *
 * Behind a disclosure rather than open: this page exists for people starting a
 * project, and a review form competing with the brief would cost more than it
 * collects. Past clients know to look for it.
 */
export function LeaveAReview() {
  const [open, setOpen] = useState(false)

  return (
    <section className="border-t border-border bg-background py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <SectionLabel>Worked with us?</SectionLabel>
          {!open ? (
            <div className="mt-5 flex flex-col items-start gap-4">
              <p className="max-w-[52ch] leading-relaxed text-text-secondary">
                Reviews go up once we have read them, not automatically.
              </p>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="border border-border px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-text-secondary transition-colors hover:border-accent/60 hover:text-accent"
              >
                Leave a review
              </button>
            </div>
          ) : (
            <div className="mt-8 max-w-2xl">
              <PublicReviewForm />
            </div>
          )}
        </Reveal>
      </div>
    </section>
  )
}
