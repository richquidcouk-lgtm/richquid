'use client'

import { useMemo, useState } from 'react'
import { PSA_ADDITIONAL_RATE, PSA_BASIC_RATE, PSA_HIGHER_RATE, formatGBP, parseAmount } from '@/lib/uk-tax'

type TaxBand = 'basic' | 'higher' | 'additional'

const BANDS: { key: TaxBand; label: string; rate: number; psa: number; hint: string }[] = [
  { key: 'basic', label: 'Basic rate', rate: 0.20, psa: PSA_BASIC_RATE, hint: 'Income up to £50,270' },
  { key: 'higher', label: 'Higher rate', rate: 0.40, psa: PSA_HIGHER_RATE, hint: 'Income £50,271–£125,140' },
  { key: 'additional', label: 'Additional rate', rate: 0.45, psa: PSA_ADDITIONAL_RATE, hint: 'Income over £125,140' },
]

export default function SavingsTaxCalculator() {
  const [savings, setSavings] = useState('')
  const [rate, setRate] = useState('4')
  const [band, setBand] = useState<TaxBand>('basic')
  const [isaSavings, setIsaSavings] = useState('')

  const result = useMemo(() => {
    const bandInfo = BANDS.find(b => b.key === band)!
    const principal = parseAmount(savings)
    const interestRate = parseFloat(rate) || 0
    const isaPrincipal = parseAmount(isaSavings)

    const grossInterest = principal * (interestRate / 100)
    const isaInterest = isaPrincipal * (interestRate / 100) // tax-free, shown for comparison only

    const taxableInterest = Math.max(0, grossInterest - bandInfo.psa)
    const taxOwed = taxableInterest * bandInfo.rate
    const effectiveRate = grossInterest > 0 ? (taxOwed / grossInterest) * 100 : 0

    return { bandInfo, grossInterest, isaInterest, taxableInterest, taxOwed, effectiveRate }
  }, [savings, rate, band, isaSavings])

  return (
    <section className="rounded-lg border border-rule bg-white p-6 sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <p className="metadata uppercase tracking-[0.2em] text-[color:var(--green)]">Your savings</p>

          <label className="block">
            <span className="block text-[14px] font-semibold text-[color:var(--ink)]">Savings held outside an ISA</span>
            <span className="metadata block text-[12.5px] text-[color:var(--ink-3)]">Regular savings accounts, current account balances, NS&amp;I products (not Premium Bonds).</span>
            <div className="relative mt-2">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--ink-3)]">£</span>
              <input
                inputMode="decimal"
                value={savings}
                onChange={e => setSavings(e.target.value)}
                placeholder="0"
                aria-label="Savings held outside an ISA"
                className="w-full rounded-md border border-rule bg-[color:var(--paper)] py-2.5 pl-7 pr-3 text-[16px] tabular-nums focus:border-[color:var(--green)] focus:outline-none"
              />
            </div>
          </label>

          <label className="block">
            <span className="block text-[14px] font-semibold text-[color:var(--ink)]">Interest rate (AER)</span>
            <div className="relative mt-2">
              <input
                inputMode="decimal"
                value={rate}
                onChange={e => setRate(e.target.value)}
                placeholder="4"
                aria-label="Interest rate"
                className="w-full rounded-md border border-rule bg-[color:var(--paper)] py-2.5 pl-3 pr-8 text-[16px] tabular-nums focus:border-[color:var(--green)] focus:outline-none"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--ink-3)]">%</span>
            </div>
          </label>

          <div className="rounded-md border border-rule bg-[color:var(--paper)] p-5">
            <p className="metadata uppercase tracking-[0.18em] text-[color:var(--ink-3)]">Your tax band</p>
            <div className="mt-3 flex flex-col gap-2">
              {BANDS.map(b => (
                <label key={b.key} className="flex cursor-pointer items-start gap-2.5">
                  <input
                    type="radio"
                    name="tax-band"
                    checked={band === b.key}
                    onChange={() => setBand(b.key)}
                    className="mt-1"
                  />
                  <span>
                    <span className="block text-[14px] font-semibold text-[color:var(--ink)]">
                      {b.label} — PSA {formatGBP(b.psa)}
                    </span>
                    <span className="metadata block text-[12px] text-[color:var(--ink-3)]">{b.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="block text-[14px] font-semibold text-[color:var(--ink)]">Savings held in a cash ISA (optional)</span>
            <span className="metadata block text-[12.5px] text-[color:var(--ink-3)]">Shown separately below — ISA interest is always tax-free and doesn&rsquo;t use your PSA.</span>
            <div className="relative mt-2">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--ink-3)]">£</span>
              <input
                inputMode="decimal"
                value={isaSavings}
                onChange={e => setIsaSavings(e.target.value)}
                placeholder="0"
                aria-label="Savings held in a cash ISA"
                className="w-full rounded-md border border-rule bg-[color:var(--paper)] py-2.5 pl-7 pr-3 text-[16px] tabular-nums focus:border-[color:var(--green)] focus:outline-none"
              />
            </div>
          </label>
        </div>

        <aside className="rounded-md border border-rule bg-[color:var(--paper)] p-6">
          <p className="metadata uppercase tracking-[0.18em] text-[color:var(--ink-3)]">Interest earned (non-ISA)</p>
          <p className="mt-2 font-serif-display text-[36px] leading-none tabular-nums">{formatGBP(result.grossInterest, 2)}</p>

          <div className="mt-5 border-t border-rule pt-5">
            <p className="metadata uppercase tracking-[0.18em] text-[color:var(--ink-3)]">Personal Savings Allowance</p>
            <p className="mt-1 text-[18px] font-semibold tabular-nums">{formatGBP(result.bandInfo.psa)}</p>
          </div>

          <div className="mt-5 border-t border-rule pt-5">
            {result.taxOwed > 0 ? (
              <>
                <p className="metadata uppercase tracking-[0.18em] text-[color:var(--green)]">Tax owed</p>
                <p className="mt-1 font-serif-display text-[28px] tabular-nums text-[color:var(--green-dark)]">{formatGBP(result.taxOwed, 2)}</p>
                <p className="metadata mt-2 text-[12.5px]">
                  {formatGBP(result.taxableInterest, 2)} taxable at {(result.bandInfo.rate * 100).toFixed(0)}% — effective rate {result.effectiveRate.toFixed(1)}% of total interest.
                </p>
              </>
            ) : (
              <>
                <p className="metadata uppercase tracking-[0.18em] text-[color:var(--green)]">Tax owed</p>
                <p className="mt-1 font-serif-display text-[28px] text-[color:var(--green-dark)]">£0</p>
                <p className="metadata mt-2 text-[12.5px]">Your interest is within your Personal Savings Allowance.</p>
              </>
            )}
          </div>

          {parseAmount(isaSavings) > 0 && (
            <div className="mt-5 border-t border-rule pt-5">
              <p className="metadata uppercase tracking-[0.18em] text-[color:var(--ink-3)]">ISA interest (tax-free)</p>
              <p className="mt-1 text-[18px] font-semibold tabular-nums">{formatGBP(result.isaInterest, 2)}</p>
            </div>
          )}
        </aside>
      </div>

      <details className="mt-8 border-t border-rule pt-6 text-[14.5px] leading-relaxed text-[color:var(--ink-2)]">
        <summary className="cursor-pointer font-semibold text-[color:var(--ink)]">How this is worked out</summary>
        <div className="mt-3 space-y-2">
          <p>
            HMRC no longer deducts tax on savings interest automatically. Instead, banks report interest paid to HMRC, and any tax due above your Personal Savings Allowance (PSA) is collected via a tax code adjustment (PAYE) or Self Assessment.
          </p>
          <p>
            The PSA is £1,000 for basic-rate taxpayers, £500 for higher-rate taxpayers, and £0 for additional-rate taxpayers. Interest above your PSA is taxed at your marginal income tax rate — 20%, 40% or 45%.
          </p>
          <p>
            ISA interest is always completely tax-free and never counts against your PSA, regardless of how much you hold. Premium Bonds prizes are also always tax-free.
          </p>
          <p>
            Savings-income tax bands follow rest-of-UK thresholds even for Scottish taxpayers, since savings tax isn&rsquo;t devolved — so the bands above apply UK-wide. This is an estimate, not a substitute for checking your actual tax code or Self Assessment calculation.
          </p>
        </div>
      </details>
    </section>
  )
}
