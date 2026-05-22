import type { Metadata } from 'next'
import Link from 'next/link'
import AffiliateDisclosure from '@/components/AffiliateDisclosure'
import { RATES, RATES_LAST_REVIEWED, formatPct, type RateRange } from '@/lib/rates'

export const metadata: Metadata = {
  title: 'Best UK savings rates — ranges by product type',
  description: 'A stable map of UK savings products — cash ISAs, fixed bonds, regular savers, notice accounts and more — with typical rate ranges and the trade-offs that matter. We point you to live aggregators for today’s top picks.',
  alternates: { canonical: '/best-savings-rates' },
}

function formatReviewed(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
}

function RateRow({ r }: { r: RateRange }) {
  return (
    <article className="rounded-lg border border-rule bg-white p-6 sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-rule pb-4">
        <h3 className="font-serif-display text-[22px] leading-tight">{r.label}</h3>
        <p className="metadata tabular-nums text-[14px] text-[color:var(--green-dark)]">
          <span className="font-semibold">{formatPct(r.rangeLow)} – {formatPct(r.rangeHigh)}</span>
          <span className="ml-2 uppercase tracking-[0.18em] text-[11.5px] text-[color:var(--ink-3)]">AER range</span>
        </p>
      </div>
      <dl className="mt-4 grid gap-3 text-[14.5px] sm:grid-cols-[140px_1fr]">
        <dt className="metadata uppercase tracking-[0.18em] text-[11.5px] text-[color:var(--ink-3)]">Access</dt>
        <dd className="text-[color:var(--ink-2)]">{r.access}</dd>
        <dt className="metadata uppercase tracking-[0.18em] text-[11.5px] text-[color:var(--ink-3)]">Suits</dt>
        <dd className="text-[color:var(--ink-2)]">{r.suits}</dd>
        <dt className="metadata uppercase tracking-[0.18em] text-[11.5px] text-[color:var(--ink-3)]">Watch outs</dt>
        <dd>
          <ul className="ml-4 list-disc space-y-1 text-[color:var(--ink-2)]">
            {r.watchOuts.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </dd>
      </dl>
    </article>
  )
}

export default function BestSavingsRatesPage() {
  return (
    <article className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
      <header className="border-b border-rule pb-8">
        <p className="metadata mb-3 uppercase tracking-[0.2em] text-[color:var(--green)]">Rates map</p>
        <h1 className="font-serif-display text-[clamp(34px,5vw,52px)] leading-[1.05]">
          UK savings rates, by product type
        </h1>
        <p className="mt-4 text-[18px] leading-relaxed text-[color:var(--ink-2)]">
          Rate ranges across the main UK savings products, with the trade-offs that decide which one fits a given chunk of cash. We don&rsquo;t publish named-provider comparisons — those move daily and need a regulated data feed. For today&rsquo;s top picks, the live aggregators below are where we send you.
        </p>
        <p className="metadata mt-5 text-[13px] text-[color:var(--ink-3)]">
          Last reviewed {formatReviewed(RATES_LAST_REVIEWED)}
        </p>
      </header>

      <section className="mt-8 rounded-md border border-rule bg-[color:var(--green-soft)] p-5">
        <p className="metadata uppercase tracking-[0.18em] text-[12px] text-[color:var(--green-dark)]">Where to check today&rsquo;s leading rates</p>
        <ul className="mt-3 space-y-2 text-[14.5px] text-[color:var(--ink-2)]">
          <li>
            <a href="https://moneyfactscompare.co.uk/savings-accounts/" target="_blank" rel="noopener noreferrer" className="font-semibold text-[color:var(--green-dark)] underline-offset-4 hover:underline">Moneyfacts Compare</a>{' '}
            — the most thorough aggregator. Filter by product type, term and minimum deposit.
          </li>
          <li>
            <a href="https://www.moneysavingexpert.com/savings/" target="_blank" rel="noopener noreferrer" className="font-semibold text-[color:var(--green-dark)] underline-offset-4 hover:underline">MoneySavingExpert</a>{' '}
            — fewer products, but updated quickly when market-leading offers land or close.
          </li>
          <li>
            <a href="https://www.bankofengland.co.uk/monetary-policy/the-interest-rate-bank-rate" target="_blank" rel="noopener noreferrer" className="font-semibold text-[color:var(--green-dark)] underline-offset-4 hover:underline">Bank of England base rate</a>{' '}
            — context for whether market rates are likely to rise, hold or fall.
          </li>
        </ul>
        <p className="metadata mt-3 text-[12.5px] text-[color:var(--ink-3)]">
          Always verify any specific rate on the provider&rsquo;s own website before opening an account — aggregators occasionally lag by a few days.
        </p>
      </section>

      <section className="mt-10 space-y-5">
        {RATES.map(r => <RateRow key={r.group + r.label} r={r} />)}
      </section>

      <section className="mt-12 rounded-md border border-rule bg-white p-6">
        <h2 className="font-serif-display text-[22px] leading-snug">A few things the table doesn&rsquo;t show</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-[14.5px] leading-relaxed text-[color:var(--ink-2)]">
          <li>
            <strong>FSCS protection</strong> covers up to £85,000 per banking group, per individual. NS&amp;I products are 100% government-backed without that cap.
          </li>
          <li>
            <strong>Tax treatment</strong> differs: ISA interest is tax-free; outside an ISA, basic-rate taxpayers get a £1,000 Personal Savings Allowance, higher-rate get £500, additional-rate get nothing.
          </li>
          <li>
            <strong>Headline rates often expire.</strong> A 12-month bonus rate that drops to ~1% afterwards is not really a 4.5% account — it&rsquo;s a 4.5% loss-leader followed by a low one.
          </li>
          <li>
            <strong>Comparing AER vs gross is important.</strong> AER assumes interest is added and earns more interest; gross is the headline before compounding. Always compare AER to AER.
          </li>
        </ul>
      </section>

      <p className="metadata mt-10 border-t border-rule pt-6 text-[12.5px] leading-relaxed text-[color:var(--ink-3)]">
        Educational only. Not personal financial advice. Figures are RichQuid&rsquo;s estimates of the top of the market based on publicly available data on the last-reviewed date; specific rates change daily and may differ. See our <Link href="/disclaimer" className="underline underline-offset-4">disclaimer</Link>.
      </p>

      <AffiliateDisclosure className="mt-8" />
    </article>
  )
}
