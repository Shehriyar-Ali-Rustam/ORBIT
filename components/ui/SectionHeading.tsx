import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  children: React.ReactNode
  className?: string
}

export function SectionHeading({ children, className }: SectionHeadingProps) {
  return (
    <h2
      className={cn(
        'text-4xl font-bold tracking-tight text-text-primary md:text-5xl',
        className
      )}
    >
      {children}
    </h2>
  )
}
