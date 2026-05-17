import Link from 'next/link'
import type { GuideMeta } from '@/lib/types'

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default function ArticleCard({ post }: { post: GuideMeta }) {
  return (
    <article className="group flex h-full flex-col rounded-lg border border-rule bg-white p-5 transition-shadow hover:shadow-sm">
      <div className="metadata mb-3 flex items-center gap-2">
        <span className="inline-block rounded-full bg-[color:var(--green-soft)] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-[color:var(--green)]">
          {post.category}
        </span>
        <span className="text-[color:var(--ink-3)]">·</span>
        <span className="text-[12px] text-[color:var(--ink-3)]">{post.readTime} min read</span>
      </div>
      <h3 className="font-serif-display text-[22px] leading-snug">
        <Link href={`/guides/${post.slug}`} className="text-[color:var(--ink)] hover:text-[color:var(--green)]">
          {post.title}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-3 text-[15px] text-[color:var(--ink-2)]">{post.excerpt}</p>
      <div className="metadata mt-auto pt-4 text-[12px]">
        <span>By {post.author}</span>
        <span aria-hidden> · </span>
        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
      </div>
    </article>
  )
}
