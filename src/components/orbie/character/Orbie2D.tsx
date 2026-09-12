'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion, useReducedMotion, useTransform, type Variants } from 'framer-motion'
import {
  ONE_SHOT_POSES,
  ORBIE_SIZE_PX,
  type OrbieEmotion,
  type OrbiePose,
  type OrbieProps,
} from './types'

const EASE = [0.22, 1, 0.36, 1] as const

/* ── Eyes ──────────────────────────────────────────────────────────────
 * Framer can only tween an SVG `d` when both paths share a command
 * structure, so every eye shape is produced by this one function: four
 * cubic segments, always, whatever the emotion. Hand-authoring the shapes
 * separately is how eye morphing silently degrades into a hard cut.
 *
 * `k` is the circularity constant. Near 0.55 the blob is a circle; near
 * 0.1 the control points collapse toward the centre and the corners go
 * sharp, which is what turns the same four curves into a sparkle.
 */
function eye(cx: number, cy: number, rx: number, up: number, down: number, k = 0.55) {
  const hx = rx * k
  const hu = up * k
  const hd = down * k
  return [
    `M ${cx} ${cy - up}`,
    `C ${cx + hx} ${cy - up} ${cx + rx} ${cy - hu} ${cx + rx} ${cy}`,
    `C ${cx + rx} ${cy + hd} ${cx + hx} ${cy + down} ${cx} ${cy + down}`,
    `C ${cx - hx} ${cy + down} ${cx - rx} ${cy + hd} ${cx - rx} ${cy}`,
    `C ${cx - rx} ${cy - hu} ${cx - hx} ${cy - up} ${cx} ${cy - up}`,
    'Z',
  ].join(' ')
}

/** Left eye centre, right eye centre. The visor spans roughly x 21-43. */
const EYE_L = 27
const EYE_R = 37
const EYE_Y = 29

const EYES: Record<OrbieEmotion, { l: string; r: string }> = {
  // Calm ovals.
  neutral: { l: eye(EYE_L, EYE_Y, 3, 3.6, 3.6), r: eye(EYE_R, EYE_Y, 3, 3.6, 3.6) },
  // Flattened on top: the shape a smiling eye makes.
  happy: { l: eye(EYE_L, EYE_Y, 3.6, 1.1, 3.4), r: eye(EYE_R, EYE_Y, 3.6, 1.1, 3.4) },
  // Wide, and the left slightly wider — asymmetry reads as interest.
  curious: { l: eye(EYE_L, EYE_Y, 3.4, 4.4, 4.4), r: eye(EYE_R, EYE_Y, 2.9, 3.6, 3.6) },
  // Same four curves, control points pulled in until the corners sharpen.
  star: { l: eye(EYE_L, EYE_Y, 4.4, 4.4, 4.4, 0.08), r: eye(EYE_R, EYE_Y, 4.4, 4.4, 4.4, 0.08) },
  // Flattened underneath, the inverse of happy.
  sorry: { l: eye(EYE_L, EYE_Y, 3.2, 3.6, 1.2), r: eye(EYE_R, EYE_Y, 3.2, 3.6, 1.2) },
}

/* ── Poses ─────────────────────────────────────────────────────────────
 * Orbie has no arms and no legs — it hovers. So poses are carried by the
 * whole body: bob, tilt, scale. That constraint is also what makes the
 * later 3D swap plausible, since none of this depends on rigging.
 */
