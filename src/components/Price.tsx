'use client'

import { useCurrency } from '@/components/providers/CurrencyProvider'
import { cn } from '@/lib/utils'

interface PriceProps {
  usd: number
  usdEnd?: number
  prefix?: string
  suffix?: string
  className?: string
  fromPrefix?: boolean
}

/**
 * Render a USD-denominated amount in the visitor's chosen currency.
 * All source prices live in USD; conversion + smart rounding happens at
 * render time via the CurrencyProvider.
 *
 *   <Price usd={500} />                     $500 or Rs 140,000 etc.
 *   <Price usd={500} usdEnd={2000} />       $500 – $2,000
 *   <Price usd={500} fromPrefix />          from $500
 */
export function Price({ usd, usdEnd, prefix, suffix, className, fromPrefix }: PriceProps) {
  const { format, formatRange, isReady } = useCurrency()

  const body = usdEnd != null
    ? (isReady ? formatRange(usd, usdEnd) : `$${usd.toLocaleString()} – $${usdEnd.toLocaleString()}`)
    : (isReady ? format(usd) : `$${usd.toLocaleString()}`)

  return (
    <span className={cn('tabular-nums', className)}>
      {fromPrefix && <span className="text-text-tertiary">from </span>}
      {prefix && <span>{prefix} </span>}
      {body}
      {suffix && <span>{suffix}</span>}
    </span>
  )
}
