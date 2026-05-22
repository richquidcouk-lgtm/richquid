import type { Metadata } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import Script from 'next/script'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import './globals.css'

const GA_ID = 'G-1SNFQ7XSZX'

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
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'RichQuid' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RichQuid — UK personal finance, in plain English',
    description: 'Guides, calculators and clear thinking on UK money — ISAs, pensions, savings, tax and mortgages.',
  },
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  verification: {
    other: {
      'msvalidate.01': 'E0AA4BAEBA7006748D1F8712548C6C2B',
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${serif.variable} ${sans.variable}`}>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      </head>
      <body>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
