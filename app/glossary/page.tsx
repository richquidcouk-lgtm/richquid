import type { Metadata } from 'next'
import Link from 'next/link'
import { GLOSSARY, GLOSSARY_LAST_REVIEWED, groupByLetter } from '@/lib/glossary'

const SITE_URL = process.env.SITE_URL || 'https://www.richquid.co.uk'

function formatReviewed(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
}

export const metadata: Metadata = {
  title: 'UK personal finance glossary',
  description: 'Plain-English definitions of UK money terms — ISA, SIPP, PAYE, AER, SDLT, FSCS, MPAA and more. Cross-referenced and cited from HMRC, FCA and gov.uk.',
  alternates: { canonical: '/glossary' },
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default function GlossaryPage() {
  const grouped = groupByLetter()
  const presentLetters = ALPHABET.filter(l => grouped[l] && grouped[l].length > 0)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'UK personal finance glossary',
    url: `${SITE_URL}/glossary`,
    inLanguage: 'en-GB',
    publisher: { '@type': 'Organization', name: 'RichQuid', url: SITE_URL },
    hasDefinedTerm: GLOSSARY.map(t => ({
      '@type': 'DefinedTerm',
      '@id': `${SITE_URL}/glossary#${t.slug}`,
      name: t.term,
      description: t.short,
      inDefinedTermSet: `${SITE_URL}/glossary`,
    })),
  }

  return (
    <article className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="border-b border-rule pb-8">
        <p className="metadata mb-3 uppercase tracking-[0.2em] text-[color:var(--green)]">Reference</p>
        <h1 className="font-serif-display text-[clamp(34px,5vw,52px)] leading-[1.05]">
          UK money glossary
        </h1>
        <p className="mt-4 text-[18px] leading-relaxed text-[color:var(--ink-2)]">
          Plain-English definitions of the terms that come up most in UK personal finance. Cross-linked, cited from HMRC, the FCA and gov.uk where applicable.
        </p>
        <p className="metadata mt-4 text-[13px] text-[color:var(--ink-3)]">
          {GLOSSARY.length} terms · Last reviewed {formatReviewed(GLOSSARY_LAST_REVIEWED)}
        </p>
      </header>

      <nav aria-label="Jump to letter" className="sticky top-16 z-30 -mx-5 mt-4 border-b border-rule bg-[color:var(--paper)]/95 px-5 py-3 backdrop-blur sm:-mx-8 sm:px-8">
        <ul className="flex flex-wrap gap-x-2 gap-y-1 text-[13px]">
          {ALPHABET.map(letter => {
            const has = presentLetters.includes(letter)
            return (
              <li key={letter}>
                {has ? (
                  <a
                    href={`#letter-${letter}`}
                    className="inline-block rounded px-1.5 font-semibold text-[color:var(--green)] hover:bg-[color:var(--green-soft)]"
                  >
                    {letter}
                  </a>
                ) : (
                  <span className="inline-block rounded px-1.5 text-[color:var(--ink-3)]/50" aria-hidden>{letter}</span>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="mt-10 space-y-12">
        {presentLetters.map(letter => (
          <section key={letter} aria-labelledby={`letter-${letter}`}>
            <h2
              id={`letter-${letter}`}
              className="font-serif-display border-b border-rule pb-2 text-[34px] leading-none text-[color:var(--green)] scroll-mt-24"
            >
              {letter}
            </h2>
            <dl className="mt-6 space-y-8">
              {grouped[letter].map(t => (
                <div key={t.slug} id={t.slug} className="scroll-mt-24">
                  <dt className="font-serif-display text-[20px] leading-snug text-[color:var(--ink)]">
                    {t.term}
                  </dt>
                  <dd className="mt-2 text-[15px] italic text-[color:var(--ink-2)]">
                    {t.short}
                  </dd>
                  <dd className="mt-2 text-[15.5px] leading-relaxed text-[color:var(--ink-2)]">
                    {t.body}
                  </dd>
                  {(t.related || t.source) && (
                    <dd className="metadata mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px] text-[color:var(--ink-3)]">
                      {t.related && t.related.length > 0 && (
                        <span>
                          See also:{' '}
                          {t.related.map((r, i) => (
                            <span key={r}>
                              <Link href={`#${r}`} className="underline-offset-4 hover:underline hover:text-[color:var(--green)]">
                                {GLOSSARY.find(g => g.slug === r)?.term ?? r}
                              </Link>
                              {i < (t.related!.length - 1) ? ', ' : ''}
                            </span>
                          ))}
                        </span>
                      )}
                      {t.source && (
                        <a
                          href={t.source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline-offset-4 hover:underline hover:text-[color:var(--green)]"
                        >
                          {t.source.label} →
                        </a>
                      )}
                    </dd>
                  )}
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>

      <p className="metadata mt-16 border-t border-rule pt-6 text-[12.5px] leading-relaxed text-[color:var(--ink-3)]">
        Educational only. Not personal financial advice. Definitions are simplified for clarity; always check the linked source for current figures and edge cases. See our{' '}
        <Link href="/disclaimer" className="underline underline-offset-4">disclaimer</Link>.
      </p>
    </article>
  )
}
