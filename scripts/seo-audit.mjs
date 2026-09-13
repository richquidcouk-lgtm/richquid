// One-off analysis: cross-references every guide's title/excerpt length
// against real GSC Pages.csv data to find truncation-risk + zero-CTR pages.
// Not part of the build — run manually: node scripts/seo-audit.mjs <path-to-Pages.csv>
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const pagesCsvPath = process.argv[2]
if (!pagesCsvPath) throw new Error('Usage: node scripts/seo-audit.mjs <path-to-Pages.csv>')

const csv = fs.readFileSync(pagesCsvPath, 'utf-8').replace(/^﻿/, '')
const lines = csv.split('\n').filter(Boolean)
const rows = lines.slice(1).map(line => {
  const [url, clicks, impressions, ctr, position] = line.split(',')
  return { url, clicks: Number(clicks), impressions: Number(impressions), ctr: parseFloat(ctr), position: parseFloat(position) }
})

const guidesDir = path.join(process.cwd(), 'content', 'guides')
const files = fs.readdirSync(guidesDir).filter(f => f.endsWith('.mdx'))
const guides = new Map()
for (const f of files) {
  const raw = fs.readFileSync(path.join(guidesDir, f), 'utf-8')
  const { data } = matter(raw)
  guides.set(data.slug, { title: data.title ?? '', excerpt: data.excerpt ?? '', file: f })
}

const results = rows
  .filter(r => r.url.includes('/guides/') && !r.url.includes('/category/'))
  .map(r => {
    const slug = r.url.split('/guides/')[1]?.replace(/\/$/, '')
    const guide = guides.get(slug)
    if (!guide) return null
    return {
      slug,
      impressions: r.impressions,
      clicks: r.clicks,
      ctr: r.ctr,
      position: r.position,
      titleLen: guide.title.length,
      excerptLen: guide.excerpt.length,
      titleTruncated: guide.title.length > 60,
      excerptTruncated: guide.excerpt.length > 160,
    }
  })
  .filter(Boolean)
  .sort((a, b) => b.impressions - a.impressions)

console.log('slug | impressions | clicks | ctr% | position | titleLen | excerptLen | flags')
for (const r of results) {
  const flags = [r.titleTruncated && 'TITLE>60', r.excerptTruncated && 'EXCERPT>160'].filter(Boolean).join(',')
  console.log(`${r.slug} | ${r.impressions} | ${r.clicks} | ${r.ctr} | ${r.position} | ${r.titleLen} | ${r.excerptLen} | ${flags}`)
}
