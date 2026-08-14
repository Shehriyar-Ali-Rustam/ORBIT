import { NextResponse } from 'next/server'
import { CARD } from '@/data/landing'

/**
 * Serves the ORBIT contact card as a .vcf download.
 *
 * This is the payoff of scanning the QR on the printed card: one tap and ORBIT
 * is in the phone's address book. iOS and Android both open the native
 * "Add Contact" sheet when they receive text/vcard with an attachment
 * disposition, so this deliberately does NOT render anything.
 */

/** vCard escapes commas, semicolons, backslashes and newlines in text values. */
function esc(value: string) {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

export const dynamic = 'force-static'

export function GET() {
  // vCard 3.0 — the version both iOS Contacts and Google Contacts import cleanly.
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:;${esc(CARD.company)};;;`,
    `FN:${esc(CARD.company)}`,
    `ORG:${esc(CARD.legalName)}`,
    `TITLE:${esc(CARD.tagline)}`,
    `TEL;TYPE=WORK,VOICE:${CARD.phone.replace(/\s/g, '')}`,
    `TEL;TYPE=CELL:${CARD.phone.replace(/\s/g, '')}`,
    `EMAIL;TYPE=WORK,INTERNET:${CARD.email}`,
    `URL:${CARD.siteHref}`,
    'ADR;TYPE=WORK:;;;Islamabad;Islamabad Capital Territory;;Pakistan',
    `NOTE:${esc('AI chatbots, custom model training, web platforms, mobile apps and brand design.')}`,
    'END:VCARD',
  ]

  // CRLF line endings are required by RFC 6350; some Android importers choke on LF.
  const body = lines.join('\r\n') + '\r\n'

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': 'attachment; filename="Orbit-Innovations.vcf"',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
