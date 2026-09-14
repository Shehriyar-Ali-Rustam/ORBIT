import { Star } from 'lucide-react'
import { Reveal } from '@/components/motion/Reveal'
import { testimonials } from '@/data/testimonials'

/** Short enough to read at marquee speed without stopping. */
const QUOTES = testimonials.filter((t) => t.quote.length < 120).slice(0, 10)

function QuoteCard({ quote, author, country }: { quote: string; author: string; country: string }) {
  return (
    <li className="card w-[280px] shrink-0 p-5 sm:w-[340px]">
      <div className="flex gap-0.5" aria-label="5 out of 5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-3 w-3 fill-orbit-accInk text-orbit-accInk" aria-hidden />
        ))}
      </div>
      <p className="mt-4 text-sm leading-relaxed text-orbit-ink/75">&ldquo;{quote}&rdquo;</p>
      <p className="eyebrow mt-4 !text-orbit-ink/60">
        {author} · {country}
      </p>
    </li>
  )
}

export default function Proof() {
  return (
    <section className="overflow-hidden border-t border-orbit-line/[0.07]">
      <div className="mx-auto max-w-[1280px] px-5 pt-16 sm:px-6 md:px-10 md:pt-20">
        <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow accent-rule">What clients said</p>
            <h2 className="h-section mt-5 max-w-lg font-semibold text-orbit-ink">
              Thirty reviews, <span className="text-orbit-accInk">every one of them five stars.</span>
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-orbit-ink/62">
            Verified Fiverr feedback, from clients in eight countries.
          </p>
        </Reveal>
      </div>

      <div className="relative mt-10 pb-16 md:pb-20">
        {/* Edge fades so cards enter and leave the canvas instead of clipping */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-orbit-canvas to-transparent md:w-32"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-orbit-canvas to-transparent md:w-32"
        />

        <ul className="animate-marquee flex w-max gap-4">
          {[...QUOTES, ...QUOTES].map((t, i) => (
            <QuoteCard
              key={`${t.id}-${i}`}
              quote={t.quote}
              author={t.author}
              country={t.country}
            />
          ))}
        </ul>
      </div>
    </section>
  )
}
