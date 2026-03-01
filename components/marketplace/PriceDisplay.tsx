import { cn } from '@/lib/utils'

interface PriceDisplayProps {
  price: number
  label?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const textSizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
}

export function PriceDisplay({ price, label = 'Starting at', size = 'md', className }: PriceDisplayProps) {
  return (
    <div className={cn('flex items-baseline gap-1', className)}>
      {label && <span className="text-xs text-text-tertiary">{label}</span>}
      <span className={cn('font-bold text-text-primary', textSizes[size])}>
        ${price.toLocaleString()}
      </span>
    </div>
  )
}
