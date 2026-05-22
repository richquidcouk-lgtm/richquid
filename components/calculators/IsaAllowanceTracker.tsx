'use client'

import { useMemo, useState } from 'react'

const ISA_ALLOWANCE = 20000
const LISA_LIMIT = 4000

type IsaInputs = {
  cash: string
  stocks: string
  lisa: string
  ifisa: string
}

const FIELDS: { key: keyof IsaInputs; label: string; hint: string }[] = [
  { key: 'cash', label: 'Cash ISA', hint: 'Variable & fixed rate cash ISAs.' },
  { key: 'stocks', label: 'Stocks & Shares ISA', hint: 'Funds, ETFs, individual shares.' },
  { key: 'lisa', label: 'Lifetime ISA', hint: 'Counts toward the £20k total. Max £4,000/year on its own.' },
  { key: 'ifisa', label: 'Innovative Finance ISA', hint: 'Peer-to-peer lending ISAs.' },
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

export default function IsaAllowanceTracker() {
  const [inputs, setInputs] = useState<IsaInputs>({
    cash: '',
    stocks: '',
    lisa: '',
    ifisa: '',
  })

  const numbers = useMemo(() => {
    const cash = parseAmount(inputs.cash)
    const stocks = parseAmount(inputs.stocks)
    const lisa = parseAmount(inputs.lisa)
    const ifisa = parseAmount(inputs.ifisa)
    const used = cash + stocks + lisa + ifisa
    const remaining = ISA_ALLOWANCE - used
    const pct = Math.min(100, Math.max(0, (used / ISA_ALLOWANCE) * 100))
    return {
      cash, stocks, lisa, ifisa, used,
      remaining,
      pct,
      over: used > ISA_ALLOWANCE,
      lisaOver: lisa > LISA_LIMIT,
    }
  }, [inputs])

  const handle = (key: keyof IsaInputs) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputs(prev => ({ ...prev, [key]: e.target.value }))

  return (
    <section className="rounded-lg border border-rule bg-white p-6 sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <p className="metadata uppercase tracking-[0.2em] text-[color:var(--green)]">2025/26 tax year</p>
          <p className="text-[15px] leading-relaxed text-[color:var(--ink-2)]">
            Enter what you&rsquo;ve paid into each type of ISA since 6 April 2025. Withdrawals from a flexible ISA don&rsquo;t free up allowance unless you&rsquo;re replacing them in the same tax year, in the same account.
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
                    value={inputs[f.key]}
                    onChange={handle(f.key)}
                    placeholder="0"
                    aria-label={`${f.label} contributions this tax year`}
                    className="w-full rounded-md border border-rule bg-[color:var(--paper)] py-2.5 pl-7 pr-3 text-[16px] tabular-nums focus:border-[color:var(--green)] focus:outline-none"
                  />
                </div>
              </label>
            ))}
          </div>
          {numbers.lisaOver && (
            <p className="rounded-md border border-rule bg-[color:var(--gold-soft)]/40 px-3 py-2 text-[13.5px] text-[color:var(--ink-2)]">
              The Lifetime ISA has its own £4,000/year cap. You&rsquo;ve entered {formatGBP(numbers.lisa)} — the government 25% bonus only applies up to £4,000.
            </p>
          )}
        </div>

        <aside className="rounded-md border border-rule bg-[color:var(--paper)] p-6">
          <p className="metadata uppercase tracking-[0.18em] text-[color:var(--ink-3)]">Allowance used</p>
          <p className="mt-2 font-serif-display text-[44px] leading-none tabular-nums">{formatGBP(numbers.used)}</p>
          <p className="metadata mt-1 text-[12.5px]">of {formatGBP(ISA_ALLOWANCE)}</p>

          <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-[color:var(--rule)]">
            <div
              role="progressbar"
              aria-valuenow={Math.round(numbers.pct)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="ISA allowance used"
              className="h-full rounded-full transition-[width] duration-300"
              style={{
                width: `${numbers.pct}%`,
                background: numbers.over ? '#B23A2E' : 'var(--green)',
              }}
            />
          </div>

          <div className="mt-6 border-t border-rule pt-5">
            <p className="metadata uppercase tracking-[0.18em] text-[color:var(--ink-3)]">
              {numbers.over ? 'Over allowance by' : 'Remaining'}
            </p>
            <p
              className="mt-1 font-serif-display text-[28px] tabular-nums"
              style={{ color: numbers.over ? '#B23A2E' : 'var(--green)' }}
            >
              {formatGBP(Math.abs(numbers.remaining))}
            </p>
            {numbers.over && (
              <p className="metadata mt-2 text-[12.5px] text-[color:var(--ink-2)]">
                Speak to your provider — HMRC will eventually flag the excess and ask you to repair it.
              </p>
            )}
          </div>
        </aside>
      </div>

      <details className="mt-8 border-t border-rule pt-6 text-[14.5px] leading-relaxed text-[color:var(--ink-2)]">
        <summary className="cursor-pointer font-semibold text-[color:var(--ink)]">How this is worked out</summary>
        <div className="mt-3 space-y-2">
          <p>
            The total ISA allowance for the 2025/26 tax year is <strong>£20,000</strong>. It applies across <em>all</em> adult ISAs you hold — the £20,000 is shared, not per account.
          </p>
          <p>
            The Lifetime ISA has its own annual cap of <strong>£4,000</strong> within that £20,000, and HMRC pays a 25% bonus on contributions up to that cap.
          </p>
          <p>
            Junior ISAs are separate (£9,000/year for under-18s) and aren&rsquo;t counted here.
          </p>
        </div>
      </details>
    </section>
  )
}
