'use client'

import { useMemo, useState } from 'react'

type Costs = {
  rent: string
  bills: string
  food: string
  transport: string
  debtMin: string
  other: string
}

const FIELDS: { key: keyof Costs; label: string; hint: string }[] = [
  { key: 'rent', label: 'Rent or mortgage', hint: 'The roof. Non-negotiable.' },
  { key: 'bills', label: 'Bills & utilities', hint: 'Council tax, energy, water, broadband, phone, insurance.' },
  { key: 'food', label: 'Food & groceries', hint: 'Weekly shop, not restaurants.' },
  { key: 'transport', label: 'Transport', hint: 'Commute, car insurance, fuel or season tickets.' },
  { key: 'debtMin', label: 'Minimum debt payments', hint: 'Credit cards, loans, BNPL — the floor, not the optimal payoff.' },
  { key: 'other', label: 'Other essentials', hint: 'Childcare, healthcare, anything you literally can’t skip.' },
]

function parseAmount(v: string): number {
  const n = parseFloat(v.replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) && n >= 0 ? n : 0
}

function formatGBP(n: number): string {
  return n.toLocaleString('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  })
}

export default function EmergencyFundCalculator() {
  const [costs, setCosts] = useState<Costs>({
    rent: '',
    bills: '',
    food: '',
    transport: '',
    debtMin: '',
    other: '',
  })
  const [months, setMonths] = useState(3)
  const [saved, setSaved] = useState('')

  const result = useMemo(() => {
    const monthly =
      parseAmount(costs.rent) +
      parseAmount(costs.bills) +
      parseAmount(costs.food) +
      parseAmount(costs.transport) +
      parseAmount(costs.debtMin) +
      parseAmount(costs.other)
    const target = monthly * months
    const have = parseAmount(saved)
    const shortfall = Math.max(0, target - have)
    const pct = target > 0 ? Math.min(100, (have / target) * 100) : 0
    return { monthly, target, have, shortfall, pct, complete: have >= target && target > 0 }
  }, [costs, months, saved])

  const handle = (key: keyof Costs) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setCosts(prev => ({ ...prev, [key]: e.target.value }))

  return (
    <section className="rounded-lg border border-rule bg-white p-6 sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <p className="metadata uppercase tracking-[0.2em] text-[color:var(--green)]">Monthly essentials</p>
          <p className="text-[15px] leading-relaxed text-[color:var(--ink-2)]">
            Enter only the costs you couldn&rsquo;t cut overnight if you lost your income. Subscriptions, holidays and takeaways don&rsquo;t belong here — the point is to see what you actually need to survive on.
          </p>

          <div className="space-y-4">
            {FIELDS.map(f => (
              <label key={f.key} className="block">
                <span className="block text-[14px] font-semibold text-[color:var(--ink)]">{f.label}</span>
                <span className="metadata block text-[12.5px] text-[color:var(--ink-3)]">{f.hint}</span>
                <div className="relative mt-2">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--ink-3)]">£</span>
                  <input
                    inputMode="decimal"
                    value={costs[f.key]}
                    onChange={handle(f.key)}
                    placeholder="0"
                    aria-label={`${f.label} per month`}
                    className="w-full rounded-md border border-rule bg-[color:var(--paper)] py-2.5 pl-7 pr-14 text-[16px] tabular-nums focus:border-[color:var(--green)] focus:outline-none"
                  />
                  <span className="metadata pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[color:var(--ink-3)]">/ mo</span>
                </div>
              </label>
            ))}
          </div>

          <div className="rounded-md border border-rule bg-[color:var(--paper)] p-5">
            <p className="metadata uppercase tracking-[0.18em] text-[color:var(--ink-3)]">How many months of cover?</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[3, 6, 9, 12].map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMonths(m)}
                  className={`rounded-full border px-4 py-1.5 text-[13.5px] font-semibold transition ${
                    months === m
                      ? 'border-[color:var(--green)] bg-[color:var(--green)] text-[color:var(--paper)]'
                      : 'border-rule bg-white text-[color:var(--ink-2)] hover:border-[color:var(--green)]'
                  }`}
                >
                  {m} months
                </button>
              ))}
            </div>
            <p className="metadata mt-3 text-[12.5px] text-[color:var(--ink-2)]">
              3 months is a common starting point. Go to 6+ if your income is irregular, you&rsquo;re self-employed, or you&rsquo;re a single earner in your household.
            </p>
          </div>

          <label className="block">
            <span className="block text-[14px] font-semibold text-[color:var(--ink)]">What you&rsquo;ve already saved</span>
            <span className="metadata block text-[12.5px] text-[color:var(--ink-3)]">Cash you can access within 24 hours.</span>
            <div className="relative mt-2">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--ink-3)]">£</span>
              <input
                inputMode="decimal"
                value={saved}
                onChange={e => setSaved(e.target.value)}
                placeholder="0"
                aria-label="Current emergency fund balance"
                className="w-full rounded-md border border-rule bg-[color:var(--paper)] py-2.5 pl-7 pr-3 text-[16px] tabular-nums focus:border-[color:var(--green)] focus:outline-none"
              />
            </div>
          </label>
        </div>

        <aside className="rounded-md border border-rule bg-[color:var(--paper)] p-6">
          <p className="metadata uppercase tracking-[0.18em] text-[color:var(--ink-3)]">Your target fund</p>
          <p className="mt-2 font-serif-display text-[40px] leading-none tabular-nums">{formatGBP(result.target)}</p>
          <p className="metadata mt-1 text-[12.5px]">
            {formatGBP(result.monthly)} × {months} months
          </p>

          <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-[color:var(--rule)]">
            <div
              role="progressbar"
              aria-valuenow={Math.round(result.pct)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Emergency fund progress"
              className="h-full rounded-full bg-[color:var(--green)] transition-[width] duration-300"
              style={{ width: `${result.pct}%` }}
            />
          </div>
          <p className="metadata mt-1 text-right text-[12px]">{Math.round(result.pct)}%</p>

          <div className="mt-5 border-t border-rule pt-5">
            {result.complete ? (
              <>
                <p className="metadata uppercase tracking-[0.18em] text-[color:var(--green)]">You&rsquo;re covered</p>
                <p className="mt-1 font-serif-display text-[24px] text-[color:var(--green-dark)]">
                  Anything extra can go into investing.
                </p>
              </>
            ) : (
              <>
                <p className="metadata uppercase tracking-[0.18em] text-[color:var(--ink-3)]">Still to save</p>
                <p className="mt-1 font-serif-display text-[28px] tabular-nums">{formatGBP(result.shortfall)}</p>
                {result.monthly > 0 && (
                  <p className="metadata mt-2 text-[12.5px]">
                    Save {formatGBP(result.shortfall / 12)}/mo to hit it in a year.
                  </p>
                )}
              </>
            )}
          </div>
        </aside>
      </div>

      <details className="mt-8 border-t border-rule pt-6 text-[14.5px] leading-relaxed text-[color:var(--ink-2)]">
        <summary className="cursor-pointer font-semibold text-[color:var(--ink)]">How this is worked out</summary>
        <div className="mt-3 space-y-2">
          <p>
            Target = essential monthly outgoings × number of months. The point of an emergency fund is to cover survival costs while you fix something — a job loss, a boiler failure, a medical issue.
          </p>
          <p>
            Keep it in instant-access cash. A premium bonds account or easy-access savings account is fine; a stocks &amp; shares ISA is not, because the worst time to sell is during the kind of market drop that often coincides with people losing their jobs.
          </p>
          <p>
            Once you&rsquo;re covered, redirect what you would have been saving into your pension, ISA, or paying down high-interest debt.
          </p>
        </div>
      </details>
    </section>
  )
}
