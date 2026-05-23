'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sun, Moon, LayoutDashboard, LogOut, User, ChevronDown } from 'lucide-react'
import { NAV_LINKS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { useTheme } from '@/components/ThemeProvider'
import { useNavbarAuth } from '@/hooks/useNavbarAuth'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [activeNavDropdown, setActiveNavDropdown] = useState<string | null>(null)
  const [mobileExpandedNav, setMobileExpandedNav] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const { user, isLoaded, isSignedIn, signOut } = useNavbarAuth()
  const loading = !isLoaded
  const isAuthenticated = isSignedIn && !!user
  const displayName = user?.fullName || user?.firstName || user?.username || user?.primaryEmailAddress?.emailAddress || 'User'
  const photoUrl = user?.imageUrl

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
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveNavDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    setDropdownOpen(false)
    await signOut({ redirectUrl: '/' })
  }

  return (
    <header
      className={cn(
        'fixed left-0 right-0 top-0 z-50 transition-all duration-500',
        scrolled
          ? 'glass'
          : 'bg-gradient-to-b from-black/80 via-black/50 to-transparent'
      )}
    >
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8"
        style={!scrolled ? { textShadow: '0 1px 4px rgba(0,0,0,0.6)' } : undefined}
      >
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
              !scrolled ? 'brightness-0 invert' : theme === 'light' ? 'invert hue-rotate-180' : ''
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
        <div ref={navRef} className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const hasChildren = !!link.children?.length
            const isOpen = activeNavDropdown === link.label
            const isActive = pathname === link.href || (hasChildren && pathname?.startsWith(link.href) && link.href !== '/')

            const textColor = link.href === '/ai'
              ? 'text-accent'
              : isActive
                ? 'text-accent'
                : scrolled
                  ? 'text-text-secondary hover:text-text-primary'
                  : 'text-white/80 hover:text-white'

            return (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => hasChildren && setActiveNavDropdown(link.label)}
                onMouseLeave={() => hasChildren && setActiveNavDropdown(null)}
              >
                <div
                  className={cn(
                    'group relative flex items-center rounded-full text-sm font-medium transition-all duration-300',
                    textColor
                  )}
                >
                  <Link
                    href={link.href}
                    onClick={() => setActiveNavDropdown(null)}
                    className={cn(
                      'relative z-10 flex items-center py-2',
                      hasChildren ? 'pl-4 pr-1.5' : 'px-4'
                    )}
                  >
                    {link.label}
                    {link.href === '/ai' && (
                      <span className="ml-1.5 inline-flex rounded-full bg-accent/15 px-1.5 py-0.5 text-[9px] font-bold uppercase leading-none text-accent">
                        New
                      </span>
                    )}
                  </Link>
                  {hasChildren && (
                    <button
                      type="button"
                      onClick={() => setActiveNavDropdown(isOpen ? null : link.label)}
                      aria-expanded={isOpen}
                      aria-label={`Toggle ${link.label} menu`}
                      className="relative z-10 flex items-center py-2 pl-1 pr-3.5"
                    >
                      <ChevronDown
                        className={cn(
                          'h-3.5 w-3.5 transition-transform duration-200',
                          isOpen && 'rotate-180'
                        )}
                      />
                    </button>
                  )}
                  {isActive ? (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 rounded-full bg-accent/10"
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    />
                  ) : (
                    <span className="absolute inset-0 rounded-full transition-colors duration-300 group-hover:bg-text-primary/5" />
                  )}
                </div>

                <AnimatePresence>
                  {hasChildren && isOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-1/2 top-full z-50 mt-2 w-72 -translate-x-1/2 rounded-2xl border border-border bg-surface p-2 shadow-xl"
                    >
                      {link.children!.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={() => setActiveNavDropdown(null)}
                          className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-accent-dim"
                        >
                          <div className="text-sm font-medium text-text-primary">{child.label}</div>
                          {child.description && (
                            <div className="mt-0.5 text-xs text-text-tertiary">{child.description}</div>
                          )}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
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
                    {photoUrl ? (
                      <Image
                        src={photoUrl}
                        alt={displayName}
                        width={36}
                        height={36}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                    ) : (
                      displayName.charAt(0) || 'U'
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
                          <p className="text-sm font-medium text-text-primary">{displayName}</p>
                          <p className="text-xs text-text-tertiary">{user?.primaryEmailAddress?.emailAddress}</p>
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
              ) : null}
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
            className="fixed inset-0 top-16 z-40 overflow-y-auto bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col items-center gap-3 px-6 pt-8 pb-8">
              {NAV_LINKS.map((link, i) => {
                const hasChildren = !!link.children?.length
                const isExpanded = mobileExpandedNav === link.label
                return (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="w-full max-w-xs"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={link.href}
                        className={cn(
                          'text-lg font-medium tracking-wider transition-colors',
                          pathname === link.href ? 'text-accent' : 'text-text-secondary hover:text-text-primary'
                        )}
                      >
                        {link.label}
                      </Link>
                      {hasChildren && (
                        <button
                          onClick={() => setMobileExpandedNav(isExpanded ? null : link.label)}
                          className="rounded-full p-1 text-text-tertiary hover:text-accent"
                          aria-label={`Toggle ${link.label} submenu`}
                        >
                          <ChevronDown className={cn('h-4 w-4 transition-transform', isExpanded && 'rotate-180')} />
                        </button>
                      )}
                    </div>
                    <AnimatePresence>
                      {hasChildren && isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-2 overflow-hidden"
                        >
                          <div className="flex flex-col items-center gap-2 pt-1">
                            {link.children!.map((child) => (
                              <Link
                                key={child.label}
                                href={child.href}
                                onClick={() => {
                                  setMobileExpandedNav(null)
                                  setMobileOpen(false)
                                }}
                                className="text-sm text-text-tertiary hover:text-text-primary"
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: NAV_LINKS.length * 0.05 }} className="flex flex-col items-center gap-3 pt-4">
                {isAuthenticated ? (
                  <>
                    <Link href="/freelancers/dashboard"><Button variant="primary" size="lg">Dashboard</Button></Link>
                    <button onClick={handleSignOut} className="text-sm text-text-secondary hover:text-red-500">Sign Out</button>
                  </>
                ) : (
                  <Link href="/contact"><Button variant="ghost" size="lg">Start a Project</Button></Link>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
