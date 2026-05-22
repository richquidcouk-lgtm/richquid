'use client'

import { useMemo, useState } from 'react'
import { TAX_YEAR, formatGBP, parseAmount, incomeTaxRUK, NI_PRIMARY, NI_UPPER } from '@/lib/uk-tax'

const TRADING_ALLOWANCE = 1000

function class4NI(profits: number): number {
  if (profits <= NI_PRIMARY) return 0
  const main = Math.min(profits, NI_UPPER) - NI_PRIMARY
  let ni = Math.max(0, main) * 0.06
  if (profits > NI_UPPER) ni += (profits - NI_UPPER) * 0.02
  return ni
}

export default function SelfAssessmentEstimator() {
  const [paye, setPaye] = useState('0')
  const [seIncome, setSeIncome] = useState('20000')
  const [expenses, setExpenses] = useState('2000')
  const [useTradingAllowance, setUseTradingAllowance] = useState(false)

  const result = useMemo(() => {
    const P = parseAmount(paye)
    const S = parseAmount(seIncome)
    const E = parseAmount(expenses)
    const deduction = useTradingAllowance ? Math.min(TRADING_ALLOWANCE, S) : E
    const netSE = Math.max(0, S - deduction)
    const totalIncome = P + netSE

    const totalIncomeTax = incomeTaxRUK(totalIncome)
    const payeTaxAlready = incomeTaxRUK(P)
    const additionalIncomeTax = Math.max(0, totalIncomeTax - payeTaxAlready)

    const ni4 = class4NI(netSE)
    const totalSaBill = additionalIncomeTax + ni4

    return {
      P, S, E, deduction, netSE, totalIncome,
      totalIncomeTax, payeTaxAlready, additionalIncomeTax,
      ni4, totalSaBill,
      tradingBetterThanExpenses: TRADING_ALLOWANCE > E && S > TRADING_ALLOWANCE,
    }
  }, [paye, seIncome, expenses, useTradingAllowance])

  return (
    <section className="rounded-lg border border-rule bg-white p-6 sm:p-8">
      <p className="metadata uppercase tracking-[0.2em] text-[color:var(--green)]">{TAX_YEAR} tax year · for the SA return</p>

      <div className="mt-4 grid gap-8 lg:grid-cols-2">
        <div className="space-y-5">
          <label className="block">
            <span className="block text-[14px] font-semibold text-[color:var(--ink)]">PAYE income</span>
            <span className="metadata block text-[12.5px] text-[color:var(--ink-3)]">Gross salary already taxed by your employer. Zero if you&rsquo;re fully self-employed.</span>
            <div className="relative mt-2">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--ink-3)]">£</span>
              <input
                inputMode="decimal" value={paye}
                onChange={e => setPaye(e.target.value)}
                aria-label="PAYE income"
                className="w-full rounded-md border border-rule bg-[color:var(--paper)] py-2.5 pl-7 pr-3 text-[16px] tabular-nums focus:border-[color:var(--green)] focus:outline-none"
              />
            </div>
          </label>

          <label className="block">
            <span className="block text-[14px] font-semibold text-[color:var(--ink)]">Self-employed / side income</span>
            <span className="metadata block text-[12.5px] text-[color:var(--ink-3)]">Gross — what clients paid you, before expenses.</span>
            <div className="relative mt-2">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--ink-3)]">£</span>
              <input
                inputMode="decimal" value={seIncome}
                onChange={e => setSeIncome(e.target.value)}
                aria-label="Self-employed income"
                className="w-full rounded-md border border-rule bg-[color:var(--paper)] py-2.5 pl-7 pr-3 text-[16px] tabular-nums focus:border-[color:var(--green)] focus:outline-none"
              />
            </div>
          </label>

          <div className="rounded-md border border-rule bg-[color:var(--paper)] p-4">
            <p className="text-[14px] font-semibold text-[color:var(--ink)]">Deductions</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setUseTradingAllowance(false)}
                className={`rounded-full border px-4 py-1.5 text-[13px] font-semibold transition ${
                  !useTradingAllowance ? 'border-[color:var(--green)] bg-[color:var(--green)] text-[color:var(--paper)]'
                                       : 'border-rule bg-white text-[color:var(--ink-2)] hover:border-[color:var(--green)]'
                }`}
              >Actual expenses</button>
              <button
                type="button"
                onClick={() => setUseTradingAllowance(true)}
                className={`rounded-full border px-4 py-1.5 text-[13px] font-semibold transition ${
                  useTradingAllowance ? 'border-[color:var(--green)] bg-[color:var(--green)] text-[color:var(--paper)]'
                                      : 'border-rule bg-white text-[color:var(--ink-2)] hover:border-[color:var(--green)]'
                }`}
              >£1,000 trading allowance</button>
            </div>
            {!useTradingAllowance ? (
              <label className="mt-3 block">
                <span className="metadata block text-[12.5px] text-[color:var(--ink-3)]">Allowable expenses (equipment, mileage, share of bills…)</span>
                <div className="relative mt-1">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--ink-3)]">£</span>
                  <input
                    inputMode="decimal" value={expenses}
                    onChange={e => setExpenses(e.target.value)}
                    aria-label="Allowable expenses"
                    className="w-full rounded-md border border-rule bg-[color:var(--paper)] py-2 pl-7 pr-3 text-[15px] tabular-nums focus:border-[color:var(--green)] focus:outline-none"
                  />
                </div>
              </label>
            ) : (
              <p className="metadata mt-3 text-[12.5px] text-[color:var(--ink-2)]">
                Claim £1,000 instead of itemising. If your real expenses are higher, switch back to actual.
              </p>
            )}
            {!useTradingAllowance && result.tradingBetterThanExpenses && (
              <p className="metadata mt-3 rounded-md bg-[color:var(--gold-soft)]/40 px-3 py-2 text-[12.5px] text-[color:var(--ink-2)]">
                Your expenses are below £1,000 — the trading allowance would deduct more. Worth toggling.
              </p>
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-md border border-rule bg-[color:var(--green-soft)] p-6">
            <p className="metadata uppercase tracking-[0.18em] text-[color:var(--green-dark)]">Estimated SA bill</p>
            <p className="mt-2 font-serif-display text-[40px] leading-none tabular-nums text-[color:var(--green-dark)]">
              {formatGBP(result.totalSaBill)}
            </p>
            <p className="metadata mt-2 text-[12.5px]">
              {formatGBP(result.additionalIncomeTax)} income tax · {formatGBP(result.ni4)} Class 4 NI
            </p>
          </div>

          <div className="rounded-md border border-rule bg-white p-5">
            <p className="metadata uppercase tracking-[0.18em] text-[color:var(--ink-3)]">Working</p>
            <dl className="mt-3 space-y-2 text-[14.5px]">
              <div className="flex justify-between"><dt>SE income</dt><dd className="tabular-nums">{formatGBP(result.S)}</dd></div>
              <div className="flex justify-between text-[color:var(--ink-2)]"><dt>− Deductions</dt><dd className="tabular-nums">{formatGBP(result.deduction)}</dd></div>
              <div className="flex justify-between font-semibold"><dt>Taxable SE profit</dt><dd className="tabular-nums">{formatGBP(result.netSE)}</dd></div>
              <div className="flex justify-between text-[color:var(--ink-3)] pt-2 border-t border-rule"><dt>Total taxable income</dt><dd className="tabular-nums">{formatGBP(result.totalIncome)}</dd></div>
              <div className="flex justify-between text-[color:var(--ink-3)]"><dt>Income tax on all income</dt><dd className="tabular-nums">{formatGBP(result.totalIncomeTax)}</dd></div>
              <div className="flex justify-between text-[color:var(--ink-3)]"><dt>− Already paid via PAYE</dt><dd className="tabular-nums">{formatGBP(result.payeTaxAlready)}</dd></div>
            </dl>
          </div>
        </aside>
      </div>

      <details className="mt-8 border-t border-rule pt-6 text-[14.5px] leading-relaxed text-[color:var(--ink-2)]">
        <summary className="cursor-pointer font-semibold text-[color:var(--ink)]">How this is worked out</summary>
        <div className="mt-3 space-y-2">
          <p>
            Taxable SE profit = gross self-employed income minus allowable expenses <em>or</em> the £1,000 trading allowance (whichever is bigger — you can&rsquo;t claim both).
          </p>
          <p>
            Income tax is applied to your <strong>total</strong> income (PAYE + SE profit) using {TAX_YEAR} bands. The amount your employer already deducted under PAYE is credited against this — what&rsquo;s left is the SA bill.
          </p>
          <p>
            <strong>Class 4 NI</strong> is the self-employed version of NI: 6% on SE profits between £12,570 and £50,270, then 2% above. Class 2 NI was abolished from April 2024 for most.
          </p>
          <p>
            This estimator doesn&rsquo;t cover: dividends, rental income, capital gains, the High Income Child Benefit Charge, pension tax relief on relief-at-source contributions, or marriage allowance transfers. For those, the SA return itself walks you through it.
          </p>
        </div>
      </details>
    </section>
  )
}
