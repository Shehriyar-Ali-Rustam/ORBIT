'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sun, Moon, LayoutDashboard, LogOut, User } from 'lucide-react'
import { NAV_LINKS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { useTheme } from '@/components/ThemeProvider'
import { useAuthStore } from '@/lib/stores/auth-store'
import { signOut } from '@/lib/firebase/auth'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const { user, isAuthenticated, loading } = useAuthStore()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setDropdownOpen(false)
  }, [pathname])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setDropdownOpen(false)
    window.location.href = '/'
  }

  return (
    <header
      className={cn(
        'fixed left-0 right-0 top-0 z-50 transition-all duration-500',
        scrolled
          ? 'glass'
          : 'bg-gradient-to-b from-black/60 via-black/20 to-transparent'
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="ORBIT"
            width={160}
            height={160}
            quality={100}
            priority
            className={cn(
              'h-10 w-10 object-contain',
              scrolled && theme === 'light' ? 'invert hue-rotate-180' : ''
            )}
          />
          <span className={cn(
            'text-lg font-bold tracking-[0.2em] transition-colors duration-300',
            scrolled ? 'text-text-primary' : 'text-white'
          )}>
            ORBIT
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'group relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-300',
                link.href === '/ai'
                  ? 'text-accent'
                  : pathname === link.href
                    ? 'text-accent'
                    : scrolled
                      ? 'text-text-secondary hover:text-text-primary'
                      : 'text-white/80 hover:text-white'
              )}
            >
              <span className="relative z-10">{link.label}</span>
              {link.href === '/ai' && (
                <span className="relative z-10 ml-1.5 inline-flex rounded-full bg-accent/15 px-1.5 py-0.5 text-[9px] font-bold uppercase leading-none text-accent">
                  New
                </span>
              )}
              {pathname === link.href ? (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute inset-0 rounded-full bg-accent/10"
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
              ) : (
                <span className="absolute inset-0 rounded-full transition-colors duration-300 group-hover:bg-text-primary/5" />
              )}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 hover:border-accent/50 hover:text-accent',
              scrolled ? 'border-border text-text-secondary' : 'border-white/30 text-white/80'
            )}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </motion.div>
            </AnimatePresence>
          </button>

          {/* Auth section */}
          {!loading && (
            <>
              {isAuthenticated && user ? (
                <div className="relative hidden md:block" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-brand text-sm font-bold text-[#0a0a0a] transition-shadow hover:shadow-accent-glow"
                  >
                    {user.photoURL ? (
                      <Image
                        src={user.photoURL}
                        alt={user.displayName}
                        width={36}
                        height={36}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                    ) : (
                      user.displayName?.charAt(0) || 'U'
                    )}
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-12 w-56 rounded-2xl border border-border bg-surface p-2 shadow-lg"
                      >
                        <div className="border-b border-border px-3 pb-3 pt-1">
                          <p className="text-sm font-medium text-text-primary">{user.displayName}</p>
                          <p className="text-xs text-text-tertiary">{user.email}</p>
                        </div>
                        <div className="pt-2">
                          <Link href="/freelancers/dashboard" className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-accent-dim hover:text-text-primary">
                            <LayoutDashboard className="h-4 w-4" /> Dashboard
                          </Link>
                          <Link href="/freelancers/dashboard/profile" className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-accent-dim hover:text-text-primary">
                            <User className="h-4 w-4" /> Account
                          </Link>
                          <button onClick={handleSignOut} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-red-500/10 hover:text-red-500">
                            <LogOut className="h-4 w-4" /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link href="/login" className="hidden md:block">
                  <Button variant="primary" size="sm">Sign In</Button>
                </Link>
              )}
            </>
          )}

          {!loading && !isAuthenticated && (
            <Link href="/contact" className="hidden md:block">
              <Button variant="ghost" size="sm">Start a Project</Button>
            </Link>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={cn('md:hidden', scrolled ? 'text-text-primary' : 'text-white')}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 top-16 z-40 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col items-center gap-6 px-6 pt-12">
              {NAV_LINKS.map((link, i) => (
                <motion.div key={link.href} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link href={link.href} className={cn('text-lg font-medium tracking-wider transition-colors', pathname === link.href ? 'text-accent' : 'text-text-secondary hover:text-text-primary')}>
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: NAV_LINKS.length * 0.05 }} className="flex flex-col items-center gap-3 pt-4">
                {isAuthenticated ? (
                  <>
                    <Link href="/freelancers/dashboard"><Button variant="primary" size="lg">Dashboard</Button></Link>
                    <button onClick={handleSignOut} className="text-sm text-text-secondary hover:text-red-500">Sign Out</button>
                  </>
                ) : (
                  <>
                    <Link href="/login"><Button variant="primary" size="lg">Sign In</Button></Link>
                    <Link href="/contact"><Button variant="ghost" size="lg">Start a Project</Button></Link>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
