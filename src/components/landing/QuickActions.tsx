'use client'

import { Phone, Mail, UserPlus, Check } from 'lucide-react'
import { WhatsAppIcon } from './icons'
import { useCopyAction } from './useCopyAction'
import { CARD } from '@/data/landing'

/**
 * The four things someone actually wants within two seconds of scanning the QR
 * on the card. Everything else on the page is secondary to this row.
 *
 * `copyValue` is set on the actions whose scheme can silently no-op on desktop.
 * WhatsApp opens web.whatsapp.com and Save downloads a file, so both always
 * visibly do something and need no fallback.
 */
export const ACTIONS = [
  {
    key: 'call',
    label: 'Call',
    href: CARD.phoneHref,
    Icon: Phone,
    note: CARD.phone,
    copyValue: CARD.phone,
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    href: CARD.whatsappHref,
    Icon: WhatsAppIcon,
    note: 'Chat now',
    copyValue: null,
  },
  {
    key: 'email',
    label: 'Email',
    href: CARD.emailHref,
    Icon: Mail,
    note: CARD.email,
    copyValue: CARD.email,
  },
  {
    key: 'save',
    label: 'Save',
    href: CARD.vcardHref,
    Icon: UserPlus,
    note: 'Add to contacts',
    copyValue: null,
  },
] as const

type Props = { variant?: 'hero' | 'bar' }

export default function QuickActions({ variant = 'hero' }: Props) {
  const { copied, copy } = useCopyAction()

  if (variant === 'bar') {
    return (
      <ul className="grid grid-cols-4">
        {ACTIONS.map(({ key, label, href, Icon, copyValue }) => {
          const isCopied = copied === key
          return (
            <li key={key} className="border-l border-orbit-line/[0.12] first:border-l-0">
              <a
                href={href}
                onClick={copyValue ? () => copy(key, copyValue) : undefined}
                {...(key === 'whatsapp' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="flex h-full flex-col items-center justify-center gap-1.5 py-3 text-orbit-ink/80 transition-colors active:bg-orbit-acc active:text-orbit-onAcc"
              >
                {isCopied ? (
                  <Check className="h-[18px] w-[18px] text-orbit-accInk" strokeWidth={2} aria-hidden />
                ) : (
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden />
                )}
                <span className="font-spacemono text-[9px] uppercase tracking-[0.2em]">
                  {isCopied ? 'Copied' : label}
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    )
  }

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {ACTIONS.map(({ key, label, href, Icon, note, copyValue }) => {
        const isCopied = copied === key
        return (
          <li key={key}>
            <a
              href={href}
              onClick={copyValue ? () => copy(key, copyValue) : undefined}
              {...(key === 'whatsapp' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="group flex h-full flex-col gap-2.5 border border-orbit-line/[0.14] bg-orbit-line/[0.022] p-4 backdrop-blur-sm transition-[border-color,background-color,transform] duration-300 hover:-translate-y-1 hover:border-orbit-accInk/60 hover:bg-orbit-line/[0.05]"
            >
              {isCopied ? (
                <Check className="h-5 w-5 text-orbit-accInk" strokeWidth={2} aria-hidden />
              ) : (
                <Icon
                  className="h-5 w-5 text-orbit-accInk transition-transform duration-300 group-hover:scale-110"
                  strokeWidth={1.5}
                  aria-hidden
                />
              )}
              <span className="font-spacemono text-[10px] font-bold uppercase tracking-[0.24em] text-orbit-ink">
                {label}
              </span>
              <span
                className="truncate font-spacemono text-[9px] uppercase tracking-[0.16em] text-orbit-ink/60"
                aria-live="polite"
              >
                {isCopied ? 'Copied to clipboard' : note}
              </span>
            </a>
          </li>
        )
      })}
    </ul>
  )
}
