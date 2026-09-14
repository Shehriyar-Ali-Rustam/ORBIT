'use client'

import { Button } from '@/components/ui/Button'

/**
 * Matches the 404 screen. The `digest` is surfaced in a monospace line because
 * it is the one thing a visitor can usefully quote when they email about a
 * failure, and the old screen dropped it entirely while telling them to
 * "contact our support team".
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <section className="flex min-h-[70vh] items-center bg-background">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-tertiary">
          Something broke
        </p>
        <h1 className="mt-5 max-w-[20ch] text-balance text-[2rem] font-semibold leading-[1.1] tracking-[-0.03em] text-text-primary sm:text-[2.75rem]">
          This page failed to load
        </h1>
        <p className="mt-4 max-w-[52ch] leading-relaxed text-text-secondary">
          Trying again usually works. If it does not, email us at info@orbitpk.com and quote the
          reference below.
        </p>

        {error.digest && (
          <p className="mt-6 border-l-2 border-border pl-4 font-mono text-xs text-text-tertiary">
            Reference {error.digest}
          </p>
        )}

        <div className="mt-9">
          <Button variant="primary" onClick={reset}>
            Try again
          </Button>
        </div>
      </div>
    </section>
  )
}
