import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, Github, Linkedin, Mail } from 'lucide-react'
import { founders } from '@/data/founders'
import { Badge } from '@/components/ui/Badge'
import { COMPANY } from '@/lib/constants'

interface Props {
  params: { id: string }
}

export function generateStaticParams() {
  return founders.map((member) => ({ id: member.id }))
}

export function generateMetadata({ params }: Props): Metadata {
  const member = founders.find((m) => m.id === params.id)
  if (!member) return {}
  return {
    title: `${member.name} — ${member.role}`,
    description: member.bio,
  }
}

export default function TeamMemberPage({ params }: Props) {
  const member = founders.find((m) => m.id === params.id)
  if (!member) notFound()

  return (
    <section className="section-padding pt-32">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <Link
          href="/about#founders"
          className="inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-orange"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to People Behind Orbit
        </Link>

        <div className="mt-10 grid gap-10 md:grid-cols-[auto_1fr] md:gap-12">
          <div className="flex justify-center md:block">
            {member.photo ? (
              <Image
                src={member.photo}
                alt={member.name}
                width={240}
                height={240}
                quality={95}
                className="h-48 w-48 rounded-2xl object-cover md:h-56 md:w-56"
              />
            ) : (
              <div className="flex h-48 w-48 items-center justify-center rounded-2xl bg-gradient-brand text-6xl font-black text-text-primary md:h-56 md:w-56">
                {member.name.charAt(0)}
              </div>
            )}
          </div>

          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-accent">
              {member.role}
            </p>
            <h1 className="mt-2 text-3xl font-bold text-text-primary md:text-4xl">
              {member.name}
            </h1>
            <p className="mt-5 leading-relaxed text-text-secondary md:text-lg">
              {member.bio}
            </p>

            {member.skills.length > 0 && (
              <div className="mt-6">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-text-tertiary">
                  Focus areas
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {member.skills.map((skill) => (
                    <Badge key={skill} variant="default">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-4">
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-text-secondary transition-colors hover:border-accent hover:text-accent"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
              )}
              {member.github && (
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-text-secondary transition-colors hover:border-accent hover:text-accent"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              )}
              {member.fiverr && (
                <a
                  href={member.fiverr}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-text-secondary transition-colors hover:border-accent hover:text-accent"
                >
                  Fiverr
                </a>
              )}
              <a
                href={`mailto:${COMPANY.email}`}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-[#0a0a0a] transition-shadow hover:shadow-accent-glow"
              >
                <Mail className="h-4 w-4" />
                Get in touch
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
