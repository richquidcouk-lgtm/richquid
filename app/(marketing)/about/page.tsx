import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About RichQuid',
  description: 'How RichQuid works, who writes the guides, and how we make money. Built by data engineers — not bankers.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-prose px-5 py-16 sm:px-0">
      <header className="mb-10 border-b border-rule pb-8">
        <p className="metadata mb-3 uppercase tracking-[0.2em] text-[color:var(--green)]">About</p>
        <h1 className="font-serif-display text-[clamp(34px,5vw,52px)] leading-[1.05]">
          Less mystery. <em className="not-italic text-[color:var(--green)]">More maths.</em>
        </h1>
      </header>

      <div className="prose">
        <p>
          RichQuid was built to make UK personal finance less mysterious.
        </p>
        <p>
          We don&rsquo;t sell advice. We don&rsquo;t take a slice when you act on what you read. What we do is build calculators and write guides that show you the maths behind the financial decisions you&rsquo;re making — ISAs, pensions, salary sacrifice, emergency funds, and the rest.
        </p>

        <h2>Who writes the site</h2>
        <p>
          The site is written by <strong>Clara Penny</strong>, who covers tax-efficient saving and investing for UK consumers. Clara writes anonymously to keep the focus on the maths rather than the personality — a deliberate choice, not an evasion. You can verify any figure on this site against the underlying source data we cite.
        </p>

        <h2>How we make money</h2>
        <p>
          We earn money through affiliate partnerships with some of the providers we mention. We never recommend a provider we wouldn&rsquo;t use ourselves, and we clearly disclose any commission relationship. You&rsquo;re never under any obligation to use our links.
        </p>

        <h2>Found something wrong?</h2>
        <p>
          If you spot an error, an outdated figure, or something we&rsquo;ve got wrong, email us — that&rsquo;s how the site stays accurate.
        </p>

        <p>
          <a href="mailto:enquiries@richquid.co.uk">enquiries@richquid.co.uk</a>
        </p>
      </div>
    </article>
  )
}
