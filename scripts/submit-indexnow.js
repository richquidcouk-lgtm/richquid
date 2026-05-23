/**
 * Submit RichQuid's sitemap URLs to IndexNow.
 *
 * IndexNow is the open indexing protocol used by Bing, Yandex, Seznam and Naver.
 * Single POST notifies all participating engines simultaneously.
 *
 * Usage:
 *   node scripts/submit-indexnow.js
 *   node scripts/submit-indexnow.js --dry-run
 *
 * Requirements:
 *   - Key file at https://www.richquid.co.uk/<KEY>.txt containing the key.
 *   - Sitemap at https://www.richquid.co.uk/sitemap-0.xml (next-sitemap default).
 */

const SITE = 'https://www.richquid.co.uk'
const HOST = 'www.richquid.co.uk'
const KEY = '09f37e4939606d368025fbd56c649806'
const KEY_LOCATION = `${SITE}/${KEY}.txt`
const SITEMAP_URL = `${SITE}/sitemap-0.xml`
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/IndexNow'
const BATCH_SIZE = 10000 // IndexNow limit per request

const dryRun = process.argv.includes('--dry-run')

async function fetchSitemapUrls() {
  console.log(`Fetching ${SITEMAP_URL}...`)
  const res = await fetch(SITEMAP_URL)
  if (!res.ok) throw new Error(`Sitemap fetch failed: ${res.status}`)
  const xml = await res.text()
  const matches = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  return matches.map(m => m[1].trim()).filter(Boolean)
}

async function verifyKeyFile() {
  console.log(`Verifying ${KEY_LOCATION}...`)
  const res = await fetch(KEY_LOCATION)
  if (!res.ok) {
    console.error(`  Key file not reachable: HTTP ${res.status}`)
    console.error(`  IndexNow will reject submissions until the key file is live.`)
    return false
  }
  const content = (await res.text()).trim()
  if (content !== KEY) {
    console.error(`  Key file content mismatch.`)
    console.error(`  Expected: ${KEY}`)
    console.error(`  Got:      ${content.slice(0, 80)}`)
    return false
  }
  console.log('  Key file OK.')
  return true
}

async function submit(urlList) {
  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  }
  console.log(`\nPOSTing ${urlList.length} URLs to ${INDEXNOW_ENDPOINT}...`)
  if (dryRun) {
    console.log('  [dry-run] Skipping actual POST.')
    console.log('  First 5 URLs:')
    urlList.slice(0, 5).forEach(u => console.log(`    ${u}`))
    return { status: 'dry-run' }
  }
  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  })
  const text = await res.text().catch(() => '')
  return { status: res.status, body: text }
}

async function main() {
  console.log('IndexNow submission for', HOST)
  console.log('Key:', KEY)
  console.log('')

  if (!dryRun) {
    const ok = await verifyKeyFile()
    if (!ok) {
      console.error('\nAborting. Wait for the key file to deploy then re-run.')
      process.exit(1)
    }
  }

  const urls = await fetchSitemapUrls()
  console.log(`Sitemap contains ${urls.length} URLs.`)

  if (urls.length === 0) {
    console.error('No URLs to submit.')
    process.exit(1)
  }

  // Submit in batches if necessary
  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE)
    const result = await submit(batch)
    console.log(`  Status: ${result.status}`)
    if (result.body) console.log(`  Body: ${result.body.slice(0, 200)}`)
  }

  console.log('\nResponse code reference:')
  console.log('  200/202 = accepted (Bing/Yandex/Seznam/Naver will crawl)')
  console.log('  400     = bad request (check payload)')
  console.log('  403     = key auth failed (key file content mismatch)')
  console.log('  422     = URLs do not match host')
  console.log('  429     = rate limited')
}

main().catch(err => {
  console.error('Error:', err.message)
  process.exit(1)
})
