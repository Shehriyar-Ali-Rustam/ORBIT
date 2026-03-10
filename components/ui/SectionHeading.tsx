import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  children: React.ReactNode
  className?: string
}

export function SectionHeading({ children, className }: SectionHeadingProps) {
  return (
    <h2
      className={cn(
        'text-4xl font-extrabold tracking-tight text-text-primary md:text-5xl lg:text-6xl',
        className
      )}
    >
      {children}
    </h2>
  )
}
