'use client'

import type { ReactNode } from 'react'

/**
 * Every scene sits in the same box.
 *
 * The bottom third belongs to the captions, so scene content is constrained
 * above it rather than each scene inventing its own safe area. `dvh` and not
 * `vh`: iOS Safari's toolbar makes `100vh` taller than the visible viewport,
 * which would push the controls off screen on exactly the devices most of this
 * traffic uses.
 */
export function SceneShell({ children }: { children: ReactNode }) {
  return (
    <div className="absolute inset-0 flex min-h-dvh items-center justify-center overflow-hidden px-6 pb-56 pt-16">
      {children}
    </div>
  )
}
