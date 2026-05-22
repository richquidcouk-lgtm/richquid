import Link from 'next/link'
import { ArrowRight, Eye, Scale, ShieldCheck } from 'lucide-react'
import ArticleCard from '@/components/ArticleCard'
import NewsletterInline from '@/components/NewsletterInline'
import { getAllGuideMeta } from '@/lib/mdx'
import { getFeaturedTools } from '@/lib/tools'

export default function HomePage() {
  const featured = getFeaturedTools()
  const latest = getAllGuideMeta().slice(0, 4)

  return (
    <>
      {/* ─── 1. HERO ─────────────────────────────────────────────────────── */}
      <section
        className="border-b border-rule"
        style={{ background: 'var(--paper)' }}
        aria-labelledby="hero-heading"
      >
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:min-h-[78vh] lg:grid-cols-[6fr_4fr] lg:gap-16 lg:py-28">
          <div>
            <p className="metadata mb-5 text-[12px] uppercase tracking-[0.22em] text-[color:var(--green)]">
              UK personal finance
            </p>
            <h1
              id="hero-heading"
              className="font-serif-display rq-rise text-[clamp(36px,6vw,72px)] leading-[1.04]"
            >
              UK personal finance, <span className="italic text-[color:var(--green)]">in plain English.</span>
            </h1>
            <p className="mt-6 max-w-[580px] text-[18px] leading-[1.65] text-[color:var(--ink-2)]">
              Guides and calculators on the money decisions that actually matter — ISAs, pensions, salary sacrifice, savings, tax, mortgages. No advice, no sales pitch, just clear numbers and the maths shown.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 rounded-md bg-[color:var(--green)] px-6 py-3 text-[16px] font-semibold text-[color:var(--paper)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[color:var(--green-dark)]"
              >
                Try our calculators <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/guides"
                className="text-[16px] font-semibold text-[color:var(--ink)] underline decoration-[color:var(--gold)] decoration-2 underline-offset-[6px] hover:text-[color:var(--green)]"
              >
                Read the guides
              </Link>
            </div>
            <p className="metadata mt-5 text-[13px] text-[color:var(--ink-3)]">
              Free · Ad-free · No signup required
            </p>
          </div>

          {/* Right column — geometric SVG, hidden on mobile */}
          <div className="hidden lg:block" aria-hidden>
            <HeroIllustration />
          </div>
        </div>
      </section>

      {/* ─── 2. CREDIBILITY STRIP ────────────────────────────────────────── */}
      <section className="border-b border-rule" style={{ background: '#F2F2EC' }}>
        <p className="mx-auto max-w-6xl px-5 py-5 text-center font-sans text-[11.5px] uppercase tracking-[0.22em] text-[color:var(--ink-3)] sm:px-8 sm:text-[12px]">
          Built by data engineers <span className="mx-2 text-[color:var(--gold)]">·</span> Written for real people <span className="mx-2 text-[color:var(--gold)]">·</span> Updated for 2026
        </p>
      </section>

      {/* ─── 3. FEATURED TOOLS ───────────────────────────────────────────── */}
      <section className="bg-white" aria-labelledby="tools-heading">
        <div className="mx-auto max-w-[1100px] px-5 py-16 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-[640px] text-center">
            <h2 id="tools-heading" className="font-serif-display text-[clamp(28px,4vw,42px)] leading-tight">
              Tools that do <em className="not-italic text-[color:var(--green)]">the maths for you.</em>
            </h2>
            <p className="mt-4 text-[17px] leading-[1.65] text-[color:var(--ink-2)]">
              Stop guessing at financial decisions. Plug your numbers in, get a clear answer, see exactly how the calculation works.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map(tool => {
              const Icon = tool.icon
              const isLive = tool.status === 'live'
              const Wrapper: React.ElementType = isLive ? Link : 'div'
              const wrapperProps = isLive ? { href: `/tools/${tool.slug}` } : {}
              return (
                <Wrapper
                  key={tool.slug}
                  {...wrapperProps}
                  className={`group flex h-full flex-col rounded-md border border-rule bg-white p-8 transition-all duration-200 ${
                    isLive ? 'cursor-pointer hover:-translate-y-1 hover:shadow-sm' : ''
                  }`}
                >
                  <Icon className="h-7 w-7 text-[color:var(--green)]" strokeWidth={1.5} aria-hidden />
                  <h3 className="font-serif-display mt-5 text-[22px] leading-snug text-[color:var(--ink)]">{tool.title}</h3>
                  <p className="mt-3 text-[15px] leading-[1.6] text-[color:var(--ink-2)]">{tool.description}</p>
                  <div className="mt-auto pt-6 text-right">
                    {isLive ? (
                      <span className="text-[14px] font-semibold text-[color:var(--green)] underline-offset-4 group-hover:underline">
                        Try it →
                      </span>
                    ) : (
                      <span className="inline-block rounded-full bg-[color:var(--rule)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[color:var(--ink-3)]">
                        Coming soon
                      </span>
                    )}
                  </div>
                </Wrapper>
              )
            })}
          </div>

          <p className="mt-10 text-center">
            <Link href="/tools" className="text-[15px] font-medium text-[color:var(--green)] underline-offset-4 hover:underline">
              See all calculators →
            </Link>
          </p>
        </div>
      </section>

      {/* ─── 4. LATEST GUIDES ────────────────────────────────────────────── */}
      <section style={{ background: 'var(--paper)' }} aria-labelledby="guides-heading">
        <div className="mx-auto max-w-[1100px] px-5 py-16 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-[640px] text-center">
            <h2 id="guides-heading" className="font-serif-display text-[clamp(28px,4vw,42px)] leading-tight">
              Guides worth <em className="not-italic text-[color:var(--green)]">reading.</em>
            </h2>
            <p className="mt-4 text-[17px] leading-[1.65] text-[color:var(--ink-2)]">
              Long-form pieces that explain how the maths and the rules actually work — not surface-level lists.
            </p>
          </div>

          {latest.length === 0 ? (
            <p className="mx-auto mt-12 max-w-[640px] rounded-md border border-dashed border-rule bg-white p-10 text-center text-[color:var(--ink-3)]">
              No guides published yet. Drop your first MDX file into <code className="mx-1 rounded bg-[#F2F2EC] px-1.5 py-0.5">content/guides/</code> to see it appear here.
            </p>
          ) : (
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {latest.map(post => (
                <Link
                  key={post.slug}
                  href={`/guides/${post.slug}`}
                  className="group flex h-full flex-col rounded-md border border-rule bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-sm"
                >
                  <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--green)]">
                    {post.category}
                  </span>
                  <h3 className="font-serif-display mt-3 line-clamp-2 text-[19px] leading-snug text-[color:var(--ink)] group-hover:text-[color:var(--green)]">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-[14.5px] leading-[1.55] text-[color:var(--ink-2)]">
                    {post.excerpt}
                  </p>
                  <p className="metadata mt-auto pt-5 text-[12.5px] text-[color:var(--ink-3)]">
                    {post.author} · {post.readTime} min read
                  </p>
                </Link>
              ))}
            </div>
          )}

          <p className="mt-10 text-center">
            <Link href="/guides" className="text-[15px] font-medium text-[color:var(--green)] underline-offset-4 hover:underline">
              Browse all guides →
            </Link>
          </p>
        </div>
      </section>

      {/* ─── 5. PHILOSOPHY ───────────────────────────────────────────────── */}
      <section style={{ background: '#F2F2EC' }} aria-labelledby="philosophy-heading">
        <div className="mx-auto max-w-[900px] px-5 py-16 sm:px-8 sm:py-24">
          <h2 id="philosophy-heading" className="font-serif-display text-center text-[clamp(28px,4vw,42px)] leading-tight">
            What makes RichQuid <em className="not-italic text-[color:var(--green)]">different.</em>
          </h2>
          <div className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-8">
            {[
              {
                Icon: ShieldCheck,
                title: 'Built by data engineers, not bankers',
                body:
                  'RichQuid is run by software engineers who got tired of vague financial websites. Every calculator on this site shows you exactly how the answer was reached. Every guide is fact-checked against HMRC and FCA sources. If we make a mistake, we fix it and credit whoever spotted it.',
              },
              {
                Icon: Scale,
                title: 'No advice, no upselling',
                body:
                  "We don't have a sales team. We don't sell courses or premium newsletters. We earn a small commission when readers open accounts with providers we mention — clearly disclosed, never affecting what we recommend. If a provider isn't worth recommending, we don't recommend it.",
              },
              {
                Icon: Eye,
                title: 'Transparent about the maths',
                body:
                  'Most financial sites tell you the answer and skip the working. Every calculator on RichQuid explains the formula, lets you adjust the assumptions, and shows you why the answer is what it is. The maths is yours to check.',
              },
            ].map(col => (
              <div key={col.title}>
                <col.Icon className="h-6 w-6 text-[color:var(--green)]" strokeWidth={1.5} aria-hidden />
                <h4 className="font-serif-display mt-4 text-[19px] leading-snug">{col.title}</h4>
                <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--ink-2)]">{col.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. NEWSLETTER ───────────────────────────────────────────────── */}
      <section style={{ background: '#F2F2EC', borderTop: '1px solid var(--rule)' }} aria-labelledby="newsletter-heading">
        <div className="mx-auto max-w-[640px] px-5 py-16 text-center sm:px-8 sm:py-24">
          <h2 id="newsletter-heading" className="font-serif-display text-[clamp(28px,4vw,42px)] leading-tight">
            One useful email <em className="not-italic text-[color:var(--green)]">a month.</em>
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-[17px] leading-[1.65] text-[color:var(--ink-2)]">
            The new calculators we&rsquo;ve launched. The UK money rules that changed. The guides our readers found most useful. No spam, no upselling, unsubscribe in one click.
          </p>
          <NewsletterInline />
          <p className="metadata mt-4 text-[12.5px] text-[color:var(--ink-3)]">
            We never share your email. Read our{' '}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-[color:var(--green)]">privacy policy</Link>.
          </p>
        </div>
      </section>
    </>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 * Right-column hero illustration — an abstract ascending bar chart in
 * single-tone green at ~15% opacity. No gradients, no animations.
 * ──────────────────────────────────────────────────────────────────── */
function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 360 360"
      role="presentation"
      className="mx-auto h-auto w-full max-w-[420px]"
      style={{ color: 'var(--green)' }}
    >
      {/* Subtle baseline */}
      <line x1="40" y1="300" x2="320" y2="300" stroke="currentColor" strokeWidth="1" opacity="0.18" />
      {/* Ascending bars */}
      {[
        { x: 60,  h: 70,  o: 0.10 },
        { x: 120, h: 120, o: 0.13 },
        { x: 180, h: 170, o: 0.16 },
        { x: 240, h: 220, o: 0.20 },
      ].map((b, i) => (
        <rect
          key={i}
          x={b.x}
          y={300 - b.h}
          width="40"
          height={b.h}
          fill="currentColor"
          opacity={b.o}
          rx="3"
        />
      ))}
      {/* A growth line, drawn as a polyline tracing the top of each bar */}
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.55"
        points="80,230 140,180 200,130 260,80"
      />
      {/* Endpoint dot */}
      <circle cx="260" cy="80" r="5" fill="currentColor" opacity="0.85" />
      {/* Decorative dashed grid (very faint) */}
      <line x1="40" y1="240" x2="320" y2="240" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 6" opacity="0.12" />
      <line x1="40" y1="180" x2="320" y2="180" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 6" opacity="0.12" />
      <line x1="40" y1="120" x2="320" y2="120" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 6" opacity="0.12" />
    </svg>
  )
}
