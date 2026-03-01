'use client'

import type { AIProvider } from '@/lib/ai/router'

const PROVIDER_CONFIG: Record<AIProvider, { label: string; color: string }> = {
  groq: { label: 'Llama 3.3 \u00b7 Groq', color: 'bg-green-500' },
  gemini: { label: 'Flash \u00b7 Gemini', color: 'bg-blue-500' },
  openai: { label: 'GPT-4o mini \u00b7 OpenAI', color: 'bg-purple-500' },
}

interface ModelBadgeProps {
  provider: AIProvider
}

export function ModelBadge({ provider }: ModelBadgeProps) {
  const config = PROVIDER_CONFIG[provider]

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] text-text-secondary">
      <span className={`h-1.5 w-1.5 rounded-full ${config.color} animate-pulse`} />
      {config.label}
    </span>
  )
}
