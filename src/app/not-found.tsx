import Link from 'next/link'
import Image from 'next/image'

/**
 * The site's real 404.
 *
 * There was a styled `not-found.tsx` inside the `(public)` route group, but
 * route groups do not create a URL segment, so it only ever rendered for a
 * `notFound()` call raised from inside that group. Any genuinely unmatched
 * URL — a stale link, a typo, a bad crawl — fell through to Next's built-in
 * page instead: unstyled black-on-white, "This page could not be found."
 *
 * This file sits at the app root, which is the only place Next looks for the
 * global case. It renders inside the root layout, so it gets the fonts and the
 * theme script but not the marketing Navbar or Footer (those belong to
 * `(public)`) — hence the wordmark and the explicit links back.
 */
export const metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <main className="flex min-h-[100dvh] flex-col bg-background px-6 py-12 lg:px-8">
      <Link href="/" className="inline-flex w-fit items-center gap-3" aria-label="Orbit Innovations home">
        <Image
          src="/logo.png"
          alt=""
          width={160}
          height={160}
          quality={100}
          className="h-9 w-9 object-contain"
        />
        <span className="flex flex-col leading-none">
          <span className="font-montserrat text-base font-bold tracking-[0.3em] text-text-primary">
            Orbit
          </span>
          <span className="mt-[3px] font-montserrat text-[7px] font-medium uppercase tracking-[0.3em] text-text-secondary">
            Innovations
          </span>
        </span>
      </Link>

      <div className="flex flex-1 items-center">
        <div className="mx-auto w-full max-w-7xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-tertiary">
            Error 404
          </p>
          <h1 className="mt-5 max-w-[18ch] text-balance text-[2rem] font-semibold leading-[1.1] tracking-[-0.03em] text-text-primary sm:text-[2.75rem]">
            That page is not here
          </h1>
          <p className="mt-4 max-w-[52ch] leading-relaxed text-text-secondary">
            The link may be out of date, or the page may have moved. Everything below is still
            where it was.
          </p>

          <nav className="mt-10 grid max-w-2xl grid-cols-2 gap-x-8 border-t border-border pt-6 sm:grid-cols-4">
            {[
              { href: '/', label: 'Home' },
              { href: '/services', label: 'Services' },
              { href: '/portfolio', label: 'Work' },
              { href: '/contact', label: 'Contact' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="border-b border-border py-3 text-[0.9375rem] text-text-secondary transition-colors hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </main>
  )
}
