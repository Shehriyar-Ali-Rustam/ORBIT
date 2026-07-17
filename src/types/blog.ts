export type BlogCategory = 'ai' | 'web' | 'mobile' | 'design' | 'business'

export interface BlogSection {
  heading?: string
  /** Paragraphs of body copy. Rendered in order. */
  paragraphs?: string[]
  /** Optional bullet list rendered after the paragraphs. */
  bullets?: string[]
  /** Optional pull-quote / callout rendered after the bullets. */
  callout?: string
  /** Optional simple table: first row is the header. */
  table?: { head: string[]; rows: string[][] }
}

export interface BlogPost {
  slug: string
  title: string
  /** Shown on cards and used as the meta description. */
  excerpt: string
  category: BlogCategory
  author: string
  /** ISO date, e.g. '2026-07-13' */
  publishedAt: string
  /** Rough read time in minutes. */
  readingMinutes: number
  /** Keywords for the page <meta keywords> and schema. */
  keywords: string[]
  /** Opening paragraph, rendered above the first section. */
  intro: string
  sections: BlogSection[]
  /** Closing call to action paragraph. */
  conclusion: string
}

export const CATEGORY_LABELS: Record<BlogCategory, string> = {
  ai: 'AI & ML',
  web: 'Web',
  mobile: 'Mobile',
  design: 'Design',
  business: 'Business',
}
