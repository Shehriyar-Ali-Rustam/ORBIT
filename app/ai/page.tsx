'use client'

import { motion } from 'framer-motion'
import { ToolCard } from '@/components/ai/ToolCard'
import { AISidebar } from '@/components/ai/AISidebar'
import { TOOL_CONFIG, type AITool } from '@/lib/ai/prompts'

const TOOL_ORDER: { tool: AITool; href: string }[] = [
  { tool: 'chat', href: '/ai/chat' },
  { tool: 'code', href: '/ai/code' },
  { tool: 'write', href: '/ai/write' },
  { tool: 'translate', href: '/ai/translate' },
  { tool: 'resume', href: '/ai/resume' },
  { tool: 'freelance', href: '/ai/freelance' },
  { tool: 'image', href: '/ai/image' },
]

export default function AIDashboardPage() {
  return (
    <>
    <AISidebar />
    <main className="flex-1 overflow-hidden">
    <div className="flex h-full flex-col items-center justify-center overflow-y-auto bg-background px-6 py-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-[#FF751F]">
          Choose Your Tool
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-text-primary md:text-5xl">
          What can I help you{' '}
          <span className="bg-gradient-to-r from-[#FF751F] to-[#FF9A5C] bg-clip-text text-transparent">
            build today?
          </span>
        </h1>
      </motion.div>

      {/* Tool grid */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="mt-12 grid w-full max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {TOOL_ORDER.map(({ tool, href }) => (
          <ToolCard
            key={tool}
            tool={tool}
            name={TOOL_CONFIG[tool].name}
            description={TOOL_CONFIG[tool].description}
            href={href}
          />
        ))}
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-12 text-xs text-text-disabled"
      >
        Powered by Llama 3.3 via Groq &middot; Free to use
      </motion.p>
    </div>
    </main>
    </>
  )
}
