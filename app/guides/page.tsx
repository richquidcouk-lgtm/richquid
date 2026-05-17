import type { Metadata } from 'next'
import GuidesIndexClient from './GuidesIndexClient'
import { getAllGuideMeta } from '@/lib/mdx'

export const metadata: Metadata = {
  title: 'Guides',
  description: 'Plain-English UK personal finance guides on ISAs, pensions, cashback, energy bills, savings and budgeting.',
  alternates: { canonical: '/guides' },
}

export default function GuidesIndexPage() {
  const posts = getAllGuideMeta()
  return <GuidesIndexClient posts={posts} />
}
