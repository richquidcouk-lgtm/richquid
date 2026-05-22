'use client'

import { useMemo, useState } from 'react'
import { formatGBP, parseAmount, incomeTax, employeeNI } from '@/lib/uk-tax'

function monthlyPayment(principal: number, annualRate: number, years: number): number {
  if (principal <= 0) return 0
  const n = years * 12
  const r = annualRate / 100 / 12
  if (r === 0) return principal / n
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

export default function MortgageAffordabilityCalculator() {
  const [income1, setIncome1] = useState('45000')
  const [income2, setIncome2] = useState('')
  const [debts, setDebts] = useState('0')
  const [deposit, setDeposit] = useState('30000')
  const [ltiMultiple, setLtiMultiple] = useState('4.5')
  const [rate, setRate] = useState('4.5')
  const [stressRate, setStressRate] = useState('8')
  const [term, setTerm] = useState('25')

  const result = useMemo(() => {
    const i1 = parseAmount(income1)
    const i2 = parseAmount(income2)
    const totalIncome = i1 + i2
    const monthlyDebts = parseAmount(debts)
    const dep = parseAmount(deposit)
    const lti = Math.min(7, Math.max(2, parseAmount(ltiMultiple) || 4.5))
    const r = Math.max(0, parseAmount(rate))
    const sr = Math.max(0, parseAmount(stressRate))
    const yrs = Math.min(40, Math.max(5, parseAmount(term) || 25))

    const maxLoan = totalIncome * lti
    // Debts haircut: most lenders reduce borrowing power by ~£X for every £100/mo of debt
    // Common rule of thumb: reduce maxLoan by 30x annual debt payments
    const debtHaircut = monthlyDebts * 12 * 30 / 12 // approx; we'll subtract directly
    const adjustedMaxLoan = Math.max(0, maxLoan - monthlyDebts * 12 * 2.5)
    const maxPurchase = adjustedMaxLoan + dep

    // Income tax + NI for combined income to estimate net take-home (treat as one earner for simplicity; conservative).
    const grossForTax = totalIncome
    const tax = incomeTax(grossForTax)
    const ni = employeeNI(grossForTax)
    const monthlyNet = (grossForTax - tax - ni) / 12

    const payNow = monthlyPayment(adjustedMaxLoan, r, yrs)
    const payStressed = monthlyPayment(adjustedMaxLoan, sr, yrs)
    const stressedShare = monthlyNet > 0 ? (payStressed + monthlyDebts) / monthlyNet : 0
    const ltv = maxPurchase > 0 ? (adjustedMaxLoan / maxPurchase) * 100 : 0

    return {
      totalIncome, maxLoan, adjustedMaxLoan, maxPurchase, deposit: dep,
      payNow, payStressed, monthlyNet, stressedShare, ltv,
      tightAffordability: stressedShare > 0.40,
      debtHaircut: maxLoan - adjustedMaxLoan,
    }
  }, [income1, income2, debts, deposit, ltiMultiple, rate, stressRate, term])

  return (
    <section className="rounded-lg border border-rule bg-white p-6 sm:p-8">
      <p className="metadata uppercase tracking-[0.2em] text-[color:var(--green)]">Borrowing power + stress test</p>

      <div className="mt-4 grid gap-8 lg:grid-cols-2">
        <div className="space-y-5">
          <label className="block">
            <span className="block text-[14px] font-semibold text-[color:var(--ink)]">Your gross income</span>
            <span className="metadata block text-[12.5px] text-[color:var(--ink-3)]">Annual salary plus regular bonus.</span>
            <div className="relative mt-2">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--ink-3)]">£</span>
              <input
                inputMode="decimal" value={income1}
                onChange={e => setIncome1(e.target.value)}
                aria-label="Primary applicant gross income"
                className="w-full rounded-md border border-rule bg-[color:var(--paper)] py-2.5 pl-7 pr-3 text-[16px] tabular-nums focus:border-[color:var(--green)] focus:outline-none"
              />
            </div>
          </label>

          <label className="block">
            <span className="block text-[14px] font-semibold text-[color:var(--ink)]">Partner&rsquo;s income <span className="font-normal text-[color:var(--ink-3)]">(optional)</span></span>
            <div className="relative mt-2">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--ink-3)]">£</span>
              <input
                inputMode="decimal" value={income2}
                onChange={e => setIncome2(e.target.value)}
                placeholder="0"
                aria-label="Joint applicant gross income"
                className="w-full rounded-md border border-rule bg-[color:var(--paper)] py-2.5 pl-7 pr-3 text-[16px] tabular-nums focus:border-[color:var(--green)] focus:outline-none"
              />
            </div>
          </label>

          <label className="block">
            <span className="block text-[14px] font-semibold text-[color:var(--ink)]">Monthly debt payments</span>
            <span className="metadata block text-[12.5px] text-[color:var(--ink-3)]">Loans, car finance, credit card minimums. Excludes living costs.</span>
            <div className="relative mt-2">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--ink-3)]">£</span>
              <input
                inputMode="decimal" value={debts}
                onChange={e => setDebts(e.target.value)}
                aria-label="Monthly debt repayments"
                className="w-full rounded-md border border-rule bg-[color:var(--paper)] py-2.5 pl-7 pr-14 text-[16px] tabular-nums focus:border-[color:var(--green)] focus:outline-none"
              />
              <span className="metadata pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[color:var(--ink-3)]">/ mo</span>
            </div>
          </label>

          <label className="block">
            <span className="block text-[14px] font-semibold text-[color:var(--ink)]">Deposit available</span>
            <div className="relative mt-2">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--ink-3)]">£</span>
              <input
                inputMode="decimal" value={deposit}
                onChange={e => setDeposit(e.target.value)}
                aria-label="Available deposit"
                className="w-full rounded-md border border-rule bg-[color:var(--paper)] py-2.5 pl-7 pr-3 text-[16px] tabular-nums focus:border-[color:var(--green)] focus:outline-none"
              />
            </div>
          </label>

          <div className="grid grid-cols-3 gap-3">
            <label className="block">
              <span className="block text-[13px] font-semibold text-[color:var(--ink)]">LTI multiple</span>
              <span className="metadata block text-[11.5px] text-[color:var(--ink-3)]">× your income</span>
              <input
                inputMode="decimal" value={ltiMultiple}
                onChange={e => setLtiMultiple(e.target.value)}
                aria-label="Loan to income multiple"
                className="mt-1 w-full rounded-md border border-rule bg-[color:var(--paper)] px-3 py-2 text-[15px] tabular-nums focus:border-[color:var(--green)] focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="block text-[13px] font-semibold text-[color:var(--ink)]">Rate</span>
              <span className="metadata block text-[11.5px] text-[color:var(--ink-3)]">today&rsquo;s deal</span>
              <div className="relative mt-1">
                <input
                  inputMode="decimal" value={rate}
                  onChange={e => setRate(e.target.value)}
                  aria-label="Mortgage interest rate"
                  className="w-full rounded-md border border-rule bg-[color:var(--paper)] px-3 py-2 pr-7 text-[15px] tabular-nums focus:border-[color:var(--green)] focus:outline-none"
                />
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[color:var(--ink-3)]">%</span>
              </div>
            </label>
            <label className="block">
              <span className="block text-[13px] font-semibold text-[color:var(--ink)]">Term</span>
              <span className="metadata block text-[11.5px] text-[color:var(--ink-3)]">years</span>
              <input
                inputMode="decimal" value={term}
                onChange={e => setTerm(e.target.value)}
                aria-label="Mortgage term in years"
                className="mt-1 w-full rounded-md border border-rule bg-[color:var(--paper)] px-3 py-2 text-[15px] tabular-nums focus:border-[color:var(--green)] focus:outline-none"
              />
            </label>
          </div>

          <label className="block">
            <span className="block text-[13px] font-semibold text-[color:var(--ink)]">Stress rate</span>
            <span className="metadata block text-[12px] text-[color:var(--ink-3)]">Lenders test you can still afford this if rates climb (typically 7–9%).</span>
            <div className="relative mt-1 max-w-[140px]">
              <input
                inputMode="decimal" value={stressRate}
                onChange={e => setStressRate(e.target.value)}
                aria-label="Stress test rate"
                className="w-full rounded-md border border-rule bg-[color:var(--paper)] px-3 py-2 pr-7 text-[15px] tabular-nums focus:border-[color:var(--green)] focus:outline-none"
              />
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[color:var(--ink-3)]">%</span>
            </div>
          </label>
        </div>

        <aside className="space-y-4">
          <div className="rounded-md border border-rule bg-[color:var(--green-soft)] p-6">
            <p className="metadata uppercase tracking-[0.18em] text-[color:var(--green-dark)]">You could buy up to</p>
            <p className="mt-2 font-serif-display text-[40px] leading-none tabular-nums text-[color:var(--green-dark)]">{formatGBP(result.maxPurchase)}</p>
            <p className="metadata mt-2 text-[12.5px]">
              {formatGBP(result.adjustedMaxLoan)} mortgage + {formatGBP(result.deposit)} deposit · LTV {result.ltv.toFixed(0)}%
            </p>
            {result.debtHaircut > 0 && (
              <p className="metadata mt-2 text-[12px] text-[color:var(--ink-2)]">
                Reduced by {formatGBP(result.debtHaircut)} for existing debts.
              </p>
            )}
          </div>

          <div className="rounded-md border border-rule bg-white p-5">
            <p className="metadata uppercase tracking-[0.18em] text-[color:var(--ink-3)]">Monthly cost</p>
            <dl className="mt-3 space-y-2 text-[14.5px]">
              <div className="flex justify-between">
                <dt>At {parseAmount(rate)}% (today)</dt>
                <dd className="tabular-nums">{formatGBP(result.payNow)}</dd>
              </div>
              <div className="flex justify-between text-[color:var(--ink-2)]">
                <dt>At {parseAmount(stressRate)}% (stressed)</dt>
                <dd className="tabular-nums">{formatGBP(result.payStressed)}</dd>
              </div>
              <div className="flex justify-between border-t border-rule pt-2 text-[13px] text-[color:var(--ink-3)]">
                <dt>As % of net pay (stressed + debts)</dt>
                <dd className="tabular-nums">{(result.stressedShare * 100).toFixed(0)}%</dd>
              </div>
            </dl>
          </div>

          {result.tightAffordability && (
            <div className="rounded-md border border-rule bg-[color:var(--gold-soft)]/40 p-4 text-[13.5px] leading-relaxed text-[color:var(--ink-2)]">
              <p>
                At the stressed rate, your housing + debt costs would consume over 40% of net income. Lenders may decline at this level — consider a smaller loan, longer term, or larger deposit.
              </p>
            </div>
          )}
        </aside>
      </div>

      <details className="mt-8 border-t border-rule pt-6 text-[14.5px] leading-relaxed text-[color:var(--ink-2)]">
        <summary className="cursor-pointer font-semibold text-[color:var(--ink)]">How this is worked out</summary>
        <div className="mt-3 space-y-2">
          <p>
            Most UK lenders cap borrowing at <strong>4 to 4.5× gross income</strong>. A few stretch to 5–5.5× for higher earners or specific products. You can move the multiple to see what each band looks like.
          </p>
          <p>
            Monthly debt repayments are subtracted from your borrowing power — every £100/month of debt reduces your max loan by roughly £3,000 in our model (a common lender heuristic).
          </p>
          <p>
            Mortgage payments use the standard repayment formula: P × r × (1+r)<sup>n</sup> ÷ ((1+r)<sup>n</sup> − 1), with r = monthly rate and n = months.
          </p>
          <p>
            The <strong>stress test</strong> mirrors FCA rules — lenders confirm you could still pay if rates rose. Many use 7–9% today. If your stressed monthly cost (mortgage + existing debts) exceeds ~40% of your net income, expect declines.
          </p>
        </div>
      </details>
    </section>
  )
}
