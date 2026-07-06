import { NextRequest, NextResponse } from 'next/server'
import { countryToCurrency } from '@/lib/currency'

// Reads the visitor's country from Vercel's edge headers. Zero cost,
// no external API, no rate limit. Falls back to USD.
export function GET(req: NextRequest) {
  const country =
    req.headers.get('x-vercel-ip-country') ||
    req.headers.get('cf-ipcountry') ||
    null
  const currency = countryToCurrency(country)
  return NextResponse.json({ country, currency })
}
