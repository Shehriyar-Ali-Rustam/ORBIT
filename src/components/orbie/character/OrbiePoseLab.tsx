'use client'

import { useState } from 'react'
import { useMotionValue } from 'framer-motion'
import { Orbie } from './Orbie'
import type { OrbieEmotion, OrbiePose } from './types'

const POSES: OrbiePose[] = ['idle', 'wave', 'point', 'thinking', 'celebrate', 'thumbsUp', 'sleep']
const EMOTIONS: OrbieEmotion[] = ['neutral', 'happy', 'curious', 'star', 'sorry']
const DIRECTIONS = ['left', 'right', 'up', 'down'] as const

const BTN =
  'border border-orbit-ink/20 px-2.5 py-1.5 font-spacemono text-[10px] uppercase tracking-[0.16em] transition-colors'
const ON = 'bg-orbit-acc text-orbit-onAcc border-orbit-acc'
const OFF = 'text-orbit-ink/60 hover:border-orbit-accInk/50 hover:text-orbit-accInk'

/**
 * A dev-only bench for the character.
 *
 * There is no browser in the environment this was built in — no Playwright,
 * no screenshots, no way to confirm that a wave looks like a wave or that the
 * eye shapes actually tween instead of cutting. This page is the substitute:
 * a human opens `/?orbie=poses` once and looks.
 *
 * Worth checking specifically, because these are the things that break
 * silently rather than throwing:
 *  - every emotion *morphs* into the next rather than snapping (if one cuts,
 *    that shape's path has a different command count)
 *  - one-shot poses settle back to idle by themselves and log `onPoseEnd`
 *  - the speaking slider drives the visor glow and the thruster
 *  - nothing moves at all with reduced motion on
 */
export function OrbiePoseLab() {
  const [pose, setPose] = useState<OrbiePose>('idle')
  const [emotion, setEmotion] = useState<OrbieEmotion>('neutral')
  const [direction, setDirection] = useState<(typeof DIRECTIONS)[number]>('right')
  const [ended, setEnded] = useState<string>('—')
  const speaking = useMotionValue(0)

  return (
    <div className="fixed inset-0 z-[200] overflow-auto bg-orbit-canvas p-6">
      <p className="eyebrow accent-rule">Orbie pose lab · dev only</p>

      <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-start">
        {/* The character, large. */}
        <div className="flex shrink-0 flex-col items-center gap-4">
          <div className="flex h-[280px] w-[280px] items-center justify-center border border-orbit-ink/10">
            <Orbie
              pose={pose}
              emotion={emotion}
              size="hero"
              direction={direction}
              speaking={speaking}
              onPoseEnd={(p) => setEnded(`${p} @ ${new Date().toLocaleTimeString()}`)}
            />
          </div>
          <p className="font-spacemono text-[10px] uppercase tracking-[0.16em] text-orbit-ink/50">
            onPoseEnd: {ended}
          </p>
        </div>

        <div className="flex flex-col gap-7">
          <div>
            <p className="eyebrow">Pose</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {POSES.map((p) => (
                <button key={p} onClick={() => setPose(p)} className={`${BTN} ${pose === p ? ON : OFF}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="eyebrow">Emotion</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {EMOTIONS.map((e) => (
                <button key={e} onClick={() => setEmotion(e)} className={`${BTN} ${emotion === e ? ON : OFF}`}>
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="eyebrow">Point direction</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {DIRECTIONS.map((d) => (
                <button key={d} onClick={() => setDirection(d)} className={`${BTN} ${direction === d ? ON : OFF}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="eyebrow">Speaking amplitude</p>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              defaultValue={0}
              onChange={(e) => speaking.set(Number(e.target.value))}
              className="mt-3 w-64 accent-orbit-acc"
            />
          </div>

          {/* Every emotion at once — the fastest way to spot a broken shape. */}
          <div>
            <p className="eyebrow">All emotions, current pose</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {EMOTIONS.map((e) => (
                <div key={e} className="flex flex-col items-center gap-2 border border-orbit-ink/10 p-3">
                  <Orbie pose={pose} emotion={e} size="stage" direction={direction} />
                  <span className="font-spacemono text-[9px] uppercase tracking-[0.16em] text-orbit-ink/50">
                    {e}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Size slots, so the dock size is checked at its real scale. */}
          <div>
            <p className="eyebrow">Size slots</p>
            <div className="mt-3 flex flex-wrap items-end gap-6">
              {(['dock', 'stage', 'hero'] as const).map((s) => (
                <div key={s} className="flex flex-col items-center gap-2">
                  <Orbie pose={pose} emotion={emotion} size={s} direction={direction} />
                  <span className="font-spacemono text-[9px] uppercase tracking-[0.16em] text-orbit-ink/50">
                    {s}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
