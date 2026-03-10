'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { LineReveal } from '@/components/ui/LineReveal'
import { projects } from '@/data/portfolio'
import type { Project } from '@/types'

function PortfolioCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '10%'])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay: index * 0.12 }}
      viewport={{ once: true, margin: '-50px' }}
    >
      <Link href={`/portfolio/${project.slug}`} className="group block">
        <div className="overflow-hidden rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] backdrop-blur-sm transition-all duration-300 hover:border-accent/30 hover:shadow-card-hover">
          <div className="relative aspect-video overflow-hidden bg-surface-2">
            <motion.div style={{ y: imageY }} className="absolute inset-[-15%]">
              <Image
                src={project.coverImage}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 transition-all duration-300 group-hover:opacity-100">
              <span className="flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-[#0a0a0a]">
                View Project <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
          <div className="p-6">
            <Badge variant="accent">{project.category.toUpperCase()}</Badge>
            <h3 className="mt-3 text-lg font-bold text-text-primary">{project.title}</h3>
            <p className="mt-2 text-sm text-text-secondary">{project.shortDescription}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.techStack.slice(0, 3).map((tech) => (
                <Badge key={tech} variant="default">{tech}</Badge>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function FeaturedPortfolio() {
  const featured = projects.filter((p) => p.featured).slice(0, 3)

  return (
    <section className="section-padding">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">
          <LineReveal>
            <SectionLabel>Selected Work</SectionLabel>
          </LineReveal>
          <LineReveal delay={0.1}>
            <SectionHeading className="mt-4">Work We&apos;re Proud Of</SectionHeading>
          </LineReveal>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((project, i) => (
            <PortfolioCard key={project.id} project={project} index={i} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/portfolio">
            <Button variant="ghost">
              See All Work
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
