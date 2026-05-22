'use client'

import { useMemo } from 'react'
import { formatGBP, parseAmount } from '@/lib/uk-tax'
import { useStateFromUrl } from '@/lib/url-state'
import ShareButton from './ShareButton'

type Region = 'england' | 'scotland' | 'wales'

type Band = { from: number; to: number; rate: number }

function bandTax(price: number, bands: Band[]): { total: number; breakdown: { band: string; rate: number; taxable: number; tax: number }[] } {
  let total = 0
  const breakdown: { band: string; rate: number; taxable: number; tax: number }[] = []
  for (const b of bands) {
    if (price <= b.from) break
    const top = Math.min(price, b.to)
    const taxable = top - b.from
    const tax = taxable * b.rate
    total += tax
    breakdown.push({
      band: `${formatGBP(b.from)} – ${b.to === Infinity ? '∞' : formatGBP(b.to)}`,
      rate: b.rate,
      taxable,
      tax,
    })
  }
  return { total, breakdown }
}

// England & NI: SDLT — bands from 1 April 2025
const SDLT_STANDARD: Band[] = [
  { from: 0, to: 125000, rate: 0 },
  { from: 125000, to: 250000, rate: 0.02 },
  { from: 250000, to: 925000, rate: 0.05 },
  { from: 925000, to: 1500000, rate: 0.10 },
  { from: 1500000, to: Infinity, rate: 0.12 },
]
const SDLT_FTB: Band[] = [
  { from: 0, to: 300000, rate: 0 },
  { from: 300000, to: 500000, rate: 0.05 },
]
const SDLT_FTB_LIMIT = 500000

// Scotland: LBTT — residential
const LBTT_STANDARD: Band[] = [
  { from: 0, to: 145000, rate: 0 },
  { from: 145000, to: 250000, rate: 0.02 },
  { from: 250000, to: 325000, rate: 0.05 },
  { from: 325000, to: 750000, rate: 0.10 },
  { from: 750000, to: Infinity, rate: 0.12 },
]
const LBTT_FTB: Band[] = [
  { from: 0, to: 175000, rate: 0 },
  { from: 175000, to: 250000, rate: 0.02 },
  { from: 250000, to: 325000, rate: 0.05 },
  { from: 325000, to: 750000, rate: 0.10 },
  { from: 750000, to: Infinity, rate: 0.12 },
]
const LBTT_ADS_RATE = 0.08
const LBTT_ADS_FLOOR = 40000

// Wales: LTT — main residential rates (from 10 Oct 2022)
const LTT_STANDARD: Band[] = [
  { from: 0, to: 225000, rate: 0 },
  { from: 225000, to: 400000, rate: 0.06 },
  { from: 400000, to: 750000, rate: 0.075 },
  { from: 750000, to: 1500000, rate: 0.10 },
  { from: 1500000, to: Infinity, rate: 0.12 },
]
// Wales higher residential rates (additional property, from 11 Dec 2024)
const LTT_HIGHER: Band[] = [
  { from: 0, to: 180000, rate: 0.05 },
  { from: 180000, to: 250000, rate: 0.085 },
  { from: 250000, to: 400000, rate: 0.10 },
  { from: 400000, to: 750000, rate: 0.125 },
  { from: 750000, to: 1500000, rate: 0.15 },
  { from: 1500000, to: Infinity, rate: 0.17 },
]

function withSurcharge(bands: Band[], surcharge: number): Band[] {
  return bands.map(b => ({ ...b, rate: b.rate + surcharge }))
}

