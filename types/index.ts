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
  answer: string
}

export type * from './marketplace'
