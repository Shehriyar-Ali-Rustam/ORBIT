import Link from 'next/link'
import { CheckCircle2, XCircle, AlertCircle, Sparkles } from 'lucide-react'

interface Props {
  searchParams: { status?: string; name?: string }
}

const COPY: Record<string, { icon: 'check' | 'x' | 'alert' | 'sparkle'; title: string; body: (name: string) => string; accent: string }> = {
  approved: {
    icon: 'check',
    title: 'Review Approved',
    body: (name) => `${name}'s review is now live on orbitpk.com. Thanks for keeping the testimonials section curated.`,
    accent: 'text-green-500',
  },
  rejected: {
    icon: 'x',
    title: 'Review Declined',
    body: (name) => `${name}'s review will not be published. The submission has been marked as rejected.`,
    accent: 'text-red-500',
  },
  'already-approved': {
    icon: 'check',
    title: 'Already Approved',
    body: (name) => `${name}'s review was already approved earlier. No change made.`,
    accent: 'text-green-500',
  },
  'already-rejected': {
    icon: 'x',
    title: 'Already Declined',
    body: (name) => `${name}'s review was already declined earlier. No change made.`,
    accent: 'text-red-500',
  },
  invalid: {
    icon: 'alert',
    title: 'Invalid Link',
    body: () => 'This approval link is invalid or has been tampered with. No changes were made.',
    accent: 'text-amber-500',
  },
  notfound: {
    icon: 'alert',
    title: 'Review Not Found',
    body: () => 'We could not find this review. It may have been deleted.',
    accent: 'text-amber-500',
  },
  error: {
    icon: 'alert',
    title: 'Something Went Wrong',
    body: () => 'An error occurred while updating the review. Check the Vercel logs for details.',
    accent: 'text-amber-500',
  },
}

function pickIcon(kind: 'check' | 'x' | 'alert' | 'sparkle') {
  const cls = 'h-14 w-14'
  if (kind === 'check') return <CheckCircle2 className={cls} />
  if (kind === 'x') return <XCircle className={cls} />
  if (kind === 'alert') return <AlertCircle className={cls} />
  return <Sparkles className={cls} />
}

export default function TestimonialThanksPage({ searchParams }: Props) {
  const status = searchParams.status || 'invalid'
  const name = searchParams.name || 'this client'
  const cfg = COPY[status] || COPY.invalid

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-6 pt-24">
      <div className="max-w-md text-center">
        <div className={`mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-surface ${cfg.accent}`}>
          {pickIcon(cfg.icon)}
        </div>
        <h1 className="text-3xl font-bold text-text-primary">{cfg.title}</h1>
        <p className="mt-4 leading-relaxed text-text-secondary">{cfg.body(name)}</p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-[#0a0a0a] transition-shadow hover:shadow-accent-glow"
        >
          Back to orbitpk.com
        </Link>
      </div>
    </section>
  )
}
