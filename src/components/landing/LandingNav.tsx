'use client'

import Image from 'next/image'
import { UserPlus } from 'lucide-react'
import { CARD } from '@/data/landing'

export default function LandingNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/5 bg-orbit-black/80 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-[1280px] items-center justify-between px-5 sm:px-6 md:h-[80px] md:px-10">
        <a href="#top" className="flex items-center gap-3" aria-label="ORBIT, back to top">
          <Image src="/logo.png" alt="" width={32} height={32} className="h-7 w-7 md:h-8 md:w-8" priority />
          <span className="font-syne text-lg font-extrabold uppercase tracking-[0.22em] text-orbit-greyLight md:text-xl">
            Orbit
          </span>
        </a>

        <div className="flex items-center gap-3">
          <span className="hidden font-spacemono text-[10px] uppercase tracking-[0.24em] text-orbit-greyLight/40 lg:inline">
            {CARD.location}
          </span>
          <a
            href={CARD.vcardHref}
            className="inline-flex items-center gap-2 border border-orbit-acc/50 bg-orbit-acc/5 px-3.5 py-2.5 font-spacemono text-[10px] font-bold uppercase tracking-[0.2em] text-orbit-acc transition-colors hover:bg-orbit-acc hover:text-orbit-black md:px-4"
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
