/**
 * UK personal tax helpers — 2026/27 tax year.
 * Update the constants here when bands change; every calculator uses these.
 */

export const TAX_YEAR = '2026/27'
export const CALC_LAST_REVIEWED = '2026-09-16'
// Income tax / NI / student loan sources: gov.uk/income-tax-rates,
// gov.uk/scottish-income-tax and gov.uk/guidance/rates-and-thresholds-for-employers-2026-to-2027
export const BASIC_TAXABLE_BAND = 37700

// --- Income tax (rest of UK: England, Wales, NI) ----------------------------

export const PA_BASE = 12570
export const PA_TAPER_THRESHOLD = 100000
export const RUK_BASIC_LIMIT = 50270
export const RUK_HIGHER_LIMIT = 125140

export function personalAllowance(gross: number): number {
  if (gross <= PA_TAPER_THRESHOLD) return PA_BASE
  const taper = Math.min(PA_BASE, Math.floor((gross - PA_TAPER_THRESHOLD) / 2))
  return Math.max(0, PA_BASE - taper)
}

/** Band ceilings apply to taxable income, not gross pay. */
function taxByBands(taxable: number, bands: readonly (readonly [number, number])[]): number {
  let tax = 0, previous = 0
  for (const [ceiling, rate] of bands) {
    tax += Math.max(0, Math.min(taxable, ceiling) - previous) * rate
    previous = ceiling
    if (taxable <= ceiling) break
  }
  return tax
}

export function incomeTaxRUK(gross: number): number {
  return taxByBands(Math.max(0, gross - personalAllowance(gross)), [
    [BASIC_TAXABLE_BAND, 0.20], [125140, 0.40], [Infinity, 0.45],
  ])
}

export function incomeTaxScotland(gross: number): number {
  return taxByBands(Math.max(0, gross - personalAllowance(gross)), [
    [3967, 0.19], [16956, 0.20], [31092, 0.21],
    [62430, 0.42], [125140, 0.45], [Infinity, 0.48],
  ])
}

export function incomeTax(gross: number, scotland = false): number {
  return scotland ? incomeTaxScotland(gross) : incomeTaxRUK(gross)
}

// --- Employee NI (UK-wide, same in Scotland) -------------------------------

export const NI_PRIMARY = 12570
export const NI_UPPER = 50270

export function employeeNI(gross: number): number {
  if (gross <= NI_PRIMARY) return 0
  const main = Math.min(gross, NI_UPPER) - NI_PRIMARY
  let ni = Math.max(0, main) * 0.08
  if (gross > NI_UPPER) ni += (gross - NI_UPPER) * 0.02
  return ni
}

// --- Student loan repayments -----------------------------------------------

export type StudentLoanPlan = 'plan1' | 'plan2' | 'plan4' | 'plan5' | 'postgrad'

export const STUDENT_LOAN: Record<StudentLoanPlan, { threshold: number; rate: number; label: string }> = {
  plan1: { threshold: 26900, rate: 0.09, label: 'Plan 1' },
  plan2: { threshold: 29385, rate: 0.09, label: 'Plan 2' },
  plan4: { threshold: 33795, rate: 0.09, label: 'Plan 4 (Scotland)' },
  plan5: { threshold: 25000, rate: 0.09, label: 'Plan 5' },
  postgrad: { threshold: 21000, rate: 0.06, label: 'Postgrad loan' },
}

export function studentLoanRepayment(gross: number, plan: StudentLoanPlan): number {
  if (!STUDENT_LOAN[plan]) return Number.NaN
  const { threshold, rate } = STUDENT_LOAN[plan]
  return Math.max(0, (gross - threshold) * rate)
}

// --- Personal Savings Allowance ---------------------------------------------
// Savings-income tax bands are not devolved, so PSA banding always follows the
// rest-of-UK thresholds above, even for Scottish taxpayers.

export const PSA_BASIC_RATE = 1000
export const PSA_HIGHER_RATE = 500
export const PSA_ADDITIONAL_RATE = 0

export function personalSavingsAllowance(grossIncome: number): number {
  if (grossIncome <= RUK_BASIC_LIMIT) return PSA_BASIC_RATE
  if (grossIncome <= RUK_HIGHER_LIMIT) return PSA_HIGHER_RATE
  return PSA_ADDITIONAL_RATE
}

// --- Pension annual allowance ------------------------------------------------

export const PENSION_ANNUAL_ALLOWANCE = 60000
export const PENSION_ANNUAL_ALLOWANCE_MIN = 10000
export const PENSION_TAPER_THRESHOLD = 260000
export const MPAA = 10000

export function pensionAnnualAllowance(adjustedIncome: number): number {
  if (adjustedIncome <= PENSION_TAPER_THRESHOLD) return PENSION_ANNUAL_ALLOWANCE
  const taper = Math.floor((adjustedIncome - PENSION_TAPER_THRESHOLD) / 2)
  return Math.max(PENSION_ANNUAL_ALLOWANCE_MIN, PENSION_ANNUAL_ALLOWANCE - taper)
}

// --- Formatting -----------------------------------------------------------

export function formatGBP(n: number, dp = 0): string {
  if (!Number.isFinite(n)) return '—'
  return n.toLocaleString('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: dp,
    minimumFractionDigits: dp,
  })
}

/** Blank inputs mean zero; invalid values must not be turned into positive money. */
export function parseAmount(value: string): number {
  const clean = value.trim().replace(/^£\s*/, '')
  if (!clean) return 0
  if (!/^(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d*)?$/.test(clean)) return Number.NaN
  const number = Number(clean.replace(/,/g, ''))
  return Number.isFinite(number) ? number : Number.NaN
}

/** Standard personal allowance, no dividends/reliefs. Savings bands apply UK-wide. */
export function savingsTax(otherIncome: number, interest: number) {
  const allowance = personalAllowance(otherIncome + interest)
  const taxableOther = Math.max(0, otherIncome - allowance)
  const taxableInterest = Math.max(0, interest - Math.max(0, allowance - otherIncome))
  const startingRate = Math.min(taxableInterest, Math.max(0, 5000 - taxableOther))
  const psa = personalSavingsAllowance(otherIncome + interest)
  const zeroRated = startingRate + Math.min(psa, taxableInterest - startingRate)
  const interestTax = taxByBands(taxableOther + taxableInterest, [[37700, .2], [125140, .4], [Infinity, .45]])
    - taxByBands(taxableOther + zeroRated, [[37700, .2], [125140, .4], [Infinity, .45]])
  return { interestTax, psa, startingRate, allowance, taxableInterest: Math.max(0, taxableInterest - zeroRated) }
}
