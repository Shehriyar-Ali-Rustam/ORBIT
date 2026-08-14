'use client'

import { UserPlus } from 'lucide-react'
import OrbitMark from './OrbitMark'
import { CARD } from '@/data/landing'

export default function LandingNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-orbit-line/[0.07] bg-orbit-canvas/80 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-[1280px] items-center justify-between px-5 sm:px-6 md:h-[80px] md:px-10">
        <a href="#top" className="flex items-center gap-3" aria-label="Orbit Innovations, back to top">
          <OrbitMark className="h-7 w-7 text-orbit-ink md:h-8 md:w-8" />
          {/* Stacked lockup: the full name set on one line at the
              display tracking is far too wide for a phone header. */}
          <span className="flex flex-col leading-none">
            <span className="font-syne text-lg font-extrabold uppercase tracking-[0.22em] text-orbit-ink md:text-xl">
              Orbit
            </span>
            <span className="mt-[3px] font-spacemono text-[8px] uppercase tracking-[0.3em] text-orbit-ink/60 md:text-[9px]">
              Innovations
            </span>
          </span>
        </a>

        <div className="flex items-center gap-3">
          <span className="hidden font-spacemono text-[10px] uppercase tracking-[0.24em] text-orbit-ink/60 lg:inline">
            {CARD.location}
          </span>
          <a
            href={CARD.vcardHref}
            className="inline-flex items-center gap-2 border border-orbit-accInk/50 bg-orbit-acc/5 px-3.5 py-2.5 font-spacemono text-[10px] font-bold uppercase tracking-[0.2em] text-orbit-accInk transition-colors hover:bg-orbit-acc hover:text-orbit-onAcc md:px-4"
          >
            <UserPlus className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
            <span className="hidden sm:inline">Save contact</span>
            <span className="sm:hidden">Save</span>
          </a>
        </div>
      </div>
    </header>
  )
}
