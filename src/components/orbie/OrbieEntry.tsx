'use client'

import { useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { ORBIE_ENABLED, ORBIE_QUERY_PARAM, ORBIE_SEEN_KEY } from '@/lib/orbie-flags'

/**
 * Code-split because `/` is the URL printed on the business card, so its
 * bundle is the one that matters. The whole engine, the graph and the views
 * load only when the tour actually opens.
 */
const OrbiePlayer = dynamic(() => import('./OrbiePlayer').then((m) => m.OrbiePlayer), {
  ssr: false,
})

/**
 * Decides whether Orbie takes over the landing page.
 *
 * While `ORBIE_ENABLED` is false this renders nothing at all except for
 * `/?orbie=1`, which is how the tour stays reviewable in production before it
 * is shown to anyone.
 *
 * Reads the query param from `window.location` rather than `useSearchParams()`
 * — the hook opts the whole route into dynamic rendering, and `/` is
 * statically generated today.
 */
export function OrbieEntry({ onExit }: { onExit?: () => void }) {
  const [open, setOpen] = useState(false)
  const [decided, setDecided] = useState(false)

  useEffect(() => {
    const forced =
      new URLSearchParams(window.location.search).get(ORBIE_QUERY_PARAM) === '1'

    if (forced) {
      setOpen(true)
      setDecided(true)
      return
    }

    if (!ORBIE_ENABLED) {
      setDecided(true)
      return
    }

    let seen = false
    try {
      seen = window.localStorage.getItem(ORBIE_SEEN_KEY) === '1'
    } catch {
      // Blocked storage reads as a first visit.
    }
    setOpen(!seen)
    setDecided(true)
  }, [])

  const exit = useCallback(() => {
    try {
      window.localStorage.setItem(ORBIE_SEEN_KEY, '1')
    } catch {
      // Not remembering is not a reason to trap them next time.
    }
    setOpen(false)
    // Reveal the landing page underneath, which was never unmounted.
    document.getElementById('orbie-cover')?.remove()
    document.documentElement.classList.remove('orbie-covered')
    onExit?.()
  }, [onExit])

  if (!decided || !open) return null
  return <OrbiePlayer onExit={exit} />
}

