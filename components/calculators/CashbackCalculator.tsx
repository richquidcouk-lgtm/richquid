'use client'
import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { calculateCashback } from '@/lib/cashback'
import { trackToolEvent } from '@/lib/analytics'

const fields = [
  { key: 'monthlySpend', label: 'Eligible spending each month (£)', hint: 'Only payments that earn this reward. Assumes the same spending in each month.', value: '1000', max: undefined },
  { key: 'rate', label: 'Cashback rate (%)', hint: 'A flat rate, not an APR. Enter 1 for 1%.', value: '1', max: 100 },
  { key: 'monthlyCap', label: 'Maximum cashback each month (£)', hint: 'Leave blank for no cap. Enter 0 if no reward can be earned.', value: '10', max: undefined },
  { key: 'monthlyFee', label: 'Monthly account fee (£)', hint: 'Charged for all twelve months, even when you do not qualify for rewards.', value: '2', max: undefined },
  { key: 'annualFee', label: 'Additional annual fee (£)', hint: 'Do not repeat a fee already included above.', value: '0', max: undefined },
  { key: 'qualifyingMonths', label: 'Months you qualify for rewards', hint: 'A whole number from 0 to 12. Does not reduce the fees.', value: '12', max: 12 },
  { key: 'bonus', label: 'One-off bonus you expect to receive (£)', hint: 'First year only. Use 0 unless you meet all the bonus conditions.', value: '0', max: undefined },
  { key: 'annualCosts', label: 'Other annual costs or interest (£)', hint: 'Your own estimate. This tool does not calculate borrowing interest.', value: '0', max: undefined },
] as const
type Key = typeof fields[number]['key']
type Draft = Record<Key, string>
const defaults = Object.fromEntries(fields.map(field => [field.key, field.value])) as Draft
const money = (value: number) => value.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })

export default function CashbackCalculator() {
  const [draft, setDraft] = useState<Draft>(defaults)
  const [result, setResult] = useState<ReturnType<typeof calculateCashback> | null>(null)
  const [error, setError] = useState('')
  const [changed, setChanged] = useState(false)
  const [started, setStarted] = useState(false)
  function edit(key: Key, value: string) {
    if (!started) { setStarted(true); trackToolEvent('calculator_start', 'net-cashback-calculator') }
    setDraft(previous => ({ ...previous, [key]: value })); setChanged(true)
  }
  function calculate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      const values = Object.fromEntries(fields.map(field => [field.key, Number(draft[field.key])])) as Record<Key, number>
      setResult(calculateCashback({ ...values, monthlyCap: draft.monthlyCap.trim() === '' ? null : Number(draft.monthlyCap) }))
      setChanged(false); setError(''); trackToolEvent('calculator_complete', 'net-cashback-calculator')
    } catch (cause) { setResult(null); setError(cause instanceof Error ? cause.message : 'Please check your inputs.') }
  }
  return <section className="rounded-lg border border-rule bg-white p-5 sm:p-8">
    <p className="mb-6 leading-relaxed">Compare a flat-rate cashback offer using your usual spending. The starting figures are an illustration, not a bank offer. All calculations run in your browser.</p>
    <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
      <form onSubmit={calculate} className="space-y-5">
        {fields.map(field => <div key={field.key}><label htmlFor={`cashback-${field.key}`} className="block text-sm font-semibold">{field.label}</label><p id={`cashback-${field.key}-help`} className="mt-1 text-sm text-[color:var(--ink-3)]">{field.hint}</p><input id={`cashback-${field.key}`} type="number" inputMode="decimal" min="0" max={field.max} step={field.key === 'qualifyingMonths' ? '1' : '0.01'} required={field.key !== 'monthlyCap'} value={draft[field.key]} onChange={event => edit(field.key, event.target.value)} aria-describedby={`cashback-${field.key}-help`} className="mt-2 w-full rounded border border-rule p-3 text-base focus:outline-2 focus:outline-[color:var(--green)]"/></div>)}
        <button className="w-full rounded bg-[color:var(--green)] p-3 font-semibold text-white" type="submit">Calculate net cashback</button>
        <button type="button" className="min-h-11 underline" onClick={() => { setDraft(defaults); setResult(null); setError(''); setChanged(false) }}>Reset example</button>
      </form>
      <aside aria-live="polite" aria-atomic="true" className="self-start rounded border border-rule bg-[color:var(--paper)] p-5 lg:sticky lg:top-6">
        <h2 className="font-serif-display text-2xl">What is it worth?</h2>
        {error && <p role="alert" className="mt-4 text-red-800">{error}</p>}
        {!result && <p className="mt-4 text-sm leading-relaxed">Enter an offer’s terms and select Calculate. You will see recurring value and first-year value separately.</p>}
        {result && <>{changed && <p className="mt-4 font-semibold">Inputs changed. Calculate again to update these results.</p>}
          <dl className="mt-5 space-y-5"><div><dt>Recurring annual net value</dt><dd className="mt-1 font-serif-display text-3xl">{money(result.recurringNet)}</dd></div><div><dt>First year, including bonus</dt><dd className="mt-1 font-serif-display text-2xl">{money(result.firstYearNet)}</dd></div><div><dt>Annual cashback before costs</dt><dd>{money(result.annualReward)}</dd></div><div><dt>Total account fees per year</dt><dd>{money(result.annualFees)}</dd></div><div><dt>Net reward as a share of annual spending</dt><dd>{result.effectiveRate === null ? 'Not applicable: no spending' : `${result.effectiveRate.toFixed(2)}%`}</dd></div></dl>
          <p className="mt-5 text-sm leading-relaxed">{result.breakEvenMonthlySpend === null ? 'The rate, cap or qualifying months cannot cover your recurring costs under these assumptions.' : `Monthly eligible spending to cover recurring costs: ${money(result.breakEvenMonthlySpend)}. This excludes the one-off bonus and is not a spending recommendation.`}</p>
          {result.recurringNet < 0 && <p className="mt-4 font-semibold text-red-800">Costs exceed the ongoing reward in this example.</p>}
          <p className="mt-5 text-sm">Results are estimates rounded to pennies. Provider rounding may differ.</p></>}
      </aside>
    </div>
    <div className="mt-8 border-t border-rule pt-6 text-sm leading-relaxed"><h2 className="font-serif-display text-2xl">How we calculate the reward</h2><p className="mt-3">Monthly cashback is eligible spending × the rate, limited by the monthly cap. Multiply by qualifying months, then subtract twelve monthly fees, any annual fee and your entered other costs. Add the bonus only to the first-year result.</p><p className="mt-3">Example: £1,500 a month at 1%, capped at £10, gives £120 cashback over twelve qualifying months. A £2 monthly fee reduces this to £96. A £100 one-off bonus makes the first-year value £196; recurring value remains £96.</p><p className="mt-3">This model does not cover fixed monthly rewards, multiple spending bands, changing monthly spending, foreign-exchange costs you have not entered, or promotional rates that change within the year. A monthly cap cannot be averaged across quieter months. Only include a bonus you qualify for.</p><p className="mt-3">Read the <Link className="underline" href="/guides/uk-cashback-current-accounts">current-account guide</Link> or <Link className="underline" href="/guides/uk-cashback-credit-cards-explained">credit-card guide</Link> before comparing products.</p></div>
  </section>
}
