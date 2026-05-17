import type { Metadata } from 'next'
import ToolCard from '@/components/ToolCard'
import { TOOLS } from '@/lib/tools'

export const metadata: Metadata = {
  title: 'Calculators',
  description: 'Free UK personal finance calculators — ISAs, pensions, salary sacrifice, LISA vs Help to Buy and more. No sign-up needed.',
  alternates: { canonical: '/tools' },
}

export default function ToolsIndexPage() {
  return (
    <>
      <header className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-8 sm:py-20">
        <p className="metadata mb-3 uppercase tracking-[0.2em] text-[color:var(--green)]">Calculators</p>
        <h1 className="font-serif-display text-[clamp(36px,6vw,60px)] leading-[1.05]">
          The numbers, <em className="not-italic text-[color:var(--green)]">not the noise.</em>
        </h1>
        <p className="mt-5 text-[18px] leading-relaxed text-[color:var(--ink-2)]">
          Every calculator on RichQuid shows its working. Tweak the inputs, see what changes, and walk away with a number you can defend.
        </p>
      </header>

      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map(t => <ToolCard key={t.slug} tool={t} />)}
        </div>
        <p className="metadata mt-10 text-center text-[13px] text-[color:var(--ink-3)]">
          More on the way — pensions tax taper, dividend allowance, capital gains allowance, mortgage overpayment vs invest.
        </p>
      </section>
    </>
  )
}
