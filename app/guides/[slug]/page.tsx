import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import { getAllGuideMeta, getGuide, getRelatedGuides } from '@/lib/mdx'
import AffiliateDisclosure from '@/components/AffiliateDisclosure'
import Newsletter from '@/components/Newsletter'
import ArticleCard from '@/components/ArticleCard'

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

export default function GuidePage({ params }: Props) {
  const guide = getGuide(params.slug)
  if (!guide) notFound()

  const related = getRelatedGuides(guide.slug, 3)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.excerpt,
    datePublished: guide.publishedAt,
    author: { '@type': 'Person', name: guide.author },
    publisher: { '@type': 'Organization', name: 'RichQuid', url: SITE_URL },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/guides/${guide.slug}` },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="mx-auto max-w-prose px-5 py-12 sm:px-0 sm:py-16">
        <Link href="/guides" className="metadata mb-6 inline-block text-[13px] text-[color:var(--green)] underline-offset-4 hover:underline">
          ← All guides
        </Link>

        <header className="border-b border-rule pb-8">
          <p className="metadata mb-3 uppercase tracking-[0.2em] text-[color:var(--green)]">{guide.category}</p>
          <h1 className="font-serif-display text-[clamp(32px,5vw,48px)] leading-[1.08]">{guide.title}</h1>
          <p className="metadata mt-5 text-[14px]">
            By <span className="text-[color:var(--ink-2)]">{guide.author}</span>
            <span aria-hidden> · </span>
            <time dateTime={guide.publishedAt}>{formatDate(guide.publishedAt)}</time>
            <span aria-hidden> · </span>
            {guide.readTime} min read
          </p>
        </header>

        <AffiliateDisclosure />

        <div className="prose prose-lg max-w-prose">
          <MDXRemote
            source={guide.content}
            components={mdxComponents}
            options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
          />
        </div>

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
