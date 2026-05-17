'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const STORAGE_KEY = 'richquid-cookie-pref'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true)
    } catch {
      // localStorage unavailable (e.g. private mode) — leave hidden, no banner.
    }
  }, [])

  function accept() {
    try { localStorage.setItem(STORAGE_KEY, 'accepted') } catch {}
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-4xl rounded-md border border-rule bg-white p-4 text-[14px] leading-relaxed shadow-md sm:p-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p className="text-[color:var(--ink-2)]">
          RichQuid uses cookie-less analytics from Vercel. We don&rsquo;t set advertising or tracking cookies.{' '}
          <Link href="/privacy" className="underline underline-offset-4 hover:text-[color:var(--green)]">Privacy policy</Link>.
        </p>
        <button
          type="button"
          onClick={accept}
          className="shrink-0 rounded-md bg-[color:var(--green)] px-5 py-2 text-[14px] font-semibold text-[color:var(--paper)] transition-colors hover:bg-[color:var(--green-dark)]"
        >
          Got it
        </button>
      </div>
    </div>
  )
}
