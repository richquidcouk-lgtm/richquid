import { serializeJsonLd } from '@/lib/schema'
import { collectArticleNavigation, type ArticleNode, type ArticleNavigation } from '@/lib/article-navigation'
import { TOOL_READING } from '@/lib/tool-reading'
import { getTool } from '@/lib/tools'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { guideArt } from '@/lib/guide-art'
import GuideVisual from '@/components/GuideVisual'
import { notFound } from 'next/navigation'
import { compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import { getAllGuideMeta, getGuide, getRelatedGuides } from '@/lib/mdx'
import AffiliateDisclosure from '@/components/AffiliateDisclosure'
import Newsletter from '@/components/Newsletter'
import ArticleCard from '@/components/ArticleCard'
import { breadcrumbListSchema, faqPageSchema, extractFaqPairs } from '@/lib/schema'
import { categorySlug } from '@/lib/types'

type Props = { params: { slug: string } }

const SITE_URL = process.env.SITE_URL || 'https://www.richquid.co.uk'

export async function generateStaticParams() {
  return getAllGuideMeta().map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = getGuide(params.slug)
  if (!guide) return { title: 'Guide not found' }
  return {
    title: guide.title,
    description: guide.excerpt,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      type: 'article',
      title: guide.title,
      description: guide.excerpt,
      url: `${SITE_URL}/guides/${guide.slug}`,
      publishedTime: guide.publishedAt,
      authors: [guide.author],
      images: guide.featuredImage ? [{ url: guide.featuredImage }] : undefined,
    },
  }
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
}

const mdxComponents = {
  // Custom replacements for MDX tags can go here.
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="font-serif-display mt-12 text-[28px] font-medium leading-tight" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="font-serif-display mt-8 text-[22px] font-medium leading-snug" {...props} />
  ),
}

export default async function GuidePage({ params }: Props) {
  const guide = getGuide(params.slug)
  if (!guide) notFound()

  const related = getRelatedGuides(guide.slug, 3)
  let navigation: ArticleNavigation = { headings: [], sources: [] }
  const { content } = await compileMDX({ source: guide.content, components: mdxComponents,
    options: { mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [() => (tree: ArticleNode) => { navigation = collectArticleNavigation(tree) }] } },
  })
  const relatedTools = Object.entries(TOOL_READING).filter(([, value]) => value.guides.includes(guide.slug)).map(([slug]) => getTool(slug)).filter(tool => tool?.status === 'live')

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${SITE_URL}/guides/${guide.slug}#article`,
    url: `${SITE_URL}/guides/${guide.slug}`,
    inLanguage: 'en-GB',
    isPartOf: { '@id': `${SITE_URL}/#website` },
    citation: navigation.sources.map(source => ({ '@type': 'CreativeWork', name: source.title, url: source.url })),
    ...(guide.featuredImage ? { image: new URL(guide.featuredImage, SITE_URL).href } : {}),
    headline: guide.title,
    description: guide.excerpt,
    datePublished: guide.publishedAt,
    ...(guide.updatedAt ? { dateModified: guide.updatedAt } : {}),
    author: { '@type': 'Person', '@id': `${SITE_URL}/about#editorial`, name: guide.author, url: `${SITE_URL}/about#editorial` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/guides/${guide.slug}` },
    articleSection: guide.category,
  }

  const breadcrumbSchema = breadcrumbListSchema([
    { name: 'Home', url: '/' },
    { name: 'Guides', url: '/guides' },
    { name: guide.category, url: `/guides/category/${categorySlug(guide.category)}` },
    { name: guide.title },
  ])

  const faqPairs = extractFaqPairs(guide.content)
  const faqSchema = faqPairs.length >= 2 ? faqPageSchema(faqPairs) : null

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqSchema) }} />
      )}

      <article className="mx-auto max-w-prose px-5 py-12 sm:px-0 sm:py-16">
        <Link href="/guides" className="metadata mb-6 inline-block text-[13px] text-[color:var(--green)] underline-offset-4 hover:underline">
          ← All guides
        </Link>

        <header className="border-b border-rule pb-8">
          <p className="metadata mb-3 uppercase tracking-[0.2em] text-[color:var(--green)]">{guide.category}</p>
          <h1 className="font-serif-display text-[clamp(32px,5vw,48px)] leading-[1.08]">{guide.title}</h1>
          <p className="metadata mt-5 text-[14px]">
            By <Link href="/about#editorial" className="underline">{guide.author}</Link>
            <span aria-hidden> · </span>
            <time dateTime={guide.publishedAt}>Published {formatDate(guide.publishedAt)}</time>
            {guide.updatedAt && guide.updatedAt !== guide.publishedAt && (
              <>
                <span aria-hidden> · </span>
                <time dateTime={guide.updatedAt}>Updated {formatDate(guide.updatedAt)}</time>
              </>
            )}
            <span aria-hidden> · </span>
            {guide.readTime} min read
          </p>
        </header>

        <p className="my-6 text-lg leading-relaxed">{guide.excerpt}</p>
        <Image src={guide.featuredImage || guideArt(guide.category, guide.slug)} alt="" width={900} height={360} className="my-6 aspect-[5/2] w-full rounded-xl object-cover" />
        {navigation.headings.length > 0 && <nav aria-label="On this page" className="my-6 rounded border border-rule p-5">
          <p className="font-semibold">On this page</p>
          <ul className="mt-3 space-y-2">{navigation.headings.map(item => <li key={item.id}><a className="text-sm underline" href={`#${item.id}`}>{item.title}</a></li>)}</ul>
        </nav>}
        <AffiliateDisclosure />

        <div className="prose prose-lg max-w-prose">
          {content}
        </div>

        <GuideVisual slug={guide.slug} />

        {navigation.sources.length > 0 && <section aria-label="Sources referenced in this guide" className="my-8 border-t border-rule pt-6">
          <h2 className="font-serif-display text-2xl">Sources referenced in this guide</h2>
          <ul className="mt-3 list-inside list-disc space-y-2">{navigation.sources.map(source => <li key={source.url}><a className="text-sm underline" href={source.url}>{source.title}</a></li>)}</ul>
        </section>}
        {relatedTools.length > 0 && <section className="my-8 rounded border border-rule p-5" aria-label="Useful calculators">
          <h2 className="font-serif-display text-2xl">Put the numbers into practice</h2>
          <ul className="mt-3 space-y-2">{relatedTools.map(tool => tool && <li key={tool.slug}><Link className="underline" href={`/tools/${tool.slug}`}>{tool.title}</Link></li>)}</ul>
        </section>}
        <p className="my-6 text-sm">Read our <Link className="underline" href="/methodology">methodology</Link> or <Link className="underline" href="/contact">report a correction</Link>. Check the effective dates and provider terms for your circumstances.</p>
        <Newsletter />

        <hr className="my-12 border-rule" />

        {related.length > 0 && (
          <section aria-labelledby="related-heading">
            <h2 id="related-heading" className="font-serif-display mb-6 text-2xl">Related guides</h2>
            <div className="grid gap-5 sm:grid-cols-3">
              {related.map(p => <ArticleCard key={p.slug} post={p} />)}
            </div>
          </section>
        )}

        <div className="mt-12">
          <Link href="/guides" className="text-[15px] text-[color:var(--green)] underline-offset-4 hover:underline">
            ← Back to all guides
          </Link>
        </div>
      </article>
    </>
  )
}
