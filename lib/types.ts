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

export interface GuideMeta {
  slug: string
  title: string
  excerpt: string
  publishedAt: string  // ISO date string
  category: Category
  author: string
  readTime: number     // minutes
  featuredImage?: string
}

export interface Guide extends GuideMeta {
  content: string      // raw MDX
}
