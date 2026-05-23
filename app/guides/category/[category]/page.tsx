import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ArticleCard from '@/components/ArticleCard'
import { getAllGuideMeta } from '@/lib/mdx'
import {
  CATEGORIES,
  CATEGORY_META,
  categoryFromSlug,
  categorySlug,
} from '@/lib/types'
import { breadcrumbListSchema } from '@/lib/schema'

type Props = { params: { category: string } }

const SITE_URL = process.env.SITE_URL || 'https://www.richquid.co.uk'

export function generateStaticParams() {
  return CATEGORIES.map(c => ({ category: categorySlug(c) }))
}

export function generateMetadata({ params }: Props): Metadata {
  const category = categoryFromSlug(params.category)
  if (!category) return { title: 'Category not found' }
  const title = `${category} guides — UK personal finance`
  const description = CATEGORY_META[category].intro
  return {
    title,
    description,
    alternates: { canonical: `/guides/category/${categorySlug(category)}` },
    openGraph: {
      type: 'website',
      title,
      description,
      url: `${SITE_URL}/guides/category/${categorySlug(category)}`,
    },
  }
}

export default function CategoryPage({ params }: Props) {
  const category = categoryFromSlug(params.category)
  if (!category) notFound()

  const guides = getAllGuideMeta().filter(g => g.category === category)
  const intro = CATEGORY_META[category].intro

  const breadcrumbSchema = breadcrumbListSchema([
    { name: 'Home', url: '/' },
    { name: 'Guides', url: '/guides' },
    { name: category },
  ])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category} guides`,
    description: intro,
    url: `${SITE_URL}/guides/category/${categorySlug(category)}`,
    inLanguage: 'en-GB',
    isPartOf: { '@type': 'WebSite', name: 'RichQuid', url: SITE_URL },
    hasPart: guides.map(g => ({
      '@type': 'Article',
      headline: g.title,
      url: `${SITE_URL}/guides/${g.slug}`,
      datePublished: g.publishedAt,
      ...(g.updatedAt ? { dateModified: g.updatedAt } : {}),
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <header className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-8 sm:py-20">
        <p className="metadata mb-3 uppercase tracking-[0.2em] text-[color:var(--green)]">
          {category}
        </p>
        <h1 className="font-serif-display text-[clamp(36px,6vw,60px)] leading-[1.05]">
          {category} <em className="not-italic text-[color:var(--green)]">guides</em>
        </h1>
        <p className="mt-5 text-[18px] leading-relaxed text-[color:var(--ink-2)]">
          {intro}
        </p>
        <p className="metadata mt-4 text-[13px] text-[color:var(--ink-3)]">
          {guides.length} {guides.length === 1 ? 'guide' : 'guides'}
        </p>
      </header>

      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        {guides.length === 0 ? (
          <p className="rounded-md border border-dashed border-rule bg-white p-10 text-center text-[color:var(--ink-3)]">
            No guides published in this category yet — check back soon.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map(g => (
              <ArticleCard key={g.slug} post={g} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/guides"
            className="metadata text-[color:var(--green)] underline-offset-4 hover:underline"
          >
            ← Browse all guides
          </Link>
        </div>
      </section>
    </>
  )
}
