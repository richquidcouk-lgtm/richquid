'use client'

import { useMemo } from 'react'
import { useStateFromUrl } from '@/lib/url-state'
import ShareButton from './ShareButton'

const PA_BASE = 12570
const BASIC_LIMIT = 50270
const HIGHER_LIMIT = 125140
const PA_TAPER_THRESHOLD = 100000
const NI_PRIMARY = 12570
const NI_UPPER = 50270
const NI_MAIN = 0.08
const NI_UPPER_RATE = 0.02

function personalAllowance(gross: number): number {
  if (gross <= PA_TAPER_THRESHOLD) return PA_BASE
  const taper = Math.min(PA_BASE, Math.floor((gross - PA_TAPER_THRESHOLD) / 2))
  return Math.max(0, PA_BASE - taper)
}

function incomeTax(gross: number): number {
  const pa = personalAllowance(gross)
  let tax = 0
  const basicTop = Math.min(gross, BASIC_LIMIT)
  const basicTaxable = Math.max(0, basicTop - pa)
  tax += basicTaxable * 0.20

  if (gross > BASIC_LIMIT) {
    const higherTop = Math.min(gross, HIGHER_LIMIT)
    tax += (higherTop - BASIC_LIMIT) * 0.40
  }
  if (gross > HIGHER_LIMIT) {
    tax += (gross - HIGHER_LIMIT) * 0.45
  }
  return tax
}

function employeeNI(gross: number): number {
  if (gross <= NI_PRIMARY) return 0
  const mainBand = Math.min(gross, NI_UPPER) - NI_PRIMARY
  let ni = Math.max(0, mainBand) * NI_MAIN
  if (gross > NI_UPPER) ni += (gross - NI_UPPER) * NI_UPPER_RATE
  return ni
}

function parseAmount(v: string): number {
  const n = parseFloat(v.replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) && n >= 0 ? n : 0
}

function formatGBP(n: number, dp = 0): string {
  return n.toLocaleString('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: dp,
    minimumFractionDigits: dp,
  })
}

