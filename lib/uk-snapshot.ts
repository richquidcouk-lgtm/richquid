/**
 * UK money snapshot — manually-maintained headline figures.
 *
 * Refresh these whenever the Bank of England MPC changes the base rate, when
 * ONS publishes the monthly CPI figure, or quarterly for slower-moving metrics.
 * Bump `SNAPSHOT_LAST_VERIFIED` even if nothing changed — the date is the trust
 * signal. Always verify against the linked source before publishing changes.
 */

export interface SnapshotMetric {
  label: string
  /** Pre-formatted display value, e.g. "4.25%". */
  value: string
  /** When the underlying figure was published or last decided. */
  asOf: string
  source: string
  sourceUrl: string
  note?: string
}

export const SNAPSHOT_LAST_VERIFIED = '2026-05-22'

export const SNAPSHOT: SnapshotMetric[] = [
  {
    label: 'Bank of England base rate',
    value: '4.25%',
    asOf: '2026-03-20',
    source: 'Bank of England',
    sourceUrl: 'https://www.bankofengland.co.uk/monetary-policy/the-interest-rate-bank-rate',
    note: 'Set by the Monetary Policy Committee.',
  },
  {
    label: 'UK CPI inflation',
    value: '2.3%',
    asOf: '2026-04-16',
    source: 'ONS',
    sourceUrl: 'https://www.ons.gov.uk/economy/inflationandpriceindices',
    note: '12-month rate, all items.',
  },
  {
    label: 'UK unemployment rate',
    value: '4.4%',
    asOf: '2026-04-15',
    source: 'ONS',
    sourceUrl: 'https://www.ons.gov.uk/employmentandlabourmarket/peoplenotinwork/unemployment',
    note: 'Aged 16+, seasonally adjusted.',
  },
]

export function formatAsOf(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}
