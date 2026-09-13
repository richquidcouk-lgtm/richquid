// One-off: fixes internal links to /tools/<slug> that are missing the
// "-calculator" (or similar) suffix, found via a GSC Coverage "Not found
// (404)" export. Verified against the real slugs in lib/tools.ts.
import fs from 'node:fs'
import path from 'node:path'

const REPLACEMENTS = [
  { old: '](/tools/mortgage-affordability)', new: '](/tools/mortgage-affordability-calculator)' },
  { old: '](/tools/take-home-pay)', new: '](/tools/take-home-pay-calculator)' },
  { old: '](/tools/stamp-duty)', new: '](/tools/stamp-duty-calculator)' },
]

let totalFixed = 0
for (const dir of ['content/guides', 'content/blog']) {
  if (!fs.existsSync(dir)) continue
  for (const file of fs.readdirSync(dir)) {
    const filePath = path.join(dir, file)
    let raw = fs.readFileSync(filePath, 'utf-8')
    let fixedInFile = 0
    for (const { old, new: replacement } of REPLACEMENTS) {
      const count = raw.split(old).length - 1
      if (count > 0) {
        raw = raw.split(old).join(replacement)
        fixedInFile += count
      }
    }
    if (fixedInFile > 0) {
      fs.writeFileSync(filePath, raw)
      console.log(`fixed ${fixedInFile} link(s) in ${dir}/${file}`)
      totalFixed += fixedInFile
    }
  }
}
console.log(`\nFixed ${totalFixed} broken /tools/ links.`)
