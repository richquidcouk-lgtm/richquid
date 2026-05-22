import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Methodology — sources, refresh cadence, accuracy',
  description: 'How RichQuid sources its UK personal finance figures, how often each piece of data is reviewed, what is verified vs estimated, and how to report a correction.',
  alternates: { canonical: '/methodology' },
}

const METHODOLOGY_LAST_REVIEWED = '2026-05-22'

function formatReviewed(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default function MethodologyPage() {
  return (
    <article className="mx-auto max-w-prose px-5 py-16 sm:px-0">
      <header className="mb-10 border-b border-rule pb-8">
        <p className="metadata mb-3 uppercase tracking-[0.2em] text-[color:var(--green)]">Methodology</p>
        <h1 className="font-serif-display text-[clamp(34px,5vw,52px)] leading-[1.05]">
          How we source, <em className="not-italic text-[color:var(--green)]">verify and refresh.</em>
        </h1>
        <p className="metadata mt-4 text-[13px] text-[color:var(--ink-3)]">
          Last reviewed {formatReviewed(METHODOLOGY_LAST_REVIEWED)}
        </p>
      </header>

      <div className="prose prose-lg">
        <p>
          RichQuid publishes calculators, guides and reference pages on UK personal finance. This page is the record of how each piece of data on the site is sourced, how often it&rsquo;s reviewed, and what we mean when we use words like &ldquo;verified&rdquo; or &ldquo;estimated&rdquo;.
        </p>
        <p>
          We&rsquo;re not FCA-authorised and we don&rsquo;t give personal financial advice. The site exists to make the public-record numbers easier to read and use — nothing more.
        </p>

        <h2>Our authoritative sources</h2>
        <p>The figures used across the site are drawn from these official sources:</p>
        <ul>
          <li><a href="https://www.gov.uk/government/organisations/hm-revenue-customs" target="_blank" rel="noopener noreferrer">HMRC and gov.uk</a> — income tax bands, NI rates and thresholds, ISA and pension allowances, CGT, dividend allowance, IHT, marriage allowance, student loan plans, Self Assessment rules.</li>
          <li><a href="https://www.bankofengland.co.uk/" target="_blank" rel="noopener noreferrer">Bank of England</a> — base rate, monetary policy decisions, financial stability data.</li>
          <li><a href="https://www.ons.gov.uk/" target="_blank" rel="noopener noreferrer">Office for National Statistics (ONS)</a> — CPI and CPIH inflation, labour market and earnings, GDP.</li>
          <li><a href="https://www.fca.org.uk/" target="_blank" rel="noopener noreferrer">Financial Conduct Authority (FCA)</a> — mortgage and consumer credit rules, financial promotion guidance, FSCS thresholds (in conjunction with FSCS itself).</li>
          <li><a href="https://www.thepensionsregulator.gov.uk/" target="_blank" rel="noopener noreferrer">The Pensions Regulator (TPR)</a> — auto-enrolment thresholds, qualifying earnings, employer duties.</li>
          <li><a href="https://revenue.scot/" target="_blank" rel="noopener noreferrer">Revenue Scotland</a> — LBTT rates and the Additional Dwelling Supplement.</li>
          <li><a href="https://gov.wales/welsh-revenue-authority" target="_blank" rel="noopener noreferrer">Welsh Revenue Authority</a> — LTT rates for residential and higher residential transactions.</li>
        </ul>
        <p>
          Where a figure on this site might be checked against any of these, the relevant guide or calculator includes a direct link.
        </p>

        <h2>Refresh cadence</h2>
        <p>Different data types move at different speeds. Our review schedule:</p>
        <table>
          <thead>
            <tr><th>Data</th><th>How often we review</th><th>Triggered by</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Income tax bands, NI rates, ISA/pension allowances, CGT and dividend allowances</td>
              <td>Annually after each Spring Budget, and immediately after any in-year change</td>
              <td>HMRC publication of the new tax year&rsquo;s figures</td>
            </tr>
            <tr>
              <td>Stamp duty thresholds (SDLT, LBTT, LTT)</td>
              <td>On the effective date of any rate or band change</td>
              <td>HMRC, Revenue Scotland or WRA announcements</td>
            </tr>
            <tr>
              <td>Student loan plan thresholds</td>
              <td>Annually each April</td>
              <td>Department for Education / Student Loans Company announcements</td>
            </tr>
            <tr>
              <td>Bank of England base rate</td>
              <td>After every MPC meeting (~ 8 per year)</td>
              <td>MPC announcement</td>
            </tr>
            <tr>
              <td>UK inflation, unemployment and earnings figures</td>
              <td>Monthly</td>
              <td>ONS release calendar</td>
            </tr>
            <tr>
              <td>Savings rate ranges (cash ISA, fixed bonds, regular savers)</td>
              <td>Monthly, or whenever leading-edge rates shift by ~25bp</td>
              <td>BoE base rate moves and major-bank product launches</td>
            </tr>
            <tr>
              <td>Editorial guides (tax-year checklist, FTB route map, etc.)</td>
              <td>At least once per tax year</td>
              <td>Any change that materially alters the guide&rsquo;s working assumptions</td>
            </tr>
          </tbody>
        </table>
        <p>
          Every guide and calculator carries a &ldquo;Last reviewed&rdquo; date — that&rsquo;s the date we last read through and confirmed the figures against the underlying source.
        </p>

        <h2>What &ldquo;verified&rdquo; vs &ldquo;estimated&rdquo; means here</h2>
        <p>
          <strong>Verified</strong> means we&rsquo;ve checked the figure against the linked official source on the date shown. Tax bands, NI thresholds, ISA allowances and similar statutory figures are verified.
        </p>
        <p>
          <strong>Estimated</strong> means the figure isn&rsquo;t directly published by an authority — it&rsquo;s our reasonable read of public market data. Savings rate <em>ranges</em> are estimates. Mortgage stress-test rates (~7&ndash;9%) are estimates of typical lender practice rather than a single regulated figure. We say so where it applies.
        </p>

        <h2>What we won&rsquo;t do</h2>
        <p>
          We deliberately don&rsquo;t publish a few things — usually because doing so safely would need a regulated data feed and authorisation we don&rsquo;t have:
        </p>
        <ul>
          <li><strong>Named-provider rate comparisons.</strong> &ldquo;Bank X is the best easy-access ISA today&rdquo; needs a live data feed and FCA-authorised editorial review. We point readers to <a href="https://moneyfactscompare.co.uk/" target="_blank" rel="noopener noreferrer">Moneyfacts</a> and <a href="https://www.moneysavingexpert.com/savings/" target="_blank" rel="noopener noreferrer">MoneySavingExpert</a> instead.</li>
          <li><strong>Personalised recommendations.</strong> The calculators produce numbers from your inputs; they don&rsquo;t tell you what to do with the answer. That&rsquo;s a regulated activity.</li>
          <li><strong>Outcome predictions.</strong> We won&rsquo;t say &ldquo;you&rsquo;ll save £X&rdquo; — only that &ldquo;at these inputs, the calculation produces £X&rdquo;.</li>
          <li><strong>Hidden affiliate-led recommendations.</strong> When we earn commission from a provider mentioned in a guide, the affiliate disclosure appears on the page. We don&rsquo;t change the editorial position based on the commission.</li>
        </ul>

        <h2>Accuracy and corrections</h2>
        <p>
          We aim for zero errors on statutory figures. If you spot a mistake — a wrong threshold, an out-of-date rate, a broken HMRC link — please email <a href="mailto:enquiries@richquid.co.uk">enquiries@richquid.co.uk</a>. We&rsquo;ll correct it, log it, and bump the page&rsquo;s &ldquo;Last reviewed&rdquo; date.
        </p>

        <h2>If you need actual advice</h2>
        <p>
          For personal financial advice in the UK, the regulated route is to find an adviser via the <a href="https://register.fca.org.uk/" target="_blank" rel="noopener noreferrer">FCA Register</a> or impartial guidance via <a href="https://www.moneyhelper.org.uk/" target="_blank" rel="noopener noreferrer">MoneyHelper</a> (the government&rsquo;s free service). RichQuid is neither — and won&rsquo;t pretend to be.
        </p>
      </div>
    </article>
  )
}
