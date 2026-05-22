/**
 * UK personal tax helpers — 2025/26 tax year.
 * Update the constants here when bands change; every calculator uses these.
 */

export const TAX_YEAR = '2025/26'
export const CALC_LAST_REVIEWED = '2026-05-22'

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

export function incomeTaxRUK(gross: number): number {
  const pa = personalAllowance(gross)
  let tax = 0
  const basicTop = Math.min(gross, RUK_BASIC_LIMIT)
  tax += Math.max(0, basicTop - pa) * 0.20
  if (gross > RUK_BASIC_LIMIT) {
    const higherTop = Math.min(gross, RUK_HIGHER_LIMIT)
    tax += (higherTop - RUK_BASIC_LIMIT) * 0.40
  }
  if (gross > RUK_HIGHER_LIMIT) {
    tax += (gross - RUK_HIGHER_LIMIT) * 0.45
  }
  return tax
}

// --- Scottish income tax ---------------------------------------------------

const SCOT_BANDS: Array<{ top: number; rate: number }> = [
  { top: 15397, rate: 0.19 }, // Starter
  { top: 27491, rate: 0.20 }, // Basic
  { top: 43662, rate: 0.21 }, // Intermediate
  { top: 75000, rate: 0.42 }, // Higher
  { top: 125140, rate: 0.45 }, // Advanced
  { top: Infinity, rate: 0.48 }, // Top
]

export function incomeTaxScotland(gross: number): number {
  const pa = personalAllowance(gross)
  const taxable = Math.max(0, gross - pa)
  if (taxable === 0) return 0
  let tax = 0
  let consumed = pa
  for (const band of SCOT_BANDS) {
    const bandTop = band.top
    if (gross <= consumed) break
    const slice = Math.min(gross, bandTop) - consumed
    if (slice > 0) tax += slice * band.rate
    consumed = bandTop
    if (gross <= bandTop) break
  }
  return tax
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
  plan1: { threshold: 26065, rate: 0.09, label: 'Plan 1' },
  plan2: { threshold: 28470, rate: 0.09, label: 'Plan 2' },
  plan4: { threshold: 32745, rate: 0.09, label: 'Plan 4 (Scotland)' },
  plan5: { threshold: 25000, rate: 0.09, label: 'Plan 5' },
  postgrad: { threshold: 21000, rate: 0.06, label: 'Postgrad loan' },
}

export function studentLoanRepayment(gross: number, plan: StudentLoanPlan): number {
  const { threshold, rate } = STUDENT_LOAN[plan]
  return Math.max(0, (gross - threshold) * rate)
}

// --- Formatting -----------------------------------------------------------

export function formatGBP(n: number, dp = 0): string {
  return n.toLocaleString('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: dp,
    minimumFractionDigits: dp,
  })
}

export function parseAmount(v: string): number {
  const n = parseFloat(v.replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) && n >= 0 ? n : 0
}
