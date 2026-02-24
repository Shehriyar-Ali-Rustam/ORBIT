'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { projects } from '@/data/portfolio'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function FeaturedPortfolio() {
  const featured = projects.filter((p) => p.featured).slice(0, 3)

  return (
    <section className="section-padding">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            viewport={{ once: true, margin: '-50px' }}
          >
            <SectionLabel>Selected Work</SectionLabel>
            <SectionHeading className="mt-4">Work We&apos;re Proud Of</SectionHeading>
          </motion.div>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease }}
              viewport={{ once: true, margin: '-50px' }}
            >
              <Link href={`/portfolio/${project.slug}`} className="group block">
                <div className="card-hover overflow-hidden rounded-xl border border-border bg-surface">
                  <div className="relative aspect-video overflow-hidden bg-surface-2">
                    <Image
                      src={project.coverImage}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="text-sm font-semibold text-text-primary">View Project &rarr;</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <Badge variant="orange">{project.category.toUpperCase()}</Badge>
                    <h3 className="mt-3 text-lg font-semibold text-text-primary">{project.title}</h3>
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
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/portfolio">
            <Button variant="ghost">See All Work &rarr;</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
