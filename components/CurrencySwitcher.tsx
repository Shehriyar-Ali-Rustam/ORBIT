'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronDown } from 'lucide-react'
import { CURRENCIES, SUPPORTED_CODES, useCurrency } from '@/components/providers/CurrencyProvider'
import { cn } from '@/lib/utils'

interface CurrencySwitcherProps {
  variant?: 'compact' | 'full'
  className?: string
  scrolledOverlay?: boolean
}

export function CurrencySwitcher({ variant = 'compact', className, scrolledOverlay = false }: CurrencySwitcherProps) {
  const { currency, setCurrency, ratesUpdatedAt } = useCurrency()
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const active = CURRENCIES[currency]

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const triggerBase = variant === 'compact'
    ? 'flex h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition-colors'
    : 'flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors'

  const triggerColors = scrolledOverlay
    ? 'border-white/30 text-white/90 hover:border-white hover:text-white'
    : 'border-border text-text-secondary hover:border-accent/50 hover:text-text-primary'

  return (
    <div ref={wrapperRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Currency: ${active.name}`}
        className={cn(triggerBase, triggerColors)}
      >
        <span className="text-sm leading-none" aria-hidden="true">{active.flag}</span>
        <span className="font-variant-tabular-nums tabular-nums">{active.code}</span>
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="listbox"
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-border bg-surface shadow-xl"
          >
            <div className="border-b border-border px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-text-tertiary">
                Show prices in
              </p>
              <p className="mt-0.5 text-xs text-text-secondary">
                Rates {ratesUpdatedAt ? 'updated' : 'refreshed'} daily
              </p>
            </div>
            <ul className="p-2">
              {SUPPORTED_CODES.map((code) => {
                const c = CURRENCIES[code]
                const isActive = code === currency
                return (
                  <li key={code}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      onClick={() => {
                        setCurrency(code)
                        setOpen(false)
                      }}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors',
                        isActive
                          ? 'bg-accent/10 text-text-primary'
                          : 'text-text-secondary hover:bg-accent-dim hover:text-text-primary',
                      )}
                    >
                      <span className="text-base leading-none" aria-hidden="true">{c.flag}</span>
                      <span className="flex-1">
                        <span className="block font-medium">{c.name}</span>
                        <span className="block text-xs text-text-tertiary tabular-nums">
                          {c.code} · {c.symbol}
                        </span>
                      </span>
                      {isActive && <Check className="h-4 w-4 shrink-0 text-accent" />}
                    </button>
                  </li>
                )
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
