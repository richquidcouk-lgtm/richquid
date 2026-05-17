'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function NewsletterInline() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'ok' | 'error'>('idle')
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    setError('')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `${res.status}`)
      }
      setStatus('ok')
      setEmail('')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Could not subscribe')
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-2 sm:flex-row" aria-label="Newsletter sign-up">
      <label htmlFor="rq-newsletter-email" className="sr-only">Email address</label>
      <input
        id="rq-newsletter-email"
        name="email"
        type="email"
        required
        placeholder="you@example.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        autoComplete="email"
        className="flex-1 rounded-md border border-rule bg-white px-4 py-3 text-[15px] text-[color:var(--ink)] placeholder:text-[color:var(--ink-3)] focus:border-[color:var(--green)] focus:outline-none"
      />
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="rounded-md bg-[color:var(--green)] px-6 py-3 text-[15px] font-semibold text-[color:var(--paper)] transition-colors hover:bg-[color:var(--green-dark)] disabled:opacity-60"
      >
        {status === 'submitting' ? 'Subscribing…' : 'Subscribe'}
      </button>
      {status === 'ok' && (
        <p className="mt-3 w-full text-center text-[14px] text-[color:var(--green)] sm:mt-0 sm:self-center sm:text-left">Thanks — check your inbox to confirm.</p>
      )}
      {status === 'error' && (
        <p className="mt-3 w-full text-center text-[14px] text-[#7A2E2E] sm:mt-0 sm:self-center sm:text-left">Couldn&rsquo;t subscribe ({error}). <Link href="/contact" className="underline underline-offset-2">Try again</Link>.</p>
      )}
    </form>
  )
}
