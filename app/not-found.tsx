import Link from 'next/link'

export default function NotFound() {
  return (
    <article className="mx-auto max-w-prose px-5 py-24 text-center sm:px-0">
      <p className="metadata mb-3 uppercase tracking-[0.2em] text-[color:var(--green)]">404</p>
      <h1 className="font-serif-display text-[clamp(36px,6vw,60px)] leading-[1.05]">
        We can&rsquo;t find that page.
      </h1>
      <p className="mt-5 text-[18px] leading-relaxed text-[color:var(--ink-2)]">
        It may have moved, or you may have followed an old link.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="rounded-md bg-[color:var(--green)] px-5 py-2.5 text-[15px] font-semibold text-[color:var(--paper)] hover:bg-[color:var(--green-dark)]">Home</Link>
        <Link href="/guides" className="rounded-md border border-[color:var(--ink)] px-5 py-2.5 text-[15px] font-semibold text-[color:var(--ink)] hover:bg-[color:var(--ink)] hover:text-[color:var(--paper)]">Guides</Link>
        <Link href="/tools" className="rounded-md border border-[color:var(--ink)] px-5 py-2.5 text-[15px] font-semibold text-[color:var(--ink)] hover:bg-[color:var(--ink)] hover:text-[color:var(--paper)]">Calculators</Link>
      </div>
    </article>
  )
}
