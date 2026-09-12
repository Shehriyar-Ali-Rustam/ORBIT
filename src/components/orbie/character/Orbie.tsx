'use client'

import dynamic from 'next/dynamic'
import { ORBIE_3D_ENABLED } from '@/lib/orbie-flags'
import { Orbie2D } from './Orbie2D'
import { useOrbieRenderer } from './useOrbieRenderer'
import type { OrbieProps } from './types'

/**
 * The character boundary, and nothing else.
 *
 * Every scene in the tour renders `<Orbie />`. Nothing above this file knows
 * whether the character is drawn as SVG or rendered with WebGL, which is the
 * entire reason the 3D model can arrive late without touching the engine.
 *
 * The load-bearing detail is that `three` must never enter `/`'s module graph
 * while the flag is off. `ORBIE_3D_ENABLED` is a build-time constant, so the
 * `dynamic()` call below is inside a branch the bundler can prove is dead and
 * eliminates — importing `Orbie3D` statically here, even unused, would pull
 * several hundred kilobytes into the page printed on the business card.
 *
 * `Orbie3D.tsx` exists today as a working placeholder that renders the 2D
 * character. It has to exist as a file — TypeScript resolves the import above
 * whether or not the branch around it can ever run — and building it as a
 * real component rather than a stub means flipping the flag today would still
 * produce a correct experience. The later swap is then one file's contents
 * plus one boolean.
 */
const Orbie3D = ORBIE_3D_ENABLED
  ? dynamic(() => import('./Orbie3D').then((m) => m.Orbie3D), {
      ssr: false,
      // Keep the 2D character on screen while the model streams, rather than
      // a gap where the narrator should be.
      loading: () => null,
    })
  : null

export function Orbie(props: OrbieProps) {
  const renderer = useOrbieRenderer()

  if (renderer === '3d' && Orbie3D) return <Orbie3D {...props} />
  return <Orbie2D {...props} />
}

export type { OrbieProps, OrbiePose, OrbieEmotion, OrbieSize } from './types'
