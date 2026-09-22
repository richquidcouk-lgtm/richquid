'use client'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { analyticsAllowed, ANALYTICS_EVENT, GA_ID } from '@/lib/analytics'

type Browser = Window & { gtag?: (...args: unknown[]) => void; dataLayer?: unknown[]; 'ga-disable-G-1SNFQ7XSZX'?: boolean }
export default function Analytics() {
  const pathname = usePathname()
  const [allowed, setAllowed] = useState(false)
  const configured = useRef(false)
  const previous = useRef('')
  useEffect(() => {
    const sync = () => setAllowed(analyticsAllowed())
    sync(); window.addEventListener(ANALYTICS_EVENT, sync); window.addEventListener('storage', sync)
    return () => { window.removeEventListener(ANALYTICS_EVENT, sync); window.removeEventListener('storage', sync) }
  }, [pathname])
  useEffect(() => {
    const browser = window as Browser
    browser[`ga-disable-${GA_ID}`] = !allowed
    if (!allowed || pathname.startsWith('/embed/')) { previous.current = ''; return }
    if (!configured.current) {
      browser.dataLayer = browser.dataLayer || []
      browser.gtag = function () { browser.dataLayer?.push(arguments) }
      browser.gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' })
      browser.gtag('js', new Date())
      browser.gtag('config', GA_ID, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false, page_location: window.location.origin + pathname, page_referrer: '' })
      const script = document.createElement('script'); script.async = true; script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`; document.head.appendChild(script)
      configured.current = true
    }
    if (previous.current !== pathname) {
      browser.gtag?.('set', { page_location: window.location.origin + pathname, page_referrer: previous.current ? window.location.origin + previous.current : '' })
      browser.gtag?.('event', 'page_view', { page_location: window.location.origin + pathname, page_referrer: previous.current ? window.location.origin + previous.current : '' })
      previous.current = pathname
    }
  }, [allowed, pathname])
  return null
}
