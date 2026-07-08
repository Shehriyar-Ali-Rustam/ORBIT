'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  CURRENCIES,
  FALLBACK_RATES,
  SUPPORTED_CODES,
  formatConverted,
  type CurrencyCode,
} from '@/lib/currency'

interface CurrencyContextValue {
  currency: CurrencyCode
  setCurrency: (c: CurrencyCode) => void
  format: (usd: number) => string
  formatRange: (usdStart: number, usdEnd: number) => string
  rates: Partial<Record<CurrencyCode, number>>
  isReady: boolean
  ratesUpdatedAt: string | null
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined)

const STORAGE_KEY = 'orbit-currency-v1'

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>('USD')
  const [rates, setRates] = useState<Partial<Record<CurrencyCode, number>>>(FALLBACK_RATES)
  const [ratesUpdatedAt, setRatesUpdatedAt] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function init() {
      // 1. Grab live rates (kicks off in parallel with detection)
      const ratesPromise = fetch('/api/exchange-rates')
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null)

      // 2. Restore saved preference from localStorage
      let resolvedCurrency: CurrencyCode | null = null
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved && (SUPPORTED_CODES as string[]).includes(saved)) {
          resolvedCurrency = saved as CurrencyCode
        }
      } catch {
        // localStorage unavailable, ignore
      }

      // 3. If none saved, geolocate for default
      if (!resolvedCurrency) {
        try {
          const geo = await fetch('/api/geolocation').then((r) => (r.ok ? r.json() : null))
          if (geo?.currency && (SUPPORTED_CODES as string[]).includes(geo.currency)) {
            resolvedCurrency = geo.currency as CurrencyCode
          }
        } catch {
          // geo unavailable, USD stays as default
        }
      }

      if (cancelled) return
      if (resolvedCurrency) setCurrencyState(resolvedCurrency)

      // 4. Apply live rates when they land
      const ratesData = await ratesPromise
      if (cancelled) return
      if (ratesData?.rates) {
        setRates({ ...FALLBACK_RATES, ...ratesData.rates })
        setRatesUpdatedAt(ratesData.updatedAt ?? null)
      }
      setIsReady(true)
    }

    init()
    return () => {
      cancelled = true
    }
  }, [])

  const setCurrency = useCallback((c: CurrencyCode) => {
    setCurrencyState(c)
    try {
      localStorage.setItem(STORAGE_KEY, c)
    } catch {
      // ignore
    }
  }, [])

  const value = useMemo<CurrencyContextValue>(
    () => ({
      currency,
      setCurrency,
      rates,
      isReady,
      ratesUpdatedAt,
      format: (usd: number) => formatConverted(usd, currency, rates),
      formatRange: (a: number, b: number) =>
        `${formatConverted(a, currency, rates)} – ${formatConverted(b, currency, rates)}`,
    }),
    [currency, rates, isReady, ratesUpdatedAt, setCurrency],
  )

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext)
  if (!ctx) throw new Error('useCurrency() must be used inside <CurrencyProvider>')
  return ctx
}

// Re-export currency metadata for consumers
export { CURRENCIES, SUPPORTED_CODES }
export type { CurrencyCode }
