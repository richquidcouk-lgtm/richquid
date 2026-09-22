import { serializeJsonLd } from '@/lib/schema'
import type { Metadata } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import Analytics from '@/components/Analytics'
import CookieBanner from '@/components/CookieBanner'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SiteChrome from '@/components/SiteChrome'
import './globals.css'


const serif = Fraunces({
  subsets: ['latin'],
  variable: '--next-font-serif',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const sans = Inter({
  subsets: ['latin'],
  variable: '--next-font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const SITE_URL = process.env.SITE_URL || 'https://www.richquid.co.uk'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'RichQuid — UK personal finance, in plain English',
    template: '%s · RichQuid',
  },
  description: 'Guides, calculators and clear thinking on UK money — ISAs, pensions, salary sacrifice, savings, tax and mortgages. Built by data engineers, not bankers.',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'RichQuid',
    url: SITE_URL,
    title: 'RichQuid — UK personal finance, in plain English',
    description: 'Guides, calculators and clear thinking on UK money — ISAs, pensions, salary sacrifice, savings, tax and mortgages.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RichQuid — UK personal finance, in plain English',
    description: 'Guides, calculators and clear thinking on UK money — ISAs, pensions, savings, tax and mortgages.',
  },
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  verification: {
    google: 'skpRS0FSi8wJlSFBbYdYL9v6UmuFKGFWLqDSrJ95TiY',
    other: {
      'msvalidate.01': 'E0AA4BAEBA7006748D1F8712548C6C2B',
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'RichQuid',
    url: SITE_URL,
    logo: `${SITE_URL}/logo`,
    description: 'UK personal finance — guides, calculators and clear thinking on ISAs, pensions, salary sacrifice, savings, tax and mortgages.',
    sameAs: [],
  }
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: 'RichQuid',
    url: SITE_URL,
    inLanguage: 'en-GB',
    publisher: { '@id': `${SITE_URL}/#organization` },
  }

  return (
    <html lang="en-GB" className={`${serif.variable} ${sans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(websiteJsonLd) }}
        />
      </head>
      <body>
        <Analytics />
        <CookieBanner />
        <SiteChrome header={<Header />} footer={<Footer />}>
          {children}
        </SiteChrome>
      </body>
    </html>
  )
}
