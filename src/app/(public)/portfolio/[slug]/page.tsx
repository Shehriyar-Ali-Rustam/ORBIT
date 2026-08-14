import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { projects } from '@/data/portfolio'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { HomeCTA } from '@/components/sections/home/HomeCTA'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = projects.find((p) => p.slug === params.slug)
  if (!project) return {}
  return {
    title: `${project.title} - Orbit Innovations Portfolio`,
    description: project.fullDescription,
    keywords: [
      project.title,
      ...project.techStack,
      `${project.category} project`,
      'Orbit Innovations case study',
    ],
    alternates: { canonical: `/portfolio/${project.slug}` },
    openGraph: {
      title: `${project.title} - Orbit Innovations Portfolio`,
      description: project.shortDescription,
      images: [{ url: project.coverImage, width: 1280, height: 720 }],
    },
  }
}

export default function ProjectDetailPage({ params }: Props) {
  const project = projects.find((p) => p.slug === params.slug)

  if (!project) {
    notFound()
  }

  const currentIndex = projects.findIndex((p) => p.slug === params.slug)
  const nextProject = projects[(currentIndex + 1) % projects.length]

  const projectSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.fullDescription,
    image: `https://orbitpk.com${project.coverImage}`,
    url: `https://orbitpk.com/portfolio/${project.slug}`,
    dateCreated: project.completedAt,
    creator: { '@id': 'https://orbitpk.com/#organization' },
    keywords: project.techStack.join(', '),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://orbitpk.com' },
      { '@type': 'ListItem', position: 2, name: 'Portfolio', item: 'https://orbitpk.com/portfolio' },
      { '@type': 'ListItem', position: 3, name: project.title, item: `https://orbitpk.com/portfolio/${project.slug}` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <section className="pt-24 section-padding">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-orange"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Portfolio
          </Link>

          {/* Hero area */}
          <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-2xl border border-border bg-surface">
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority
            />
          </div>

          {/* Content */}
          <div className="mt-12 grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Badge variant="orange">{project.category.toUpperCase()}</Badge>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-text-primary md:text-5xl">
                {project.title}
              </h1>
              <p className="mt-6 whitespace-pre-line leading-relaxed text-text-secondary">
                {project.fullDescription}
              </p>

              {/* ── Case study ── */}
              {project.caseStudy && (
                <div className="mt-12 flex flex-col gap-10 border-t border-border pt-10">
                  {/* Results up top: the numbers are the headline */}
                  <div className="grid grid-cols-3 gap-3">
                    {project.caseStudy.results.map((r) => (
                      <div
                        key={r.label}
                        className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-4 text-center"
                      >
                        <p className="text-xl font-black tracking-tight text-accent sm:text-2xl">
                          {r.value}
                        </p>
                        <p className="mt-1 text-[11px] leading-tight text-text-tertiary">
                          {r.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <section>
                    <h2 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-text-tertiary">
                      The problem
                    </h2>
                    <p className="mt-3 leading-relaxed text-text-secondary">
                      {project.caseStudy.problem}
                    </p>
                  </section>

                  <section>
                    <h2 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-text-tertiary">
                      What we did
                    </h2>
                    <p className="mt-3 leading-relaxed text-text-secondary">
                      {project.caseStudy.approach}
                    </p>
                    <ul className="mt-5 flex flex-col gap-3">
                      {project.caseStudy.highlights.map((h) => (
                        <li key={h} className="flex gap-3 text-sm leading-relaxed text-text-secondary">
                          <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  {project.caseStudy.note && (
                    <blockquote className="border-l-2 border-accent bg-accent/5 py-4 pl-5 pr-4 text-sm leading-relaxed text-text-primary">
                      {project.caseStudy.note}
                    </blockquote>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-text-tertiary">
                  Tech Stack
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <Badge key={tech} variant="default">{tech}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-text-tertiary">
                  Completed
                </h3>
                <p className="mt-2 text-sm text-text-secondary">
                  {new Date(project.completedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                  })}
                </p>
              </div>

              <div className="space-y-3">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="block">
                    <Button variant="primary" className="w-full">
                      <ExternalLink className="h-4 w-4" />
                      See Live
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Next project */}
          {nextProject && (
            <div className="mt-16 border-t border-border pt-8">
              <p className="text-sm text-text-tertiary">Next Project</p>
              <Link
                href={`/portfolio/${nextProject.slug}`}
                className="mt-2 inline-flex items-center gap-2 text-xl font-semibold text-text-primary transition-colors hover:text-orange"
              >
                {nextProject.title} &rarr;
              </Link>
            </div>
          )}
        </div>
      </section>

      <HomeCTA />
    </>
  )
}
