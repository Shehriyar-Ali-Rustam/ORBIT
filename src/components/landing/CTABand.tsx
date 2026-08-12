import Link from 'next/link'
import MotionReveal from './MotionReveal'
import { CARD } from '@/data/landing'

/** The one place the palette flips. Used once, near the end of the page. */
export default function CTABand() {
  return (
    <section className="relative border-t border-orbit-line/[0.07] bg-orbit-acc text-orbit-onAcc">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.8) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <div className="relative mx-auto flex max-w-[1280px] flex-col items-start gap-8 px-5 py-20 sm:px-6 md:flex-row md:items-end md:justify-between md:px-10 md:py-28">
        <MotionReveal from="left" className="max-w-2xl">
          <span className="eyebrow !text-orbit-onAcc/80">Get in touch</span>
          <h2 className="h-hero mt-4 font-bold text-orbit-onAcc">Tell us what you need built.</h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-orbit-onAcc/80">
            Send a two-line description of the problem. You will get a straight answer on whether we
            can build it, roughly what it costs, and how long it takes. Usually the same day.
          </p>
        </MotionReveal>

        <MotionReveal from="right" delay={0.15} className="w-full md:w-auto">
          <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
            <a
              href={CARD.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border-2 border-orbit-onAcc bg-orbit-onAcc px-7 py-4 font-spacemono text-[11px] font-bold uppercase tracking-[0.25em] text-orbit-acc transition-colors hover:bg-transparent hover:text-orbit-onAcc"
            >
              WhatsApp us <span aria-hidden>↗</span>
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 border-2 border-orbit-onAcc bg-transparent px-7 py-4 font-spacemono text-[11px] font-bold uppercase tracking-[0.25em] text-orbit-onAcc transition-colors hover:bg-orbit-onAcc hover:text-orbit-acc"
            >
              Project brief <span aria-hidden>↗</span>
            </Link>
          </div>
        </MotionReveal>
      </div>
    </section>
  )
}
