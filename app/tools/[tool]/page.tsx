import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { TOOLS, getTool } from '@/lib/tools'
import AffiliateDisclosure from '@/components/AffiliateDisclosure'

type Props = { params: { tool: string } }

export async function generateStaticParams() {
  return TOOLS.map(t => ({ tool: t.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tool = getTool(params.tool)
  if (!tool) return { title: 'Calculator not found' }
  return {
    title: tool.title,
    description: tool.description,
    alternates: { canonical: `/tools/${tool.slug}` },
  }
}

export default function ToolPage({ params }: Props) {
  const tool = getTool(params.tool)
  if (!tool) notFound()

  return (
    <article className="mx-auto max-w-prose px-5 py-16 sm:px-0">
      <header className="mb-10 border-b border-rule pb-8">
        <p className="metadata mb-3 uppercase tracking-[0.2em] text-[color:var(--gold)]">Calculator</p>
        <h1 className="font-serif-display text-[clamp(34px,5vw,52px)] leading-[1.05]">{tool.title}</h1>
        <p className="mt-4 text-[18px] leading-relaxed text-[color:var(--ink-2)]">{tool.description}</p>
      </header>

      <section className="rounded-lg border border-rule bg-white p-8 text-center">
        <p className="metadata uppercase tracking-[0.2em] text-[color:var(--gold)]">Status</p>
        <p className="mt-3 font-serif-display text-3xl">Coming soon — building this next.</p>
        <p className="mt-4 text-[15px] leading-relaxed text-[color:var(--ink-2)]">
          We&rsquo;re writing this calculator now. It&rsquo;ll show every line of working and link to the source data behind each input.
        </p>
        <Link href="/tools" className="metadata mt-6 inline-block text-[color:var(--green)] underline-offset-4 hover:underline">
          ← Back to all calculators
        </Link>
      </section>

      <AffiliateDisclosure className="mt-12" />
    </article>
  )
}
