'use client'

import { useState } from 'react'

export default function Newsletter() {
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
    <section className="my-10 rounded-lg border border-rule bg-[color:var(--green-soft)] p-6 sm:p-8" aria-labelledby="newsletter-heading">
      <h3 id="newsletter-heading" className="font-serif-display text-2xl">One email a month. <em className="not-italic text-[color:var(--green)]">No spam.</em></h3>
      <p className="mt-2 text-[15px] text-[color:var(--ink-2)]">
        The most-read calculators and the UK rule changes that matter. Unsubscribe anytime.
      </p>
      <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor="newsletter-email">Email address</label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="flex-1 rounded-md border border-rule bg-white px-3 py-2.5 text-[15px] text-[color:var(--ink)] placeholder:text-[color:var(--ink-3)] focus:border-[color:var(--green)] focus:outline-none"
          autoComplete="email"
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="rounded-md bg-[color:var(--green)] px-5 py-2.5 text-[15px] font-semibold text-[color:var(--paper)] transition-colors hover:bg-[color:var(--green-dark)] disabled:opacity-60"
        >
          {status === 'submitting' ? 'Subscribing…' : 'Subscribe'}
        </button>
      </form>
      {status === 'ok' && (
        <p className="mt-3 text-[14px] text-[color:var(--green)]">Thanks — check your inbox to confirm.</p>
      )}
      {status === 'error' && (
        <p className="mt-3 text-[14px] text-[color:#7A2E2E]">Couldn&rsquo;t subscribe ({error}). Try again or email enquiries@richquid.co.uk.</p>
      )}
      <p className="mt-3 text-[12px] text-[color:var(--ink-3)]">We store your email only to send the newsletter. See our <a href="/privacy" className="underline underline-offset-2">privacy policy</a>.</p>
    </section>
  )
}
