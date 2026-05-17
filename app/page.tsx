import Link from 'next/link'
import ArticleCard from '@/components/ArticleCard'
import ToolCard, { type Tool } from '@/components/ToolCard'
import { getAllGuideMeta } from '@/lib/mdx'

const FEATURED_TOOLS: Tool[] = [
  { slug: 'isa-allowance-tracker', title: 'ISA Allowance Tracker', description: 'See how much of your £20,000 allowance is left this tax year.', status: 'coming-soon' },
  { slug: 'sipp-vs-workplace-pension', title: 'SIPP vs Workplace Pension', description: 'Find out when adding a SIPP makes sense on top of your workplace scheme.', status: 'coming-soon' },
  { slug: 'salary-sacrifice-calculator', title: 'Salary Sacrifice Calculator', description: 'Check whether your employer&rsquo;s scheme is actually worth it.', status: 'coming-soon' },
]

const WHY = [
  { title: 'Built by data engineers', body: 'Not bankers. Every number on the site is verified against the source data, not regurgitated from a press release.' },
  { title: 'No advice, no fluff', body: 'We show you the maths. You decide what to do with it. If you need regulated advice, we point you to the FCA register.' },
  { title: 'Free, ad-free, no email', body: 'Nothing to subscribe to before you can use the calculators. No banner ads. No tracking pixels for advertisers.' },
]

export default function HomePage() {
  const latest = getAllGuideMeta().slice(0, 4)

  return (
    <>
      {/* HERO ─────────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-20 sm:px-8 sm:pt-28">
        <p className="metadata mb-5 uppercase tracking-[0.2em] text-[color:var(--green)]">
          Personal finance · UK
        </p>
        <h1 className="font-serif-display text-[clamp(40px,7vw,80px)] leading-[1.02]">
          Smart money tools <span className="italic text-[color:var(--green)]">for everyday Brits.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-[18px] leading-relaxed text-[color:var(--ink-2)]">
          Calculators and clear guides for ISAs, pensions and tax-efficient saving — written for people who&rsquo;d rather see the maths than be sold to.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/tools"
            className="rounded-md bg-[color:var(--green)] px-6 py-3 text-[15px] font-semibold text-[color:var(--paper)] transition-colors hover:bg-[color:var(--green-dark)]"
          >
            Try our calculators →
          </Link>
          <Link
            href="/guides"
            className="rounded-md border border-[color:var(--ink)] px-6 py-3 text-[15px] font-semibold text-[color:var(--ink)] transition-colors hover:bg-[color:var(--ink)] hover:text-[color:var(--paper)]"
          >
            Read the guides
          </Link>
        </div>
      </section>

      {/* FEATURED TOOLS ───────────────────────────────────────────────────── */}
      <section className="border-y border-rule bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="metadata mb-2 uppercase tracking-[0.2em] text-[color:var(--gold)]">Most-used tools</p>
              <h2 className="font-serif-display text-3xl sm:text-4xl">Calculators worth bookmarking.</h2>
            </div>
            <Link href="/tools" className="hidden text-[15px] text-[color:var(--green)] underline-offset-4 hover:underline sm:inline">
              All calculators →
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED_TOOLS.map(t => <ToolCard key={t.slug} tool={t} />)}
          </div>
        </div>
      </section>

      {/* LATEST ARTICLES ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="metadata mb-2 uppercase tracking-[0.2em] text-[color:var(--green)]">Latest guides</p>
            <h2 className="font-serif-display text-3xl sm:text-4xl">Plain English. <em className="not-italic text-[color:var(--green)]">Real numbers.</em></h2>
          </div>
          <Link href="/guides" className="hidden text-[15px] text-[color:var(--green)] underline-offset-4 hover:underline sm:inline">
            All guides →
          </Link>
        </div>
        {latest.length === 0 ? (
          <p className="rounded-md border border-dashed border-rule bg-white p-8 text-center text-[color:var(--ink-3)]">
            No guides published yet. Drop your first MDX file into <code className="mx-1 rounded bg-[color:var(--paper)] px-1.5 py-0.5">content/guides/</code> to see it appear here.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {latest.map(p => <ArticleCard key={p.slug} post={p} />)}
          </div>
        )}
      </section>

      {/* WHY RICHQUID ─────────────────────────────────────────────────────── */}
      <section className="border-t border-rule bg-[color:var(--green-soft)]">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <p className="metadata mb-2 uppercase tracking-[0.2em] text-[color:var(--green)]">Why RichQuid</p>
          <h2 className="font-serif-display text-3xl sm:text-4xl">A different kind of finance site.</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {WHY.map(item => (
              <div key={item.title} className="border-t border-rule pt-5">
                <h3 className="font-serif-display text-xl">{item.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[color:var(--ink-2)]">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
