'use client'

import { motion } from 'framer-motion'
import { Sparkles, Zap, MessageSquare, Globe } from 'lucide-react'
import type { AITool } from '@/lib/ai/prompts'

const TOOL_SUBTITLES: Record<AITool, string> = {
  chat:      'Type a command or ask a question',
  code:      'Describe what you want to build',
  write:     'Tell me what you want to create',
  translate: 'Paste text to translate',
  resume:    'Describe your experience and goals',
  freelance: 'Ask about Fiverr, proposals, or pricing',
  image:     'Describe the image you want to generate',
}

// Suggestion chip icons
const CHIP_ICONS = [Sparkles, Zap, MessageSquare, Globe]

interface WelcomeScreenProps {
  tool: AITool
  suggestions: string[]
  onSuggestionClick: (text: string) => void
}

export function WelcomeScreen({ tool, suggestions, onSuggestionClick }: WelcomeScreenProps) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-6 py-16">

      {/* ── Animated background orbs ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute left-1/4 top-1/4 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.06] blur-[100px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute right-1/4 bottom-1/3 h-[300px] w-[300px] translate-x-1/2 rounded-full bg-accent/[0.04] blur-[80px]"
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </div>

      <div className="relative w-full max-w-2xl text-center">

        {/* ── Heading — mixed weight like reference ── */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl font-light tracking-tight text-text-primary sm:text-5xl"
        >
          How can{' '}
          <span className="font-semibold italic text-accent">I</span>{' '}
          help{' '}
          <span className="font-semibold italic text-text-primary">today?</span>
        </motion.h1>

        {/* ── Subtitle ── */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-3 text-sm text-text-tertiary"
        >
          {TOOL_SUBTITLES[tool]}
        </motion.p>

        {/* ── Suggestion chips ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-wrap justify-center gap-2"
        >
          {suggestions.slice(0, 4).map((s, i) => {
            const ChipIcon = CHIP_ICONS[i % CHIP_ICONS.length]
            return (
              <motion.button
                key={s}
                onClick={() => onSuggestionClick(s)}
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 rounded-full border border-[var(--color-card-border)] bg-[var(--color-card-bg)] px-4 py-2 text-sm text-text-secondary shadow-sm transition-all duration-200 hover:border-accent/40 hover:text-accent"
              >
                <ChipIcon className="h-3.5 w-3.5 flex-shrink-0 text-accent/70" />
                <span className="truncate max-w-[180px]">{s}</span>
              </motion.button>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}
