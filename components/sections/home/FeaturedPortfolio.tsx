'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { LineReveal } from '@/components/ui/LineReveal'
import { projects } from '@/data/portfolio'
import type { Project } from '@/types'

function MarqueeCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/portfolio/${project.slug}`}
      className="group block w-[340px] flex-shrink-0 sm:w-[380px]"
    >
      <div className="overflow-hidden rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] backdrop-blur-sm transition-all duration-300 hover:border-accent/30 hover:shadow-card-hover">
        <div className="relative aspect-video overflow-hidden bg-surface-2">
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="400px"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 transition-all duration-300 group-hover:opacity-100">
            <span className="flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-[#0a0a0a]">
              View Project <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
        <div className="p-5">
          <Badge variant="accent">{project.category.toUpperCase()}</Badge>
          <h3 className="mt-2 text-base font-bold text-text-primary">{project.title}</h3>
          <p className="mt-1.5 line-clamp-2 text-sm text-text-secondary">
            {project.shortDescription}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.techStack.slice(0, 3).map((tech) => (
              <Badge key={tech} variant="default">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}

function MarqueeRow({
  items,
  direction = 'left',
  duration = 40,
}: {
  items: Project[]
  direction?: 'left' | 'right'
  duration?: number
}) {
  // Duplicate items for seamless loop
  const doubled = [...items, ...items]

  return (
    <div className="group/marquee relative overflow-hidden">
      {/* Fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-[var(--color-bg)] to-transparent sm:w-24" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-[var(--color-bg)] to-transparent sm:w-24" />

      <div
        className="flex gap-6 hover:[animation-play-state:paused]"
        style={{
          animation: `marquee-${direction} ${duration}s linear infinite`,
        }}
      >
        {doubled.map((project, i) => (
          <MarqueeCard key={`${project.id}-${i}`} project={project} />
        ))}
      </div>
    </div>
  )
}

export function FeaturedPortfolio() {
  const row1 = projects.slice(0, 4)
  const row2 = projects.slice(4, 8)

  return (
    <section className="section-padding overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">
          <LineReveal>
            <SectionLabel>Selected Work</SectionLabel>
          </LineReveal>
          <LineReveal delay={0.1}>
            <SectionHeading className="mt-4">Work We&apos;re Proud Of</SectionHeading>
          </LineReveal>
        </div>
      </div>

      {/* Marquee rows — full width, no container constraint */}
      <motion.div
        className="mt-16 space-y-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <MarqueeRow items={row1} direction="left" duration={35} />
        <MarqueeRow items={row2} direction="right" duration={40} />
      </motion.div>

      <div className="mt-12 text-center">
        <Link href="/portfolio">
          <Button variant="ghost">
            See All Work
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  )
}
