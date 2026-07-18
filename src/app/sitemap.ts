import type { MetadataRoute } from 'next'
import { projects } from '@/data/portfolio'
import { posts } from '@/data/blog'

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://orbitpk.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/portfolio`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.7 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/team`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/careers`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    // Orbit AI (/ai/*) and the Freelancer Marketplace (/freelancers) are
    // gated behind Coming Soon right now, so they're intentionally left out
    // of the sitemap. Add them back when their flags flip to enabled.
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  // NOTE: the route is /portfolio/[slug], not /projects/[slug]. This used to
  // emit /projects/... which 404'd for every project in the sitemap.
  const projectsRoutes: MetadataRoute.Sitemap = projects.map((item) => ({
    url: `${SITE_URL}/portfolio/${item.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const teamRoutes: MetadataRoute.Sitemap = ['shehriyar', 'saqib', 'abdul-ahad'].map((id) => ({
    url: `${SITE_URL}/team/${id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.5,
  }))

  return [...staticRoutes, ...projectsRoutes, ...blogRoutes, ...teamRoutes]
}
