'use client'

import { useEffect, useId, useState, type InputHTMLAttributes } from 'react'
import { parseAmount } from '@/lib/uk-tax'

/** Keep an invalid draft out of the calculation; explicitly label retained results. */
export default function AmountInput({ value, onChange, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const [draft, setDraft] = useState(String(value ?? ''))
  const id = useId()
  useEffect(() => setDraft(String(value ?? '')), [value])
  const invalid = !Number.isFinite(parseAmount(draft))
  return <>
    <input {...props} value={draft} aria-invalid={invalid || undefined}
      aria-describedby={[props['aria-describedby'], invalid ? id : ''].filter(Boolean).join(' ') || undefined}
      onChange={event => {
        const next = event.target.value
        setDraft(next)
        if (Number.isFinite(parseAmount(next))) onChange?.(event)
      }} />
    {invalid && <span id={id} role="alert" className="mt-2 block text-sm text-red-800">Enter a non-negative number, such as 1250.50. Results still use your last valid input.</span>}
  </>
}
