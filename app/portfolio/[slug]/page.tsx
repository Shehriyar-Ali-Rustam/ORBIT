import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ExternalLink, Github } from 'lucide-react'
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
    title: project.title,
    description: project.shortDescription,
  }
}

export default function ProjectDetailPage({ params }: Props) {
  const project = projects.find((p) => p.slug === params.slug)

  if (!project) {
    notFound()
  }

  const currentIndex = projects.findIndex((p) => p.slug === params.slug)
  const nextProject = projects[(currentIndex + 1) % projects.length]

  return (
    <>
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
          <div className="mt-8 aspect-video w-full overflow-hidden rounded-2xl border border-border bg-surface">
            <div className="flex h-full items-center justify-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-orange-dim">
                <span className="text-4xl font-bold text-orange">{project.title.charAt(0)}</span>
              </div>
            </div>
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
                      View Live
                    </Button>
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="block">
                    <Button variant="outline" className="w-full">
                      <Github className="h-4 w-4" />
                      View Source
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
