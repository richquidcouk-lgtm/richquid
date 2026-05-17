import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Start here',
  description: 'New to RichQuid? Pick the situation that matches yours and we\u2019ll point you to the right guide or calculator.',
  alternates: { canonical: '/start-here' },
}

const PATHS = [
  {
    headline: 'I&rsquo;m new to ISAs',
    body: 'Start with the basics — what an ISA is, the £20,000 allowance, and how to pick between cash, stocks &amp; shares, LISA and IFISA.',
    href: '/guides',
    cta: 'Read the ISA guides',
  },
  {
    headline: 'I want to compare pensions',
    body: 'Workplace pension, SIPP, salary sacrifice — see when each one makes sense and how the tax relief actually works in practice.',
    href: '/guides',
    cta: 'Read the pension guides',
  },
  {
    headline: 'I just want to use a calculator',
    body: 'Skip the reading. Jump straight into the calculators — every one of them shows the working out so you can sanity-check the maths.',
    href: '/tools',
    cta: 'Open the calculator library',
  },
  {
    headline: 'I&rsquo;m saving for a house',
    body: 'Lifetime ISA, Help to Buy ISA, regular savers — which one earns you the most based on your timeline and deposit target.',
    href: '/guides',
    cta: 'Compare first-home saving routes',
  },
  {
    headline: 'I&rsquo;m self-employed',
    body: 'How to think about pensions, tax-efficient saving, and emergency funds when your income is uneven.',
    href: '/guides',
    cta: 'Read the self-employed guides',
  },
  {
    headline: 'I&rsquo;m just here to learn',
    body: 'No specific question yet? Browse every guide we&rsquo;ve written, sorted by topic.',
    href: '/guides',
    cta: 'Browse all guides',
  },
]

export default function StartHerePage() {
  return (
    <>
      <header className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-8 sm:py-20">
        <p className="metadata mb-3 uppercase tracking-[0.2em] text-[color:var(--green)]">Start here</p>
        <h1 className="font-serif-display text-[clamp(36px,6vw,60px)] leading-[1.05]">
          Pick the situation <em className="not-italic text-[color:var(--green)]">that matches yours.</em>
        </h1>
        <p className="mt-5 text-[18px] leading-relaxed text-[color:var(--ink-2)]">
          RichQuid has tools and guides on most UK personal-finance topics. Use this page as a one-click route into the parts that matter to you.
        </p>
      </header>

      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PATHS.map(p => (
            <Link
              key={p.headline}
              href={p.href}
              className="group flex h-full flex-col rounded-lg border border-rule bg-white p-6 transition-shadow hover:shadow-sm"
            >
              <h3 className="font-serif-display text-xl text-[color:var(--ink)]" dangerouslySetInnerHTML={{ __html: p.headline }} />
              <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--ink-2)]" dangerouslySetInnerHTML={{ __html: p.body }} />
              <span className="metadata mt-auto pt-5 text-[13px] text-[color:var(--green)]">{p.cta} →</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
