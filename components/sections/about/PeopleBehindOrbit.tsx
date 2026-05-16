'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Github, Linkedin } from 'lucide-react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Badge } from '@/components/ui/Badge'
import { founders } from '@/data/founders'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function PeopleBehindOrbit() {
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
            <SectionLabel>People Behind Orbit</SectionLabel>
            <SectionHeading className="mt-4">The Founding Team</SectionHeading>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">
              Three software engineering students from Pakistan who built ORBIT from
              the ground up.
            </p>
          </motion.div>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {founders.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease }}
              viewport={{ once: true, margin: '-50px' }}
            >
              <div className="group relative h-full overflow-hidden rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-6 text-center backdrop-blur-sm">
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-br from-accent/5 to-transparent" />
                <div className="relative z-10">
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={member.name}
                      width={200}
                      height={200}
                      quality={90}
                      className="mx-auto h-24 w-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-brand text-3xl font-black text-text-primary">
                      {member.name.charAt(0)}
                    </div>
                  )}
                  <h3 className="mt-5 text-xl font-semibold text-text-primary">{member.name}</h3>
                  <p className="mt-1 text-sm font-medium text-accent">{member.role}</p>
                  <p className="mt-4 text-sm leading-relaxed text-text-secondary">{member.bio}</p>
                  {member.skills.length > 0 && (
                    <div className="mt-5 flex flex-wrap justify-center gap-2">
                      {member.skills.slice(0, 6).map((skill) => (
                        <Badge key={skill} variant="default">{skill}</Badge>
                      ))}
                    </div>
                  )}
                  {(member.github || member.linkedin || member.fiverr) && (
                    <div className="mt-5 flex items-center justify-center gap-4">
                      {member.github && (
                        <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-text-tertiary transition-colors hover:text-accent" aria-label="GitHub">
                          <Github className="h-4 w-4" />
                        </a>
                      )}
                      {member.linkedin && (
                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-text-tertiary transition-colors hover:text-accent" aria-label="LinkedIn">
                          <Linkedin className="h-4 w-4" />
                        </a>
                      )}
                      {member.fiverr && (
                        <a href={member.fiverr} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-text-tertiary transition-colors hover:text-accent" aria-label="Fiverr">
                          Fiverr
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
