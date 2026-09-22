export type CashbackInputs = {
  monthlySpend: number
  rate: number
  monthlyCap: number | null
  monthlyFee: number
  annualFee: number
  bonus: number
  qualifyingMonths: number
  annualCosts: number
}

/** A single flat-rate reward. Monthly cap applies before fees; fees run for all 12 months. */
export function calculateCashback(input: CashbackInputs) {
  const values = [input.monthlySpend, input.rate, input.monthlyFee, input.annualFee, input.bonus, input.qualifyingMonths, input.annualCosts]
  if (values.some(value => !Number.isFinite(value) || value < 0) || input.rate > 100 || input.qualifyingMonths > 12 || !Number.isInteger(input.qualifyingMonths)
    || (input.monthlyCap !== null && (!Number.isFinite(input.monthlyCap) || input.monthlyCap < 0))) throw new Error('Enter valid non-negative amounts, a rate up to 100%, and 0–12 whole qualifying months.')
  const monthlyUncapped = input.monthlySpend * input.rate / 100
  const monthlyReward = Math.min(monthlyUncapped, input.monthlyCap ?? Infinity)
  const annualReward = monthlyReward * input.qualifyingMonths
  const annualFees = input.monthlyFee * 12 + input.annualFee
  const recurringNet = annualReward - annualFees - input.annualCosts
  const firstYearNet = recurringNet + input.bonus
  const annualSpend = input.monthlySpend * 12
  if ([monthlyUncapped, monthlyReward, annualReward, annualFees, recurringNet, firstYearNet, annualSpend].some(value => !Number.isFinite(value))) throw new Error('These amounts are too large to calculate reliably.')
  const totalCosts = annualFees + input.annualCosts
  const maximumReward = input.monthlyCap === null ? Infinity : input.monthlyCap * input.qualifyingMonths
  const breakEvenMonthlySpend = totalCosts === 0 ? 0
    : input.rate === 0 || input.qualifyingMonths === 0 || maximumReward < totalCosts ? null
    : totalCosts / (input.rate / 100 * input.qualifyingMonths)
  return { monthlyUncapped, monthlyReward, annualReward, annualFees, recurringNet, firstYearNet, annualSpend,
    effectiveRate: annualSpend === 0 ? null : recurringNet / annualSpend * 100, breakEvenMonthlySpend }
}
