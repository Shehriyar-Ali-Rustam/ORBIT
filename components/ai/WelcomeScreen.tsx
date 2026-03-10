'use client'

import { motion } from 'framer-motion'
import {
  Bot, Code2, PenTool, Languages, FileText, Briefcase, ImageIcon,
} from 'lucide-react'
import type { AITool } from '@/lib/ai/prompts'

const TOOL_ICONS: Record<AITool, typeof Bot> = {
  chat: Bot,
  code: Code2,
  write: PenTool,
  translate: Languages,
  resume: FileText,
  freelance: Briefcase,
  image: ImageIcon,
}

const TOOL_TITLES: Record<AITool, string> = {
  chat: 'Orbit Chat',
  code: 'Orbit Code',
  write: 'Orbit Write',
  translate: 'Orbit Translate',
  resume: 'Orbit Resume',
  freelance: 'Orbit Freelance',
  image: 'Orbit Image',
}

const TOOL_DESCRIPTIONS: Record<AITool, string> = {
  chat: 'Your general AI assistant. Ask me anything about tech, business, or Orbit.',
  code: 'Write, debug, and explain code in any language. Production-ready output.',
  write: 'Create marketing copy, blog posts, emails, and professional content.',
  translate: 'Professional English ↔ Urdu translation with cultural context.',
  resume: 'Build ATS-optimized resumes and cover letters that get interviews.',
  freelance: 'Win more clients on Fiverr and Upwork with optimized profiles and proposals.',
  image: 'Generate AI images for free. Describe what you want and I\'ll create it.',
}

interface WelcomeScreenProps {
  tool: AITool
  suggestions: string[]
  onSuggestionClick: (text: string) => void
}

export function WelcomeScreen({
  tool,
  suggestions,
  onSuggestionClick,
}: WelcomeScreenProps) {
  const Icon = TOOL_ICONS[tool]

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-center"
      >
        {/* Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FF751F]/10">
          <Icon className="h-8 w-8 text-[#FF751F]" />
        </div>

        {/* Title */}
        <h2 className="mt-5 text-2xl font-bold text-text-primary">
          Hi, I&apos;m {TOOL_TITLES[tool]}
        </h2>

        {/* Description */}
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-text-secondary">
          {TOOL_DESCRIPTIONS[tool]}
        </p>
      </motion.div>

      {/* Suggestion cards */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="mt-8 grid w-full max-w-lg grid-cols-1 gap-3 sm:grid-cols-2"
      >
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => onSuggestionClick(suggestion)}
            className="rounded-xl border border-border bg-surface px-4 py-3 text-left text-sm text-text-secondary transition-all hover:border-[#FF751F]/50 hover:text-text-primary"
          >
            {suggestion}
          </button>
        ))}
      </motion.div>
    </div>
  )
}