const POSES: Variants = {
  idle: {
    y: [0, -2.5, 0],
    rotate: 0,
    scale: 1,
    transition: { y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }, rotate: { duration: 0.4 } },
  },
  wave: {
    rotate: [0, -9, 7, -5, 0],
    y: [0, -3, 0, -1.5, 0],
    scale: 1,
    transition: { duration: 1.1, ease: 'easeInOut' },
  },
  point: {
    rotate: 0,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: EASE },
  },
  thinking: {
    rotate: [0, -7, -7, 0],
    y: [0, -1, -1, 0],
    scale: 1,
    transition: { duration: 3.6, repeat: Infinity, ease: 'easeInOut' },
  },
  celebrate: {
    y: [0, -12, 0, -5, 0],
    scale: [1, 1.08, 1, 1.03, 1],
    rotate: [0, 5, -5, 2, 0],
    transition: { duration: 1.2, ease: 'easeOut' },
  },
  thumbsUp: {
    y: [0, -5, 0],
    scale: [1, 1.05, 1],
    rotate: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
  sleep: {
    y: [0, 1.5, 0],
    rotate: 8,
    scale: 0.97,
    transition: { y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' }, rotate: { duration: 0.6 } },
  },
  // Every pose collapses to this when the visitor asked for less motion.
  still: { y: 0, rotate: 0, scale: 1, transition: { duration: 0.2 } },
}

/** How far the body leans when pointing. `point` without a direction is idle. */
const POINT_LEAN: Record<NonNullable<OrbieProps['direction']>, { x: number; y: number; rotate: number }> = {
  left: { x: -4, y: 0, rotate: -12 },
  right: { x: 4, y: 0, rotate: 12 },
  up: { x: 0, y: -4, rotate: 0 },
  down: { x: 0, y: 4, rotate: 0 },
}

export function Orbie2D({
  pose,
  emotion = 'neutral',
  size = 'dock',
  direction,
  speaking,
  onPoseEnd,
  className = '',
}: OrbieProps) {
  const reduce = useReducedMotion()

  // One-shot poses play once and settle back to idle on their own, so the
  // engine can fire a wave without also having to schedule its undo. Looping
  // poses stay until the caller changes them.
  const [active, setActive] = useState<OrbiePose>(pose)
  useEffect(() => setActive(pose), [pose])

  const handleComplete = useCallback(() => {
    if (!ONE_SHOT_POSES.includes(active)) return
    onPoseEnd?.(active)
    setActive('idle')
  }, [active, onPoseEnd])

  // Blink on a loop, independent of pose — it is the cheapest thing that
  // makes a face read as alive rather than as a graphic.
  const px = ORBIE_SIZE_PX[size]
  const eyes = EYES[emotion]

  // Speech drives the visor glow and the thruster. A MotionValue rather than
  // state, so narration audio can push it at 60 Hz without re-rendering.
  const zero = useTransform(() => 0)
  const amp = speaking ?? zero
  const thrusterScale = useTransform(amp, [0, 1], [1, 1.35])
  const visorGlow = useTransform(amp, [0, 1], [0.18, 0.42])

  const lean = active === 'point' && direction ? POINT_LEAN[direction] : { x: 0, y: 0, rotate: 0 }
  const variant = reduce ? 'still' : active

  return (
    <motion.svg
      viewBox="0 0 64 64"
      width={px}
      height={px}
      className={className}
      role="img"
      aria-label="Orbie, the Orbit assistant"
      initial={false}
    >
      <motion.g
        variants={POSES}
        animate={variant}
        onAnimationComplete={handleComplete}
        style={{ originX: '32px', originY: '34px' }}
        // The point lean is a separate transform so it composes with the pose
        // loop instead of fighting it for the same properties.
        {...(!reduce && { transformTemplate: undefined })}
      >
        <motion.g
          animate={{ x: lean.x, y: lean.y, rotate: lean.rotate }}
          transition={{ duration: 0.45, ease: EASE }}
          style={{ originX: '32px', originY: '34px' }}
        >
          {/* Thruster. Under the body, so the body's fill covers its top edge. */}
          <motion.ellipse
            cx="32"
            cy="52"
            rx="7"
            ry="3"
            fill="rgb(var(--acc-rgb))"
            opacity="0.35"
            style={{ scale: thrusterScale, originX: '32px', originY: '52px' }}
          />

          {/* Antenna */}
          <path d="M32 13 L32 8" stroke="rgb(var(--ink-rgb))" strokeWidth="1.6" strokeLinecap="round" opacity="0.85" />
          <motion.circle
            cx="32"
            cy="6.5"
            r="2.4"
            fill="rgb(var(--acc-rgb))"
            animate={reduce ? { opacity: 0.9 } : { opacity: [0.55, 1, 0.55] }}
            transition={reduce ? undefined : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Body */}
          <rect
            x="15"
            y="13"
            width="34"
            height="34"
            rx="14"
            fill="rgb(var(--canvas-rgb))"
            stroke="rgb(var(--ink-rgb))"
            strokeWidth="1.8"
          />

          {/* Visor */}
          <rect x="20" y="21" width="24" height="17" rx="8" fill="rgb(var(--ink-rgb))" />
          <motion.rect
            x="20"
            y="21"
            width="24"
            height="17"
            rx="8"
            fill="rgb(var(--acc-rgb))"
            style={{ opacity: visorGlow }}
          />

          {/* Eyes. Both tween because every shape comes from eye(). */}
          <motion.path
            d={eyes.l}
            fill="rgb(var(--canvas-rgb))"
            animate={{ d: eyes.l }}
            transition={{ duration: 0.3, ease: EASE }}
          />
          <motion.path
            d={eyes.r}
            fill="rgb(var(--canvas-rgb))"
            animate={{ d: eyes.r }}
            transition={{ duration: 0.3, ease: EASE }}
          />

          {/* Blink. A thin bar sweeping down over the eyes reads as a blink
              without needing a sixth eye shape per emotion. */}
          {!reduce && (
            <motion.rect
              x="21"
              y="22"
              width="22"
              height="15"
              rx="7"
              fill="rgb(var(--ink-rgb))"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: [0, 0, 1, 0] }}
              transition={{ duration: 0.24, repeat: Infinity, repeatDelay: 4.2, ease: 'easeInOut' }}
              style={{ originY: '29px' }}
            />
          )}
        </motion.g>
      </motion.g>

      {/* The orbit ring. Outside the pose group deliberately: it belongs to
          the brand, not to the character's mood, so it keeps its own slow
          rotation while Orbie bobs and tilts inside it. */}
      <motion.ellipse
        cx="32"
        cy="34"
        rx="26"
        ry="9.5"
        fill="none"
        stroke="rgb(var(--ink-rgb))"
        strokeWidth="1.4"
        opacity="0.3"
        style={{ originX: '32px', originY: '34px' }}
        animate={reduce ? { rotate: -18 } : { rotate: [-18, -14, -18] }}
        transition={reduce ? undefined : { duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.svg>
  )
}
