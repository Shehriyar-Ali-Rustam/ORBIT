'use client'

import { motion } from 'framer-motion'
import { Mail, MapPin, Phone, Github, Linkedin } from 'lucide-react'
import { COMPANY, SOCIAL_LINKS } from '@/lib/constants'
import { GlowDot } from '@/components/ui/GlowDot'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function ContactInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease }}
      viewport={{ once: true }}
      className="space-y-8"
    >
      <div>
        <h3 className="text-lg font-semibold text-white">Contact Information</h3>
        <p className="mt-2 text-sm text-gray-1">
          Reach out through any of the channels below, or fill out the contact form.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-dim">
            <Mail className="h-5 w-5 text-orange" />
          </div>
          <div>
            <p className="text-xs text-gray-2">Email</p>
            <a href={`mailto:${COMPANY.email}`} className="text-sm text-white transition-colors hover:text-orange">
              {COMPANY.email}
            </a>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-dim">
            <Phone className="h-5 w-5 text-orange" />
          </div>
          <div>
            <p className="text-xs text-gray-2">Phone</p>
            <p className="text-sm text-white">{COMPANY.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-dim">
            <MapPin className="h-5 w-5 text-orange" />
          </div>
          <div>
            <p className="text-xs text-gray-2">Location</p>
            <p className="text-sm text-white">{COMPANY.location}</p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <GlowDot />
          <span className="text-sm text-green-500">Currently accepting projects</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" className="text-gray-2 transition-colors hover:text-orange" aria-label="GitHub">
          <Github className="h-5 w-5" />
        </a>
        <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-2 transition-colors hover:text-orange" aria-label="LinkedIn">
          <Linkedin className="h-5 w-5" />
        </a>
        <a href={SOCIAL_LINKS.fiverr} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-gray-2 transition-colors hover:text-orange" aria-label="Fiverr">
          Fiverr
        </a>
      </div>
    </motion.div>
  )
}
