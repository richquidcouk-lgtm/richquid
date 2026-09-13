// One-off: fixes internal markdown links in content/guides/*.mdx that point to
// `/<slug>/` instead of the real route `/guides/<slug>`. Only rewrites a link
// when the captured slug matches an actual guide file — legitimate root-level
// links (/about, /tools/..., /contact, etc.) and links to slugs that don't
// exist as guides are left untouched and reported separately for review.
//
// Usage:
//   node scripts/fix-broken-guide-links.mjs          # dry run, reports only
//   node scripts/fix-broken-guide-links.mjs --apply  # writes the fixes
import fs from 'node:fs'
import path from 'node:path'

const apply = process.argv.includes('--apply')
const guidesDir = path.join(process.cwd(), 'content', 'guides')
const files = fs.readdirSync(guidesDir).filter(f => f.endsWith('.mdx'))
const realSlugs = new Set(files.map(f => f.replace(/\.mdx$/, '')))

const LINK_RE = /\]\(\/([a-z0-9-]+)\/?\)/g

let totalFixed = 0
let filesChanged = 0
const unresolved = new Map() // slug-like path -> [files it appears in]

for (const file of files) {
  const filePath = path.join(guidesDir, file)
  const raw = fs.readFileSync(filePath, 'utf-8')
  let fixedInFile = 0

  const updated = raw.replace(LINK_RE, (match, slug) => {
    if (!realSlugs.has(slug)) {
      // Not a guide slug — either a legit root-level route or a dangling
      // reference. Leave untouched; record for manual review.
      if (!unresolved.has(slug)) unresolved.set(slug, [])
      unresolved.get(slug).push(file)
      return match
    }
    fixedInFile++
    return `](/guides/${slug})`
  })

  if (fixedInFile > 0) {
    filesChanged++
    totalFixed += fixedInFile
    console.log(`${apply ? 'fixed' : 'would fix'} ${fixedInFile} link(s) in ${file}`)
    if (apply) fs.writeFileSync(filePath, updated)
  }
}

console.log(`\n${apply ? 'Fixed' : 'Would fix'} ${totalFixed} broken guide links across ${filesChanged} files.`)

if (unresolved.size > 0) {
  console.log(`\n${unresolved.size} distinct path(s) left untouched (not a recognised guide slug) — review these manually:`)
  for (const [slug, inFiles] of unresolved) {
    console.log(`  /${slug}  (referenced in ${inFiles.length} file(s): ${inFiles.slice(0, 3).join(', ')}${inFiles.length > 3 ? ', ...' : ''})`)
  }
}
