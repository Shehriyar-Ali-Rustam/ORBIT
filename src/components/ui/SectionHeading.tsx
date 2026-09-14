import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  children: React.ReactNode
  className?: string
  /** Renders an `h1`. Use once per page; sections default to `h2`. */
  as?: 'h1' | 'h2'
}

/**
 * Section headings across the marketing site.
 *
 * Was `text-4xl md:text-5xl lg:text-6xl font-black` — a heading that competes
 * with the page rather than organising it. Hierarchy now comes from weight and
 * colour, with size doing the smallest share of the work: one step down at
 * every breakpoint, and semibold instead of black.
 *
 * `text-balance` keeps two-line headings from dropping a single orphan word,
 * which is most of what made the old ones look accidental at tablet widths.
 */
export function SectionHeading({ children, className, as = 'h2' }: SectionHeadingProps) {
  const Tag = as

  return (
    <Tag
      className={cn(
        'text-balance font-semibold tracking-[-0.03em] text-text-primary',
        as === 'h1'
          ? 'text-[2.25rem] leading-[1.08] sm:text-5xl md:text-[3.5rem]'
          : 'text-[1.75rem] leading-[1.12] sm:text-[2rem] md:text-[2.5rem]',
        className
      )}
    >
      {children}
    </Tag>
  )
}
