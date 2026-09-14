'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useMotionValue, type MotionValue } from 'framer-motion'
// Deliberately imports no scene type. The clock now takes the minimal
// `ClockNode` shape declared below, which both Story Mode's `Scene` and
// Orbie's `StoryNode` satisfy — so the clock has no opinion about what a
// story is, only about when a node ends.

/**
 * What ends a node.
 *
 * This type is the whole reason the linear Story Mode clock can also drive
 * Orbie's branching graph. The clock used to conflate two different jobs:
 * *when does this node end* and *what comes next*. `durationMs` answered the
 * first and a hardcoded `goTo(i + 1)` answered the second.
 *
 * Separating them means a node can finish narrating and then simply stop,
 * waiting for the visitor to pick an option, without the clock needing any
 * concept of a graph.
 */
export type Advance =
  /** Narrate, then move on by itself. Every Story Mode scene is one of these. */
  | { kind: 'auto'; durationMs: number }
  /**
   * Narrate for `durationMs` if given, then park at full progress and wait
   * for input. This is what a crossroads is.
   */
  | { kind: 'hold'; durationMs?: number }

/**
 * The minimum a node must expose for the clock to run it.
 *
 * `durationMs` is accepted as shorthand for `{ kind: 'auto', durationMs }` so
 * Story Mode's existing `Scene[]` satisfies this unchanged.
 */
export interface ClockNode {
  durationMs?: number
  advance?: Advance
}

function advanceOf(node: ClockNode | undefined): Advance {
  if (node?.advance) return node.advance
  return { kind: 'auto', durationMs: node?.durationMs ?? 0 }
}

/** Total ms a node narrates before its advance policy applies. */
function durationOf(node: ClockNode | undefined): number {
  const a = advanceOf(node)
  return a.kind === 'auto' ? a.durationMs : (a.durationMs ?? 0)
}

export interface OrbieClock {
  /** Which scene is on screen. Changes 5 times in a whole run. */
  sceneIndex: number
  /** 0..1 through the current scene. A MotionValue, so it never re-renders React. */
  progress: MotionValue<number>
  /** Milliseconds into the current scene. Drives caption reveal. */
  elapsedMs: MotionValue<number>
  isPaused: boolean
  /** True once the last scene has run out. */
  isComplete: boolean
  /**
   * A `hold` node has finished narrating and is waiting for the visitor.
   * Distinct from `isPaused`: nothing is suspended, the node is simply over
   * and the next step is someone's choice rather than a timer's.
   */
  isWaiting: boolean
  play(): void
  pause(): void
  next(): void
  prev(): void
  seekScene(index: number): void
  restart(): void
}

interface ClockOptions {
  onComplete?: () => void
  /**
   * Called when an `auto` node runs out, with that node's index. Provide this
   * and the clock stops routing entirely — it reports that a node ended and
   * the caller decides what happens, which is how a graph plugs in.
   *
   * Omitted, the clock keeps its original linear behaviour: advance to the
   * next index, and finish on the last.
   */
  onNodeEnd?: (index: number) => void
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
 * Swapping in narration audio later means writing a `useOrbieAudioClock` that reads
 * `audio.currentTime` and advances on `ended`, then returning the same shape.
 * No consumer changes.
 */
export function useOrbieTimelineClock(
  scenes: ClockNode[],
  options: ClockOptions | (() => void) = {}
): OrbieClock {
  // A bare function was the original signature. Kept working so the clock can
  // gain graph support without every existing caller changing shape.
  const { onComplete, onNodeEnd } =
    typeof options === 'function' ? { onComplete: options, onNodeEnd: undefined } : options

  const [sceneIndex, setSceneIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [isWaiting, setIsWaiting] = useState(false)

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
  const waitingRef = useRef(false)

  sceneIndexRef.current = sceneIndex
  pausedRef.current = isPaused
  completeRef.current = isComplete
  waitingRef.current = isWaiting

  const duration = useCallback((i: number) => durationOf(scenes[i]), [scenes])

  /** Move to a scene and reset the clock to its start. */
  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, scenes.length - 1))
      bankedRef.current = 0
      startedAtRef.current = performance.now()
      progress.set(0)
      elapsedMs.set(0)
      // Arriving anywhere ends a wait. Without this a visitor who picks an
      // option lands on the next node with the loop still stopped.
      setIsWaiting(false)
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
  // `isWaiting` joins the guard: a parked node is not suspended, it is over,
  // and restarting rAF would immediately re-run the end-of-node branch.
  useEffect(() => {
    if (isPaused || isComplete || isWaiting) return

    startedAtRef.current = performance.now() - bankedRef.current

    const tick = () => {
      const i = sceneIndexRef.current
      const total = duration(i)
      const elapsed = performance.now() - startedAtRef.current

      elapsedMs.set(elapsed)
      progress.set(total > 0 ? Math.min(elapsed / total, 1) : 0)

      if (elapsed >= total) {
        const advance = advanceOf(scenes[i])

        if (advance.kind === 'hold') {
          // Narration is done; the next step belongs to the visitor. Park at
          // full and stop the loop rather than burning frames on a node that
          // has nothing left to measure.
          progress.set(1)
          setIsWaiting(true)
          return
        }

        // `onNodeEnd` takes over routing completely when supplied — including
        // the last node, because in a graph "last index" means nothing.
        if (onNodeEnd) {
          onNodeEnd(i)
          return
        }

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
  }, [
    isPaused,
    isComplete,
    isWaiting,
    sceneIndex,
    duration,
    scenes,
    goTo,
    finish,
    onNodeEnd,
    progress,
    elapsedMs,
  ])

  // ── Controls ────────────────────────────────────────────────────────
  const pause = useCallback(() => {
    // Pausing a parked node is meaningless — there is nothing running to
    // suspend — and setting isPaused there would make the resume control
    // appear over a node that is simply waiting for a choice.
    if (pausedRef.current || completeRef.current || waitingRef.current) return
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

  /**
   * Jump to a node. This is the routing primitive a graph drives the clock
   * with — the navigator resolves a node id to an index and calls this.
   */
  const seekScene = useCallback(
    (index: number) => {
      setIsComplete(false)
      setIsPaused(false)
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
    isWaiting,
    play,
    pause,
    next,
    prev,
    seekScene,
    restart,
  }
}
