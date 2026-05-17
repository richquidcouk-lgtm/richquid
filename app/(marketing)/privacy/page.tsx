import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy policy',
  description: 'How RichQuid collects and uses your data. Plain English summary of our UK GDPR obligations and your rights.',
  alternates: { canonical: '/privacy' },
}

const UPDATED = '17 May 2026'

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-prose px-5 py-16 sm:px-0">
      <header className="mb-10 border-b border-rule pb-8">
        <p className="metadata mb-3 uppercase tracking-[0.2em] text-[color:var(--green)]">Privacy policy</p>
        <h1 className="font-serif-display text-[clamp(34px,5vw,52px)] leading-[1.05]">
          Your data. <em className="not-italic text-[color:var(--green)]">Plainly explained.</em>
        </h1>
        <p className="metadata mt-4">Last updated: {UPDATED}</p>
      </header>

      <div className="prose">
        <p>
          This page explains what data we collect, why, and what you can do about it. RichQuid is operated from the United Kingdom and is bound by the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
        </p>

        <h2>What we collect</h2>
        <ul>
          <li>
            <strong>Analytics.</strong> When you visit a page we record anonymised, aggregated information such as the page URL, browser type, device type, country, and the time of your visit. We use this to understand which guides and calculators are useful. We use Vercel&rsquo;s built-in analytics, which does not use cookies and does not identify individual users. If we later add Google Analytics, we will update this page first.
          </li>
          <li>
            <strong>Newsletter sign-ups.</strong> If you choose to subscribe to our newsletter, we store the email address you provide. We use it only to send the newsletter and to send a confirmation message. We do not sell, rent or share newsletter addresses with anyone.
          </li>
          <li>
            <strong>Affiliate click-throughs.</strong> When you click an affiliate link out of RichQuid, the destination provider receives standard referral information (typically a referral code that identifies RichQuid, and the page you came from). They do not receive your email or name from us.
          </li>
          <li>
            <strong>Contact emails.</strong> If you email us at enquiries@richquid.co.uk we keep your email and the contents of your message for as long as we need to reply, and for our records of past correspondence.
          </li>
        </ul>

        <h2>What we don&rsquo;t collect</h2>
        <ul>
          <li>We do not require an account to use the site or the calculators.</li>
          <li>We do not use third-party advertising trackers or remarketing pixels.</li>
          <li>We do not sell, rent, or trade your personal data.</li>
        </ul>

        <h2>Third parties</h2>
        <ul>
          <li><strong>Vercel</strong> hosts the site and provides the analytics described above.</li>
          <li><strong>Affiliate networks</strong> (e.g. AWIN, Impact, partner-direct programmes) receive a referral identifier when you click an outbound affiliate link. Their privacy policies apply to anything that happens after you leave our site.</li>
          <li>If we add a newsletter provider (e.g. Buttondown, ConvertKit), we will list it here and link to their privacy policy.</li>
        </ul>

        <h2>Cookies</h2>
        <p>
          RichQuid does not set advertising or tracking cookies. The site may set strictly necessary cookies (for example, a preference for light/dark mode) which do not identify you. Vercel&rsquo;s analytics is cookie-less.
        </p>

        <h2>Your rights under UK GDPR</h2>
        <p>
          You have the right to:
        </p>
        <ul>
          <li>access the personal data we hold about you,</li>
          <li>ask us to correct it if it is wrong,</li>
          <li>ask us to delete it,</li>
          <li>object to or restrict our processing of it,</li>
          <li>complain to the Information Commissioner&rsquo;s Office (<a href="https://www.ico.org.uk" target="_blank" rel="noopener noreferrer">ico.org.uk</a>).</li>
        </ul>
        <p>
          To exercise any of those rights, email <a href="mailto:enquiries@richquid.co.uk">enquiries@richquid.co.uk</a> with the subject &ldquo;Data request&rdquo;. We aim to reply within 30 days.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          We&rsquo;ll update this page when our data practices change. The &ldquo;last updated&rdquo; date at the top of this page will always reflect the most recent revision.
        </p>
      </div>
    </article>
  )
}
