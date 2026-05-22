/**
 * UK savings product rate RANGES, by product type.
 *
 * We deliberately do NOT publish named-provider rate claims — those move daily
 * and creating a comparison table without a regulated data feed is a legal
 * liability. Instead this is a stable, editorial map of the market: what
 * each product type pays roughly, who it suits, and what to look out for.
 *
 * Refresh the `rangeLow` / `rangeHigh` figures and `lastReviewed` when the
 * Bank of England base rate moves materially or when leading-edge offers
 * shift by ~25bp. Most months no update is needed.
 */

export type ProductGroup = 'cash-isa' | 'savings' | 'fixed-isa' | 'fixed-savings' | 'regular-saver' | 'lifetime-isa' | 'premium-bonds' | 'notice'

export interface RateRange {
  group: ProductGroup
  label: string
  /** Typical AER on market-leading products, as a fraction (0.045 = 4.5%). */
  rangeLow: number
  rangeHigh: number
  /** Lock-in or access description. */
  access: string
  /** Plain-English suitability note. */
  suits: string
  /** Two or three things worth knowing before opening one. */
  watchOuts: string[]
}

export const RATES_LAST_REVIEWED = '2026-05-22'

export const RATES: RateRange[] = [
  {
    group: 'cash-isa',
    label: 'Easy-access cash ISA',
    rangeLow: 0.040,
    rangeHigh: 0.048,
    access: 'No lock-in. Withdraw any time.',
    suits: 'Money that might be needed within 12 months but should still earn interest tax-free.',
    watchOuts: [
      'Some headline rates include a 12-month bonus that drops afterwards — check the rate at month 13.',
      'Not all easy-access ISAs are flexible. A flexible ISA lets you withdraw and redeposit without using more allowance; a non-flexible one does not.',
      'Some accounts cap withdrawals (e.g. three per year) and revert to a low rate afterwards.',
    ],
  },
  {
    group: 'savings',
    label: 'Easy-access savings (non-ISA)',
    rangeLow: 0.042,
    rangeHigh: 0.050,
    access: 'No lock-in. Withdraw any time.',
    suits: 'Cash above the £20,000 ISA allowance, or cash that produces interest below the Personal Savings Allowance (£1,000 basic-rate / £500 higher-rate).',
    watchOuts: [
      'Interest above the PSA is taxable at your marginal rate.',
      'Bonus-rate headline products often pay less after the first 12 months.',
      'FSCS protection is £85,000 per banking group — check that two brand names aren’t under the same licence.',
    ],
  },
  {
    group: 'fixed-isa',
    label: 'Fixed-rate cash ISA (1–2 years)',
    rangeLow: 0.044,
    rangeHigh: 0.052,
    access: '12–24 months lock-in. Early withdrawal penalty applies.',
    suits: 'Money that genuinely won’t be needed within the term and shouldn’t pay tax on interest.',
    watchOuts: [
      'Many fixed-rate ISAs don’t accept further deposits after opening — top up before the funding window closes.',
      'Withdrawing early typically forfeits 90–180 days of interest.',
      'Transfers in are often allowed only at opening, not later.',
    ],
  },
  {
    group: 'fixed-savings',
    label: 'Fixed-rate savings bonds (1–5 years)',
    rangeLow: 0.044,
    rangeHigh: 0.052,
    access: '12–60 months lock-in. Most cannot be accessed early.',
    suits: 'Cash earmarked for a specific date — house deposit, planned tax bill, school fees.',
    watchOuts: [
      'Interest is taxable above the Personal Savings Allowance.',
      'Some bonds pay interest annually only — others monthly. The monthly-interest version usually has a slightly lower AER.',
      'NS&I products are 100% government-backed beyond the £85k FSCS limit.',
    ],
  },
  {
    group: 'regular-saver',
    label: 'Regular savers',
    rangeLow: 0.060,
    rangeHigh: 0.080,
    access: 'No lock-in usually, but capped monthly deposits.',
    suits: 'Drip-feeding from monthly salary — these pay the headline-grabbing rates but on small sums.',
    watchOuts: [
      'Monthly deposit caps are typically £100–£500. The advertised rate is on the average balance, which is far less than what a lump sum in a fixed bond would earn.',
      'Many are restricted to existing current-account customers.',
      'After the initial 12-month term, balances usually drop into a much lower easy-access rate.',
    ],
  },
  {
    group: 'lifetime-isa',
    label: 'Lifetime ISA (cash)',
    rangeLow: 0.035,
    rangeHigh: 0.045,
    access: 'Penalty-free only for a first home (under £450k) or after age 60.',
    suits: 'Under-40s saving for a first home, where the 25% government bonus matters more than the headline interest rate.',
    watchOuts: [
      'The 25% government bonus is paid on contributions up to £4,000 per tax year — so up to £1,000 per year.',
      'Withdrawing for anything other than a qualifying first home or age-60+ retirement triggers a 25% penalty on the withdrawn amount, which translates to a small loss on your own money.',
      'The £450,000 property cap has not changed since 2017 and is increasingly tight in London.',
    ],
  },
  {
    group: 'premium-bonds',
    label: 'NS&I Premium Bonds',
    rangeLow: 0.035,
    rangeHigh: 0.040,
    access: 'No lock-in. Withdraw any time.',
    suits: 'Cash savers who prefer prize-draw upside over guaranteed interest, and who value 100% NS&I protection beyond the £85k FSCS limit.',
    watchOuts: [
      'The "rate" shown is the prize-fund rate — your actual return depends on luck and follows a long-tailed distribution.',
      'Prizes are tax-free and don’t need declaring.',
      'Maximum holding is £50,000.',
    ],
  },
  {
    group: 'notice',
    label: 'Notice accounts',
    rangeLow: 0.043,
    rangeHigh: 0.050,
    access: 'Withdrawals require 30–120 days’ notice.',
    suits: 'Cash you want to earn more than easy-access on but can plan withdrawals 1–4 months ahead.',
    watchOuts: [
      'Forgetting the notice period is the most common reason these underperform expectations.',
      'Some notice accounts have variable rates that can be cut at the provider’s discretion.',
      'Less common than easy-access or fixed — fewer products to compare.',
    ],
  },
]

export function formatPct(n: number): string {
  return `${(n * 100).toFixed(2)}%`
}
