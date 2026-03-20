import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  children: React.ReactNode
  className?: string
}

export function SectionHeading({ children, className }: SectionHeadingProps) {
  return (
    <h2
      className={cn(
        'text-4xl font-black text-text-primary md:text-5xl lg:text-6xl',
        className
      )}
      style={{ letterSpacing: '-0.04em', lineHeight: '1.08' }}
    >
      {children}
    </h2>
  )
}
