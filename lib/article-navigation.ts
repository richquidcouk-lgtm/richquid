export type ArticleNode = { type: string; tagName?: string; value?: string; properties?: Record<string, unknown>; children?: ArticleNode[] }
export type ArticleNavigation = { headings: { id: string; title: string }[]; sources: { title: string; url: string }[] }

/** One renderer pass supplies both heading IDs and the visible source list. */
export function collectArticleNavigation(tree: ArticleNode): ArticleNavigation {
  const result: ArticleNavigation = { headings: [], sources: [] }
  const ids = new Set<string>(), urls = new Set<string>()
  const text = (node: ArticleNode): string => node.type === 'text' ? node.value ?? '' : (node.children ?? []).map(text).join('')
  function visit(node: ArticleNode) {
    if (node.type === 'element' && node.tagName === 'h2') {
      const title = text(node)
      const base = title.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, '').trim().replace(/\s+/g, '-') || 'section'
      let id = base, suffix = 1
      while (ids.has(id)) id = `${base}-${suffix++}`
      ids.add(id); node.properties = { ...node.properties, id }
      result.headings.push({ id, title })
    }
    if (node.tagName === 'a' && typeof node.properties?.href === 'string') {
      try {
        const url = new URL(node.properties.href)
        if (url.protocol === 'https:' && !url.username && !url.password && !urls.has(url.href) && url.hostname !== 'www.richquid.co.uk') {
          urls.add(url.href); result.sources.push({ title: text(node) || url.hostname, url: url.href })
        }
      } catch { /* Internal links and malformed URLs are not citations. */ }
    }
    node.children?.forEach(visit)
  }
  visit(tree)
  return result
}
