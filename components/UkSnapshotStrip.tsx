import { SNAPSHOT } from '@/lib/uk-snapshot'
export default function UkSnapshotStrip() {
  return <section aria-labelledby="snapshot-heading" className="border-b border-rule bg-white">
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
      <h2 id="snapshot-heading" className="font-serif-display text-2xl">Check the latest UK money figures</h2>
      <p className="mt-2 text-sm">Use the official release for the latest value and reference period.</p>
      <ul className="mt-5 grid gap-5 sm:grid-cols-3">{SNAPSHOT.map(metric => <li key={metric.label} className="border-l-2 border-[color:var(--green)] pl-4">
        <a className="font-semibold underline" href={metric.sourceUrl}>{metric.label}</a><p className="mt-2 text-sm">Latest release from {metric.source}</p>
      </li>)}</ul>
    </div>
  </section>
}
