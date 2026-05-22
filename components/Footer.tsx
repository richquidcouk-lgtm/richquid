import Link from 'next/link'

const SITE_YEAR = new Date().getFullYear()

const COLS: Array<{ title: string; links: Array<{ href: string; label: string; external?: boolean }> }> = [
  {
    title: 'About',
    links: [
      { href: '/about', label: 'About RichQuid' },
      { href: '/start-here', label: 'Start here' },
      { href: '/methodology', label: 'Methodology' },
      { href: '/contact', label: 'Contact us' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { href: '/tools', label: 'All calculators' },
      { href: '/guides', label: 'All guides' },
      { href: '/best-savings-rates', label: 'UK savings rates map' },
      { href: '/glossary', label: 'UK money glossary' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/disclaimer', label: 'Disclaimer' },
      { href: '/privacy', label: 'Privacy policy' },
    ],
  },
  {
    title: 'Connect',
    links: [
      { href: 'mailto:enquiries@richquid.co.uk', label: 'enquiries@richquid.co.uk', external: true },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-rule bg-[color:var(--green)] text-[color:var(--paper)]">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {COLS.map(col => (
            <div key={col.title}>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[color:var(--gold-soft)]">{col.title}</h4>
              <ul className="space-y-2 text-[15px]">
                {col.links.map(l => (
                  <li key={l.href + l.label}>
                    {l.external ? (
                      <a href={l.href} className="text-[color:var(--paper)]/85 hover:text-[color:var(--paper)] underline-offset-4 hover:underline">{l.label}</a>
                    ) : (
                      <Link href={l.href} className="text-[color:var(--paper)]/85 hover:text-[color:var(--paper)] underline-offset-4 hover:underline">{l.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 space-y-3 border-t border-[color:var(--paper)]/15 pt-6 text-[13px] text-[color:var(--paper)]/65">
          <p className="font-serif-display text-xl text-[color:var(--paper)]">
            Rich<span className="text-[color:var(--gold-soft)]">Quid</span>
          </p>
          <p>
            <strong className="text-[color:var(--paper)]/85">Affiliate disclosure.</strong>{' '}
            RichQuid earns commission from some providers we mention. You don&rsquo;t pay any more, and our editorial coverage stays independent.{' '}
            <Link href="/about" className="underline underline-offset-4">How we make money</Link>.
          </p>
          <p>
            ICO registration: <em>TBC</em> · RichQuid is not a financial adviser. See our{' '}
            <Link href="/disclaimer" className="underline underline-offset-4">disclaimer</Link>.
          </p>
          <p className="opacity-70">© {SITE_YEAR} RichQuid. UK personal finance, written in plain English.</p>
        </div>
      </div>
    </footer>
  )
}
