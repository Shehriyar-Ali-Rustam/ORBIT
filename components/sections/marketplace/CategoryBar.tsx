'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CategoryBarProps {
  selected: string | null
  onSelect: (cat: string | null) => void
}

const categories: { label: string; value: string | null }[] = [
  { label: 'All', value: null },
  { label: 'AI & ML', value: 'ai' },
  { label: 'Web Dev', value: 'web' },
  { label: 'Mobile', value: 'mobile' },
  { label: 'Design', value: 'design' },
  { label: 'Marketing', value: 'marketing' },
  { label: 'Other', value: 'other' },
]

export function CategoryBar({ selected, onSelect }: CategoryBarProps) {
  return (
    <div className="scrollbar-hide -mx-6 overflow-x-auto px-6">
      <div className="flex gap-3">
        {categories.map((cat) => {
          const isActive = selected === cat.value

          return (
            <button
              key={cat.label}
              onClick={() => onSelect(cat.value)}
              className={cn(
                'relative shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'text-white'
                  : 'border border-border bg-surface text-text-secondary hover:text-text-primary'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="category-indicator"
                  className="absolute inset-0 rounded-full bg-orange"
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
              <span className="relative z-10">{cat.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
