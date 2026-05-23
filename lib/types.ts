export type Category =
  | 'Budgeting'
  | 'Cashback'
  | 'Energy Bills'
  | 'ISAs'
  | 'Mortgages'
  | 'Pensions'
  | 'Savings'
  | 'Tax'

export const CATEGORIES: Category[] = [
  'Budgeting',
  'Cashback',
  'Energy Bills',
  'ISAs',
  'Mortgages',
  'Pensions',
  'Savings',
  'Tax',
]

export function categorySlug(c: Category): string {
  return c.toLowerCase().replace(/\s+/g, '-')
}

export function categoryFromSlug(slug: string): Category | undefined {
  return CATEGORIES.find(c => categorySlug(c) === slug)
}

export interface CategoryMeta {
  intro: string
  cornerstone?: string
}

export const CATEGORY_META: Record<Category, CategoryMeta> = {
  Budgeting: {
    intro: 'Practical, plain-English guides on UK budgeting — order of operations, emergency funds, the priority sequence most people work through.',
  },
  Cashback: {
    intro: 'How UK cashback actually works — credit cards, reward bank accounts, and the websites that pay you for clicking through.',
  },
  'Energy Bills': {
    intro: 'The UK energy market explained — the price cap, fixed vs variable tariffs, and the moves that actually cut your annual bill.',
  },
  ISAs: {
    intro: 'Cash, Stocks & Shares, LISA, IFISA and Junior — how the £20,000 wrapper works, when each type fits, and the changes coming in April 2027.',
  },
  Mortgages: {
    intro: 'UK mortgages from first-time buyer through remortgaging — deposits, affordability, fix lengths, and the rules that change at LTV cliffs.',
  },
  Pensions: {
    intro: 'Workplace pensions, SIPPs, the State Pension and the April 2027 IHT changes — what you need to know about UK retirement saving.',
  },
  Savings: {
    intro: 'Personal Savings Allowance, Premium Bonds, regular savers, emergency funds — making cash work as hard as it can outside the ISA.',
  },
  Tax: {
    intro: 'UK personal tax in plain English — Self Assessment, side hustles, the £100k trap, the April 2026 dividend rate rise, and what changed this tax year.',
  },
}

export interface GuideMeta {
  slug: string
  title: string
  excerpt: string
  publishedAt: string  // ISO date string
  updatedAt?: string   // optional ISO date — last editorial review
  category: Category
  author: string
  readTime: number     // minutes
  featuredImage?: string
}

export interface Guide extends GuideMeta {
  content: string      // raw MDX
}
