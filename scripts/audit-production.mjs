import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const origin = process.env.AUDIT_ORIGIN || 'http://127.0.0.1:3106'
const redirects = JSON.parse(fs.readFileSync('lib/legacy-redirects.json', 'utf8'))
const guideDir = '.next/server/app/guides'
const files = fs.readdirSync(guideDir).filter(name => name.endsWith('.html'))
let references = 0
for (const name of files) {
  const html = fs.readFileSync(path.join(guideDir,name),'utf8')
  const slug = name.replace(/\.html$/, '')
  assert.equal((html.match(/<h1[ >]/g) || []).length,1,slug)
  assert.ok(html.includes(`href="https://www.richquid.co.uk/guides/${slug}"`),slug)
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1])
  for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(match[1]),`${slug}: missing ${match[1]}`)
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match=>JSON.parse(match[1]))
  const article = schemas.find(item=>item['@type']==='Article')
  assert.ok(article,slug);assert.ok(article.publisher['@id'].endsWith('/#organization'))
  for (const source of article.citation) {
    assert.ok(html.includes(`href="${source.url.replace(/&/g,'&amp;')}"`),`${slug}: invisible citation`)
    references++
  }
}
assert.equal(files.length,116)
const sitemap=fs.readFileSync('public/sitemap-0.xml','utf8')
const urls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match=>match[1])
assert.ok(urls.includes('https://www.richquid.co.uk/guides/category/banking-and-credit'))
for (const slug of ['sipp-vs-workplace-pension','lisa-vs-help-to-buy-isa']) {
  assert.ok(!urls.includes(`https://www.richquid.co.uk/tools/${slug}`))
  const html=fs.readFileSync(`.next/server/app/tools/${slug}.html`,'utf8')
  assert.ok(html.includes('noindex, follow'))
}
const robots=fs.readFileSync('public/robots.txt','utf8')
for (const bot of ['OAI-SearchBot','ChatGPT-User','Claude-SearchBot','Claude-User']) assert.ok(robots.includes(bot))
console.log(`Static checks passed: ${files.length} guides, ${references} visible citation links, ${urls.length} sitemap URLs.`)

for (const item of redirects) {
  const response=await fetch(origin+item.source,{redirect:'manual'})
  assert.equal(response.status,308,item.source)
  assert.equal(new URL(response.headers.get('location'),origin).pathname,item.destination)
  const final=await fetch(origin+item.destination)
  assert.equal(final.status,200,item.destination)
  if (item.destination.includes('/opengraph-image')) assert.match(final.headers.get('content-type'),/^image\//)
}
const unavailable=await fetch(origin+'/api/newsletter',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'local-test@example.com'})})
assert.equal(unavailable.status,503)
assert.ok((await unavailable.json()).error.includes('unavailable'))
const home=await (await fetch(origin)).text()
assert.ok(!home.includes('rq-newsletter-email'))
assert.ok(!home.includes('check your inbox'))
console.log('HTTP checks passed: all 43 permanent redirects and destinations, newsletter unavailable, no signup form.')
