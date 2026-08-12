'use client'

import { Phone, Mail, UserPlus } from 'lucide-react'
import { WhatsAppIcon } from './icons'
import { CARD } from '@/data/landing'

/**
 * The four things someone actually wants within two seconds of scanning the QR
 * on the card. Everything else on the page is secondary to this row.
 */
export const ACTIONS = [
  { key: 'call', label: 'Call', href: CARD.phoneHref, Icon: Phone, note: CARD.phone },
  { key: 'whatsapp', label: 'WhatsApp', href: CARD.whatsappHref, Icon: WhatsAppIcon, note: 'Chat now' },
  { key: 'email', label: 'Email', href: CARD.emailHref, Icon: Mail, note: CARD.email },
  { key: 'save', label: 'Save', href: CARD.vcardHref, Icon: UserPlus, note: 'Add to contacts' },
] as const

type Props = { variant?: 'hero' | 'bar' }

export default function QuickActions({ variant = 'hero' }: Props) {
  if (variant === 'bar') {
    return (
      <ul className="grid grid-cols-4">
        {ACTIONS.map(({ key, label, href, Icon }) => (
          <li key={key} className="border-l border-orbit-line/[0.12] first:border-l-0">
            <a
              href={href}
              {...(key === 'whatsapp' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="flex h-full flex-col items-center justify-center gap-1.5 py-3 text-orbit-ink/80 transition-colors active:bg-orbit-acc active:text-orbit-onAcc"
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden />
              <span className="font-spacemono text-[9px] uppercase tracking-[0.2em]">{label}</span>
            </a>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {ACTIONS.map(({ key, label, href, Icon, note }) => (
        <li key={key}>
          <a
            href={href}
            {...(key === 'whatsapp' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="group flex h-full flex-col gap-2.5 border border-orbit-line/[0.14] bg-orbit-line/[0.022] p-4 backdrop-blur-sm transition-[border-color,background-color,transform] duration-300 hover:-translate-y-1 hover:border-orbit-accInk/60 hover:bg-orbit-line/[0.05]"
          >
            <Icon
              className="h-5 w-5 text-orbit-accInk transition-transform duration-300 group-hover:scale-110"
              strokeWidth={1.5}
              aria-hidden
            />
            <span className="font-spacemono text-[10px] font-bold uppercase tracking-[0.24em] text-orbit-ink">
              {label}
            </span>
            <span className="truncate font-spacemono text-[9px] uppercase tracking-[0.16em] text-orbit-ink/60">
              {note}
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}
