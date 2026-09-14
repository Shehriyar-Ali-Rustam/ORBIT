import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Clock } from 'lucide-react'
import { getSortedPosts } from '@/data/blog'
import { CATEGORY_LABELS } from '@/types/blog'
import { HomeCTA } from '@/components/sections/home/HomeCTA'

const SITE_URL = 'https://orbitpk.com'

export const metadata: Metadata = {
  title: 'Blog - AI, Web & Software Insights from Orbit Innovations',
  description:
    'Practical writing on AI chatbots, web development, and building software from Pakistan. Real numbers, real build breakdowns, no fluff.',
  keywords: [
    'Orbit Innovations blog',
    'AI development Pakistan',
    'web development blog',
    'software development Pakistan',
    'Next.js Pakistan',
  ],
  alternates: { canonical: '/blog' },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function BlogIndexPage() {
  const posts = getSortedPosts()
  const [featured, ...rest] = posts

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${SITE_URL}/blog#blog`,
    name: 'Orbit Innovations Blog',
    description:
      'Practical writing on AI chatbots, web development, and building software from Pakistan.',
    url: `${SITE_URL}/blog`,
    publisher: { '@id': `${SITE_URL}/#organization` },
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.excerpt,
      datePublished: p.publishedAt,
      author: { '@type': 'Person', name: p.author },
      url: `${SITE_URL}/blog/${p.slug}`,
    })),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero */}
      <section className="section-padding pt-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-accent">
            Writing
          </p>
          <h1 className="mt-4 max-w-3xl text-[2.25rem] font-semibold tracking-[-0.03em] text-text-primary sm:text-5xl md:text-[3.5rem]">
            Notes from the <span className="text-accent">build</span>
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-text-secondary sm:text-base">
            Real numbers and honest tradeoffs from things we shipped.
          </p>
        </div>
      </section>

      {/* Featured post */}
      {featured && (
        <section className="pb-4">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Link href={`/blog/${featured.slug}`} className="group block">
              <article className="relative overflow-hidden rounded-3xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-8 transition-colors hover:border-accent/40 sm:p-12">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative z-10">
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <span className="rounded-full bg-accent/10 px-3 py-1 font-mono font-bold uppercase tracking-wider text-accent">
                      {CATEGORY_LABELS[featured.category]}
                    </span>
                    <span className="text-text-tertiary">{formatDate(featured.publishedAt)}</span>
                    <span className="inline-flex items-center gap-1.5 text-text-tertiary">
                      <Clock className="h-3.5 w-3.5" />
                      {featured.readingMinutes} min read
                    </span>
                  </div>

                  <h2 className="mt-5 max-w-2xl text-2xl font-bold leading-tight tracking-tight text-text-primary transition-colors group-hover:text-accent sm:text-3xl md:text-4xl">
                    {featured.title}
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">
                    {featured.excerpt}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                    Read it
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </article>
            </Link>
          </div>
        </section>
      )}

      {/* Rest of the posts */}
      <section className="section-padding pt-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {rest.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                <article className="flex h-full flex-col rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-6 transition-colors hover:border-accent/40">
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <span className="rounded-full bg-accent/10 px-2.5 py-0.5 font-mono font-bold uppercase tracking-wider text-accent">
                      {CATEGORY_LABELS[post.category]}
                    </span>
                    <span className="text-text-tertiary">{formatDate(post.publishedAt)}</span>
                  </div>

                  <h2 className="mt-4 text-lg font-bold leading-snug text-text-primary transition-colors group-hover:text-accent sm:text-xl">
                    {post.title}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary">
                    {post.excerpt}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                    <span className="inline-flex items-center gap-1.5 text-xs text-text-tertiary">
                      <Clock className="h-3.5 w-3.5" />
                      {post.readingMinutes} min read
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-text-tertiary transition-all group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <HomeCTA />
    </>
  )
}
