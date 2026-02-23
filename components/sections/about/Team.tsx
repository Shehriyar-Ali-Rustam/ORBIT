'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Github, Linkedin } from 'lucide-react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Badge } from '@/components/ui/Badge'
import { team } from '@/data/team'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function Team() {
  return (
    <section className="section-padding bg-surface">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            viewport={{ once: true, margin: '-50px' }}
          >
            <SectionLabel>Our Team</SectionLabel>
            <SectionHeading className="mt-4">Meet the People Behind Orbit</SectionHeading>
          </motion.div>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease }}
              viewport={{ once: true, margin: '-50px' }}
            >
              {member.isFounder ? (
                <div className="card-hover rounded-xl border border-border bg-background p-6 text-center">
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={member.name}
                      width={200}
                      height={200}
                      quality={90}
                      className="mx-auto h-20 w-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-brand text-2xl font-black text-text-primary">
                      {member.name.charAt(0)}
                    </div>
                  )}
                  <h3 className="mt-4 text-lg font-semibold text-text-primary">{member.name}</h3>
                  <p className="text-sm text-orange">{member.role}</p>
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary">{member.bio}</p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {member.skills.slice(0, 4).map((skill) => (
                      <Badge key={skill} variant="default">{skill}</Badge>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-3">
                    {member.github && (
                      <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-text-tertiary transition-colors hover:text-orange" aria-label="GitHub">
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-text-tertiary transition-colors hover:text-orange" aria-label="LinkedIn">
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                    {member.fiverr && (
                      <a href={member.fiverr} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-text-tertiary transition-colors hover:text-orange" aria-label="Fiverr">
                        Fiverr
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <Link href="/freelancers/apply" className="block">
                  <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-border p-6 text-center transition-colors hover:border-orange/40">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-surface-2 text-2xl text-text-tertiary">
                      ?
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-text-tertiary">{member.role}</h3>
                    <p className="mt-2 text-sm text-text-tertiary">{member.bio}</p>
                    <span className="mt-4 text-sm font-medium text-orange">Join the Team &rarr;</span>
                  </div>
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
