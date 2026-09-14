'use client'

import { useCallback, useEffect, useRef } from 'react'

/** How long a press must last before it counts as a hold rather than a tap. */
const HOLD_MS = 180

interface StoryInputHandlers {
  next(): void
  prev(): void
  pause(): void
  play(): void
  exit(): void
  isPaused: boolean
}

/**
 * Pointer and keyboard input for the story.
 *
 * The whole reason this is a hook and not four inline handlers is that **tap
 * and hold-to-pause share one pointer**, and getting that wrong is the classic
 * bug in this pattern: you press to pause, the story pauses, you release, and
 * it immediately skips a scene because the release also read as a tap.
 *
 * The fix is a flag, not a timer race. `becameHoldRef` is set when the hold
 * timer fires, and `pointerup` checks it before advancing. A hold therefore
 * consumes its own release.
 */
export function useStoryInput({
  next,
  prev,
  pause,
  play,
  exit,
  isPaused,
}: StoryInputHandlers) {
  const holdTimerRef = useRef<ReturnType<typeof setTimeout>>()
  const becameHoldRef = useRef(false)
  /** Where the press started, so a swipe is not mistaken for a tap. */
  const originRef = useRef({ x: 0, y: 0 })

  const clearHold = () => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current)
    holdTimerRef.current = undefined
  }

  useEffect(() => () => clearHold(), [])

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      becameHoldRef.current = false
      originRef.current = { x: e.clientX, y: e.clientY }
      clearHold()
      holdTimerRef.current = setTimeout(() => {
        becameHoldRef.current = true
        pause()
      }, HOLD_MS)
    },
    [pause]
  )

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      clearHold()

      if (becameHoldRef.current) {
        // This release belongs to the hold. Resume, and do not advance.
        becameHoldRef.current = false
        play()
        return
      }

      // A drag is a scroll attempt or a swipe, not a tap.
      const dx = Math.abs(e.clientX - originRef.current.x)
      const dy = Math.abs(e.clientY - originRef.current.y)
      if (dx > 12 || dy > 12) return

      const rect = e.currentTarget.getBoundingClientRect()
      const ratio = (e.clientX - rect.left) / rect.width
      if (ratio < 0.3) prev()
      else next()
    },
    [next, prev, play]
  )

  const onPointerCancel = useCallback(() => {
    clearHold()
    if (becameHoldRef.current) {
      becameHoldRef.current = false
      play()
    }
  }, [play])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Never hijack keys while the visitor is in a control.
      const el = document.activeElement
      if (el instanceof HTMLElement && ['BUTTON', 'A', 'INPUT', 'TEXTAREA'].includes(el.tagName)) {
        if (e.key !== 'Escape') return
      }

      switch (e.key) {
        case ' ':
        case 'Spacebar':
          e.preventDefault()
          if (isPaused) play()
          else pause()
          break
        case 'ArrowRight':
          e.preventDefault()
          next()
          break
        case 'ArrowLeft':
          e.preventDefault()
          prev()
          break
        case 'Escape':
          e.preventDefault()
          exit()
          break
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [next, prev, pause, play, exit, isPaused])

  return { onPointerDown, onPointerUp, onPointerCancel }
}
