import Link from 'next/link'

export default function AffiliateDisclosure({ className = '' }: { className?: string }) {
  return (
    <aside
      className={`my-6 rounded-md border border-rule bg-[color:var(--paper)]/60 px-4 py-3 text-[13.5px] leading-relaxed text-[color:var(--ink-2)] ${className}`}
      role="note"
      aria-label="Affiliate disclosure"
    >
      <p>
        <span className="font-semibold text-[color:var(--ink)]">Affiliate disclosure.</span>{' '}
        RichQuid earns a commission from some providers mentioned on this page. You don&rsquo;t pay any more, and our editorial coverage stays independent.{' '}
        <Link href="/about" className="underline underline-offset-4 hover:text-[color:var(--green)]">Read more about how we make money</Link>.
      </p>
    </aside>
  )
}
