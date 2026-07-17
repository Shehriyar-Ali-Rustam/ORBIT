export interface Service {
  id: string
  icon: string
  title: string
  shortDescription: string
  fullDescription: string
  includes: string[]
  category: 'ai' | 'web' | 'mobile' | 'design' | 'freelancer'
  slug: string
}

/** A measurable outcome, e.g. { value: '3x', label: 'more bookings' } */
export interface CaseStudyResult {
  value: string
  label: string
}

/**
 * The story behind a project. Optional: projects without it fall back to
 * showing fullDescription alone.
 */
export interface CaseStudy {
  /** What the client was up against before we started. */
  problem: string
  /** The approach and the calls we made. */
  approach: string
  /** Key decisions or build highlights, rendered as a list. */
  highlights: string[]
  /** Headline numbers shown as stat cards. */
  results: CaseStudyResult[]
  /** Optional closing note, e.g. what we learned or would change. */
  note?: string
}

export interface Project {
  id: string
  slug: string
  title: string
  category: 'ai' | 'web' | 'mobile' | 'design'
  shortDescription: string
  fullDescription: string
  coverImage: string
  images: string[]
  techStack: string[]
  liveUrl?: string
  githubUrl?: string
  featured: boolean
  completedAt: string
  /** Present on projects we have written up properly. */
  caseStudy?: CaseStudy
}

export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  photo: string
  skills: string[]
  github?: string
  linkedin?: string
  fiverr?: string
  isFounder?: boolean
}

export interface Testimonial {
  id: string
  quote: string
  author: string
  country: string
  avatar?: string
  rating: number
}

export interface FAQ {
  id: string
  question: string
  /** Rendered on the page - can include JSX (e.g. inline <Price />) */
  answer: React.ReactNode
  /** Plain-text version used for FAQPage schema.org JSON-LD (SEO) */
  answerText: string
}

export type * from './marketplace'
