import { personalAllowance, BASIC_TAXABLE_BAND } from './uk-tax'

export const CGT_AEA = 3000
export const CGT_BASIC = 0.18
export const CGT_HIGHER = 0.24
export const DIV_ALLOWANCE = 500
export const DIV_BASIC = 0.1075
export const DIV_HIGHER = 0.3575
export const DIV_ADDITIONAL = 0.3935

export function computeCGT(income: number, gain: number) {
  const taxableGain = Math.max(0, gain - CGT_AEA)
  if (taxableGain === 0) return { tax: 0, atBasic: 0, atHigher: 0, basicRemaining: 0, taxableGain }
  // Income uses up basic-rate band first
  const pa = personalAllowance(income)
  const incomeAfterPA = Math.max(0, income - pa)
  const basicBandSize = BASIC_TAXABLE_BAND
  const basicUsed = Math.min(incomeAfterPA, basicBandSize)
  const basicRemaining = Math.max(0, basicBandSize - basicUsed)
  const atBasic = Math.min(taxableGain, basicRemaining)
  const atHigher = taxableGain - atBasic
  const tax = atBasic * CGT_BASIC + atHigher * CGT_HIGHER
  return { tax, atBasic, atHigher, basicRemaining, taxableGain }
}

export function computeDividendTax(nonDivIncome: number, dividends: number) {
  const pa = personalAllowance(nonDivIncome + dividends)
  const unusedPA = Math.max(0, pa - nonDivIncome)
  const dividendsAfterPA = Math.max(0, dividends - unusedPA)
  const taxableDiv = Math.max(0, dividendsAfterPA - DIV_ALLOWANCE)
  if (taxableDiv === 0) return { tax: 0, atBasic: 0, atHigher: 0, atAdditional: 0, taxableDiv }
  // Treat the £500 allowance as using up tax bands too (it does technically). Simplified: place taxable dividends on top of non-div income.
  const incomeAfterPA = Math.max(0, nonDivIncome - pa)
  const basicEnd = BASIC_TAXABLE_BAND
  const higherEnd = 125140

  // The £500 dividend allowance sits in whichever band the first £500 of dividends falls into.
  // We assume the allowance is consumed before taxing — this matches HMRC's behaviour.
  let position = incomeAfterPA + Math.min(dividendsAfterPA, DIV_ALLOWANCE) // start of taxable dividend tax
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
