'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ANALYTICS_KEY, ANALYTICS_EVENT, setAnalyticsChoice } from '@/lib/analytics'

export function AnalyticsSettingsButton() {
  return <button className="min-h-11 text-sm underline underline-offset-4" onClick={() => window.dispatchEvent(new Event('richquid-open-analytics-settings'))}>Analytics preferences</button>
}
export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const pathname = usePathname()
  useEffect(() => {
    try { setVisible(!['accepted', 'declined'].includes(localStorage.getItem(ANALYTICS_KEY) || '')) } catch { setVisible(true) }
    const open = () => setVisible(true)
    const close = () => setVisible(false)
    window.addEventListener('richquid-open-analytics-settings', open); window.addEventListener(ANALYTICS_EVENT, close)
    return () => { window.removeEventListener('richquid-open-analytics-settings', open); window.removeEventListener(ANALYTICS_EVENT, close) }
  }, [])
  if (!visible || pathname.startsWith('/embed/')) return null
  return <section aria-label="Optional analytics" className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded border border-rule bg-white p-5 shadow-lg">
    <h2 className="font-semibold">Help us improve RichQuid?</h2><p className="mt-2 text-sm leading-relaxed">With your permission, Google Analytics measures page visits and calculator use. Our calculator events do not include the amounts you enter. You can use every tool without analytics. <Link href="/privacy" className="underline">Privacy policy</Link>.</p>
    <div className="mt-4 flex flex-wrap gap-3"><button className="min-h-11 rounded border border-rule px-4 py-2 font-semibold" onClick={() => setAnalyticsChoice('declined')}>Decline analytics</button><button className="min-h-11 rounded border border-rule px-4 py-2 font-semibold" onClick={() => setAnalyticsChoice('accepted')}>Allow analytics</button></div>
  </section>
}
