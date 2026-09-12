import type { MotionValue } from 'framer-motion'

/**
 * The character contract.
 *
 * This file is the whole point of the 2D-first decision. Everything the tour
 * engine knows about Orbie is in this interface, so the SVG character shipping
 * today and a glTF model arriving later are a drop-in swap rather than a
 * rewrite of every scene.
 *
 * Five rules keep that true. Break any of them and the 3D swap stops being a
 * swap:
 *
 * 1. One-shot poses return to idle on their own and fire `onPoseEnd`. In 2D
 *    that is Framer's `onAnimationComplete`; in 3D it is the mixer's
 *    `finished` event. Identical external behaviour, so the engine never has
 *    to know which renderer is live.
 * 2. `speaking` is a MotionValue, not a number. With narration audio it is
 *    driven by an AnalyserNode at 60 Hz; as React state that re-renders the
 *    character sixty times a second.
 * 3. Sizes are three named slots, never pixels. A 3D canvas needs a fixed
 *    aspect per slot; arbitrary sizes force a ResizeObserver into it.
 * 4. Nothing here mentions SVG, canvas, WebGL or a file format.
 * 5. Every prop is optional except `pose`, so a caller that only wants a
 *    breathing character writes `<Orbie pose="idle" />`.
 */

/**
 * Looping poses (`idle`, `thinking`, `sleep`) run until the pose changes.
 * One-shot poses (`wave`, `point`, `celebrate`, `thumbsUp`) play once and
 * settle back to idle.
 */
export type OrbiePose =
  | 'idle'
  | 'wave'
  | 'point'
  | 'thinking'
  | 'celebrate'
  | 'thumbsUp'
  | 'sleep'

/** Poses that end by themselves. The renderer must fire `onPoseEnd` for these. */
export const ONE_SHOT_POSES: readonly OrbiePose[] = [
  'wave',
  'point',
  'celebrate',
  'thumbsUp',
]

/**
 * Shown on the visor. Independent of pose: Orbie can be `thinking` and
 * `curious` at once, or `celebrate` and `star`.
 */
export type OrbieEmotion = 'neutral' | 'happy' | 'curious' | 'star' | 'sorry'

/**
 * Named slots, not pixels.
 *  - `dock`  ~56px — the corner presence during a scene
 *  - `stage` ~160px — narrating beside content
 *  - `hero`  ~240px — arrival, and the crossroads
 */
export type OrbieSize = 'dock' | 'stage' | 'hero'

export const ORBIE_SIZE_PX: Record<OrbieSize, number> = {
  dock: 56,
  stage: 160,
  hero: 240,
}

export interface OrbieProps {
  pose: OrbiePose
  emotion?: OrbieEmotion
  size?: OrbieSize
  /** Only meaningful when `pose` is `point`. Ignored otherwise. */
  direction?: 'left' | 'right' | 'up' | 'down'
  /**
   * Speech amplitude, 0..1. Drives the visor and the thruster so the character
   * visibly talks. Left undefined, Orbie breathes on its own timing.
   */
  speaking?: MotionValue<number>
  /** Fires when a one-shot pose finishes. Never fires for looping poses. */
  onPoseEnd?: (pose: OrbiePose) => void
  className?: string
}

/** What the renderer picker resolves to. `Orbie.tsx` is the only consumer. */
export type OrbieRenderer = '2d' | '3d'
