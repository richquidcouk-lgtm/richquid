/**
 * Convert WordPress-style articles in richquid_articles/ to Next.js MDX
 * format compatible with content/guides/.
 *
 * One-shot script. Reads each .md, rewrites frontmatter, drops the H1
 * (Next.js renders title from frontmatter), writes to content/guides/.
 */

const fs = require('fs')
const path = require('path')

const SOURCE_DIR = path.join(__dirname, '..', 'richquid_articles')
const TARGET_DIR = path.join(__dirname, '..', 'content', 'guides')

const PILLAR_TO_CATEGORY = {
  'ISAs': 'ISAs',
  'Pensions': 'Pensions',
  'Mortgages': 'Mortgages',
  'Tax and side income': 'Tax',
  'Savings and everyday': 'Savings',
}

const TODAY = '2026-05-23'

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) throw new Error('No frontmatter found')

  const yaml = match[1]
  const body = match[2]
  const data = {}

  yaml.split('\n').forEach(line => {
    const m = line.match(/^(\w+):\s*"?(.*?)"?$/)
    if (m) data[m[1]] = m[2]
  })

  return { data, body }
}

function stripH1(body) {
  // Drop the first H1 (rendered from title in Next.js)
  return body.replace(/^\n*#\s+.+\n/, '\n').trimStart()
}

function estimateReadTime(body) {
  const words = body.split(/\s+/).length
  return Math.max(3, Math.ceil(words / 200))
}

function buildMDX(meta, body) {
  const title = (meta.meta_title || '').replace(/"/g, '\\"')
  const excerpt = (meta.meta_description || '').replace(/"/g, '\\"')
  const slug = meta.source_keyword
    ? meta.source_keyword.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    : null
  const category = PILLAR_TO_CATEGORY[meta.pillar] || 'Savings'
  const readTime = estimateReadTime(body)

  const frontmatter = [
    '---',
    `title: "${title}"`,
    `slug: "${slug}"`,
    `excerpt: "${excerpt}"`,
    `publishedAt: "${TODAY}"`,
    `updatedAt: "${TODAY}"`,
    `category: "${category}"`,
    `author: "Clara Penny"`,
    `readTime: ${readTime}`,
    `featuredImage: ""`,
    '---',
    '',
  ].join('\n')

  return frontmatter + stripH1(body)
}

function main() {
  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true })
  }

  const files = fs.readdirSync(SOURCE_DIR).filter(f => f.endsWith('.md'))
  let converted = 0
  let skipped = 0
  const errors = []

  for (const file of files) {
    try {
      const slug = file.replace(/\.md$/, '')
      const targetPath = path.join(TARGET_DIR, `${slug}.mdx`)

      // Skip if target already exists (preserves earlier wave guides)
      if (fs.existsSync(targetPath)) {
        skipped++
        console.log(`SKIP existing: ${slug}`)
        continue
      }

      const sourcePath = path.join(SOURCE_DIR, file)
      const raw = fs.readFileSync(sourcePath, 'utf-8')
      const { data, body } = parseFrontmatter(raw)
      const mdx = buildMDX(data, body)

      fs.writeFileSync(targetPath, mdx, 'utf-8')
      converted++
      console.log(`OK: ${slug}`)
    } catch (err) {
      errors.push({ file, error: err.message })
      console.error(`FAIL: ${file} - ${err.message}`)
    }
  }

  console.log('')
  console.log(`Converted: ${converted}`)
  console.log(`Skipped (already existed): ${skipped}`)
  console.log(`Errors: ${errors.length}`)
  if (errors.length) {
    console.log('Error details:', JSON.stringify(errors, null, 2))
  }
}

main()