export default function SalarySacrificeCalculator() {
  const [salary, setSalary] = useStateFromUrl('salary', '45000')
  const [sacrificePct, setSacrificePct] = useStateFromUrl('pct', '5')

  const result = useMemo(() => {
    const gross = parseAmount(salary)
    const pct = Math.min(60, Math.max(0, parseAmount(sacrificePct)))
    const sacrifice = gross * (pct / 100)
    const newGross = Math.max(0, gross - sacrifice)

    const taxBefore = incomeTax(gross)
    const niBefore = employeeNI(gross)
    const takeHomeBefore = gross - taxBefore - niBefore

    const taxAfter = incomeTax(newGross)
    const niAfter = employeeNI(newGross)
    const takeHomeAfter = newGross - taxAfter - niAfter

    const taxSaved = taxBefore - taxAfter
    const niSaved = niBefore - niAfter
    const totalSaved = taxSaved + niSaved
    const takeHomeCost = takeHomeBefore - takeHomeAfter
    const intoPension = sacrifice
    const effectiveRate = sacrifice > 0 ? (1 - takeHomeCost / sacrifice) * 100 : 0

    return {
      gross,
      pct,
      sacrifice,
      taxBefore, niBefore, takeHomeBefore,
      taxAfter, niAfter, takeHomeAfter,
      taxSaved, niSaved, totalSaved,
      takeHomeCost,
      intoPension,
      effectiveRate,
    }
  }, [salary, sacrificePct])

  return (
    <section className="rounded-lg border border-rule bg-white p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="metadata uppercase tracking-[0.2em] text-[color:var(--green)]">2025/26 tax year · England, Wales &amp; NI</p>
        <ShareButton />
      </div>

      <div className="mt-4 grid gap-8 lg:grid-cols-2">
        <div className="space-y-5">
          <label className="block">
            <span className="block text-[14px] font-semibold text-[color:var(--ink)]">Gross salary</span>
            <span className="metadata block text-[12.5px] text-[color:var(--ink-3)]">Annual pay before any pension or tax.</span>
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

          <label className="block">
            <span className="block text-[14px] font-semibold text-[color:var(--ink)]">Sacrifice into pension</span>
            <span className="metadata block text-[12.5px] text-[color:var(--ink-3)]">Percentage of gross salary going into the pension scheme.</span>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={30}
                step={0.5}
                value={parseAmount(sacrificePct)}
                onChange={e => setSacrificePct(e.target.value)}
                aria-label="Salary sacrifice percentage"
                className="h-2 flex-1 cursor-pointer accent-[color:var(--green)]"
              />
              <div className="relative">
                <input
                  inputMode="decimal"
                  value={sacrificePct}
                  onChange={e => setSacrificePct(e.target.value)}
                  className="w-20 rounded-md border border-rule bg-[color:var(--paper)] py-2 pl-3 pr-7 text-right text-[16px] tabular-nums focus:border-[color:var(--green)] focus:outline-none"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--ink-3)]">%</span>
              </div>
            </div>
            <p className="metadata mt-2 text-[12.5px]">That&rsquo;s {formatGBP(result.sacrifice)} per year into your pension.</p>
          </label>

          <div className="rounded-md border border-rule bg-[color:var(--paper)] p-4">
            <p className="metadata uppercase tracking-[0.18em] text-[color:var(--ink-3)]">Without sacrifice</p>
            <dl className="mt-2 space-y-1 text-[14.5px]">
              <div className="flex justify-between"><dt>Income tax</dt><dd className="tabular-nums">{formatGBP(result.taxBefore)}</dd></div>
              <div className="flex justify-between"><dt>Employee NI</dt><dd className="tabular-nums">{formatGBP(result.niBefore)}</dd></div>
              <div className="mt-1 flex justify-between border-t border-rule pt-1 font-semibold"><dt>Take-home</dt><dd className="tabular-nums">{formatGBP(result.takeHomeBefore)}</dd></div>
            </dl>
          </div>

          <div className="rounded-md border border-rule bg-[color:var(--paper)] p-4">
            <p className="metadata uppercase tracking-[0.18em] text-[color:var(--ink-3)]">With {result.pct}% sacrifice</p>
            <dl className="mt-2 space-y-1 text-[14.5px]">
              <div className="flex justify-between"><dt>Income tax</dt><dd className="tabular-nums">{formatGBP(result.taxAfter)}</dd></div>
              <div className="flex justify-between"><dt>Employee NI</dt><dd className="tabular-nums">{formatGBP(result.niAfter)}</dd></div>
              <div className="mt-1 flex justify-between border-t border-rule pt-1 font-semibold"><dt>Take-home</dt><dd className="tabular-nums">{formatGBP(result.takeHomeAfter)}</dd></div>
            </dl>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-md border border-rule bg-[color:var(--green-soft)] p-6">
            <p className="metadata uppercase tracking-[0.18em] text-[color:var(--green-dark)]">You save in tax + NI</p>
            <p className="mt-2 font-serif-display text-[40px] leading-none tabular-nums text-[color:var(--green-dark)]">
              {formatGBP(result.totalSaved)}
            </p>
            <p className="metadata mt-2 text-[12.5px]">
              {formatGBP(result.taxSaved)} income tax · {formatGBP(result.niSaved)} NI
            </p>
          </div>

          <div className="rounded-md border border-rule bg-white p-6">
            <p className="metadata uppercase tracking-[0.18em] text-[color:var(--ink-3)]">Into your pension</p>
            <p className="mt-2 font-serif-display text-[32px] leading-none tabular-nums">{formatGBP(result.intoPension)}</p>
            <p className="metadata mt-2 text-[12.5px]">
              For only {formatGBP(result.takeHomeCost)} less in your bank.
            </p>
            <div className="mt-4 border-t border-rule pt-3">
              <p className="metadata text-[12.5px]">
                Every £1 sacrificed costs you just <strong className="text-[color:var(--ink)]">£{(1 - result.effectiveRate / 100).toFixed(2)}</strong> in take-home.
              </p>
            </div>
          </div>
        </aside>
      </div>

      <details className="mt-8 border-t border-rule pt-6 text-[14.5px] leading-relaxed text-[color:var(--ink-2)]">
        <summary className="cursor-pointer font-semibold text-[color:var(--ink)]">How this is worked out</summary>
        <div className="mt-3 space-y-2">
          <p>
            Salary sacrifice lowers your gross pay before tax and National Insurance, so HMRC sees a smaller salary. The full sacrificed amount goes into your pension.
          </p>
          <p>
            <strong>2025/26 bands used:</strong> personal allowance £12,570 (tapered from £100k); basic rate 20% to £50,270; higher rate 40% to £125,140; additional rate 45% above. Employee NI: 8% between £12,570 and £50,270, 2% above.
          </p>
          <p>
            This shows employee-side savings only. Your employer also saves 15% in employer NI on the sacrificed amount — some schemes pass that into your pension too, but most don&rsquo;t.
          </p>
          <p>
            Scottish income tax bands differ. If you&rsquo;re a Scottish taxpayer, the NI numbers are right but income tax will be a little different.
          </p>
        </div>
      </details>
    </section>
  )
}
