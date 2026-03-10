'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bot, Code2, PenTool, Languages, FileText, Briefcase, ImageIcon,
  Plus, ChevronLeft, Menu, X, Sun, Moon,
} from 'lucide-react'
import { ConversationList, type ConversationItem } from './ConversationList'
import { useTheme } from '@/components/ThemeProvider'
import { cn } from '@/lib/utils'
import type { AITool } from '@/lib/ai/prompts'

const NAV_ITEMS: { tool: AITool; label: string; icon: typeof Bot; href: string }[] = [
  { tool: 'chat', label: 'Chat', icon: Bot, href: '/ai/chat' },
  { tool: 'code', label: 'Code', icon: Code2, href: '/ai/code' },
  { tool: 'write', label: 'Write', icon: PenTool, href: '/ai/write' },
  { tool: 'translate', label: 'Translate', icon: Languages, href: '/ai/translate' },
  { tool: 'resume', label: 'Resume', icon: FileText, href: '/ai/resume' },
  { tool: 'freelance', label: 'Freelance', icon: Briefcase, href: '/ai/freelance' },
  { tool: 'image', label: 'Image', icon: ImageIcon, href: '/ai/image' },
]

interface AISidebarProps {
  conversations?: ConversationItem[]
  activeConversationId?: string
  onNewChat?: () => void
  onSelectConversation?: (id: string) => void
  onDeleteConversation?: (id: string) => void
}

export function AISidebar({
  conversations = [],
  activeConversationId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
}: AISidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const currentTool = NAV_ITEMS.find((item) => pathname.startsWith(item.href))?.tool

  const sidebarContent = (
    <div className="flex h-full flex-col bg-surface border-r border-border">
      {/* Logo + Theme toggle */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="ORBIT"
              width={80}
              height={80}
              quality={100}
              className={cn('h-8 w-8 object-contain', theme === 'light' && 'invert hue-rotate-180')}
            />
            <span className="font-montserrat text-sm font-bold tracking-[0.2em] text-text-primary">
              ORBIT
            </span>
          </Link>
          <button
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:border-accent hover:text-accent"
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
                {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>

        <Link
          href="/"
          className="mt-3 flex items-center gap-2 text-xs text-text-secondary transition-colors hover:text-accent"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Back to Orbit
        </Link>

        {onNewChat && (
          <button
            onClick={() => {
              onNewChat()
              setMobileOpen(false)
            }}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </button>
        )}
      </div>

      {/* Tool navigation */}
      <div className="border-b border-border p-3">
        <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-[#FF751F]">
          Tools
        </p>
        <nav className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.tool}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[#FF751F]/10 text-[#FF751F]'
                    : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Conversations */}
      {currentTool && (
        <div className="flex-1 overflow-y-auto p-3">
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-text-tertiary">
            History
          </p>
          <ConversationList
            conversations={conversations}
            activeId={activeConversationId}
            onSelect={(id) => {
              onSelectConversation?.(id)
              setMobileOpen(false)
            }}
            onDelete={(id) => onDeleteConversation?.(id)}
          />
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-border p-4">
        <p className="text-[10px] text-text-disabled">
          Powered by Groq &middot; Llama 3.3
        </p>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-text-primary lg:hidden"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed left-0 top-0 z-40 h-full w-64 transform transition-transform lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden w-60 shrink-0 lg:block">
        {sidebarContent}
      </div>
    </>
  )
}
