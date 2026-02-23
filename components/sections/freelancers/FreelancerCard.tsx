'use client'

import { motion } from 'framer-motion'
import { Star, Github, Linkedin } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { GlowDot } from '@/components/ui/GlowDot'
import { Freelancer } from '@/types'

interface FreelancerCardProps {
  freelancer: Freelancer
}

export function FreelancerCard({ freelancer }: FreelancerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: '-50px' }}
      className="card-hover rounded-xl border border-border bg-surface p-6"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-brand text-xl font-bold text-white">
            {freelancer.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white">{freelancer.name}</h3>
              {freelancer.available && <GlowDot />}
            </div>
            <p className="text-sm text-gray-1">{freelancer.title}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {freelancer.skills.slice(0, 4).map((skill) => (
          <Badge key={skill} variant="orange">{skill}</Badge>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.floor(freelancer.rating) }).map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-orange text-orange" />
          ))}
        </div>
        <span className="text-sm text-gray-1">
          {freelancer.rating} ({freelancer.reviewCount} reviews)
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-gray-1">{freelancer.bio}</p>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <div>
          <Badge variant="default">{freelancer.level}</Badge>
          <span className="ml-3 text-sm font-bold text-white">{freelancer.hourlyRate}</span>
        </div>
        <div className="flex items-center gap-2">
          {freelancer.github && (
            <a href={freelancer.github} target="_blank" rel="noopener noreferrer" className="text-gray-2 transition-colors hover:text-orange" aria-label="GitHub">
              <Github className="h-4 w-4" />
            </a>
          )}
          {freelancer.linkedin && (
            <a href={freelancer.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-2 transition-colors hover:text-orange" aria-label="LinkedIn">
              <Linkedin className="h-4 w-4" />
            </a>
          )}
          {freelancer.fiverr && (
            <a href={freelancer.fiverr} target="_blank" rel="noopener noreferrer">
              <Button variant="primary" size="sm">View Profile</Button>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}
