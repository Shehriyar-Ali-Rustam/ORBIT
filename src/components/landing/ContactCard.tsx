import { Phone, Mail, Globe, MapPin, Clock, UserPlus } from 'lucide-react'
import MotionReveal from './MotionReveal'
import { WhatsAppIcon, LinkedInIcon, GitHubIcon } from './icons'
import { CARD, SOCIALS } from '@/data/landing'

const ROWS = [
  { Icon: Phone, label: 'Phone', value: CARD.phone, href: CARD.phoneHref, external: false },
  { Icon: WhatsAppIcon, label: 'WhatsApp', value: CARD.phone, href: CARD.whatsappHref, external: true },
  { Icon: Mail, label: 'Email', value: CARD.email, href: CARD.emailHref, external: false },
  { Icon: Globe, label: 'Website', value: CARD.site, href: CARD.siteHref, external: true },
  { Icon: MapPin, label: 'Studio', value: CARD.location, href: null, external: false },
  { Icon: Clock, label: 'Hours', value: CARD.hours, href: null, external: false },
] as const

const SOCIAL_ICONS = { LinkedIn: LinkedInIcon, GitHub: GitHubIcon } as const

export default function ContactCard() {
  return (
    <section id="contact" className="border-t border-orbit-line/[0.07]">
      <div className="mx-auto max-w-[1280px] px-5 py-24 sm:px-6 md:px-10 md:py-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">
          <MotionReveal from="left" className="lg:col-span-4">
            <p className="eyebrow accent-rule">The card, digitally</p>
            <h2 className="h-section mt-5 font-semibold text-orbit-ink">
              Everything on the card, <span className="text-orbit-accInk">one tap away.</span>
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-orbit-ink/65">
              Save us to your contacts now and the number is there when you need it. No photo of a
              card sitting in your camera roll for six months.
            </p>
            <p className="mt-6 max-w-md text-base leading-relaxed text-orbit-ink/65">
              When you call, you get the people who write the code. There is no account manager
              layer between you and the build.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {SOCIALS.map((social) => {
                const Icon = SOCIAL_ICONS[social.label as keyof typeof SOCIAL_ICONS]
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`ORBIT on ${social.label}`}
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
          </MotionReveal>

          <MotionReveal from="right" delay={0.12} className="lg:col-span-8">
            <div className="card p-6 md:p-8">
              <div className="flex items-center justify-between gap-4 border-b border-orbit-line/[0.12] pb-5">
                {/* The `//` prefix is the design system's code-comment motif. */}
                <span className="eyebrow !text-orbit-accInk">{'// Contact card'}</span>
                <span className="eyebrow !text-orbit-ink/60">v.l.02</span>
              </div>

              <dl className="divide-y divide-orbit-line/[0.09]">
                {ROWS.map(({ Icon, label, value, href, external }) => {
                  const body = (
                    <>
                      <dt className="flex items-center gap-3">
                        <Icon
                          className="h-4 w-4 shrink-0 text-orbit-accInk"
                          strokeWidth={1.5}
                          aria-hidden
                        />
                        <span className="font-spacemono text-[10px] uppercase tracking-[0.24em] text-orbit-ink/62">
                          {label}
                        </span>
                      </dt>
                      <dd className="flex min-w-0 items-center gap-3 text-sm text-orbit-ink sm:text-base">
                        <span className="truncate">{value}</span>
                        {href && (
                          <span
                            aria-hidden
                            className="shrink-0 text-orbit-ink/60 transition-all group-hover:translate-x-1 group-hover:text-orbit-accInk"
                          >
                            ↗
                          </span>
                        )}
                      </dd>
                    </>
                  )

                  return (
                    <div key={label}>
                      {href ? (
                        <a
                          href={href}
                          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                          className="group flex flex-col gap-1.5 py-4 transition-colors sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                        >
                          {body}
                        </a>
                      ) : (
                        <div className="flex flex-col gap-1.5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                          {body}
                        </div>
                      )}
                    </div>
                  )
                })}
              </dl>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a href={CARD.vcardHref} className="btn-primary flex-1">
                  <UserPlus className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                  Save to contacts
                </a>
                <a
                  href={CARD.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost flex-1"
                >
                  Message on WhatsApp <span aria-hidden>↗</span>
                </a>
              </div>
            </div>
          </MotionReveal>
        </div>
      </div>
    </section>
  )
}
