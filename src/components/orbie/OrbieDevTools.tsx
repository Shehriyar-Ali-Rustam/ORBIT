'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

/**
 * Mounts dev-only Orbie tooling, and ships nothing in production.
 *
 * Two gates, and both are needed. `IS_DEV` is a build-time constant, so in a
 * production build the branch is dead and `OrbiePoseLab` resolves to `null`.
 * The query check then keeps it out of the way during ordinary development.
 *
 * Measured, not assumed: webpack still *emits* the lab as its own ~3.5 kB
 * chunk, because it creates a split point for any `import()` it can see
 * whether or not the branch around it can run. That chunk is referenced zero
 * times in the app build manifest, so no visitor ever fetches it and `/` is
 * unchanged at 164 kB. It is a stray file in the deployment, not a payload
 * cost — worth knowing rather than believing it vanished.
 *
 * Open `/?orbie=poses` with `npm run dev` running.
 */
const IS_DEV = process.env.NODE_ENV !== 'production'

const OrbiePoseLab = IS_DEV
  ? dynamic(() => import('./character/OrbiePoseLab').then((m) => m.OrbiePoseLab), { ssr: false })
  : null

export function OrbieDevTools() {
  const [tool, setTool] = useState<string | null>(null)

  useEffect(() => {
    if (!IS_DEV) return
    // Read from `window.location` rather than `useSearchParams()`, which would
    // opt `/` into dynamic rendering. Same reasoning as StoryEntry.
    setTool(new URLSearchParams(window.location.search).get('orbie'))
  }, [])

  if (!IS_DEV || !OrbiePoseLab) return null
  if (tool !== 'poses') return null
  return <OrbiePoseLab />
}
