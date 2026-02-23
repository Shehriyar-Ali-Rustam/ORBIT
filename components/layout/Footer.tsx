import Link from 'next/link'
import { Github, Linkedin } from 'lucide-react'
import { NAV_LINKS, SOCIAL_LINKS, COMPANY } from '@/lib/constants'
import { services } from '@/data/services'

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand">
                <span className="text-sm font-black text-white">O</span>
              </div>
              <span className="text-lg font-bold tracking-tight text-white">Orbit</span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-1">{COMPANY.tagline}</p>
            <div className="flex items-center gap-4">
              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-2 transition-colors hover:text-orange"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-2 transition-colors hover:text-orange"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href={SOCIAL_LINKS.fiverr}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-gray-2 transition-colors hover:text-orange"
                aria-label="Fiverr"
              >
                Fiverr
              </a>
            </div>
          </div>

          {/* Col 2: Company */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Company
            </h3>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-1 transition-colors hover:text-orange"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Services */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Services
            </h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.id}>
                  <Link
                    href="/services"
                    className="text-sm text-gray-1 transition-colors hover:text-orange"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Contact
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="text-sm text-gray-1 transition-colors hover:text-orange"
                >
                  {COMPANY.email}
                </a>
              </li>
              <li className="text-sm text-gray-1">{COMPANY.phone}</li>
              <li className="text-sm text-gray-1">{COMPANY.location}</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-xs text-gray-2">
            &copy; {new Date().getFullYear()} Orbit. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-xs text-gray-2 transition-colors hover:text-orange"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-gray-2 transition-colors hover:text-orange"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
