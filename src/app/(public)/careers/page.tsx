import type { Metadata } from 'next'
import { ArrowUpRight, Check } from 'lucide-react'
import { HomeCTA } from '@/components/sections/home/HomeCTA'
import { COMPANY } from '@/lib/constants'

const SITE_URL = 'https://orbitpk.com'

export const metadata: Metadata = {
  title: 'Careers & Internships at ORBIT - Islamabad, Pakistan',
  description:
    'Join ORBIT. We are hiring AI engineers, web and mobile developers, and designers in Islamabad and Rawalpindi. Paid internships with real client work and founder mentorship.',
  keywords: [
    'ORBIT careers',
    'software jobs Islamabad',
    'AI internship Pakistan',
    'web developer jobs Pakistan',
    'internship Islamabad',
    'tech jobs Rawalpindi',
  ],
  alternates: { canonical: '/careers' },
}

const perks = [
  'Real client projects from week one, not throwaway exercises',
  'Direct mentorship from the founders, not a layer of managers',
  'Remote or hybrid, whatever actually works for you',
  'A certificate and a portfolio piece you can show anyone',
  'A genuine shot at joining the team full time',
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
      'A three month hands-on internship at ORBIT working on real client projects in AI/ML, web development, mobile development, or design. Mentored directly by the founders. Remote or hybrid, based in Islamabad, Pakistan.',
    identifier: {
      '@type': 'PropertyValue',
      name: 'ORBIT',
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
      <section className="section-padding pt-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.24em] text-accent">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            Now accepting applications
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight text-text-primary sm:text-5xl md:text-6xl">
            Build real things, <span className="text-gradient">from day one</span>
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-text-secondary sm:text-base">
            We are three engineers who started ORBIT from freelance work and grew it
            into a company. We are looking for people who want to ship, not shadow.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="https://orbit-internship.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-[#0a0a0a] transition-shadow hover:shadow-accent-glow"
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
                You are probably a student or recent graduate. You have built something,
                even if it is small and a bit broken. You would rather be given a real
                problem than a tutorial.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-text-secondary">
                We care more about what you have made than where you studied. Show us a
                repo, a design file, a half-finished app. That tells us more than a CV.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-text-secondary">
                We are a small team, so we read every application ourselves and reply
                within five working days either way.
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
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-bold text-[#0a0a0a] transition-shadow hover:shadow-accent-glow"
            >
              Start your application
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <HomeCTA />
    </>
  )
}
