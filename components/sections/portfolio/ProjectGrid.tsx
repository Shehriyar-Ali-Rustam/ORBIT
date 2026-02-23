'use client'

import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { FilterBar } from './FilterBar'
import { ProjectCard } from './ProjectCard'
import { projects } from '@/data/portfolio'

export function ProjectGrid() {
  const [category, setCategory] = useState('all')

  const filtered = category === 'all' ? projects : projects.filter((p) => p.category === category)

  return (
    <section className="section-padding">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FilterBar active={category} onChange={setCategory} />
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
