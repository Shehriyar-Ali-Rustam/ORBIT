import Link from 'next/link'
import { Button } from '@/components/ui/Button'

/**
 * `dot-grid` and a `text-8xl font-black` numeral came off this. The dot grid
 * was a decorative texture on the one screen where the visitor is trying to
 * work out what went wrong, and the numeral is not the message — the sentence
 * under it is. Both surfaces are left-aligned now, matching the rest of the
 * site rather than centring because there is little content.
 */
export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center bg-background">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-tertiary">
          Error 404
        </p>
        <h1 className="mt-5 max-w-[18ch] text-balance text-[2rem] font-semibold leading-[1.1] tracking-[-0.03em] text-text-primary sm:text-[2.75rem]">
          That page is not here
        </h1>
        <p className="mt-4 max-w-[52ch] leading-relaxed text-text-secondary">
          The link may be out of date, or the page may have moved. The work, services and contact
          details are all still where they were.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Link href="/">
            <Button variant="primary">Go to the homepage</Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline">Contact us</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
