import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock, ArrowUpRight } from 'lucide-react'
import { getPost, getSortedPosts } from '@/data/blog'
import { CATEGORY_LABELS } from '@/types/blog'
import { CTASection } from '@/components/sections/CTASection'

const SITE_URL = 'https://orbitpk.com'

interface Props {
  params: { slug: string }
}

export function generateStaticParams() {
  return getSortedPosts().map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getPost(params.slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function BlogPostPage({ params }: Props) {
  const post = getPost(params.slug)
  if (!post) notFound()

  const others = getSortedPosts().filter((p) => p.slug !== post.slug).slice(0, 2)

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author,
      url: `${SITE_URL}/team/shehriyar`,
    },
    publisher: { '@id': `${SITE_URL}/#organization` },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${post.slug}`,
    },
    keywords: post.keywords.join(', '),
    articleSection: CATEGORY_LABELS[post.category],
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE_URL}/blog/${post.slug}` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <article className="section-padding pt-32">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            All writing
          </Link>

          {/* Header */}
          <header className="mt-8 border-b border-border pb-8">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="rounded-full bg-accent/10 px-3 py-1 font-mono font-bold uppercase tracking-wider text-accent">
                {CATEGORY_LABELS[post.category]}
              </span>
              <span className="text-text-tertiary">{formatDate(post.publishedAt)}</span>
              <span className="inline-flex items-center gap-1.5 text-text-tertiary">
                <Clock className="h-3.5 w-3.5" />
                {post.readingMinutes} min read
              </span>
            </div>

            <h1 className="mt-5 text-[1.875rem] font-semibold leading-[1.15] tracking-[-0.03em] text-text-primary sm:text-4xl md:text-[2.75rem]">
              {post.title}
            </h1>

            <p className="mt-4 text-base leading-relaxed text-text-secondary sm:text-lg">
              {post.excerpt}
            </p>

            <p className="mt-6 text-sm text-text-tertiary">
              By{' '}
              <Link href="/team/shehriyar" className="text-text-secondary hover:text-accent">
                {post.author}
              </Link>
            </p>
          </header>

          {/* Body */}
          <div className="mt-10 flex flex-col gap-10">
            <p className="text-base leading-[1.75] text-text-secondary">{post.intro}</p>

            {post.sections.map((section, i) => (
              <section key={i} className="flex flex-col gap-4">
                {section.heading && (
                  <h2 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
                    {section.heading}
                  </h2>
                )}

                {section.paragraphs?.map((p, j) => (
                  <p key={j} className="text-base leading-[1.75] text-text-secondary">
                    {p}
                  </p>
                ))}

                {section.table && (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[440px] border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          {section.table.head.map((h, k) => (
                            <th
                              key={k}
                              className="px-3 py-3 text-left font-mono text-[11px] font-bold uppercase tracking-wider text-text-tertiary"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {section.table.rows.map((row, k) => (
                          <tr key={k} className="border-b border-border/60">
                            {row.map((cell, l) => (
                              <td
                                key={l}
                                className={`px-3 py-3 tabular-nums ${
                                  l === 0 ? 'font-medium text-text-primary' : 'text-text-secondary'
                                }`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {section.bullets && (
                  <ul className="flex flex-col gap-3">
                    {section.bullets.map((b, j) => (
                      <li key={j} className="flex gap-3 text-base leading-[1.7] text-text-secondary">
                        <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.callout && (
                  <blockquote className="border-l-2 border-accent bg-accent/5 py-4 pl-5 pr-4 text-base leading-relaxed text-text-primary">
                    {section.callout}
                  </blockquote>
                )}
              </section>
            ))}

            {/* Conclusion */}
            <div className="rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-6 sm:p-8">
              <p className="text-base leading-[1.75] text-text-secondary">{post.conclusion}</p>
              <Link
                href="/contact"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-[#0a0a0a] transition-colors hover:bg-accent-hover"
              >
                Start a project
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* More posts */}
          {others.length > 0 && (
            <div className="mt-16 border-t border-border pt-8">
              <h2 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-text-tertiary">
                Read next
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {others.map((p) => (
                  <Link key={p.slug} href={`/blog/${p.slug}`} className="group block">
                    <div className="h-full rounded-xl border border-border p-5 transition-colors hover:border-accent/40">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-accent">
                        {CATEGORY_LABELS[p.category]}
                      </span>
                      <h3 className="mt-2 text-sm font-semibold leading-snug text-text-primary transition-colors group-hover:text-accent">
                        {p.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      <CTASection />
    </>
  )
}
