'use client'

import { Orbie2D } from './Orbie2D'
import type { OrbieProps } from './types'

/**
 * The 3D character — not yet built. This file is the swap point.
 *
 * It renders the 2D character today, which makes it a working placeholder
 * rather than a stub: if `ORBIE_3D_ENABLED` were flipped on right now the
 * experience would still be correct, just not three-dimensional.
 *
 * It exists as a file because `Orbie.tsx` references it in a `dynamic()`
 * import, and TypeScript resolves that import whether or not the branch
 * around it can ever run.
 *
 * ── When the model arrives ───────────────────────────────────────────
 * Replace the body of this component with an R3F scene. The contract in
 * `types.ts` is what makes that a drop-in rather than a rewrite, so it has to
 * be honoured exactly:
 *
 *  - `pose` maps to a named glTF animation clip. One-shot clips
 *    (`ONE_SHOT_POSES`) use `clampWhenFinished` and fire `onPoseEnd` from the
 *    mixer's `finished` event, so the engine sees identical behaviour to the
 *    2D renderer's `onAnimationComplete`.
 *  - `emotion` drives the visor material or a morph target.
 *  - `speaking` is a MotionValue — read it per frame inside `useFrame`, never
 *    through React state.
 *  - `size` maps to one of three fixed canvas aspects. Do not accept pixels;
 *    a free-sized canvas needs a ResizeObserver and will thrash on mobile.
 *
 * Two constraints that decide whether this ships at all:
 *
 *  - The GLB must come in under ~1.5 MB Draco-compressed. If it does not, do
 *    not flip the flag. The 2D character is the product, not a placeholder
 *    waiting to be replaced, and a heavy model on `/` costs more than the
 *    fidelity is worth on the page printed on the business card.
 *  - The model streams in *after* the experience is interactive, never as
 *    part of the initial payload.
 */
export function Orbie3D(props: OrbieProps) {
  return <Orbie2D {...props} />
}
