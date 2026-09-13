// One-off: applies title/excerpt rewrites from seo-updates.json via surgical
// line replacement (not gray-matter stringify, which reformats the whole YAML
// block — different quoting, folded scalars, etc. — and would blow up the diff
// for no reason). Only the `title:` and `excerpt:` lines inside frontmatter
// change; everything else in the file is untouched byte-for-byte.
// Usage: node scripts/apply-seo-updates.mjs
import fs from 'node:fs'
import path from 'node:path'

const updates = JSON.parse(fs.readFileSync(new URL('./seo-updates.json', import.meta.url)))
const guidesDir = path.join(process.cwd(), 'content', 'guides')

function replaceFrontmatterField(raw, field, newValue) {
  const escaped = newValue.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
  const pattern = new RegExp(`^${field}:\\s*".*"$`, 'm')
  if (!pattern.test(raw)) throw new Error(`Field "${field}" not found`)
  return raw.replace(pattern, `${field}: "${escaped}"`)
}

let applied = 0
for (const [slug, { title, excerpt }] of Object.entries(updates)) {
  const filePath = path.join(guidesDir, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) {
    console.error(`! No file for slug: ${slug}`)
    continue
  }
  let raw = fs.readFileSync(filePath, 'utf-8')
  const beforeTitleMatch = raw.match(/^title:\s*"(.*)"$/m)
  const beforeExcerptMatch = raw.match(/^excerpt:\s*"(.*)"$/m)

  raw = replaceFrontmatterField(raw, 'title', title)
  raw = replaceFrontmatterField(raw, 'excerpt', excerpt)
  fs.writeFileSync(filePath, raw)

  console.log(`✓ ${slug}`)
  console.log(`  title:   "${beforeTitleMatch?.[1]}" -> "${title}"`)
  console.log(`  excerpt: "${beforeExcerptMatch?.[1]}" -> "${excerpt}"`)
  applied++
}
console.log(`\nApplied ${applied}/${Object.keys(updates).length} updates.`)
