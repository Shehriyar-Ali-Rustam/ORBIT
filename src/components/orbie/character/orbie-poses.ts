import type { OrbiePose } from './types'

/**
 * The same poses the SVG character plays, expressed as functions of time.
 *
 * Framer drives the 2D character with keyframe arrays; a WebGL scene has a
 * per-frame callback instead, so each pose is written as a curve sampled at
 * the elapsed time. The durations below are copied from `Orbie2D`'s variants
 * deliberately rather than re-invented: the contract in `types.ts` says the
 * engine must not be able to tell which renderer is live, and a `wave` that
 * takes a different length of time to finish is exactly that tell.
 */

/** One-shot durations, in seconds. Looping poses are absent. */
export const POSE_SECONDS: Partial<Record<OrbiePose, number>> = {
  wave: 1.1,
  point: 0.5,
  celebrate: 1.2,
  thumbsUp: 0.6,
}

export interface PoseFrame {
  y: number
  x: number
  rotZ: number
  rotY: number
  scale: number
}

const REST: PoseFrame = { y: 0, x: 0, rotZ: 0, rotY: 0, scale: 1 }

const LEAN: Record<string, { x: number; rotZ: number; rotY: number }> = {
  left: { x: -0.12, rotZ: 0.12, rotY: -0.35 },
  right: { x: 0.12, rotZ: -0.12, rotY: 0.35 },
  up: { x: 0, rotZ: 0, rotY: 0 },
  down: { x: 0, rotZ: 0, rotY: 0 },
}

/** Ease-out, for the one-shot poses that should land rather than arrive. */
const outCubic = (t: number) => 1 - Math.pow(1 - t, 3)

/**
 * @param t seconds since this pose started. For looping poses it runs forever;
 *          for one-shot poses the caller stops asking once it passes the
 *          pose's duration.
 */
export function poseFrame(
  pose: OrbiePose,
  t: number,
  direction?: 'left' | 'right' | 'up' | 'down'
): PoseFrame {
  switch (pose) {
    case 'idle':
      // A 3.2s breath. Small on purpose: the character should look alive, not
      // animated.
      return { ...REST, y: Math.sin((t / 3.2) * Math.PI * 2) * 0.035 }

    case 'thinking':
      // Tilted, and slower than idle. The tilt is what reads as thought.
      return {
        ...REST,
        y: Math.sin((t / 3.6) * Math.PI * 2) * 0.02,
        rotZ: -0.12 + Math.sin((t / 3.6) * Math.PI * 2) * 0.03,
      }

    case 'sleep':
      // Heavier, lower, and leaning. Scale slightly under one so it settles.
      return {
        ...REST,
        y: -0.05 + Math.sin((t / 4.5) * Math.PI * 2) * 0.022,
        rotZ: 0.14,
        scale: 0.97,
      }

    case 'wave': {
      const p = Math.min(t / 1.1, 1)
      // Four decreasing swings, damped, so it stops rather than being cut off.
      const swing = Math.sin(p * Math.PI * 4) * (1 - p)
      return { ...REST, rotZ: swing * 0.22, y: Math.abs(swing) * 0.05 }
    }

    case 'point': {
      const p = outCubic(Math.min(t / 0.5, 1))
      const l = LEAN[direction ?? ''] ?? { x: 0, rotZ: 0, rotY: 0 }
      return { ...REST, x: l.x * p, rotZ: l.rotZ * p, rotY: l.rotY * p }
    }

    case 'celebrate': {
      const p = Math.min(t / 1.2, 1)
      // A jump with a spin, both settling back to rest by the end.
      const hop = Math.sin(p * Math.PI) * (1 - p * 0.35)
      return {
        ...REST,
        y: hop * 0.34,
        rotY: Math.sin(p * Math.PI * 2) * 0.5 * (1 - p),
        scale: 1 + hop * 0.07,
      }
    }

    case 'thumbsUp': {
      const p = Math.min(t / 0.6, 1)
      const hop = Math.sin(p * Math.PI)
      return { ...REST, y: hop * 0.12, scale: 1 + hop * 0.05 }
    }

    default:
      return REST
  }
}
