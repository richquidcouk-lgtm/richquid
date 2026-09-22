export const ANALYTICS_KEY = 'richquid-analytics-consent-v1'
export const ANALYTICS_EVENT = 'richquid-analytics-consent'
export const GA_ID = 'G-1SNFQ7XSZX'
type AnalyticsWindow = Window & { gtag?: (...args: unknown[]) => void; dataLayer?: unknown[]; 'ga-disable-G-1SNFQ7XSZX'?: boolean }
export function analyticsAllowed(): boolean {
  try { return typeof window !== 'undefined' && localStorage.getItem(ANALYTICS_KEY) === 'accepted' && !window.location.pathname.startsWith('/embed/') } catch { return false }
}
export function trackToolEvent(event: 'calculator_start' | 'calculator_complete', tool: 'net-cashback-calculator' | 'isa-allowance-tracker') {
  try {
    if (!analyticsAllowed() || !['calculator_start', 'calculator_complete'].includes(event) || !['net-cashback-calculator', 'isa-allowance-tracker'].includes(tool)) return
    ;(window as AnalyticsWindow).gtag?.('event', event, { tool_slug: tool })
  } catch { /* Analytics must never affect a calculation. No amounts or input text are sent. */ }
}
export function setAnalyticsChoice(choice: 'accepted' | 'declined') {
  try { localStorage.setItem(ANALYTICS_KEY, choice) } catch { /* Unavailable storage means analytics stays off. */ }
  const browser = window as AnalyticsWindow
  browser[`ga-disable-${GA_ID}`] = choice !== 'accepted'
  browser.gtag?.('consent', 'update', { analytics_storage: choice === 'accepted' ? 'granted' : 'denied' })
  window.dispatchEvent(new Event(ANALYTICS_EVENT))
}
