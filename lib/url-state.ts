'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { parseAmount } from './uk-tax'

/**
 * useStateFromUrl
 *
 * Drop-in replacement for useState<string> that syncs the value to a query
 * parameter on the current URL — so a calculator's inputs can be shared via
 * link. Uses window.history.replaceState so it doesn't trigger Next.js
 * navigation or refetches.
 *
 * - On first mount, reads the param from window.location.search and uses it
 *   if present; otherwise falls back to the default.
 * - On every set, writes the value back to the URL (omitting the param when
 *   the value equals the default, to keep links short).
 */
export function useStateFromUrl(
  key: string,
  defaultValue: string,
): [string, (next: string) => void] {
  const [value, setValueLocal] = useState<string>(defaultValue)
  const initialized = useRef(false)
  const defaultRef = useRef(defaultValue)
  defaultRef.current = defaultValue

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const fromUrl = params.get(key)
    const options: Record<string, string[]> = {
      loan: ['none', 'plan1', 'plan2', 'plan4', 'plan5', 'postgrad'],
      pension: ['none', 'salary-sacrifice', 'relief-at-source'],
      scotland: ['true', 'false'],
      region: ['england', 'scotland', 'wales'],
      ftb: ['true', 'false'],
      add: ['true', 'false'],
    }
    if (fromUrl !== null && (options[key] ? options[key].includes(fromUrl) : Number.isFinite(parseAmount(fromUrl)))) setValueLocal(fromUrl)
  }, [key])

  const setValue = useCallback(
    (next: string) => {
      setValueLocal(next)
      if (typeof window === 'undefined') return
      const url = new URL(window.location.href)
      if (next && next !== defaultRef.current) {
        url.searchParams.set(key, next)
      } else {
        url.searchParams.delete(key)
      }
      window.history.replaceState({}, '', url.toString())
    },
    [key],
  )

  return [value, setValue]
}
