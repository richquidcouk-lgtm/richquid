/**
 * Schema.org JSON-LD helpers.
 *
 * Functions here produce schema objects that page components serialise via
 * <script type="application/ld+json">. Keep helpers pure and unit-testable.
 */

const SITE_URL = process.env.SITE_URL || 'https://www.richquid.co.uk'

export interface BreadcrumbItem {
  name: string
  url?: string // last item omits url per Google guidance
}

export function breadcrumbListSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      ...(item.url ? { item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}` } : {}),
    })),
  }
}

export interface FAQItem {
  question: string
  answer: string
}

export function faqPageSchema(items: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

/**
 * Extract Q&A pairs from MDX guide content. Treats H2 headings ending with
 * `?` as questions and the following paragraph(s) up to the next H2 as the
 * answer. Returns at most `limit` pairs (default 10 — Google warns against
 * very long FAQPage lists).
 */
export function extractFaqPairs(mdxContent: string, limit = 10): FAQItem[] {
  const lines = mdxContent.split('\n')
  const pairs: FAQItem[] = []
  let currentQuestion: string | null = null
  let currentAnswer: string[] = []

  const flush = () => {
    if (currentQuestion && currentAnswer.length > 0) {
      const answer = currentAnswer.join(' ').replace(/\s+/g, ' ').trim()
      if (answer.length >= 30) {
        pairs.push({ question: currentQuestion, answer })
      }
    }
    currentQuestion = null
    currentAnswer = []
  }

  for (const line of lines) {
    const h2Match = line.match(/^##\s+(.+?)\s*$/)
    if (h2Match) {
      flush()
      const heading = h2Match[1].trim()
      if (heading.endsWith('?')) {
        currentQuestion = heading
      } else {
        currentQuestion = null
      }
      continue
    }
    if (currentQuestion) {
      // Skip H3+ subheadings and table rows; gather narrative text only.
      if (line.match(/^#{3,}\s/) || line.match(/^\|/)) continue
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('---')) {
        // Strip markdown formatting characters for the FAQ answer text.
        const clean = trimmed
          .replace(/\*\*(.+?)\*\*/g, '$1')
          .replace(/\*(.+?)\*/g, '$1')
          .replace(/\[(.+?)\]\([^)]+\)/g, '$1')
          .replace(/`([^`]+)`/g, '$1')
        currentAnswer.push(clean)
      }
    }
    if (pairs.length >= limit) break
  }
  flush()
  return pairs.slice(0, limit)
}
