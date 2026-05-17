'use client'

import { useMemo, useState } from 'react'
import ArticleCard from '@/components/ArticleCard'
import { CATEGORIES, type Category, type GuideMeta } from '@/lib/types'

type Filter = 'All' | Category

export default function GuidesIndexClient({ posts }: { posts: GuideMeta[] }) {
  const [filter, setFilter] = useState<Filter>('All')

  const filtered = useMemo(() => {
    if (filter === 'All') return posts
    return posts.filter(p => p.category === filter)
  }, [filter, posts])

  return (
    <>
      <header className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-8 sm:py-20">
        <p className="metadata mb-3 uppercase tracking-[0.2em] text-[color:var(--green)]">Guides</p>
        <h1 className="font-serif-display text-[clamp(36px,6vw,60px)] leading-[1.05]">
          UK personal finance, <em className="not-italic text-[color:var(--green)]">written like a friend would explain it.</em>
        </h1>
        <p className="mt-5 text-[18px] leading-relaxed text-[color:var(--ink-2)]">
          Every guide cites its sources. Every figure is verifiable. No sponsored content dressed up as advice.
        </p>
      </header>

      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        <nav aria-label="Categories" className="mb-8 flex flex-wrap items-center gap-2 border-b border-rule pb-5">
          {(['All', ...CATEGORIES] as Filter[]).map(cat => {
            const isActive = filter === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className={`rounded-full border px-3.5 py-1.5 text-[13.5px] font-semibold transition-colors ${
                  isActive
                    ? 'border-[color:var(--green)] bg-[color:var(--green)] text-[color:var(--paper)]'
                    : 'border-rule bg-white text-[color:var(--ink-2)] hover:border-[color:var(--green)] hover:text-[color:var(--green)]'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </nav>

        {filtered.length === 0 ? (
          <p className="rounded-md border border-dashed border-rule bg-white p-10 text-center text-[color:var(--ink-3)]">
            No guides published in this category yet — try another or check back soon.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(p => <ArticleCard key={p.slug} post={p} />)}
          </div>
        )}
      </section>
    </>
  )
}
