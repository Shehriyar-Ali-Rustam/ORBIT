'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Bot, Code2, PenTool, Languages, FileText, Briefcase, ImageIcon, ArrowRight,
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

interface ToolCardProps {
  tool: AITool
  name: string
  description: string
  href: string
}

export function ToolCard({ tool, name, description, href }: ToolCardProps) {
  const Icon = TOOL_ICONS[tool]

  return (
    <Link href={href}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="group cursor-pointer rounded-xl border border-border bg-surface p-6 transition-all hover:border-[#FF751F]/30 hover:shadow-[0_0_30px_-10px_rgba(112,230,237,0.15)]"
      >
        {/* Icon */}
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF751F]/10">
          <Icon className="h-5 w-5 text-[#FF751F]" />
        </div>

        {/* Title */}
        <h3 className="mt-4 text-lg font-semibold text-text-primary">{name}</h3>

        {/* Description */}
        <p className="mt-1 text-sm text-text-secondary">{description}</p>

        {/* CTA */}
        <p className="mt-4 flex items-center gap-1 text-sm font-medium text-[#FF751F] transition-all group-hover:gap-2">
          Open <ArrowRight className="h-3.5 w-3.5" />
        </p>
      </motion.div>
    </Link>
  )
}
