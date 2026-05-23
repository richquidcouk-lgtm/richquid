'use client'

import { useMemo, useState } from 'react'
import { TAX_YEAR, formatGBP, parseAmount, personalAllowance, RUK_BASIC_LIMIT, RUK_HIGHER_LIMIT } from '@/lib/uk-tax'

type Mode = 'cgt' | 'dividends'

const CGT_AEA = 3000
const CGT_BASIC = 0.18
const CGT_HIGHER = 0.24
const DIV_ALLOWANCE = 500
const DIV_BASIC = 0.1075
const DIV_HIGHER = 0.3575
const DIV_ADDITIONAL = 0.3935

function computeCGT(income: number, gain: number) {
  const taxableGain = Math.max(0, gain - CGT_AEA)
  if (taxableGain === 0) return { tax: 0, atBasic: 0, atHigher: 0, basicRemaining: 0, taxableGain }
  // Income uses up basic-rate band first
  const pa = personalAllowance(income)
  const incomeAfterPA = Math.max(0, income - pa)
  const basicBandSize = RUK_BASIC_LIMIT - pa
  const basicUsed = Math.min(incomeAfterPA, basicBandSize)
  const basicRemaining = Math.max(0, basicBandSize - basicUsed)
  const atBasic = Math.min(taxableGain, basicRemaining)
  const atHigher = taxableGain - atBasic
  const tax = atBasic * CGT_BASIC + atHigher * CGT_HIGHER
  return { tax, atBasic, atHigher, basicRemaining, taxableGain }
}

function computeDividendTax(nonDivIncome: number, dividends: number) {
  const taxableDiv = Math.max(0, dividends - DIV_ALLOWANCE)
  if (taxableDiv === 0) return { tax: 0, atBasic: 0, atHigher: 0, atAdditional: 0, taxableDiv }
  // Treat the £500 allowance as using up tax bands too (it does technically). Simplified: place taxable dividends on top of non-div income.
  const pa = personalAllowance(nonDivIncome + dividends)
  const incomeAfterPA = Math.max(0, nonDivIncome - pa)
  const basicEnd = RUK_BASIC_LIMIT - pa // amount of basic band
  const higherEnd = RUK_HIGHER_LIMIT - pa

  // The £500 dividend allowance sits in whichever band the first £500 of dividends falls into.
  // We assume the allowance is consumed before taxing — this matches HMRC's behaviour.
  let position = incomeAfterPA + DIV_ALLOWANCE // start of taxable dividend tax
  let remaining = taxableDiv

  let atBasic = 0, atHigher = 0, atAdditional = 0
  // Slice into basic
  if (position < basicEnd && remaining > 0) {
    const slice = Math.min(remaining, basicEnd - position)
    atBasic += slice; position += slice; remaining -= slice
  }
  // Slice into higher
  if (position < higherEnd && remaining > 0) {
    const slice = Math.min(remaining, higherEnd - position)
    atHigher += slice; position += slice; remaining -= slice
  }
  // Whatever's left is additional
  atAdditional += remaining

  const tax = atBasic * DIV_BASIC + atHigher * DIV_HIGHER + atAdditional * DIV_ADDITIONAL
  return { tax, atBasic, atHigher, atAdditional, taxableDiv }
}

