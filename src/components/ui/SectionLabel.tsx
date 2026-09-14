import { cn } from '@/lib/utils'

interface SectionLabelProps {
  children: React.ReactNode
  className?: string
  /** Centre the rule and label. Only for genuinely centred sections. */
  centered?: boolean
}

/**
 * The eyebrow above a section heading.
 *
 * Was a rounded pill with a tinted background and a small filled dot — the
 * badge shape every generated landing page reaches for. It is now a monospace
 * label preceded by a short accent rule, which is the same device the QR
 * landing page uses, so the two halves of the site finally agree on what a
 * section label looks like.
 *
 * The rule carries the accent so the text can stay at full contrast instead of
 * being tinted orange against the canvas, where it failed AA.
 */
export function SectionLabel({ children, className, centered = false }: SectionLabelProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-text-secondary',
        centered && 'justify-center',
        className
      )}
    >
      <span aria-hidden className="h-px w-7 shrink-0 bg-accent" />
      {children}
    </span>
  )
}
