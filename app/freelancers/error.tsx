'use client'

import { Button } from '@/components/ui/Button'

export default function MarketplaceError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-xl font-bold text-text-primary">Something went wrong</h2>
      <p className="text-sm text-text-secondary">
        {error.message || 'An unexpected error occurred.'}
      </p>
      <Button variant="primary" size="sm" onClick={reset}>
        Try Again
      </Button>
    </div>
  )
}
