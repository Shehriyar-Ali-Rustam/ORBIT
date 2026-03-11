'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, MessageSquare, ArrowLeft } from 'lucide-react'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/Button'
import { useTheme } from '@/components/ThemeProvider'
import { cn } from '@/lib/utils'

const MARKETPLACE_LINKS = [
  { label: 'Browse', href: '/freelancers' },
  { label: 'Search', href: '/freelancers/search' },
  { label: 'Dashboard', href: '/freelancers/dashboard' },
]

export function MarketplaceNavbar() {
  const pathname = usePathname()
  const { theme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo + back link */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-text-tertiary transition-colors hover:bg-surface hover:text-text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Main Site</span>
          </Link>
          <div className="h-4 w-px bg-border" />
          <Link href="/freelancers" className="flex items-center gap-3">
            <Image src="/logo.png" alt="ORBIT" width={160} height={160} quality={100} priority className={cn('h-8 w-8 object-contain', theme === 'light' && 'invert hue-rotate-180')} />
            <span className="font-montserrat text-base font-bold tracking-[0.3em] text-text-primary">
              ORBIT <span className="text-[10px] font-normal tracking-widest text-text-tertiary">MARKETPLACE</span>
            </span>
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {MARKETPLACE_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/freelancers' && pathname.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  isActive ? 'text-orange' : 'text-text-secondary hover:text-text-primary'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="marketplace-nav"
                    className="absolute inset-0 rounded-lg bg-orange-dim"
                    transition={{ duration: 0.2 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <SignedIn>
            <Link
              href="/freelancers/dashboard/messages"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-text-tertiary transition-colors hover:bg-surface hover:text-text-primary"
            >
              <MessageSquare className="h-4 w-4" />
            </Link>
            <UserButton
              afterSignOutUrl="/freelancers"
              appearance={{
                elements: {
                  avatarBox: 'h-8 w-8',
                },
              }}
            />
          </SignedIn>

          <SignedOut>
            <Link href="/freelancers/sign-in">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/freelancers/sign-up">
              <Button variant="primary" size="sm">Join</Button>
            </Link>
          </SignedOut>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-text-tertiary md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-border bg-background md:hidden"
          >
            <nav className="flex flex-col gap-1 px-6 py-4">
              {MARKETPLACE_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                    pathname === link.href ? 'bg-orange-dim text-orange' : 'text-text-secondary hover:bg-surface'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="my-2 border-t border-border" />
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-text-tertiary transition-colors hover:bg-surface hover:text-text-primary"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Main Site
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