export default function StampDutyCalculator() {
  const [regionStr, setRegionStr] = useStateFromUrl('region', 'england')
  const region = regionStr as Region
  const setRegion = (r: Region) => setRegionStr(r)
  const [price, setPrice] = useStateFromUrl('price', '300000')
  const [ftbStr, setFtbStr] = useStateFromUrl('ftb', 'false')
  const firstTimeBuyer = ftbStr === 'true'
  const setFirstTimeBuyer = (v: boolean) => setFtbStr(v ? 'true' : 'false')
  const [addStr, setAddStr] = useStateFromUrl('add', 'false')
  const additional = addStr === 'true'
  const setAdditional = (v: boolean) => setAddStr(v ? 'true' : 'false')

  const result = useMemo(() => {
    const p = parseAmount(price)
    let bands: Band[] = []
    let flatSurchargeAmount = 0
    let regimeName = ''
    let regimeNote = ''

    if (region === 'england') {
      regimeName = 'SDLT'
      if (additional) {
        bands = withSurcharge(SDLT_STANDARD, 0.05) // +5% additional dwelling surcharge
      } else if (firstTimeBuyer && p <= SDLT_FTB_LIMIT) {
        bands = SDLT_FTB
      } else {
        bands = SDLT_STANDARD
        if (firstTimeBuyer && p > SDLT_FTB_LIMIT) {
          regimeNote = 'FTB relief does not apply above £500,000 — standard rates used.'
        }
      }
    } else if (region === 'scotland') {
      regimeName = 'LBTT'
      bands = firstTimeBuyer && !additional ? LBTT_FTB : LBTT_STANDARD
      if (additional && p >= LBTT_ADS_FLOOR) {
        flatSurchargeAmount = p * LBTT_ADS_RATE
        regimeNote = `Additional Dwelling Supplement (8%) of ${formatGBP(flatSurchargeAmount)} applied on the full price.`
      }
    } else {
      regimeName = 'LTT'
      bands = additional ? LTT_HIGHER : LTT_STANDARD
      if (firstTimeBuyer) regimeNote = 'Wales does not have a separate first-time buyer relief — the standard £225,000 threshold already applies to everyone.'
    }

    const { total, breakdown } = bandTax(p, bands)
    const grandTotal = total + flatSurchargeAmount
    const effective = p > 0 ? (grandTotal / p) * 100 : 0
    return { price: p, regimeName, regimeNote, breakdown, total, flatSurchargeAmount, grandTotal, effective }
  }, [region, price, firstTimeBuyer, additional])

  return (
    <section className="rounded-lg border border-rule bg-white p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="metadata uppercase tracking-[0.2em] text-[color:var(--green)]">Residential property tax</p>
        <ShareButton />
      </div>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <div>
            <p className="block text-[14px] font-semibold text-[color:var(--ink)]">Where is the property?</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {([
                ['england', 'England & NI (SDLT)'],
                ['scotland', 'Scotland (LBTT)'],
                ['wales', 'Wales (LTT)'],
              ] as const).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setRegion(key)}
                  className={`rounded-full border px-4 py-1.5 text-[13.5px] font-semibold transition ${
                    region === key ? 'border-[color:var(--green)] bg-[color:var(--green)] text-[color:var(--paper)]'
                                  : 'border-rule bg-white text-[color:var(--ink-2)] hover:border-[color:var(--green)]'
                  }`}
                >{label}</button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="block text-[14px] font-semibold text-[color:var(--ink)]">Purchase price</span>
            <div className="relative mt-2">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--ink-3)]">£</span>
              <input
                inputMode="decimal"
                value={price}
                onChange={e => setPrice(e.target.value)}
                aria-label="Property purchase price"
                className="w-full rounded-md border border-rule bg-[color:var(--paper)] py-2.5 pl-7 pr-3 text-[16px] tabular-nums focus:border-[color:var(--green)] focus:outline-none"
              />
            </div>
          </label>

          <div className="space-y-2">
            <label className="flex cursor-pointer items-start gap-3 rounded-md border border-rule bg-[color:var(--paper)] p-3">
              <input
                type="checkbox"
                checked={firstTimeBuyer}
                onChange={e => { setFirstTimeBuyer(e.target.checked); if (e.target.checked) setAdditional(false) }}
                className="mt-0.5 h-4 w-4 accent-[color:var(--green)]"
              />
              <span>
                <span className="block text-[14px] font-semibold text-[color:var(--ink)]">First-time buyer</span>
                <span className="metadata block text-[12.5px] text-[color:var(--ink-3)]">
                  Neither you nor anyone buying with you has ever owned a property anywhere in the world.
                </span>
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-3 rounded-md border border-rule bg-[color:var(--paper)] p-3">
              <input
                type="checkbox"
                checked={additional}
                onChange={e => { setAdditional(e.target.checked); if (e.target.checked) setFirstTimeBuyer(false) }}
                className="mt-0.5 h-4 w-4 accent-[color:var(--green)]"
              />
              <span>
                <span className="block text-[14px] font-semibold text-[color:var(--ink)]">Additional property</span>
                <span className="metadata block text-[12.5px] text-[color:var(--ink-3)]">
                  Buy-to-let, second home, or owning another property at completion. Adds a surcharge.
                </span>
              </span>
            </label>
          </div>
        </div>

        <aside className="rounded-md border border-rule bg-[color:var(--paper)] p-6">
          <p className="metadata uppercase tracking-[0.18em] text-[color:var(--ink-3)]">{result.regimeName} payable</p>
          <p className="mt-2 font-serif-display text-[44px] leading-none tabular-nums">{formatGBP(result.grandTotal)}</p>
          <p className="metadata mt-1 text-[12.5px]">
            Effective rate: {result.effective.toFixed(2)}% of {formatGBP(result.price)}
          </p>

          <div className="mt-5 border-t border-rule pt-4 text-[13.5px]">
            {result.breakdown.length === 0 && result.flatSurchargeAmount === 0 ? (
              <p className="text-[color:var(--ink-3)]">No tax due at this price.</p>
            ) : (
              <ul className="space-y-1.5 text-[color:var(--ink-2)]">
                {result.breakdown.map((b, i) => (
                  <li key={i} className="flex justify-between gap-3 tabular-nums">
                    <span className="text-[12.5px]">{b.band} @ {(b.rate * 100).toFixed(2)}%</span>
                    <span>{formatGBP(b.tax)}</span>
                  </li>
                ))}
                {result.flatSurchargeAmount > 0 && (
                  <li className="flex justify-between gap-3 border-t border-rule pt-1.5 tabular-nums">
                    <span className="text-[12.5px]">ADS surcharge</span>
                    <span>{formatGBP(result.flatSurchargeAmount)}</span>
                  </li>
                )}
              </ul>
            )}
          </div>

          {result.regimeNote && (
            <p className="metadata mt-4 rounded-md bg-[color:var(--gold-soft)]/40 px-3 py-2 text-[12.5px] text-[color:var(--ink-2)]">
              {result.regimeNote}
            </p>
          )}
        </aside>
      </div>

      <details className="mt-8 border-t border-rule pt-6 text-[14.5px] leading-relaxed text-[color:var(--ink-2)]">
        <summary className="cursor-pointer font-semibold text-[color:var(--ink)]">How this is worked out</summary>
        <div className="mt-3 space-y-2">
          <p>
            All three UK tax regimes are <em>banded</em> — you pay each rate on the slice of price that falls in that band, not the whole price. The numbers above show that slice-by-slice working.
          </p>
          <p>
            <strong>England &amp; NI:</strong> SDLT bands (current from 1 April 2025) — 0% to £125k, 2% to £250k, 5% to £925k, 10% to £1.5m, 12% above. FTB relief: 0% to £300k, 5% on £300–500k, none above £500k. Additional property: +5% on every band.
          </p>
          <p>
            <strong>Scotland:</strong> LBTT — 0% to £145k, 2% to £250k, 5% to £325k, 10% to £750k, 12% above. FTB relief: 0% threshold rises to £175k. Additional Dwelling Supplement: 8% on the full price (if over £40k).
          </p>
          <p>
            <strong>Wales:</strong> LTT — 0% to £225k, 6% to £400k, 7.5% to £750k, 10% to £1.5m, 12% above. No separate FTB relief. Higher rates for additional property are a different band set entirely (from 11 Dec 2024).
          </p>
          <p>
            Mixed-use, leasehold or company purchases are different — speak to a conveyancer.
          </p>
        </div>
      </details>
    </section>
  )
}
