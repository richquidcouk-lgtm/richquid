/** Locally authored vector artwork: decorative, with no product/rate claims. */
export function guideArt(category: string): string {
  const themes: Record<string, string> = {
    'Banking and Credit': 'banking', Budgeting: 'budgeting', Cashback: 'cashback',
    'Energy Bills': 'energy', ISAs: 'isas', Mortgages: 'mortgages',
    Pensions: 'pensions', Savings: 'savings', Tax: 'tax',
  }
  return `/illustrations/${themes[category] || 'savings'}.svg`
}
