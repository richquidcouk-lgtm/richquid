import Link from 'next/link'

export interface Tool {
  slug: string
  title: string
  description: string
  status: 'live' | 'coming-soon'
  icon?: string
}

export default function ToolCard({ tool }: { tool: Tool }) {
  const isLive = tool.status === 'live'
  const Wrapper: React.ElementType = isLive ? Link : 'div'
  const wrapperProps = isLive ? { href: `/tools/${tool.slug}` } : {}

  return (
    <Wrapper
      {...wrapperProps}
      className={`group flex h-full flex-col rounded-lg border border-rule bg-white p-5 transition-shadow ${isLive ? 'hover:shadow-sm cursor-pointer' : 'opacity-95'}`}
    >
      <div className="metadata mb-3">
        {isLive ? (
          <span className="inline-block rounded-full bg-[color:var(--gold-soft)] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-[color:var(--gold)]">
            Calculator
          </span>
        ) : (
          <span className="inline-block rounded-full bg-[color:var(--rule)] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-[color:var(--ink-3)]">
            Coming soon
          </span>
        )}
      </div>
      <h3 className="font-serif-display text-[22px] leading-snug text-[color:var(--ink)]">{tool.title}</h3>
      <p className="mt-2 text-[15px] text-[color:var(--ink-2)]">{tool.description}</p>
      <div className="metadata mt-auto pt-4 text-[13px] text-[color:var(--green)]">
        {isLive ? 'Open the calculator →' : 'Notify me when it lands →'}
      </div>
    </Wrapper>
  )
}
