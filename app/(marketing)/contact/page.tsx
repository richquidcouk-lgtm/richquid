import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Send corrections, factual errors and questions to enquiries@richquid.co.uk. We aim to reply within 2 working days.',
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return (
    <article className="mx-auto max-w-prose px-5 py-16 sm:px-0">
      <header className="mb-10 border-b border-rule pb-8">
        <p className="metadata mb-3 uppercase tracking-[0.2em] text-[color:var(--green)]">Contact</p>
        <h1 className="font-serif-display text-[clamp(34px,5vw,52px)] leading-[1.05]">
          Get in touch.
        </h1>
        <p className="mt-4 text-[18px] leading-relaxed text-[color:var(--ink-2)]">
          We aim to reply within 2 working days. For corrections or factual errors, please include the URL of the page.
        </p>
      </header>

      <section className="rounded-lg border border-rule bg-white p-8 text-center">
        <p className="metadata uppercase tracking-[0.2em] text-[color:var(--gold)]">Email</p>
        <p className="mt-4 font-serif-display text-3xl">
          <a className="underline decoration-[color:var(--gold)] decoration-2 underline-offset-[6px] hover:text-[color:var(--green)]" href="mailto:enquiries@richquid.co.uk">
            enquiries@richquid.co.uk
          </a>
        </p>
        <p className="mt-5 text-[14px] text-[color:var(--ink-3)]">
          No web forms — we read every email personally.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-serif-display text-2xl">What to email about</h2>
        <ul className="mt-4 space-y-3 text-[16px] leading-relaxed text-[color:var(--ink-2)]">
          <li>
            <strong className="text-[color:var(--ink)]">Corrections.</strong> A figure looks wrong, a rule has changed, a calculator gives the wrong answer. Include the URL.
          </li>
          <li>
            <strong className="text-[color:var(--ink)]">Reader questions.</strong> If you can&rsquo;t find the answer to a personal-finance question on the site, ask. If the answer turns out to be a guide we should have written, we&rsquo;ll write it.
          </li>
          <li>
            <strong className="text-[color:var(--ink)]">Affiliate &amp; partnerships.</strong> Provider with a product worth recommending? Get in touch. We only partner with regulated UK providers.
          </li>
          <li>
            <strong className="text-[color:var(--ink)]">Press.</strong> Quotes, comments and data requests welcome.
          </li>
        </ul>
        <p className="mt-8 text-[14px] text-[color:var(--ink-3)]">
          We don&rsquo;t reply to cold sales pitches, link-building outreach, or AI-generated guest-post offers. Sorry.
        </p>
      </section>
    </article>
  )
}
