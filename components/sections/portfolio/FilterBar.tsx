'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface FilterBarProps {
  active: string
  onChange: (category: string) => void
}

const filters = [
  { label: 'All', value: 'all' },
  { label: 'AI', value: 'ai' },
  { label: 'Web', value: 'web' },
  { label: 'Mobile', value: 'mobile' },
  { label: 'Design', value: 'design' },
]

export function FilterBar({ active, onChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onChange(filter.value)}
          className={cn(
            'relative rounded-full px-5 py-2 text-sm font-medium transition-colors',
            active === filter.value
              ? 'text-text-primary'
              : 'text-text-secondary hover:text-text-primary'
          )}
        >
          {active === filter.value && (
            <motion.div
              layoutId="filter-pill"
              className="absolute inset-0 rounded-full bg-orange"
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
          )}
          <span className="relative z-10">{filter.label}</span>
        </button>
      ))}
    </div>
  )
}
