import Link from 'next/link'
import { LinkedInIcon, GitHubIcon } from './icons'
import { CARD, SOCIALS } from '@/data/landing'

const COLUMNS = [
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Team', href: '/team' },
      { label: 'Careers', href: '/careers' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    heading: 'Work',
    links: [
      { label: 'Services', href: '/services' },
      { label: 'Portfolio', href: '/portfolio' },
      { label: 'Testimonials', href: '/testimonials' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    heading: 'Products',
    links: [
      { label: 'Orbit AI tools', href: '/ai' },
      { label: 'Freelancers', href: '/freelancers' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
]

const SOCIAL_ICONS = { LinkedIn: LinkedInIcon, GitHub: GitHubIcon } as const

export default function LandingFooter() {
  return (
    <footer className="border-t border-orbit-line/[0.07]">
      <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-6 md:px-10">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr] md:gap-12">
          <div className="col-span-2 md:col-span-1">
            <p className="text-2xl font-semibold uppercase tracking-[0.2em] text-orbit-accInk">
              Orbit
            </p>
            <p className="mt-1 font-spacemono text-[10px] uppercase tracking-[0.3em] text-orbit-ink/60">
              Innovations
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-orbit-ink/62">
              {CARD.tagline} in {CARD.location}. Building AI, web and mobile products for teams
              worldwide.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {SOCIALS.map((social) => {
                const Icon = SOCIAL_ICONS[social.label as keyof typeof SOCIAL_ICONS]
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Orbit Innovations on ${social.label}`}
                    className="flex h-10 w-10 items-center justify-center border border-orbit-line/[0.12] text-orbit-ink/60 transition-colors hover:border-orbit-accInk/50 hover:text-orbit-accInk"
                  >
                    {Icon ? (
                      <Icon className="h-4 w-4" />
                    ) : (
                      <span className="font-spacemono text-[9px] font-bold uppercase tracking-[0.1em]">
                        Fv
                      </span>
                    )}
                  </a>
                )
              })}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <p className="eyebrow !text-orbit-accInk">{col.heading}</p>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-orbit-ink/60 transition-colors hover:text-orbit-accInk"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="border-t border-orbit-line/[0.07]">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-3 px-5 py-6 pb-24 sm:px-6 md:flex-row md:items-center md:justify-between md:px-10 md:pb-6">
          <p className="eyebrow">© {new Date().getFullYear()} {CARD.company} · {CARD.location}</p>
          <p className="eyebrow !text-orbit-ink/60">
            Photography via Unsplash · Landing v.l.02
          </p>
        </div>
      </div>
    </footer>
  )
}
