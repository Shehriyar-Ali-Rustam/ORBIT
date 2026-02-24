'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/Badge'
import { Project } from '@/types'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/portfolio/${project.slug}`} className="group block">
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="card-hover overflow-hidden rounded-xl border border-border bg-surface"
      >
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
      </motion.div>
    </Link>
  )
}
