'use client'

import AmountInput from './AmountInput'

import { useMemo, useState } from 'react'
import { PENSION_ANNUAL_ALLOWANCE, formatGBP, parseAmount } from '@/lib/uk-tax'

type FundType = 'sipp' | 'workplace' | 'isa'
type TaxBand = 'basic' | 'higher' | 'additional'

const RETIREMENT_AGE = 67

const FUND_TYPES: { key: FundType; label: string; hint: string }[] = [
  { key: 'sipp', label: 'SIPP', hint: 'Self-invested personal pension — relief added by the provider, more reclaimed via Self Assessment if you&rsquo;re higher/additional rate.' },
  { key: 'workplace', label: 'Workplace pension (relief at source)', hint: 'Only for schemes adding basic-rate relief to a net payment. Excludes net-pay and salary-sacrifice schemes.' },
  { key: 'isa', label: 'ISA', hint: 'No pension tax relief, but the money stays accessible any time — shown here for comparison.' },
]

const BAND_RATES: Record<TaxBand, number> = { basic: 0.20, higher: 0.40, additional: 0.45 }

function futureValue(pot: number, annualContribution: number, years: number, annualGrowthRate: number): number {
  if (years <= 0) return pot
  const r = annualGrowthRate / 100
  if (r === 0) return pot + annualContribution * years
  const potGrowth = pot * Math.pow(1 + r, years)
  const contributionGrowth = annualContribution * ((Math.pow(1 + r, years) - 1) / r)
  return potGrowth + contributionGrowth
}

