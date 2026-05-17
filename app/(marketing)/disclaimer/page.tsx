import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'RichQuid is not a regulated financial adviser. This page explains what the site is, what it isn\u2019t, and where to get advice tailored to you.',
  alternates: { canonical: '/disclaimer' },
}

export default function DisclaimerPage() {
  return (
    <article className="mx-auto max-w-prose px-5 py-16 sm:px-0">
      <header className="mb-10 border-b border-rule pb-8">
        <p className="metadata mb-3 uppercase tracking-[0.2em] text-[color:var(--green)]">Disclaimer</p>
        <h1 className="font-serif-display text-[clamp(34px,5vw,52px)] leading-[1.05]">
          What this site is. <em className="not-italic text-[color:var(--green)]">And what it isn&rsquo;t.</em>
        </h1>
      </header>

      <div className="prose">
        <p>
          RichQuid provides general information about UK personal finance topics including ISAs, pensions, savings, and investing. The content on this site is for educational and informational purposes only.
        </p>
        <p>
          RichQuid is not a financial adviser and does not provide regulated financial advice. Nothing on this site constitutes a personal recommendation. The information is not tailored to your individual circumstances.
        </p>

        <h2>Accuracy and timing</h2>
        <p>
          Tax rules and product features mentioned on this site are accurate to the best of our knowledge at the time of writing, but they change frequently. Always verify the current rules with HMRC, the FCA, or directly with the product provider before making a financial decision.
        </p>

        <h2>Investment risk</h2>
        <p>
          Past performance is not a guide to future performance. The value of investments can go down as well as up, and you may get back less than you put in.
        </p>

        <h2>Affiliate commission</h2>
        <p>
          RichQuid earns affiliate commission from some of the providers we mention. This does not affect the price you pay or the analysis we publish. We disclose affiliate relationships clearly throughout the site.
        </p>

        <h2>When you need regulated advice</h2>
        <p>
          If you need regulated financial advice tailored to your personal circumstances, please consult an FCA-authorised financial adviser. You can find one at{' '}
          <a href="https://www.unbiased.co.uk" rel="noopener noreferrer" target="_blank">unbiased.co.uk</a>{' '}or{' '}
          <a href="https://www.vouchedfor.co.uk" rel="noopener noreferrer" target="_blank">vouchedfor.co.uk</a>.
        </p>
      </div>
    </article>
  )
}
