'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Github, Linkedin, ArrowUpRight } from 'lucide-react'
import { NAV_LINKS, SOCIAL_LINKS, COMPANY } from '@/lib/constants'
import { services } from '@/data/services'
import { useTheme } from '@/components/ThemeProvider'
import { cn } from '@/lib/utils'

export function Footer() {
  const { theme } = useTheme()

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Col 1: Brand */}
          <div className="space-y-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="ORBIT"
                width={160}
                height={160}
                quality={100}
                className={cn('h-10 w-10 object-contain', theme === 'light' && 'invert hue-rotate-180')}
              />
              <span className="text-lg font-bold tracking-[0.2em] text-text-primary">ORBIT</span>
            </Link>
            <p className="text-sm leading-relaxed text-text-secondary">{COMPANY.tagline}</p>
            <div className="flex items-center gap-3">
              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-text-tertiary transition-all hover:border-accent/50 hover:text-accent"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-text-tertiary transition-all hover:border-accent/50 hover:text-accent"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href={SOCIAL_LINKS.fiverr}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 items-center gap-1 rounded-full border border-border px-3 text-xs font-semibold text-text-tertiary transition-all hover:border-accent/50 hover:text-accent"
                aria-label="Fiverr"
              >
                Fiverr <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Col 2: Company */}
          <div>
            <h3 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-text-primary">Company</h3>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-text-secondary transition-colors hover:text-accent">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Services */}
          <div>
            <h3 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-text-primary">Services</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.id}>
                  <Link href="/services" className="text-sm text-text-secondary transition-colors hover:text-accent">{service.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Orbit AI */}
          <div>
            <h3 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-text-primary">Orbit AI</h3>
            <ul className="space-y-3">
              <li><Link href="/ai/chat" className="text-sm text-text-secondary transition-colors hover:text-accent">Orbit Chat</Link></li>
              <li><Link href="/ai/code" className="text-sm text-text-secondary transition-colors hover:text-accent">Orbit Code</Link></li>
              <li><Link href="/ai/write" className="text-sm text-text-secondary transition-colors hover:text-accent">Orbit Write</Link></li>
              <li><Link href="/ai/image" className="text-sm text-text-secondary transition-colors hover:text-accent">Orbit Image</Link></li>
              <li><Link href="/ai" className="group inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline">All Tools <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link></li>
            </ul>
          </div>

          {/* Col 5: Contact */}
          <div>
            <h3 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-text-primary">Contact</h3>
            <ul className="space-y-3">
              <li><a href={`mailto:${COMPANY.email}`} className="text-sm text-text-secondary transition-colors hover:text-accent">{COMPANY.email}</a></li>
              <li className="text-sm text-text-secondary">{COMPANY.phone}</li>
              <li className="text-sm text-text-secondary">{COMPANY.location}</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="font-mono text-xs text-text-tertiary">&copy; {new Date().getFullYear()} Orbit. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs text-text-tertiary transition-colors hover:text-accent">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-text-tertiary transition-colors hover:text-accent">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
