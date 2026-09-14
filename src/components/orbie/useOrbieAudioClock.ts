'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useMotionValue } from 'framer-motion'
import type { ClockNode, OrbieClock } from './useOrbieClock'

/** A node that may carry a narration file. Deliberately not named
 *  `AudioNode` — that is a Web Audio DOM global, and the collision resolved
 *  silently to the wrong type rather than erroring on the name. */
interface NarratedNode extends ClockNode {
  audio?: string
}

interface AudioClockOptions {
  onComplete?: () => void
  onNodeEnd?: (index: number) => void
  /** Muted playback still runs the clock; only the sound is suppressed. */
  muted?: boolean
}

/**
 * The same clock, driven by narration audio instead of a timeline.
 *
 * This is the swap `useStoryClock` was built to accept. It returns an
 * identical `OrbieClock`, so no scene, caption, progress bar or navigator
 * changes — `OrbiePlayer` swaps one hook call and everything downstream is
 * unaware.
 *
 * Three things make it behave like the timeline clock rather than merely
 * resemble it:
 *
 * **The `Advance` contract is honoured.** A `hold` node plays its clip and
 * then parks at full progress, exactly as the timeline version does. If only
 * one of the two clocks understood `hold`, the experience would diverge the
 * moment audio was switched on — which is precisely the kind of bug that
 * shows up in production and not in a build.
 *
 * **A node without a clip still works.** It falls back to the node's duration
 * on a timer, so the tour never stalls on a missing or 404ing file. Audio is
 * an enhancement to the narration, not a dependency of it.
 *
 * **Muted is not stopped.** The visitor may have sound off — it is off by
 * default — and the captions still have to advance. Muting sets the element's
 * `muted`, it does not bypass the clock.
 */
export function useOrbieAudioClock(
  nodes: NarratedNode[],
  options: AudioClockOptions = {}
): OrbieClock {
  const { onComplete, onNodeEnd, muted = true } = options

  const [sceneIndex, setSceneIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [isWaiting, setIsWaiting] = useState(false)

  const progress = useMotionValue(0)
  const elapsedMs = useMotionValue(0)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const rafRef = useRef<number>()
  const fallbackStartRef = useRef(0)
  const sceneIndexRef = useRef(0)
  sceneIndexRef.current = sceneIndex

  /** The clip, or null when this node has none. */
  const srcFor = useCallback((i: number) => nodes[i]?.audio ?? null, [nodes])

  const durationFor = useCallback(
    (i: number) => {
      const a = nodes[i]?.advance
      if (a) return a.kind === 'auto' ? a.durationMs : (a.durationMs ?? 0)
      return nodes[i]?.durationMs ?? 0
    },
    [nodes]
  )

  const endOfNode = useCallback(
    (i: number) => {
      const advance = nodes[i]?.advance
      const holds = advance?.kind === 'hold'

      if (holds) {
        progress.set(1)
        setIsWaiting(true)
        return
      }
      if (onNodeEnd) {
        onNodeEnd(i)
        return
      }
      if (i >= nodes.length - 1) {
        progress.set(1)
        setIsComplete(true)
        setIsPaused(true)
        onComplete?.()
        return
      }
      setSceneIndex(i + 1)
    },
    [nodes, onNodeEnd, onComplete, progress]
  )

  // ── Drive from the element when there is a clip, from a timer when not ──
  useEffect(() => {
    if (isPaused || isComplete || isWaiting) return

    const i = sceneIndexRef.current
    const src = srcFor(i)
    const total = durationFor(i)

    progress.set(0)
    elapsedMs.set(0)

    if (src) {
      const el = new Audio(src)
      el.preload = 'auto'
      el.muted = muted
      audioRef.current = el

      const onTime = () => {
        const ms = el.currentTime * 1000
        elapsedMs.set(ms)
        // `el.duration` is NaN until metadata loads, so fall back to the
        // node's own figure rather than dividing by nothing.
        const dur = Number.isFinite(el.duration) && el.duration > 0 ? el.duration * 1000 : total
        progress.set(dur > 0 ? Math.min(ms / dur, 1) : 0)
      }
      const onEnded = () => endOfNode(i)
      // A missing or blocked file must not strand the tour. Fall through to
      // the timed path instead.
      const onError = () => {
        el.removeEventListener('timeupdate', onTime)
        fallbackStartRef.current = performance.now()
        const tick = () => {
          const elapsed = performance.now() - fallbackStartRef.current
          elapsedMs.set(elapsed)
          progress.set(total > 0 ? Math.min(elapsed / total, 1) : 0)
          if (elapsed >= total) return endOfNode(i)
          rafRef.current = requestAnimationFrame(tick)
        }
        rafRef.current = requestAnimationFrame(tick)
      }

      el.addEventListener('timeupdate', onTime)
      el.addEventListener('ended', onEnded)
      el.addEventListener('error', onError)
      // Autoplay with sound is blocked until a gesture; muted playback is not.
      // The caller unmutes from the visitor's first tap, never on mount.
      void el.play().catch(onError)

      return () => {
        el.removeEventListener('timeupdate', onTime)
        el.removeEventListener('ended', onEnded)
        el.removeEventListener('error', onError)
        el.pause()
        audioRef.current = null
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
      }
    }

    fallbackStartRef.current = performance.now()
    const tick = () => {
      const elapsed = performance.now() - fallbackStartRef.current
      elapsedMs.set(elapsed)
      progress.set(total > 0 ? Math.min(elapsed / total, 1) : 0)
      if (elapsed >= total) return endOfNode(i)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [sceneIndex, isPaused, isComplete, isWaiting, muted, srcFor, durationFor, endOfNode, progress, elapsedMs])

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted
  }, [muted])

  // ── Controls, matching the timeline clock exactly ──────────────────
  const pause = useCallback(() => {
    if (isWaiting || isComplete) return
    audioRef.current?.pause()
    setIsPaused(true)
  }, [isWaiting, isComplete])

  const play = useCallback(() => {
    if (isComplete) return
    setIsPaused(false)
    void audioRef.current?.play().catch(() => {})
  }, [isComplete])

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, nodes.length - 1))
      setIsWaiting(false)
      setIsComplete(false)
      setIsPaused(false)
      setSceneIndex(clamped)
    },
    [nodes.length]
  )

  const next = useCallback(() => goTo(sceneIndexRef.current + 1), [goTo])
  const prev = useCallback(() => goTo(sceneIndexRef.current - 1), [goTo])

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) pause()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [pause])

  return {
    sceneIndex,
    progress,
    elapsedMs,
    isPaused,
    isComplete,
    isWaiting,
    play,
    pause,
    next,
    prev,
    seekScene: goTo,
    restart: () => goTo(0),
  }
}
