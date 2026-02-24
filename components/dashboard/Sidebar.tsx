'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  ShoppingBag,
  MessageSquare,
  Star,
  Settings,
  Briefcase,
  User,
  Package,
  DollarSign,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '@/lib/stores/auth-store'
import { signOut } from '@/lib/firebase/auth'
import { cn } from '@/lib/utils'

const buyerLinks = [
  { label: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
  { label: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
  { label: 'Reviews', href: '/dashboard/reviews', icon: Star },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
]

const sellerLinks = [
  { label: 'Overview', href: '/dashboard/seller', icon: LayoutDashboard },
  { label: 'Profile', href: '/dashboard/seller/profile', icon: User },
  { label: 'My Gigs', href: '/dashboard/seller/gigs', icon: Briefcase },
  { label: 'Orders', href: '/dashboard/seller/orders', icon: Package },
  { label: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
  { label: 'Reviews', href: '/dashboard/seller/reviews', icon: Star },
  { label: 'Earnings', href: '/dashboard/seller/earnings', icon: DollarSign },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, isSeller } = useAuthStore()
  const [collapsed, setCollapsed] = useState(false)

  const links = isSeller ? sellerLinks : buyerLinks

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/'
  }

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-surface transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="ORBIT" width={120} height={120} quality={100} className="h-8 w-8 object-contain" />
          {!collapsed && (
            <span className="font-montserrat text-sm font-bold tracking-[0.2em] text-text-primary">
              ORBIT
            </span>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden text-text-tertiary hover:text-text-primary lg:block"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <div className="space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/dashboard/seller' && pathname.startsWith(link.href))
            const Icon = link.icon

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'text-orange'
                    : 'text-text-secondary hover:bg-background hover:text-text-primary'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-lg bg-orange-dim"
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
                <Icon className="relative z-10 h-4 w-4 shrink-0" />
                {!collapsed && <span className="relative z-10">{link.label}</span>}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* User Section */}
      <div className="border-t border-border p-3">
        {!collapsed && user && (
          <div className="mb-3 flex items-center gap-3 px-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-brand text-xs font-bold text-white">
              {user.displayName?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-text-primary">{user.displayName}</p>
              <p className="truncate text-xs text-text-tertiary">{user.role}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-background hover:text-red-500"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && 'Sign Out'}
        </button>
      </div>
    </aside>
  )
}
