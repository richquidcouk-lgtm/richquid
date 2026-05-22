'use client'

import { useMemo, useState } from 'react'
import { TAX_YEAR, formatGBP, parseAmount, STUDENT_LOAN, studentLoanRepayment, type StudentLoanPlan } from '@/lib/uk-tax'

type UndergradPlan = 'none' | 'plan1' | 'plan2' | 'plan4' | 'plan5'

export default function StudentLoanCalculator() {
  const [salary, setSalary] = useState('35000')
  const [undergrad, setUndergrad] = useState<UndergradPlan>('plan2')
  const [postgrad, setPostgrad] = useState(false)

  const result = useMemo(() => {
    const gross = parseAmount(salary)
    const ugRepay = undergrad === 'none' ? 0 : studentLoanRepayment(gross, undergrad as StudentLoanPlan)
    const pgRepay = postgrad ? studentLoanRepayment(gross, 'postgrad') : 0
    const total = ugRepay + pgRepay
    const ugThreshold = undergrad === 'none' ? 0 : STUDENT_LOAN[undergrad as StudentLoanPlan].threshold
    const pgThreshold = postgrad ? STUDENT_LOAN.postgrad.threshold : 0
    const pctOfGross = gross > 0 ? (total / gross) * 100 : 0
    return { gross, ugRepay, pgRepay, total, monthly: total / 12, ugThreshold, pgThreshold, pctOfGross }
  }, [salary, undergrad, postgrad])

  return (
    <section className="rounded-lg border border-rule bg-white p-6 sm:p-8">
      <p className="metadata uppercase tracking-[0.2em] text-[color:var(--green)]">{TAX_YEAR} thresholds</p>

      <div className="mt-4 grid gap-8 lg:grid-cols-2">
        <div className="space-y-5">
          <label className="block">
            <span className="block text-[14px] font-semibold text-[color:var(--ink)]">Gross annual salary</span>
            <span className="metadata block text-[12.5px] text-[color:var(--ink-3)]">Before tax. Salary sacrifice into pension reduces this.</span>
            <div className="relative mt-2">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--ink-3)]">£</span>
              <input
                inputMode="decimal" value={salary}
                onChange={e => setSalary(e.target.value)}
                aria-label="Gross annual salary"
                className="w-full rounded-md border border-rule bg-[color:var(--paper)] py-2.5 pl-7 pr-3 text-[16px] tabular-nums focus:border-[color:var(--green)] focus:outline-none"
              />
            </div>
          </label>

          <div>
            <p className="block text-[14px] font-semibold text-[color:var(--ink)]">Undergraduate plan</p>
            <select
              value={undergrad}
              onChange={e => setUndergrad(e.target.value as UndergradPlan)}
              aria-label="Undergraduate student loan plan"
              className="mt-2 w-full rounded-md border border-rule bg-[color:var(--paper)] px-3 py-2.5 text-[15px] focus:border-[color:var(--green)] focus:outline-none"
            >
              <option value="none">None</option>
              <option value="plan1">Plan 1 — pre-Sept 2012, or NI/Scotland (older)</option>
              <option value="plan2">Plan 2 — England/Wales 2012–Aug 2023</option>
              <option value="plan4">Plan 4 — Scotland from 2007</option>
              <option value="plan5">Plan 5 — England, courses starting Aug 2023+</option>
            </select>
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-md border border-rule bg-[color:var(--paper)] p-3">
            <input
              type="checkbox"
              checked={postgrad}
              onChange={e => setPostgrad(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[color:var(--green)]"
            />
            <span>
              <span className="block text-[14px] font-semibold text-[color:var(--ink)]">Postgraduate loan</span>
              <span className="metadata block text-[12.5px] text-[color:var(--ink-3)]">Masters or PhD loan. Repaid alongside any undergrad loan.</span>
            </span>
          </label>
        </div>

        <aside className="space-y-4">
          <div className="rounded-md border border-rule bg-[color:var(--green-soft)] p-6">
            <p className="metadata uppercase tracking-[0.18em] text-[color:var(--green-dark)]">Annual repayment</p>
            <p className="mt-2 font-serif-display text-[40px] leading-none tabular-nums text-[color:var(--green-dark)]">{formatGBP(result.total)}</p>
            <p className="metadata mt-2 text-[12.5px]">
              {formatGBP(result.monthly)} / month · {result.pctOfGross.toFixed(1)}% of gross
            </p>
          </div>

          {(result.ugRepay > 0 || result.pgRepay > 0) && (
            <div className="rounded-md border border-rule bg-white p-5">
              <p className="metadata uppercase tracking-[0.18em] text-[color:var(--ink-3)]">Working</p>
              <dl className="mt-3 space-y-2 text-[14.5px]">
                {undergrad !== 'none' && result.ugRepay > 0 && (
                  <div>
                    <div className="flex justify-between">
                      <dt>{STUDENT_LOAN[undergrad as StudentLoanPlan].label}</dt>
                      <dd className="tabular-nums">{formatGBP(result.ugRepay)}</dd>
                    </div>
                    <p className="metadata text-[12px] text-[color:var(--ink-3)]">
                      9% of {formatGBP(result.gross - result.ugThreshold)} (income above {formatGBP(result.ugThreshold)})
                    </p>
                  </div>
                )}
                {postgrad && result.pgRepay > 0 && (
                  <div className="pt-2 border-t border-rule">
                    <div className="flex justify-between">
                      <dt>Postgrad loan</dt>
                      <dd className="tabular-nums">{formatGBP(result.pgRepay)}</dd>
                    </div>
                    <p className="metadata text-[12px] text-[color:var(--ink-3)]">
                      6% of {formatGBP(result.gross - result.pgThreshold)} (income above {formatGBP(result.pgThreshold)})
                    </p>
                  </div>
                )}
              </dl>
            </div>
          )}
          {result.total === 0 && undergrad === 'none' && !postgrad && (
            <div className="rounded-md border border-rule bg-white p-5 text-[14px] text-[color:var(--ink-3)]">
              Select a plan to see repayments.
            </div>
          )}
          {result.total === 0 && (undergrad !== 'none' || postgrad) && (
            <div className="rounded-md border border-rule bg-white p-5 text-[14px] text-[color:var(--ink-2)]">
              You earn below the repayment threshold — nothing to repay this year.
            </div>
          )}
        </aside>
      </div>

      <details className="mt-8 border-t border-rule pt-6 text-[14.5px] leading-relaxed text-[color:var(--ink-2)]">
        <summary className="cursor-pointer font-semibold text-[color:var(--ink)]">How this is worked out</summary>
        <div className="mt-3 space-y-2">
          <p>
            UK student loans don&rsquo;t work like normal debt — they&rsquo;re a graduate tax. You repay <strong>9% of income above the plan threshold</strong> (6% for postgrad). It comes out of your payslip automatically.
          </p>
          <p>
            <strong>Plan thresholds ({TAX_YEAR}):</strong>
          </p>
          <ul className="ml-5 list-disc space-y-0.5 text-[13.5px]">
            <li>Plan 1: £26,065 — pre-2012 starters, NI/Scotland (older).</li>
            <li>Plan 2: £28,470 — England/Wales 2012 to Aug 2023.</li>
            <li>Plan 4: £32,745 — Scotland.</li>
            <li>Plan 5: £25,000 — England, new from Aug 2023.</li>
            <li>Postgrad: £21,000 — masters &amp; doctoral.</li>
          </ul>
          <p>
            Loans get written off eventually — Plan 1 after 25 years, Plan 2 after 30, Plan 5 after 40. Whether to overpay voluntarily depends on whether you&rsquo;ll clear the loan in full before write-off. For Plan 5 especially, many won&rsquo;t.
          </p>
        </div>
      </details>
    </section>
  )
}
