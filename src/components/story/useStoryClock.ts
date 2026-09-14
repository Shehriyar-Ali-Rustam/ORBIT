'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useMotionValue, type MotionValue } from 'framer-motion'
import type { Scene } from '@/data/storyboard'

export interface StoryClock {
  /** Which scene is on screen. Changes 5 times in a whole run. */
  sceneIndex: number
  /** 0..1 through the current scene. A MotionValue, so it never re-renders React. */
  progress: MotionValue<number>
  /** Milliseconds into the current scene. Drives caption reveal. */
  elapsedMs: MotionValue<number>
  isPaused: boolean
  /** True once the last scene has run out. */
  isComplete: boolean
  play(): void
  pause(): void
  next(): void
  prev(): void
  seekScene(index: number): void
  restart(): void
}

/**
 * The one clock. Everything on screen reads from this and nothing keeps a timer
 * of its own, which is what stops the progress bar, the captions and the scene
 * transitions from drifting apart.
 *
 * Two implementation choices carry most of the weight:
 *
 * **requestAnimationFrame, not setInterval.** Intervals drift, keep firing in
 * background tabs, and run on a different schedule from Framer's own rAF loop,
 * so anything driven off them slowly desyncs from anything animated.
 *
 * **Progress is a MotionValue, not React state.** The bar needs a per-frame
 * value; putting that in state would re-render the whole story sixty times a
 * second. Only genuinely discrete things (which scene, paused or not) are state.
 *
 * Swapping in narration audio later means writing a `useAudioClock` that reads
 * `audio.currentTime` and advances on `ended`, then returning the same shape.
 * No consumer changes.
 */
export function useTimelineClock(
  scenes: Scene[],
  onComplete?: () => void
): StoryClock {
  const [sceneIndex, setSceneIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const progress = useMotionValue(0)
  const elapsedMs = useMotionValue(0)

  const rafRef = useRef<number>()
  /** Wall-clock time the current scene started, already adjusted for pauses. */
  const startedAtRef = useRef(0)
  /** Elapsed ms banked at the moment of the last pause. */
  const bankedRef = useRef(0)
  const sceneIndexRef = useRef(0)
  const pausedRef = useRef(false)
  const completeRef = useRef(false)

  sceneIndexRef.current = sceneIndex
  pausedRef.current = isPaused
  completeRef.current = isComplete

  const duration = useCallback(
    (i: number) => scenes[i]?.durationMs ?? 0,
    [scenes]
  )

  /** Move to a scene and reset the clock to its start. */
  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, scenes.length - 1))
      bankedRef.current = 0
      startedAtRef.current = performance.now()
      progress.set(0)
      elapsedMs.set(0)
      setSceneIndex(clamped)
    },
    [scenes.length, progress, elapsedMs]
  )

  const finish = useCallback(() => {
    progress.set(1)
    setIsComplete(true)
    setIsPaused(true)
    onComplete?.()
  }, [progress, onComplete])

  // ── The loop ────────────────────────────────────────────────────────
  useEffect(() => {
    if (isPaused || isComplete) return

    startedAtRef.current = performance.now() - bankedRef.current

    const tick = () => {
      const i = sceneIndexRef.current
      const total = duration(i)
      const elapsed = performance.now() - startedAtRef.current

      elapsedMs.set(elapsed)
      progress.set(total > 0 ? Math.min(elapsed / total, 1) : 0)

      if (elapsed >= total) {
        if (i >= scenes.length - 1) {
          finish()
          return
        }
        goTo(i + 1)
        // goTo reset the bank; re-anchor so the next frame measures from now.
        startedAtRef.current = performance.now()
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isPaused, isComplete, sceneIndex, duration, scenes.length, goTo, finish, progress, elapsedMs])

  // ── Controls ────────────────────────────────────────────────────────
  const pause = useCallback(() => {
    if (pausedRef.current || completeRef.current) return
    bankedRef.current = performance.now() - startedAtRef.current
    setIsPaused(true)
  }, [])

  const play = useCallback(() => {
    if (completeRef.current) return
    setIsPaused(false)
  }, [])

  const next = useCallback(() => {
    const i = sceneIndexRef.current
    if (i >= scenes.length - 1) {
      finish()
      return
    }
    goTo(i + 1)
  }, [scenes.length, goTo, finish])

  const prev = useCallback(() => {
    // Matches Instagram: if you are past the start of a scene, the first press
    // restarts it rather than jumping back. Only a press near the start moves.
    const i = sceneIndexRef.current
    const elapsed = performance.now() - startedAtRef.current
    if (elapsed > 700 && !pausedRef.current) {
      goTo(i)
      return
    }
    goTo(Math.max(0, i - 1))
  }, [goTo])

  const seekScene = useCallback(
    (index: number) => {
      setIsComplete(false)
      goTo(index)
    },
    [goTo]
  )

  const restart = useCallback(() => {
    setIsComplete(false)
    setIsPaused(false)
    goTo(0)
  }, [goTo])

  // A backgrounded tab throttles rAF, so a story left open would "resume"
  // many seconds in. Bank the time and stop instead.
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
    play,
    pause,
    next,
    prev,
    seekScene,
    restart,
  }
}
