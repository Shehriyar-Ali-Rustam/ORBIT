import type { Metadata } from 'next'
import Image from 'next/image'
import { Linkedin } from 'lucide-react'
import { founders, teamMembers } from '@/data/founders'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { HomeCTA } from '@/components/sections/home/HomeCTA'
import type { TeamMember } from '@/types'

const SITE_URL = 'https://orbitpk.com'

export const metadata: Metadata = {
  title: 'The Team - The People Building ORBIT',
  description:
    'Meet the full ORBIT team - the founders and the people driving engineering, design, marketing, and growth across our AI and software work.',
  alternates: { canonical: '/team' },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Team', item: `${SITE_URL}/team` },
  ],
}

function MemberCard({ member }: { member: TeamMember }) {
  const hasLinkedIn = member.linkedin && member.linkedin !== '#'

  return (
    <div className="group relative flex h-full flex-col items-center overflow-hidden rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-6 text-center backdrop-blur-sm">
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-br from-accent/5 to-transparent" />
      <div className="relative z-10 flex flex-col items-center">
        {member.photo ? (
          <Image
            src={member.photo}
            alt={member.name}
            width={200}
            height={200}
            quality={90}
            className="h-24 w-24 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-brand text-3xl font-black text-text-primary">
            {member.name.charAt(0)}
          </div>
        )}
        <h3 className="mt-5 text-lg font-semibold text-text-primary">{member.name}</h3>
        <p className="mt-1 text-sm font-medium text-accent">{member.role}</p>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary">{member.bio}</p>

        {hasLinkedIn ? (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-accent hover:text-accent"
            aria-label={`${member.name} on LinkedIn`}
          >
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </a>
        ) : (
          <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-text-tertiary">
            <Linkedin className="h-4 w-4" />
            LinkedIn soon
          </span>
        )}
      </div>
    </div>
  )
}

export default function TeamPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero */}
      <section className="section-padding pt-32">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
          <SectionLabel>The Team</SectionLabel>
          <SectionHeading className="mt-4">The people building ORBIT</SectionHeading>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-text-secondary sm:text-base">
            From engineering and design to marketing and growth - the people who ship
            the work and move the studio forward.
          </p>
        </div>
      </section>

      {/* Founders */}
      <section className="section-padding pt-4">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-accent">
            Founders
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {founders.map((m) => (
              <MemberCard key={m.id} member={m} />
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding pt-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-accent">
            Team
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((m) => (
              <MemberCard key={m.id} member={m} />
            ))}
          </div>
        </div>
      </section>

      <HomeCTA />
    </>
  )
}
