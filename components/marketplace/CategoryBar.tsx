'use client'

import { motion } from 'framer-motion'
import { Bot, Globe, Smartphone, Palette, TrendingUp, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'
import { GIG_CATEGORIES } from '@/lib/marketplace/constants'
import type { GigCategory } from '@/types/marketplace'

const ICONS: Record<string, React.ElementType> = {
  Bot, Globe, Smartphone, Palette, TrendingUp, Layers,
}

interface CategoryBarProps {
  selected: GigCategory | null
  onSelect: (category: GigCategory | null) => void
}

export function CategoryBar({ selected, onSelect }: CategoryBarProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={cn(
          'relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors',
          !selected
            ? 'text-orange'
            : 'text-text-secondary hover:text-text-primary'
        )}
      >
        {!selected && (
          <motion.div
            layoutId="category-active"
            className="absolute inset-0 rounded-full bg-orange-dim"
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
        <span className="relative z-10">All</span>
      </button>

      {GIG_CATEGORIES.map((cat) => {
        const Icon = ICONS[cat.icon] || Layers
        const isActive = selected === cat.value

        return (
          <button
            key={cat.value}
            type="button"
            onClick={() => onSelect(cat.value)}
            className={cn(
              'relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'text-orange'
                : 'text-text-secondary hover:text-text-primary'
            )}
          >
            {isActive && (
              <motion.div
                layoutId="category-active"
                className="absolute inset-0 rounded-full bg-orange-dim"
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              />
            )}
            <Icon className="relative z-10 h-4 w-4" />
            <span className="relative z-10">{cat.label}</span>
          </button>
        )
      })}
    </div>
  )
}
