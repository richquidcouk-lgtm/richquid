'use client'

import { useMemo, useState } from 'react'
import {
  TAX_YEAR, formatGBP, parseAmount,
  incomeTax, employeeNI,
  studentLoanRepayment,
  STUDENT_LOAN, type StudentLoanPlan,
} from '@/lib/uk-tax'

type PensionMode = 'none' | 'salary-sacrifice' | 'relief-at-source'

export default function TakeHomePayCalculator() {
  const [salary, setSalary] = useState('40000')
  const [scotland, setScotland] = useState(false)
  const [pensionMode, setPensionMode] = useState<PensionMode>('salary-sacrifice')
  const [pensionPct, setPensionPct] = useState('5')
  const [studentPlan, setStudentPlan] = useState<StudentLoanPlan | 'none'>('none')

  const result = useMemo(() => {
    const gross = parseAmount(salary)
    const pPct = Math.min(60, Math.max(0, parseAmount(pensionPct)))
    const pensionContribution = pensionMode === 'none' ? 0 : gross * (pPct / 100)
    // Salary sacrifice lowers gross before tax/NI; relief-at-source pays from net.
    const taxableGross = pensionMode === 'salary-sacrifice'
      ? Math.max(0, gross - pensionContribution)
      : gross

    const tax = incomeTax(taxableGross, scotland)
    const ni = employeeNI(taxableGross)
    const loanRepay = studentPlan === 'none' ? 0 : studentLoanRepayment(taxableGross, studentPlan)

    const pensionFromNet = pensionMode === 'relief-at-source' ? pensionContribution * 0.80 : 0
    const takeHome = taxableGross - tax - ni - loanRepay - pensionFromNet
    return {
      gross, taxableGross, tax, ni, loanRepay, pensionContribution, pensionFromNet, takeHome,
      monthly: takeHome / 12,
      weekly: takeHome / 52,
    }
  }, [salary, scotland, pensionMode, pensionPct, studentPlan])

  return (
    <section className="rounded-lg border border-rule bg-white p-6 sm:p-8">
      <p className="metadata uppercase tracking-[0.2em] text-[color:var(--green)]">{TAX_YEAR} tax year</p>

      <div className="mt-4 grid gap-8 lg:grid-cols-2">
        <div className="space-y-5">
          <label className="block">
            <span className="block text-[14px] font-semibold text-[color:var(--ink)]">Gross annual salary</span>
            <span className="metadata block text-[12.5px] text-[color:var(--ink-3)]">Before pension, tax and NI.</span>
            <div className="relative mt-2">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--ink-3)]">£</span>
              <input
                inputMode="decimal"
                value={salary}
                onChange={e => setSalary(e.target.value)}
                aria-label="Gross annual salary"
                className="w-full rounded-md border border-rule bg-[color:var(--paper)] py-2.5 pl-7 pr-3 text-[16px] tabular-nums focus:border-[color:var(--green)] focus:outline-none"
              />
            </div>
          </label>

          <div>
            <p className="block text-[14px] font-semibold text-[color:var(--ink)]">Tax region</p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setScotland(false)}
                className={`rounded-full border px-4 py-1.5 text-[13.5px] font-semibold transition ${
                  !scotland ? 'border-[color:var(--green)] bg-[color:var(--green)] text-[color:var(--paper)]'
                            : 'border-rule bg-white text-[color:var(--ink-2)] hover:border-[color:var(--green)]'
                }`}
              >England, Wales &amp; NI</button>
              <button
                type="button"
                onClick={() => setScotland(true)}
                className={`rounded-full border px-4 py-1.5 text-[13.5px] font-semibold transition ${
                  scotland ? 'border-[color:var(--green)] bg-[color:var(--green)] text-[color:var(--paper)]'
                           : 'border-rule bg-white text-[color:var(--ink-2)] hover:border-[color:var(--green)]'
                }`}
              >Scotland</button>
            </div>
          </div>

          <div>
            <p className="block text-[14px] font-semibold text-[color:var(--ink)]">Pension</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {([
                ['none', 'None'],
                ['salary-sacrifice', 'Salary sacrifice'],
                ['relief-at-source', 'Relief at source'],
              ] as const).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPensionMode(key)}
                  className={`rounded-md border px-3 py-2 text-[13px] font-semibold transition ${
                    pensionMode === key ? 'border-[color:var(--green)] bg-[color:var(--green-soft)] text-[color:var(--green-dark)]'
                                       : 'border-rule bg-white text-[color:var(--ink-2)] hover:border-[color:var(--green)]'
                  }`}
                >{label}</button>
              ))}
            </div>
            {pensionMode !== 'none' && (
              <div className="mt-3 flex items-center gap-3">
                <input
                  type="range" min={0} max={30} step={0.5}
                  value={parseAmount(pensionPct)}
                  onChange={e => setPensionPct(e.target.value)}
                  aria-label="Pension contribution percentage"
                  className="h-2 flex-1 cursor-pointer accent-[color:var(--green)]"
                />
                <div className="relative">
                  <input
                    inputMode="decimal" value={pensionPct}
                    onChange={e => setPensionPct(e.target.value)}
                    className="w-20 rounded-md border border-rule bg-[color:var(--paper)] py-2 pl-3 pr-7 text-right text-[16px] tabular-nums focus:border-[color:var(--green)] focus:outline-none"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--ink-3)]">%</span>
                </div>
              </div>
            )}
          </div>

          <div>
            <p className="block text-[14px] font-semibold text-[color:var(--ink)]">Student loan</p>
            <select
              value={studentPlan}
              onChange={e => setStudentPlan(e.target.value as StudentLoanPlan | 'none')}
              aria-label="Student loan plan"
              className="mt-2 w-full rounded-md border border-rule bg-[color:var(--paper)] px-3 py-2.5 text-[15px] focus:border-[color:var(--green)] focus:outline-none"
            >
              <option value="none">No student loan</option>
              {(Object.keys(STUDENT_LOAN) as StudentLoanPlan[]).map(k => (
                <option key={k} value={k}>{STUDENT_LOAN[k].label}</option>
              ))}
            </select>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-md border border-rule bg-[color:var(--green-soft)] p-6">
            <p className="metadata uppercase tracking-[0.18em] text-[color:var(--green-dark)]">Annual take-home</p>
            <p className="mt-2 font-serif-display text-[44px] leading-none tabular-nums text-[color:var(--green-dark)]">
              {formatGBP(result.takeHome)}
            </p>
            <p className="metadata mt-3 text-[13px]">
              {formatGBP(result.monthly)} / month · {formatGBP(result.weekly)} / week
            </p>
          </div>

          <div className="rounded-md border border-rule bg-white p-5">
            <p className="metadata uppercase tracking-[0.18em] text-[color:var(--ink-3)]">Where it goes</p>
            <dl className="mt-3 space-y-2 text-[14.5px]">
              <div className="flex justify-between"><dt>Gross salary</dt><dd className="tabular-nums">{formatGBP(result.gross)}</dd></div>
              {result.pensionContribution > 0 && (
                <div className="flex justify-between text-[color:var(--ink-2)]">
                  <dt>− Pension contribution</dt>
                  <dd className="tabular-nums">{formatGBP(result.pensionContribution)}</dd>
                </div>
              )}
              <div className="flex justify-between text-[color:var(--ink-2)]"><dt>− Income tax</dt><dd className="tabular-nums">{formatGBP(result.tax)}</dd></div>
              <div className="flex justify-between text-[color:var(--ink-2)]"><dt>− Employee NI</dt><dd className="tabular-nums">{formatGBP(result.ni)}</dd></div>
              {result.loanRepay > 0 && (
                <div className="flex justify-between text-[color:var(--ink-2)]"><dt>− Student loan</dt><dd className="tabular-nums">{formatGBP(result.loanRepay)}</dd></div>
              )}
              <div className="flex justify-between border-t border-rule pt-2 font-semibold"><dt>Take-home</dt><dd className="tabular-nums">{formatGBP(result.takeHome)}</dd></div>
            </dl>
          </div>
        </aside>
      </div>

      <details className="mt-8 border-t border-rule pt-6 text-[14.5px] leading-relaxed text-[color:var(--ink-2)]">
        <summary className="cursor-pointer font-semibold text-[color:var(--ink)]">How this is worked out</summary>
        <div className="mt-3 space-y-2">
          <p>
            <strong>Salary sacrifice</strong> reduces the salary HMRC sees, so income tax and NI both drop. <strong>Relief at source</strong> is paid from your net pay; HMRC tops it up by 25% inside the pension (basic-rate relief is automatic; higher-rate is claimed via Self Assessment).
          </p>
          <p>
            Bands for {TAX_YEAR}: personal allowance £12,570 (tapered from £100k); for England/Wales/NI 20% to £50,270, 40% to £125,140, 45% above. Scotland uses six bands from 19% to 48%. Employee NI is 8% between £12,570–£50,270 and 2% above.
          </p>
          <p>
            Student loan repayments are 9% of income above the plan threshold (6% for Postgrad). Plan 5 is for students starting after Aug 2023.
          </p>
        </div>
      </details>
    </section>
  )
}
