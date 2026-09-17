'use client'

import { useState } from 'react'
import AmountInput from './AmountInput'
import { TAX_YEAR, parseAmount, formatGBP, savingsTax } from '@/lib/uk-tax'

export default function SavingsTaxCalculator() {
  const [income, setIncome] = useState('30000')
  const [savings, setSavings] = useState('20000')
  const [rate, setRate] = useState('4')
  const interest = parseAmount(savings) * parseAmount(rate) / 100
  const result = savingsTax(parseAmount(income), interest)
  const fields = [
    { label: 'Other annual income before personal allowance', value: income, set: setIncome, hint: 'Employment, pension and other non-savings income. Excludes dividends and ISA income.' },
    { label: 'Savings outside ISAs', value: savings, set: setSavings, hint: 'Assumes this balance stays invested for one year. Exclude tax-free accounts and Premium Bonds.' },
    { label: 'Annual interest rate (%)', value: rate, set: setRate, hint: 'Enter the AER as a percentage, for example 4 for 4%.' },
  ]
  return <section className="rounded-lg border border-rule bg-white p-6 sm:p-8">
    <p className="metadata">{TAX_YEAR} tax year · UK savings-income bands</p>
    <div className="mt-5 grid gap-8 md:grid-cols-2">
      <div className="space-y-5">{fields.map(field => <label key={field.label} className="block">
        <span className="block font-semibold">{field.label}</span>
        <span className="mb-2 block text-sm text-[color:var(--ink-2)]">{field.hint}</span>
        <AmountInput inputMode="decimal" aria-label={field.label} value={field.value} onChange={event => field.set(event.target.value)} className="w-full rounded border border-rule p-3" />
      </label>)}</div>
      <aside className="rounded border border-rule bg-[color:var(--paper)] p-5" aria-live="polite" aria-atomic="true">
        <h2 className="font-serif-display text-2xl">Estimated tax on interest</h2>
        <p className="my-4 text-3xl">{formatGBP(result.interestTax, 2)}</p>
        <dl className="space-y-3 text-sm">
          <div><dt>Annual interest</dt><dd>{formatGBP(interest, 2)}</dd></div>
          <div><dt>Personal Savings Allowance</dt><dd>{formatGBP(result.psa)}</dd></div>
          <div><dt>Interest using the starting rate for savings</dt><dd>{formatGBP(result.startingRate, 2)}</dd></div>
          <div><dt>Interest taxable above available allowances</dt><dd>{formatGBP(result.taxableInterest, 2)}</dd></div>
        </dl>
      </aside>
    </div>
    <section className="mt-8 border-t border-rule pt-5 text-sm leading-relaxed">
      <h2 className="font-semibold">How the estimate works</h2>
      <p className="mt-2">Unused personal allowance is applied before the starting rate for savings and the Personal Savings Allowance. Interest counts when determining your tax band, even when covered by a savings allowance. Amounts spanning bands are taxed separately.</p>
      <p className="mt-2">Example: £30,000 of other income and £20,000 earning 4% produce £800 of interest, within a £1,000 Personal Savings Allowance, so the estimated interest tax is £0.</p>
      <p className="mt-2">This models interest tax only, not extra tax on other income from personal-allowance tapering. Dividends, pension relief, marriage allowance, non-resident cases and special tax codes are excluded. ISA interest is excluded. Actual interest depends on balance changes and the provider’s terms.</p>
      <a className="mt-3 inline-block underline" href="https://www.gov.uk/apply-tax-free-interest-on-savings">Check HMRC’s savings tax guidance</a>
    </section>
  </section>
}
