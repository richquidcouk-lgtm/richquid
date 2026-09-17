const fs = require('node:fs')
const path = require('node:path')
const matter = require('gray-matter')
const dates = new Map()
for (const file of fs.readdirSync(path.join(__dirname, 'content/guides'))) {
  if (!file.endsWith('.mdx')) continue
  const { data } = matter(fs.readFileSync(path.join(__dirname, 'content/guides', file), 'utf8'))
  dates.set(`/guides/${data.slug || file.replace(/\.mdx$/, '')}`, data.updatedAt || data.publishedAt)
}
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://www.richquid.co.uk',
  generateRobotsTxt: true,
  robotsTxtOptions: { policies: [
    { userAgent: '*', allow: '/', disallow: '/api/' },
    ...['OAI-SearchBot', 'ChatGPT-User', 'Claude-SearchBot', 'Claude-User'].map(userAgent => ({ userAgent, allow: '/', disallow: '/api/' })),
  ] },
  autoLastmod: false,
  exclude: ['/api/*', '/embed/*', '/tools/sipp-vs-workplace-pension', '/tools/lisa-vs-help-to-buy-isa'],
  transform: async (_config, url) => ({ loc: url, ...(dates.get(url) ? { lastmod: new Date(dates.get(url)).toISOString() } : {}) }),
}
