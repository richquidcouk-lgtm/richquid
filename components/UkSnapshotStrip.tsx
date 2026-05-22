import { SNAPSHOT, SNAPSHOT_LAST_VERIFIED, formatAsOf } from '@/lib/uk-snapshot'

export default function UkSnapshotStrip() {
  return (
    <section
      aria-labelledby="snapshot-heading"
      className="border-b border-rule bg-white"
    >
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h2
            id="snapshot-heading"
            className="metadata uppercase tracking-[0.22em] text-[11.5px] text-[color:var(--green)] sm:text-[12px]"
          >
            UK money snapshot
          </h2>
          <p className="metadata text-[11.5px] text-[color:var(--ink-3)]">
            Last verified {formatAsOf(SNAPSHOT_LAST_VERIFIED)} · figures are from BoE and ONS
          </p>
        </div>

        <dl className="grid gap-5 sm:grid-cols-3">
          {SNAPSHOT.map(m => (
            <div key={m.label} className="border-l-2 border-[color:var(--green)] pl-4">
              <dt className="metadata text-[12px] uppercase tracking-[0.18em] text-[color:var(--ink-3)]">
                {m.label}
              </dt>
              <dd className="mt-1.5 font-serif-display text-[32px] leading-none tabular-nums text-[color:var(--ink)]">
                {m.value}
              </dd>
              <dd className="metadata mt-2 text-[12px] text-[color:var(--ink-3)]">
                As of {formatAsOf(m.asOf)} ·{' '}
                <a
                  href={m.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-4 hover:underline hover:text-[color:var(--green)]"
                >
                  {m.source}
                </a>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
