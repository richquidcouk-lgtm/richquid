export type ValueBar = { label: string; value: number; tone?: 'green' | 'gold' }

/** Shared zero baseline and proportional lengths; negative amounts extend left. */
export default function ValueBars({ title, description, items }: { title: string; description: string; items: ValueBar[] }) {
  const maximum = Math.max(1, ...items.map(item => Math.abs(item.value)))
  const signed = items.some(item => item.value < 0)
  const origin = signed ? 50 : 0
  const span = signed ? 50 : 100
  const money = (value: number) => value.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 2 })
  return <figure className="my-6 rounded-xl border border-rule bg-white p-5 sm:p-6" aria-label={title}>
    <figcaption><span className="block text-xs font-semibold uppercase tracking-widest text-[color:var(--green)]">The numbers, pictured</span><strong className="mt-2 block font-serif-display text-xl leading-snug">{title}</strong><span className="mt-2 block text-sm leading-relaxed text-[color:var(--ink-2)]">{description}</span></figcaption>
    <dl className="mt-6 space-y-5">{items.map(item => {
      const width = Math.abs(item.value) / maximum * span
      return <div key={item.label}><div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-sm"><dt>{item.label}</dt><dd className="font-semibold tabular-nums">{money(item.value)}</dd></div>
        <div aria-hidden="true" className="relative h-5 overflow-hidden rounded bg-[color:var(--paper)]">
          <div className="absolute inset-y-0 w-px bg-[color:var(--ink-3)]" style={{ left: `${origin}%` }}/>
          <div className="absolute inset-y-0 rounded-sm" style={{ left: `${item.value < 0 ? origin - width : origin}%`, width: `${width}%`, backgroundColor: item.value < 0 ? '#A33F39' : item.tone === 'gold' ? '#A88539' : '#0F4F3A' }}/>
        </div></div>
    })}</dl>
    <p className="mt-4 text-xs text-[color:var(--ink-3)]">{signed ? 'Bars share the centre zero line. Negative amounts extend left.' : 'Bars start at zero and share the same scale.'} Exact amounts are shown above each bar.</p>
  </figure>
}
