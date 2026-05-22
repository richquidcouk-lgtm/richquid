import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Category, Guide, GuideMeta } from './types'

const GUIDES_DIR = path.join(process.cwd(), 'content', 'guides')

function readGuideFile(filename: string): Guide {
  const fullPath = path.join(GUIDES_DIR, filename)
  const raw = fs.readFileSync(fullPath, 'utf-8')
  const { data, content } = matter(raw)

  const slug = (data.slug ?? filename.replace(/\.mdx?$/, '')) as string

  return {
    slug,
    title: String(data.title ?? slug),
    excerpt: String(data.excerpt ?? ''),
    publishedAt: String(data.publishedAt ?? new Date().toISOString().slice(0, 10)),
    updatedAt: data.updatedAt ? String(data.updatedAt) : undefined,
    category: (data.category ?? 'Savings') as Category,
    author: String(data.author ?? 'Clara Penny'),
    readTime: Number(data.readTime ?? Math.max(2, Math.ceil(content.split(/\s+/).length / 200))),
    featuredImage: data.featuredImage ? String(data.featuredImage) : undefined,
    content,
  }
}

let _cache: Guide[] | null = null

export function getAllGuides(): Guide[] {
  if (_cache) return _cache
  if (!fs.existsSync(GUIDES_DIR)) {
    _cache = []
    return _cache
  }
  const files = fs.readdirSync(GUIDES_DIR).filter(f => f.endsWith('.mdx') || f.endsWith('.md'))
  _cache = files.map(readGuideFile).sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
  return _cache
}

export function getAllGuideMeta(): GuideMeta[] {
  return getAllGuides().map(({ content: _content, ...meta }) => meta)
}

export function getGuide(slug: string): Guide | null {
  return getAllGuides().find(g => g.slug === slug) ?? null
}

export function getRelatedGuides(slug: string, limit = 3): GuideMeta[] {
  const all = getAllGuides()
  const self = all.find(g => g.slug === slug)
  if (!self) return all.slice(0, limit).map(({ content: _content, ...m }) => m)
  // Prefer same category, then fall back to recent.
  const sameCategory = all
    .filter(g => g.slug !== slug && g.category === self.category)
    .slice(0, limit)
  if (sameCategory.length >= limit) {
    return sameCategory.map(({ content: _content, ...m }) => m)
  }
  const filler = all
    .filter(g => g.slug !== slug && g.category !== self.category)
    .slice(0, limit - sameCategory.length)
  return [...sameCategory, ...filler].map(({ content: _content, ...m }) => m)
}
