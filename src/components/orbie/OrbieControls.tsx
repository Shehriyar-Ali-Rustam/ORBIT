'use client'

import { Pause, Play, RotateCcw, X } from 'lucide-react'

interface StoryControlsProps {
  isPaused: boolean
  isComplete: boolean
  onTogglePlay(): void
  onRestart(): void
  onExit(): void
}

const BTN =
  'flex h-11 w-11 items-center justify-center border border-orbit-ink/15 bg-orbit-canvas/70 text-orbit-ink/70 backdrop-blur-sm transition-colors hover:border-orbit-accInk/50 hover:text-orbit-accInk'

/**
 * Always-visible escape hatches. Part 4 #3: nobody gets trapped in an
 * experience, so exit and pause are on screen at every moment rather than
 * appearing on hover or after a delay.
 *
 * Exit is deliberately first in the DOM, so it is also first in tab order.
 */
export function OrbieControls({
  isPaused,
  isComplete,
  onTogglePlay,
  onRestart,
  onExit,
}: StoryControlsProps) {
  return (
    <div className="absolute right-3 top-6 z-40 flex items-center gap-2">
      <button type="button" onClick={onExit} className={BTN} aria-label="Exit the tour">
        <X className="h-4 w-4" aria-hidden />
      </button>

      {isComplete ? (
        <button type="button" onClick={onRestart} className={BTN} aria-label="Replay the tour">
          <RotateCcw className="h-4 w-4" aria-hidden />
        </button>
      ) : (
        <button
          type="button"
          onClick={onTogglePlay}
          className={BTN}
          aria-label={isPaused ? 'Resume the tour' : 'Pause the tour'}
        >
          {isPaused ? <Play className="h-4 w-4" aria-hidden /> : <Pause className="h-4 w-4" aria-hidden />}
        </button>
      )}
    </div>
  )
}
