'use client'

import { useState } from 'react'
import { Check, Link2 } from 'lucide-react'

export default function ShareButton({ label = 'Copy share link' }: { label?: string }) {
  const [copied, setCopied] = useState(false)

  const onClick = async () => {
    if (typeof window === 'undefined') return
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API can fail (insecure context, permission). Fall back to a quick
      // visual nudge so the user knows something happened — they can still copy
      // the URL bar manually.
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-md border border-rule bg-white px-3 py-1.5 text-[13px] font-semibold text-[color:var(--ink-2)] transition hover:border-[color:var(--green)] hover:text-[color:var(--green)]"
      aria-live="polite"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
          Copied
        </>
      ) : (
        <>
          <Link2 className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
          {label}
        </>
      )}
    </button>
  )
}