export default function CgtDividendCalculator() {
  const [mode, setMode] = useState<Mode>('cgt')
  const [income, setIncome] = useState('40000')
  const [gain, setGain] = useState('10000')
  const [dividends, setDividends] = useState('5000')

  const cgt = useMemo(() => computeCGT(parseAmount(income), parseAmount(gain)), [income, gain])
  const div = useMemo(() => computeDividendTax(parseAmount(income), parseAmount(dividends)), [income, dividends])

  return (
    <section className="rounded-lg border border-rule bg-white p-6 sm:p-8">
      <p className="metadata uppercase tracking-[0.2em] text-[color:var(--green)]">{TAX_YEAR} tax year</p>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => setMode('cgt')}
          className={`rounded-full border px-4 py-1.5 text-[13.5px] font-semibold transition ${
            mode === 'cgt' ? 'border-[color:var(--green)] bg-[color:var(--green)] text-[color:var(--paper)]'
                          : 'border-rule bg-white text-[color:var(--ink-2)] hover:border-[color:var(--green)]'
          }`}
        >Capital Gains</button>
        <button
          type="button"
          onClick={() => setMode('dividends')}
          className={`rounded-full border px-4 py-1.5 text-[13.5px] font-semibold transition ${
            mode === 'dividends' ? 'border-[color:var(--green)] bg-[color:var(--green)] text-[color:var(--paper)]'
                                : 'border-rule bg-white text-[color:var(--ink-2)] hover:border-[color:var(--green)]'
          }`}
        >Dividends</button>
      </div>

      <div className="mt-5 grid gap-8 lg:grid-cols-2">
        <div className="space-y-5">
          <label className="block">
            <span className="block text-[14px] font-semibold text-[color:var(--ink)]">
              {mode === 'cgt' ? 'Other taxable income this year' : 'Non-dividend income this year'}
            </span>
            <span className="metadata block text-[12.5px] text-[color:var(--ink-3)]">
              Salary, pension, rental, SE profit. Determines which tax band the {mode === 'cgt' ? 'gain' : 'dividend'} sits in.
            </span>
            <div className="relative mt-2">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--ink-3)]">£</span>
              <input
                inputMode="decimal" value={income}
                onChange={e => setIncome(e.target.value)}
                aria-label="Other income"
                className="w-full rounded-md border border-rule bg-[color:var(--paper)] py-2.5 pl-7 pr-3 text-[16px] tabular-nums focus:border-[color:var(--green)] focus:outline-none"
              />
            </div>
          </label>

          {mode === 'cgt' ? (
            <label className="block">
              <span className="block text-[14px] font-semibold text-[color:var(--ink)]">Total gain this year</span>
              <span className="metadata block text-[12.5px] text-[color:var(--ink-3)]">Across all disposals — shares, crypto, second property — after deducting losses.</span>
              <div className="relative mt-2">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--ink-3)]">£</span>
                <input
                  inputMode="decimal" value={gain}
                  onChange={e => setGain(e.target.value)}
                  aria-label="Total capital gain"
                  className="w-full rounded-md border border-rule bg-[color:var(--paper)] py-2.5 pl-7 pr-3 text-[16px] tabular-nums focus:border-[color:var(--green)] focus:outline-none"
                />
              </div>
            </label>
          ) : (
            <label className="block">
              <span className="block text-[14px] font-semibold text-[color:var(--ink)]">Dividend income</span>
              <span className="metadata block text-[12.5px] text-[color:var(--ink-3)]">Outside an ISA or pension. Stocks &amp; shares ISA dividends are tax-free.</span>
              <div className="relative mt-2">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--ink-3)]">£</span>
                <input
                  inputMode="decimal" value={dividends}
                  onChange={e => setDividends(e.target.value)}
                  aria-label="Dividend income"
                  className="w-full rounded-md border border-rule bg-[color:var(--paper)] py-2.5 pl-7 pr-3 text-[16px] tabular-nums focus:border-[color:var(--green)] focus:outline-none"
                />
              </div>
            </label>
          )}
        </div>

        <aside className="space-y-4">
          {mode === 'cgt' ? (
            <>
              <div className="rounded-md border border-rule bg-[color:var(--green-soft)] p-6">
                <p className="metadata uppercase tracking-[0.18em] text-[color:var(--green-dark)]">CGT due</p>
                <p className="mt-2 font-serif-display text-[40px] leading-none tabular-nums text-[color:var(--green-dark)]">{formatGBP(cgt.tax)}</p>
                <p className="metadata mt-2 text-[12.5px]">After £{CGT_AEA.toLocaleString()} annual exempt amount.</p>
              </div>
              <div className="rounded-md border border-rule bg-white p-5">
                <p className="metadata uppercase tracking-[0.18em] text-[color:var(--ink-3)]">Working</p>
                <dl className="mt-3 space-y-2 text-[14.5px]">
                  <div className="flex justify-between"><dt>Gain</dt><dd className="tabular-nums">{formatGBP(parseAmount(gain))}</dd></div>
                  <div className="flex justify-between text-[color:var(--ink-2)]"><dt>− Annual exempt amount</dt><dd className="tabular-nums">{formatGBP(Math.min(parseAmount(gain), CGT_AEA))}</dd></div>
                  <div className="flex justify-between font-semibold"><dt>Taxable gain</dt><dd className="tabular-nums">{formatGBP(cgt.taxableGain)}</dd></div>
                  {cgt.atBasic > 0 && <div className="flex justify-between text-[color:var(--ink-3)]"><dt>At 18% (basic band)</dt><dd className="tabular-nums">{formatGBP(cgt.atBasic * CGT_BASIC)}</dd></div>}
                  {cgt.atHigher > 0 && <div className="flex justify-between text-[color:var(--ink-3)]"><dt>At 24% (higher)</dt><dd className="tabular-nums">{formatGBP(cgt.atHigher * CGT_HIGHER)}</dd></div>}
                </dl>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-md border border-rule bg-[color:var(--green-soft)] p-6">
                <p className="metadata uppercase tracking-[0.18em] text-[color:var(--green-dark)]">Dividend tax due</p>
                <p className="mt-2 font-serif-display text-[40px] leading-none tabular-nums text-[color:var(--green-dark)]">{formatGBP(div.tax)}</p>
                <p className="metadata mt-2 text-[12.5px]">First £{DIV_ALLOWANCE} is tax-free.</p>
              </div>
              <div className="rounded-md border border-rule bg-white p-5">
                <p className="metadata uppercase tracking-[0.18em] text-[color:var(--ink-3)]">Working</p>
                <dl className="mt-3 space-y-2 text-[14.5px]">
                  <div className="flex justify-between"><dt>Dividends</dt><dd className="tabular-nums">{formatGBP(parseAmount(dividends))}</dd></div>
                  <div className="flex justify-between text-[color:var(--ink-2)]"><dt>− Dividend allowance</dt><dd className="tabular-nums">{formatGBP(Math.min(parseAmount(dividends), DIV_ALLOWANCE))}</dd></div>
                  <div className="flex justify-between font-semibold"><dt>Taxable dividends</dt><dd className="tabular-nums">{formatGBP(div.taxableDiv)}</dd></div>
                  {div.atBasic > 0 && <div className="flex justify-between text-[color:var(--ink-3)]"><dt>At 10.75% (basic)</dt><dd className="tabular-nums">{formatGBP(div.atBasic * DIV_BASIC)}</dd></div>}
                  {div.atHigher > 0 && <div className="flex justify-between text-[color:var(--ink-3)]"><dt>At 35.75% (higher)</dt><dd className="tabular-nums">{formatGBP(div.atHigher * DIV_HIGHER)}</dd></div>}
                  {div.atAdditional > 0 && <div className="flex justify-between text-[color:var(--ink-3)]"><dt>At 39.35% (additional)</dt><dd className="tabular-nums">{formatGBP(div.atAdditional * DIV_ADDITIONAL)}</dd></div>}
                </dl>
              </div>
            </>
          )}
        </aside>
      </div>

      <details className="mt-8 border-t border-rule pt-6 text-[14.5px] leading-relaxed text-[color:var(--ink-2)]">
        <summary className="cursor-pointer font-semibold text-[color:var(--ink)]">How this is worked out</summary>
        <div className="mt-3 space-y-2">
          {mode === 'cgt' ? (
            <>
              <p>
                <strong>Capital Gains Tax</strong> uses your other taxable income to decide which band your gain falls into. The annual exempt amount is £3,000 (dropped from £6,000 in 2023/24 and £12,300 before that).
              </p>
              <p>
                Rates as of 30 October 2024: <strong>18% in the basic band, 24% above</strong> — same for shares, crypto, and second residential property. Pre-Oct 2024 the non-property rates were 10/20%.
              </p>
              <p>
                Gains inside an ISA or SIPP are not taxable. Selling your only home is normally covered by Private Residence Relief.
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>Dividend tax</strong> sits on top of your other income. The first £500 each year is tax-free (the dividend allowance — down from £1,000 in 2023/24 and £2,000 before that).
              </p>
              <p>
                Rates (from 6 April 2026): <strong>10.75% basic, 35.75% higher, 39.35% additional</strong> — basic and higher rates rose 2pp on 6 April 2026 (Autumn Budget 2024 announcement). Dividends from shares held inside a Stocks &amp; Shares ISA are entirely tax-free and don&rsquo;t use the allowance.
              </p>
              <p>
                Dividend reinvestment is still a taxable event in a general account — even if you didn&rsquo;t take the cash.
              </p>
            </>
          )}
        </div>
      </details>
    </section>
  )
}
