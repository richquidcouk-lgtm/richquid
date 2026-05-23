/**
 * Shift articles from 2025/26 tax year framing to 2026/27.
 *
 * Replaces:
 *   - "2025/26" → "2026/27"
 *   - "5 April 2026" → "5 April 2027" (tax year end)
 *   - "31 January 2027" → "31 January 2028" (SA filing deadline)
 *   - "5 October 2026" → "5 October 2027" (SA registration deadline)
 *   - "31 July 2027" → "31 July 2028" (POA deadline)
 *
 * Operates on both the source markdown in richquid_articles/ and the
 * converted MDX in content/guides/. Only touches files in those directories
 * (does not modify the earlier hand-written guides).
 *
 * Historical references (e.g. "30 October 2024", "Spring Budget 2024",
 * "April 2024") are left untouched because they're factual events.
 */

const fs = require('fs')
const path = require('path')

const SOURCE_DIR = path.join(__dirname, '..', 'richquid_articles')
const TARGET_DIR = path.join(__dirname, '..', 'content', 'guides')

const REPLACEMENTS = [
  // Tax year shorthand — broadest replacement
  [/2025\/26/g, '2026/27'],
  // Tax year end (5 April 2026 = end of 2025/26)
  [/\b5 April 2026\b/g, '5 April 2027'],
  // SA filing deadline (31 Jan 2027 = filing for 2025/26)
  [/\b31 January 2027\b/g, '31 January 2028'],
  // SA registration deadline (5 Oct 2026 = first registration for 2025/26)
  [/\b5 October 2026\b/g, '5 October 2027'],
  // Second POA (31 July 2027 = second POA for 2025/26 carried forward)
  [/\b31 July 2027\b/g, '31 July 2028'],
  // Next-year forward refs
  [/\b31 January 2028\b/g, '31 January 2029'],
]

function processFile(filepath) {
  const original = fs.readFileSync(filepath, 'utf-8')
  let updated = original
  let replacementCount = 0

  for (const [pattern, replacement] of REPLACEMENTS) {
    const before = updated
    updated = updated.replace(pattern, replacement)
    if (before !== updated) {
      const matches = (before.match(pattern) || []).length
      replacementCount += matches
    }
  }

  if (original !== updated) {
    fs.writeFileSync(filepath, updated, 'utf-8')
    return replacementCount
  }
  return 0
}

function processDir(dir, extension) {
  if (!fs.existsSync(dir)) return { files: 0, replacements: 0 }
  const files = fs.readdirSync(dir).filter(f => f.endsWith(extension))
  let totalFiles = 0
  let totalReplacements = 0

  for (const file of files) {
    const count = processFile(path.join(dir, file))
    if (count > 0) {
      totalFiles++
      totalReplacements += count
    }
  }

  return { files: totalFiles, replacements: totalReplacements }
}

const sourceStats = processDir(SOURCE_DIR, '.md')
const targetStats = processDir(TARGET_DIR, '.mdx')

console.log(`richquid_articles/: updated ${sourceStats.files} files (${sourceStats.replacements} replacements)`)
console.log(`content/guides/: updated ${targetStats.files} files (${targetStats.replacements} replacements)`)
