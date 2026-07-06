import { NextResponse } from 'next/server'
import { FALLBACK_RATES, SUPPORTED_CODES, type CurrencyCode } from '@/lib/currency'

// Cache the response at Vercel's edge for 24 hours. open.er-api.com
// itself is refreshed daily, so nothing gets stale by polling harder.
export const revalidate = 86400

export async function GET() {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD', {
      next: { revalidate: 86400 },
    })
    if (!res.ok) throw new Error(`upstream ${res.status}`)
    const data = await res.json()

    const rates: Partial<Record<CurrencyCode, number>> = {}
    for (const code of SUPPORTED_CODES) {
      rates[code] = data.rates?.[code] ?? FALLBACK_RATES[code]
    }

    return NextResponse.json({
      rates,
      updatedAt: data.time_last_update_utc ?? new Date().toISOString(),
      source: 'open.er-api.com',
    })
  } catch (err) {
    console.error('[exchange-rates] fetch failed, using fallback:', err)
    return NextResponse.json({
      rates: FALLBACK_RATES,
      updatedAt: new Date().toISOString(),
      source: 'fallback',
    })
  }
}
