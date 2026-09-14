import type { Metadata } from 'next'
import { ArrowUpRight, Check } from 'lucide-react'
import { CTASection } from '@/components/sections/CTASection'
import { COMPANY } from '@/lib/constants'

const SITE_URL = 'https://orbitpk.com'

export const metadata: Metadata = {
  title: 'Careers & Internships at Orbit Innovations - Islamabad, Pakistan',
  description:
    'Join Orbit Innovations. We are hiring AI engineers, web and mobile developers, and designers in Islamabad and Rawalpindi. Paid internships with real client work and founder mentorship.',
  keywords: [
    'Orbit Innovations careers',
    'software jobs Islamabad',
    'AI internship Pakistan',
    'web developer jobs Pakistan',
    'internship Islamabad',
    'tech jobs Rawalpindi',
  ],
  alternates: { canonical: '/careers' },
}

const perks = [
  'Real client projects from week one',
  'Direct mentorship from the founders',
  'Remote or hybrid',
  'A certificate and a portfolio piece',
  'A real shot at joining full time',
]

const tracks = [
  {
    code: 'AI-ML',
    title: 'AI & Machine Learning',
    desc: 'Build chatbots, fine-tune models, and work on RAG systems for real clients.',
    stack: 'Python · OpenAI · LangChain · PyTorch',
  },
  {
    code: 'WEB',
    title: 'Web Development',
    desc: 'Ship production Next.js applications with real users and real deadlines.',
    stack: 'Next.js · React · TypeScript · Tailwind',
  },
  {
    code: 'MOB',
    title: 'Mobile Development',
    desc: 'Build Android and cross-platform apps from design to store submission.',
    stack: 'Kotlin · React Native · Flutter',
  },
  {
    code: 'DSN',
    title: 'Design',
    desc: 'Own brand identity and product interfaces for shipping products.',
    stack: 'Figma · UI/UX · Brand · Motion',
  },
]

export default function CareersPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Careers', item: `${SITE_URL}/careers` },
    ],
  }

  // JobPosting schema makes the internship eligible for Google Jobs.
  const jobSchema = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: 'Software & AI Internship',
    description:
      'A three month hands-on internship at Orbit Innovations working on real client projects in AI/ML, web development, mobile development, or design. Mentored directly by the founders. Remote or hybrid, based in Islamabad, Pakistan.',
    identifier: {
      '@type': 'PropertyValue',
      name: 'Orbit Innovations',
      value: 'ORB-INT-26',
    },
    hiringOrganization: { '@id': `${SITE_URL}/#organization` },
    employmentType: 'INTERN',
    jobLocationType: 'TELECOMMUTE',
    applicantLocationRequirements: {
      '@type': 'Country',
      name: 'Pakistan',
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Islamabad',
        addressRegion: 'Islamabad Capital Territory',
        addressCountry: 'PK',
      },
    },
    datePosted: '2026-07-13',
    directApply: true,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobSchema) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden section-padding pt-32">
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Left: copy */}
            <div>
              <p className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.24em] text-accent">
                <span aria-hidden className="h-px w-7 bg-accent" />
                Now accepting applications
              </p>
              <h1 className="mt-5 max-w-2xl text-[2.25rem] font-semibold tracking-[-0.03em] text-text-primary sm:text-5xl md:text-[3.5rem]">
                Build real things, <span className="text-accent">from day one</span>
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-text-secondary sm:text-base">
                We are looking for people who want to ship, not shadow.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="https://orbit-internship.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-[#0a0a0a] transition-colors hover:bg-accent-hover"
                >
                  Apply for the internship
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <a
                  href={`mailto:${COMPANY.email}?subject=Career%20enquiry`}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-text-secondary transition-colors hover:border-accent hover:text-accent"
                >
                  Email us instead
                </a>
              </div>
            </div>

            {/* Was three counter-rotating dashed rings with orbiting dots and
                a glowing centre mark: six perpetual animations, desktop-only,
                carrying no information. Replaced with the terms of the role,
                which is what someone reads before deciding to apply. */}
            <dl className="grid grid-cols-2 gap-x-8 gap-y-7 border-t border-border pt-8 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
              {[
                { k: 'Role', v: 'AI / ML Intern' },
                { k: 'Length', v: '3 months' },
                { k: 'Format', v: 'Remote, Pakistan' },
                { k: 'Hours', v: '20 to 25 / week' },
                { k: 'Stipend', v: 'Paid' },
                { k: 'Starts', v: 'Rolling' },
              ].map((row) => (
                <div key={row.k}>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
                    {row.k}
                  </dt>
                  <dd className="mt-1.5 text-[0.9375rem] font-medium text-text-primary">{row.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Tracks */}
      <section className="section-padding pt-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-text-tertiary">
            Open tracks
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {tracks.map((t) => (
              <div
                key={t.code}
                className="rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-bold text-text-primary">{t.title}</h3>
                  <span className="shrink-0 rounded-full bg-accent/10 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-accent">
                    {t.code}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">{t.desc}</p>
                <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-text-tertiary">
                  {t.stack}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get + the honest bit */}
      <section className="section-padding pt-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                What you actually get
              </h2>
              <ul className="mt-6 flex flex-col gap-3">
                {perks.map((p) => (
                  <li key={p} className="flex gap-3 text-sm leading-relaxed text-text-secondary">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-6 sm:p-8">
              <h2 className="text-lg font-bold text-text-primary">Who this suits</h2>
              <p className="mt-4 text-sm leading-relaxed text-text-secondary">
                A student or recent graduate who has built something, even if it is small
                and a bit broken.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-text-secondary">
                Show us a repo, a design file, a half-finished app. It tells us more than
                a CV.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-text-secondary">
                We read every application ourselves and reply within five working days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Apply CTA */}
      <section className="section-padding pt-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col items-center gap-5 rounded-3xl border border-accent/20 bg-accent/5 p-10 text-center sm:p-14">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">
              ORB-INT-26 · 3 months · Remote or hybrid
            </p>
            <h2 className="max-w-lg text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
              The application takes about five minutes
            </h2>
            <p className="max-w-md text-sm text-text-secondary">
              No cover letter. No CV upload. Just tell us what you want to build.
            </p>
            <a
              href="https://orbit-internship.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-bold text-[#0a0a0a] transition-colors hover:bg-accent-hover"
            >
              Start your application
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  )
}
