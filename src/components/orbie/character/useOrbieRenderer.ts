'use client'

import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { ORBIE_3D_ENABLED } from '@/lib/orbie-flags'
import type { OrbieRenderer } from './types'

/**
 * Decides which character renderer to use.
 *
 * The important property: **this can only ever downgrade.** It starts at `2d`
 * and upgrades to `3d` only if every check passes. There is no path where a
 * failed probe leaves a visitor staring at an empty canvas.
 *
 * That is also why the 2D character has to be genuinely good rather than a
 * placeholder — it is both the fallback and, until a model exists, the
 * shipped product.
 *
 * Four signals, any one of which keeps us on 2D:
 *
 *  - `ORBIE_3D_ENABLED` is false. A build-time constant, so with the flag off
 *    the dynamic import below is unreachable and `three` never enters the
 *    module graph at all.
 *  - `prefers-reduced-motion`. A hovering, bobbing 3D character is exactly
 *    what that setting is asking you not to do.
 *  - Save-Data, or a 2G-class connection. A model is hundreds of kilobytes
 *    that a visitor on a metered connection did not ask for.
 *  - No WebGL2. Probed once, on a throwaway canvas, after mount.
 *
 * Deliberately returns `2d` on the first render even when 3D is available:
 * the probes need the browser, and rendering 2D for one frame is better than
 * a layout shift or a hydration mismatch.
 */
export function useOrbieRenderer(): OrbieRenderer {
  const reduce = useReducedMotion()
  const [renderer, setRenderer] = useState<OrbieRenderer>('2d')

  useEffect(() => {
    if (!ORBIE_3D_ENABLED) return
    if (reduce) return

    // Save-Data and effectiveType are Chromium-only; absent elsewhere, which
    // we read as "no reason to downgrade" rather than as a failure.
    const conn = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string }
      }
    ).connection
    if (conn?.saveData) return
    if (conn?.effectiveType && ['slow-2g', '2g'].includes(conn.effectiveType)) return

    // One throwaway context. Some browsers cap the number of live WebGL
    // contexts, so this is released immediately rather than held.
    let ok = false
    try {
      const canvas = document.createElement('canvas')
      ok = Boolean(canvas.getContext('webgl2'))
    } catch {
      ok = false
    }

    if (ok) setRenderer('3d')
  }, [reduce])

  return renderer
}