export default function PensionContributionTracker() {
  const [age, setAge] = useState('30')
  const [currentPot, setCurrentPot] = useState('')
  const [contribution, setContribution] = useState('')
  const [growthRate, setGrowthRate] = useState('5')
  const [fundType, setFundType] = useState<FundType>('sipp')
  const [taxBand, setTaxBand] = useState<TaxBand>('basic')

  const result = useMemo(() => {
    const currentAge = Math.max(0, Math.min(100, parseInt(age, 10) || 0))
    const years = Math.max(0, RETIREMENT_AGE - currentAge)
    const pot = parseAmount(currentPot)
    const netContribution = parseAmount(contribution)
    const rate = parseAmount(growthRate)

    const isPension = fundType !== 'isa'
    const bandRate = BAND_RATES[taxBand]

    // Relief-at-source mechanic: basic-rate relief (20%) is always added by the
    // provider regardless of your band, grossing up the net amount you pay in.
    // Higher/additional-rate taxpayers reclaim the difference via Self Assessment.
    const grossContribution = isPension ? netContribution / 0.8 : netContribution
    const basicRelief = isPension ? grossContribution - netContribution : 0
    const extraReclaim = isPension && bandRate > 0.20 ? grossContribution * (bandRate - 0.20) : 0
    const totalRelief = basicRelief + extraReclaim

    const projectedValue = futureValue(pot, grossContribution, years, rate)
    const remainingAllowance = Math.max(0, PENSION_ANNUAL_ALLOWANCE - grossContribution)
    const overAllowance = grossContribution > PENSION_ANNUAL_ALLOWANCE

    return { years, grossContribution, basicRelief, extraReclaim, totalRelief, projectedValue, remainingAllowance, overAllowance, isPension }
  }, [age, currentPot, contribution, growthRate, fundType, taxBand])

  return (
    <section className="rounded-lg border border-rule bg-white p-6 sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <p className="metadata uppercase tracking-[0.2em] text-[color:var(--green)]">Your details</p>

          <label className="block">
            <span className="block text-[14px] font-semibold text-[color:var(--ink)]">Current age</span>
            <input
              inputMode="numeric"
              value={age}
              onChange={e => setAge(e.target.value)}
              placeholder="30"
              aria-label="Current age"
              className="mt-2 w-full rounded-md border border-rule bg-[color:var(--paper)] py-2.5 px-3 text-[16px] tabular-nums focus:border-[color:var(--green)] focus:outline-none"
            />
            <span className="metadata mt-1 block text-[12px] text-[color:var(--ink-3)]">Projection runs to age {RETIREMENT_AGE}, an illustrative target age, not a personalised State Pension date.</span>
          </label>

          <label className="block">
            <span className="block text-[14px] font-semibold text-[color:var(--ink)]">Current pot value (optional)</span>
            <div className="relative mt-2">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--ink-3)]">£</span>
              <AmountInput
                inputMode="decimal"
                value={currentPot}
                onChange={e => setCurrentPot(e.target.value)}
                placeholder="0"
                aria-label="Current pot value"
                className="w-full rounded-md border border-rule bg-[color:var(--paper)] py-2.5 pl-7 pr-3 text-[16px] tabular-nums focus:border-[color:var(--green)] focus:outline-none"
              />
            </div>
          </label>

          <label className="block">
            <span className="block text-[14px] font-semibold text-[color:var(--ink)]">Your contribution per year</span>
            <span className="metadata block text-[12.5px] text-[color:var(--ink-3)]">The net amount that actually leaves your bank account.</span>
            <div className="relative mt-2">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--ink-3)]">£</span>
              <AmountInput
                inputMode="decimal"
                value={contribution}
                onChange={e => setContribution(e.target.value)}
                placeholder="0"
                aria-label="Annual contribution"
                className="w-full rounded-md border border-rule bg-[color:var(--paper)] py-2.5 pl-7 pr-3 text-[16px] tabular-nums focus:border-[color:var(--green)] focus:outline-none"
              />
            </div>
          </label>

          <label className="block">
            <span className="block text-[14px] font-semibold text-[color:var(--ink)]">Assumed annual growth</span>
            <div className="relative mt-2">
              <AmountInput
                inputMode="decimal"
                value={growthRate}
                onChange={e => setGrowthRate(e.target.value)}
                placeholder="5"
                aria-label="Assumed annual growth rate"
                className="w-full rounded-md border border-rule bg-[color:var(--paper)] py-2.5 pl-3 pr-8 text-[16px] tabular-nums focus:border-[color:var(--green)] focus:outline-none"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--ink-3)]">%</span>
            </div>
          </label>

          <div className="rounded-md border border-rule bg-[color:var(--paper)] p-5">
            <p className="metadata uppercase tracking-[0.18em] text-[color:var(--ink-3)]">Where you&rsquo;re contributing</p>
            <div className="mt-3 flex flex-col gap-3">
              {FUND_TYPES.map(f => (
                <label key={f.key} className="flex cursor-pointer items-start gap-2.5">
                  <input
                    type="radio"
                    name="fund-type"
                    checked={fundType === f.key}
                    onChange={() => setFundType(f.key)}
                    className="mt-1"
                  />
                  <span>
                    <span className="block text-[14px] font-semibold text-[color:var(--ink)]">{f.label}</span>
                    <span className="metadata block text-[12px] text-[color:var(--ink-3)]">{f.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {result.isPension && (
            <div className="rounded-md border border-rule bg-[color:var(--paper)] p-5">
              <p className="metadata uppercase tracking-[0.18em] text-[color:var(--ink-3)]">Your tax band</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(['basic', 'higher', 'additional'] as TaxBand[]).map(b => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setTaxBand(b)}
                    className={`rounded-full border px-4 py-1.5 text-[13.5px] font-semibold capitalize transition ${
                      taxBand === b
                        ? 'border-[color:var(--green)] bg-[color:var(--green)] text-[color:var(--paper)]'
                        : 'border-rule bg-white text-[color:var(--ink-2)] hover:border-[color:var(--green)]'
                    }`}
                  >
                    {b} rate
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="rounded-md border border-rule bg-[color:var(--paper)] p-6">
          <p className="metadata uppercase tracking-[0.18em] text-[color:var(--ink-3)]">Projected value at {RETIREMENT_AGE}</p>
          <p className="mt-2 font-serif-display text-[36px] leading-none tabular-nums">{formatGBP(result.projectedValue)}</p>
          <p className="metadata mt-1 text-[12.5px]">{result.years} years of growth at {growthRate || 0}%/year</p>

          {result.isPension && (
            <div className="mt-5 border-t border-rule pt-5">
              <p className="metadata uppercase tracking-[0.18em] text-[color:var(--green)]">Tax relief this year</p>
              <p className="mt-1 font-serif-display text-[24px] tabular-nums text-[color:var(--green-dark)]">{formatGBP(result.totalRelief, 2)}</p>
              <p className="metadata mt-2 text-[12.5px]">
                {formatGBP(result.basicRelief, 2)} added automatically
                {result.extraReclaim > 0 && <> · {formatGBP(result.extraReclaim, 2)} more reclaimable via Self Assessment</>}
              </p>
            </div>
          )}

          <div className="mt-5 border-t border-rule pt-5">
            <p className="metadata uppercase tracking-[0.18em] text-[color:var(--ink-3)]">Gross contribution this year</p>
            <p className="mt-1 text-[18px] font-semibold tabular-nums">{formatGBP(result.grossContribution, 2)}</p>
            {result.isPension && (
              <p className="metadata mt-2 text-[12.5px]">
                {result.overAllowance
                  ? `Over the £${(PENSION_ANNUAL_ALLOWANCE / 1000).toFixed(0)}k standard annual allowance — check carry-forward or the tapered allowance if your adjusted income is above £260,000.`
                  : `${formatGBP(result.remainingAllowance)} of your £${(PENSION_ANNUAL_ALLOWANCE / 1000).toFixed(0)}k annual allowance left this year.`}
              </p>
            )}
          </div>
        </aside>
      </div>

      <p className="mt-5 text-sm">Assumes contributions qualify for relief at the selected rate in full, with enough relevant earnings and tax paid. Scottish relief rates, employer contributions, pension withdrawal tax, inflation and charges are not modelled. Growth is an assumed non-negative rate, not a forecast.</p>
      <details className="mt-8 border-t border-rule pt-6 text-[14.5px] leading-relaxed text-[color:var(--ink-2)]">
        <summary className="cursor-pointer font-semibold text-[color:var(--ink)]">How this is worked out</summary>
        <div className="mt-3 space-y-2">
          <p>
            For every £80 you pay into a SIPP or workplace pension, the provider adds £20 of basic-rate relief automatically — so your £80 becomes a £100 gross contribution. Higher-rate taxpayers can reclaim a further 20% (up to £20 more), and additional-rate taxpayers a further 25%, both via Self Assessment.
          </p>
          <p>
            ISA contributions get no pension tax relief — what you pay in is what goes in — but the money stays accessible at any time, unlike a pension, which is normally locked until age 55 (rising to 57 from 2028).
          </p>
          <p>
            The projection compounds your current pot and gross annual contribution at a constant assumed growth rate to age {RETIREMENT_AGE}. Real returns vary year to year and this isn&rsquo;t a forecast of actual future performance.
          </p>
          <p>
            The standard annual allowance is £60,000 for 2026/27, covering your contributions, your employer&rsquo;s, and tax relief combined, across all your pensions. It tapers down to £10,000 for adjusted income above £260,000, and unused allowance can be carried forward up to three years. See our <a href="/guides/what-is-the-annual-allowance-for-pension-contributions" className="underline underline-offset-4 hover:text-[color:var(--green)]">pension annual allowance guide</a> for the full rules.
          </p>
        </div>
      </details>
    </section>
  )
}
