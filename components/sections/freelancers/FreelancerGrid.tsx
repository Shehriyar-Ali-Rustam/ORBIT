'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { FreelancerCard } from './FreelancerCard'
import { freelancers } from '@/data/freelancers'

const filters = ['All', 'AI', 'Web Dev', 'App Dev', 'Design']

export function FreelancerGrid() {
  const [active, setActive] = useState('All')

  const filtered = active === 'All'
    ? freelancers
    : freelancers.filter((f) => {
        const skills = f.skills.join(' ').toLowerCase()
        if (active === 'AI') return skills.includes('ai') || skills.includes('ml') || skills.includes('python')
        if (active === 'Web Dev') return skills.includes('react') || skills.includes('next') || skills.includes('web')
        if (active === 'App Dev') return skills.includes('native') || skills.includes('flutter') || skills.includes('mobile')
        if (active === 'Design') return skills.includes('figma') || skills.includes('design') || skills.includes('ui')
        return true
      })

  return (
    <section className="section-padding">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-3">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActive(filter)}
              className={cn(
                'rounded-full px-5 py-2 text-sm font-medium transition-colors',
                active === filter
                  ? 'bg-orange text-text-primary'
                  : 'bg-surface text-text-secondary hover:text-text-primary'
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((freelancer) => (
            <FreelancerCard key={freelancer.id} freelancer={freelancer} />
          ))}
        </div>
      </div>
    </section>
  )
}
