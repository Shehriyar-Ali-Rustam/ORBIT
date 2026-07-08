import { SELLER_LEVELS } from '@/lib/marketplace/constants'
import { cn } from '@/lib/utils'
import type { SellerLevel } from '@/types/marketplace'

interface SellerBadgeProps {
  level: SellerLevel
  className?: string
}

export function SellerBadge({ level, className }: SellerBadgeProps) {
  const config = SELLER_LEVELS.find((l) => l.value === level) || SELLER_LEVELS[0]

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  )
}
