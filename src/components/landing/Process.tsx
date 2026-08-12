import Image from 'next/image'
import MotionReveal from './MotionReveal'
import { PROCESS } from '@/data/landing'

export default function Process() {
  return (
    <section className="relative border-t border-white/5">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 80% 0%, rgba(255,117,31,0.05) 0%, transparent 55%)',
        }}
      />

      <div className="relative mx-auto max-w-[1280px] px-5 py-24 sm:px-6 md:px-10 md:py-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div>
            <MotionReveal from="left">
              <p className="eyebrow accent-rule">How it goes</p>
              <h2 className="h-section mt-5 font-semibold text-orbit-greyLight">
                No mystery, <span className="text-orbit-acc">no surprise invoice.</span>
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-orbit-greyLight/65">
                Most people who scan this card have been burned by an agency before. So here is
                exactly how a project runs with us, start to finish.
              </p>
            </MotionReveal>

            <MotionReveal from="left" delay={0.15} className="mt-10">
              <div className="relative aspect-[4/3] overflow-hidden border border-white/[0.08]">
                <Image
                  src="/images/landing/studio-desk.jpg"
                  alt="Overhead view of a developer working at a lit desk"
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-orbit-black/80 via-transparent to-transparent"
                />
                <span
                  aria-hidden
                  className="absolute left-4 top-4 h-[3px] w-12"
                  style={{
                    background:
                      'repeating-linear-gradient(135deg, rgba(255,117,31,0.7) 0 6px, transparent 6px 10px)',
                  }}
                />
              </div>
            </MotionReveal>
          </div>

          <ol className="divide-y divide-white/10 border-y border-white/10">
            {PROCESS.map((step, i) => (
              <li key={step.n}>
                <MotionReveal delay={Math.min(i * 0.06, 0.3)}>
                  <div className="group flex gap-5 py-7 transition-colors md:gap-8 md:py-9">
                    <span className="font-spacemono text-[11px] font-bold uppercase tracking-[0.24em] text-orbit-acc">
                      {step.n}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-syne text-2xl font-bold uppercase tracking-[0.04em] text-orbit-greyLight md:text-3xl">
                        {step.title}
                      </h3>
                      <p className="mt-3 max-w-lg text-sm leading-relaxed text-orbit-greyLight/60 md:text-base">
                        {step.body}
                      </p>
                    </div>
                  </div>
                </MotionReveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
