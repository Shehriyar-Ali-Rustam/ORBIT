'use client'

import { useCallback, useEffect } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { track } from '@vercel/analytics'
import { STORYBOARD } from '@/data/storyboard'
import { useTimelineClock } from './useStoryClock'
import { useStoryInput } from './useStoryInput'
import { StoryProgress } from './StoryProgress'
import { StoryControls } from './StoryControls'
import { StoryCaptions } from './StoryCaptions'
import { OrbitAI } from './OrbitAI'
import { WelcomeScene } from './scenes/WelcomeScene'
import { SoftwareScene } from './scenes/SoftwareScene'
import { AIScene } from './scenes/AIScene'
import { JourneyScene } from './scenes/JourneyScene'
import { CTAScene } from './scenes/CTAScene'

const EASE = [0.22, 1, 0.36, 1] as const

interface StoryPlayerProps {
  onExit(): void
}

export function StoryPlayer({ onExit }: StoryPlayerProps) {
  const reduce = useReducedMotion()
  const clock = useTimelineClock(STORYBOARD, () => track('story_complete'))
  const scene = STORYBOARD[clock.sceneIndex]

  const exit = useCallback(() => {
    track('story_exit', { scene: scene.id })
    onExit()
  }, [onExit, scene.id])

  const input = useStoryInput({
    next: clock.next,
    prev: clock.prev,
    pause: clock.pause,
    play: clock.play,
    exit,
    isPaused: clock.isPaused,
  })

  useEffect(() => {
    track('story_start')
    // Clear the pre-paint cover here rather than on a timer in StoryEntry.
    // This component is behind a dynamic import, so "we decided to mount the
    // player" and "the player is on screen" are not the same moment; on a slow
    // connection a timer drops the cover into the gap and the landing page
    // flashes before the story arrives. Removing it from the player's own
    // mount means the cover survives exactly as long as it is needed.
    document.getElementById('story-cover')?.remove()
    document.documentElement.classList.remove('story-covered')
  }, [])

  useEffect(() => {
    track('scene_view', { scene: scene.id })
  }, [scene.id])

  // The story owns the viewport while it is open.
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  const isLast = clock.sceneIndex === STORYBOARD.length - 1

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Orbit Innovations guided tour"
      className="fixed inset-0 z-[100] min-h-dvh overflow-hidden bg-orbit-canvas"
    >
      {/* Screen-reader escape hatch, deliberately first in the DOM. */}
      <button
        type="button"
        onClick={exit}
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:border focus:border-orbit-accInk focus:bg-orbit-canvas focus:px-4 focus:py-2 focus:text-sm focus:text-orbit-accInk"
      >
        Skip the tour and read the site
      </button>

      <div className="grid-faint pointer-events-none absolute inset-0 opacity-60" aria-hidden />

      <StoryProgress
        count={STORYBOARD.length}
        activeIndex={clock.sceneIndex}
        progress={clock.progress}
      />

      <StoryControls
        isPaused={clock.isPaused}
        isComplete={clock.isComplete}
        onTogglePlay={clock.isPaused ? clock.play : clock.pause}
        onRestart={clock.restart}
        onExit={exit}
      />

      {/* Scenes. One signature transition, used everywhere. */}
      <AnimatePresence mode="wait">
        <motion.div
          key={scene.id}
          className="absolute inset-0"
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.99 }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          {scene.id === 'welcome' && <WelcomeScene />}
          {scene.id === 'software' && <SoftwareScene />}
          {scene.id === 'ai' && <AIScene />}
          {scene.id === 'journey' && <JourneyScene />}
          {scene.id === 'cta' && (
            <CTAScene
              onExplore={exit}
              onReplay={clock.restart}
              onContact={() => track('cta_lets_talk')}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <StoryCaptions scene={scene} elapsedMs={clock.elapsedMs} />

      <div className="pointer-events-none absolute bottom-6 left-5 z-30 md:bottom-8 md:left-8">
        <OrbitAI isPaused={clock.isPaused} />
      </div>

      {/*
        The tap layer. Sits above the scenes and below the controls, so buttons
        keep working while taps anywhere else navigate. Disabled on the final
        scene: the CTA is the point, and tapping past it would skip the ending.
        `touch-action: none` stops Safari firing a synthetic click after the
        pointer events have already been handled.
      */}
      {!isLast && (
        <div
          className="absolute inset-0 z-10"
          style={{ touchAction: 'none' }}
          onPointerDown={input.onPointerDown}
          onPointerUp={input.onPointerUp}
          onPointerCancel={input.onPointerCancel}
        />
      )}

      {clock.isPaused && !clock.isComplete && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pointer-events-none absolute left-1/2 top-16 z-30 -translate-x-1/2 font-spacemono text-[10px] uppercase tracking-[0.24em] text-orbit-ink/50"
        >
          Paused
        </motion.p>
      )}
    </div>
  )
}
