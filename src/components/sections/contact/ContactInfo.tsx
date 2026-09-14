'use client'

import { motion } from 'framer-motion'
import { Mail, MapPin, Phone, Github, Linkedin } from 'lucide-react'
import { COMPANY, SOCIAL_LINKS } from '@/lib/constants'
import { GlowDot } from '@/components/ui/GlowDot'
import { EASE } from '@/components/motion/motion-config'


export function ContactInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      viewport={{ once: true }}
      className="space-y-8"
    >
      <div>
        <h3 className="text-lg font-semibold text-text-primary">Contact Information</h3>
        <p className="mt-2 text-sm text-text-secondary">
          Reach out through any of the channels below, or fill out the contact form.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
            <Mail className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="text-xs text-text-tertiary">Email</p>
            <a href={`mailto:${COMPANY.email}`} className="text-sm text-text-primary transition-colors hover:text-accent">
              {COMPANY.email}
            </a>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
            <Phone className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="text-xs text-text-tertiary">Phone</p>
            <a href={`tel:${COMPANY.phone.replace(/\s/g, '')}`} className="text-sm text-text-primary transition-colors hover:text-accent">
              {COMPANY.phone}
            </a>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
            <MapPin className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="text-xs text-text-tertiary">Location</p>
            <p className="text-sm text-text-primary">{COMPANY.location}</p>
          </div>
        </div>
      </div>

      {/* Green-on-canvas at `text-green-500` was the only non-accent colour on
          the page and sat around 3:1 in light mode. The dot carries the state;
          the label reads at full contrast. */}
      <div className="flex items-center gap-2.5">
        <GlowDot />
        <span className="text-sm text-text-primary">
          Accepting projects for{' '}
          <span className="text-text-secondary">October onwards</span>
        </span>
      </div>

      <div className="flex items-center gap-4">
        <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" className="text-text-tertiary transition-colors hover:text-accent" aria-label="GitHub">
          <Github className="h-5 w-5" />
        </a>
        <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="text-text-tertiary transition-colors hover:text-accent" aria-label="LinkedIn">
          <Linkedin className="h-5 w-5" />
        </a>
        <a href={SOCIAL_LINKS.fiverr} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-text-tertiary transition-colors hover:text-accent" aria-label="Fiverr">
          Fiverr
        </a>
      </div>
    </motion.div>
  )
}
