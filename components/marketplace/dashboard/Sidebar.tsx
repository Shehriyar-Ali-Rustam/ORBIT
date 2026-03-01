'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Briefcase, Package, MessageSquare, Star,
  DollarSign, User, LogOut, ChevronLeft, ChevronRight, ShoppingBag,
} from 'lucide-react'
import { useState } from 'react'
import { useClerk } from '@clerk/nextjs'
import { cn } from '@/lib/utils'

const sellerLinks = [
  { label: 'Overview', href: '/freelancers/dashboard', icon: LayoutDashboard },
  { label: 'Profile', href: '/freelancers/dashboard/profile', icon: User },
  { label: 'My Gigs', href: '/freelancers/dashboard/gigs', icon: Briefcase },
  { label: 'Orders', href: '/freelancers/dashboard/orders', icon: Package },
  { label: 'Messages', href: '/freelancers/dashboard/messages', icon: MessageSquare },
  { label: 'Reviews', href: '/freelancers/dashboard/reviews', icon: Star },
  { label: 'Earnings', href: '/freelancers/dashboard/earnings', icon: DollarSign },
]

const buyerLinks = [
  { label: 'My Orders', href: '/freelancers/dashboard/buyer', icon: ShoppingBag },
  { label: 'Messages', href: '/freelancers/dashboard/messages', icon: MessageSquare },
  { label: 'Reviews', href: '/freelancers/dashboard/buyer/reviews', icon: Star },
]

interface DashboardSidebarProps {
  mode: 'seller' | 'buyer'
  onModeSwitch: () => void
  userName?: string
  userRole?: string
}

export function DashboardSidebar({ mode, onModeSwitch, userName, userRole }: DashboardSidebarProps) {
  const pathname = usePathname()
  const { signOut } = useClerk()
  const [collapsed, setCollapsed] = useState(false)
  const links = mode === 'seller' ? sellerLinks : buyerLinks

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-surface transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <Link href="/freelancers" className="flex items-center gap-2">
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
            const isActive = pathname === link.href ||
              (link.href !== '/freelancers/dashboard' && pathname.startsWith(link.href))
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

        {/* Mode switch */}
        {!collapsed && (
          <div className="mt-4 border-t border-border pt-4">
            <button
              onClick={onModeSwitch}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-tertiary transition-colors hover:bg-background hover:text-text-primary"
            >
              {mode === 'seller' ? <ShoppingBag className="h-4 w-4" /> : <Briefcase className="h-4 w-4" />}
              Switch to {mode === 'seller' ? 'Buyer' : 'Seller'} Mode
            </button>
          </div>
        )}
      </nav>

      {/* User Section */}
      <div className="border-t border-border p-3">
        {!collapsed && userName && (
          <div className="mb-3 flex items-center gap-3 px-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange to-orange/70 text-xs font-bold text-white">
              {userName.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-text-primary">{userName}</p>
              <p className="truncate text-xs text-text-tertiary">{userRole || mode}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => signOut({ redirectUrl: '/freelancers' })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-background hover:text-red-500"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && 'Sign Out'}
        </button>
      </div>
    </aside>
  )
}
