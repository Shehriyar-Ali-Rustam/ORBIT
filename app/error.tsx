'use client'

import { Button } from '@/components/ui/Button'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <section className="dot-grid flex min-h-screen items-center justify-center">
      <div className="mx-auto max-w-xl px-6 text-center lg:px-8">
        <div className="text-6xl font-black text-orange">Oops</div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
          Something Went Wrong
        </h1>
        <p className="mt-4 text-text-secondary">
          An unexpected error occurred. Please try again or contact our support team if the problem
          persists.
        </p>
        <div className="mt-8">
          <Button variant="primary" onClick={reset}>
            Try Again
          </Button>
        </div>
      </div>
    </section>
  )
}
