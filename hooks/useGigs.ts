'use client'

import { useState, useEffect } from 'react'
import { getActiveGigs } from '@/lib/firebase/firestore'
import type { Gig, GigCategory } from '@/types/marketplace'

interface UseGigsReturn {
  gigs: Gig[]
  loading: boolean
  error: string | null
}

export function useGigs(category: GigCategory | null = null): UseGigsReturn {
  const [gigs, setGigs] = useState<Gig[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchGigs() {
      setLoading(true)
      setError(null)

      try {
        const options = category ? { category } : {}
        const data = await getActiveGigs(options)

        if (!cancelled) {
          setGigs(data)
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : 'Failed to load gigs.'
          setError(message)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchGigs()

    return () => {
      cancelled = true
    }
  }, [category])

  return { gigs, loading, error }
}
