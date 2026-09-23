import manifest from './guide-art-manifest.json'

/** Article-specific editorial illustrations. Existing featured images take precedence. */
export function guideArt(category: string, slug?: string): string {
  if (slug && Object.prototype.hasOwnProperty.call(manifest, slug)) {
    return `/illustrations/articles/${slug}.svg`
  }
  const themes: Record<string, string> = {
    'Banking and Credit': 'banking', Budgeting: 'budgeting', Cashback: 'cashback',
    'Energy Bills': 'energy', ISAs: 'isas', Mortgages: 'mortgages',
    Pensions: 'pensions', Savings: 'savings', Tax: 'tax',
  }
  return `/illustrations/${themes[category] || 'savings'}.svg`
}
