export type CurrencyCode = 'USD' | 'PKR' | 'GBP' | 'EUR' | 'INR' | 'AED'

export interface Currency {
  code: CurrencyCode
  name: string
  symbol: string
  flag: string
  locale: string
}

export const CURRENCIES: Record<CurrencyCode, Currency> = {
  USD: { code: 'USD', name: 'US Dollar',       symbol: '$',   flag: '🇺🇸', locale: 'en-US' },
  PKR: { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨',   flag: '🇵🇰', locale: 'en-PK' },
  GBP: { code: 'GBP', name: 'British Pound',   symbol: '£',   flag: '🇬🇧', locale: 'en-GB' },
  EUR: { code: 'EUR', name: 'Euro',            symbol: '€',   flag: '🇪🇺', locale: 'de-DE' },
  INR: { code: 'INR', name: 'Indian Rupee',    symbol: '₹',   flag: '🇮🇳', locale: 'en-IN' },
  AED: { code: 'AED', name: 'UAE Dirham',      symbol: 'د.إ', flag: '🇦🇪', locale: 'en-AE' },
}

export const SUPPORTED_CODES: CurrencyCode[] = ['USD', 'PKR', 'GBP', 'EUR', 'INR', 'AED']

// Fallback rates so the app still shows sensible numbers when the rate
// API is unreachable. Refreshed periodically as a safety net.
export const FALLBACK_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  PKR: 280,
  GBP: 0.79,
  EUR: 0.92,
  INR: 84,
  AED: 3.67,
}

const COUNTRY_TO_CURRENCY: Record<string, CurrencyCode> = {
  PK: 'PKR',
  IN: 'INR',
  AE: 'AED',
  GB: 'GBP',
  // Eurozone
  IE: 'EUR', FR: 'EUR', DE: 'EUR', IT: 'EUR', ES: 'EUR', NL: 'EUR', BE: 'EUR',
  AT: 'EUR', PT: 'EUR', GR: 'EUR', FI: 'EUR', LU: 'EUR', SK: 'EUR', SI: 'EUR',
  EE: 'EUR', LV: 'EUR', LT: 'EUR', MT: 'EUR', CY: 'EUR', HR: 'EUR',
}

export function countryToCurrency(countryCode?: string | null): CurrencyCode {
  if (!countryCode) return 'USD'
  return COUNTRY_TO_CURRENCY[countryCode.toUpperCase()] || 'USD'
}

/**
 * Round to two significant figures so converted prices read like human
 * prices, not machine translations. $500 in PKR becomes "Rs 140,000",
 * not "Rs 139,247".
 */
export function smartRound(amount: number): number {
  if (amount === 0) return 0
  const abs = Math.abs(amount)
  if (abs < 10) return Math.round(amount)
  const magnitude = Math.pow(10, Math.floor(Math.log10(abs)) - 1)
  return Math.round(amount / magnitude) * magnitude
}

export function convert(usdAmount: number, targetCurrency: CurrencyCode, rates: Partial<Record<CurrencyCode, number>>): number {
  if (targetCurrency === 'USD') return usdAmount
  const rate = rates[targetCurrency] ?? FALLBACK_RATES[targetCurrency]
  return usdAmount * rate
}

export function formatConverted(
  usdAmount: number,
  targetCurrency: CurrencyCode,
  rates: Partial<Record<CurrencyCode, number>>,
): string {
  const raw = convert(usdAmount, targetCurrency, rates)
  const rounded = smartRound(raw)
  const currency = CURRENCIES[targetCurrency]
  try {
    return new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: targetCurrency,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(rounded)
  } catch {
    return `${currency.symbol}${rounded.toLocaleString()}`
  }
}
