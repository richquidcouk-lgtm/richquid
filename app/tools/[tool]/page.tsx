import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { TOOLS, getTool } from '@/lib/tools'
import AffiliateDisclosure from '@/components/AffiliateDisclosure'
import { CALC_LAST_REVIEWED, TAX_YEAR } from '@/lib/uk-tax'
import { breadcrumbListSchema } from '@/lib/schema'
import IsaAllowanceTracker from '@/components/calculators/IsaAllowanceTracker'
import SalarySacrificeCalculator from '@/components/calculators/SalarySacrificeCalculator'
import EmergencyFundCalculator from '@/components/calculators/EmergencyFundCalculator'
import TakeHomePayCalculator from '@/components/calculators/TakeHomePayCalculator'
import StampDutyCalculator from '@/components/calculators/StampDutyCalculator'
import MortgageAffordabilityCalculator from '@/components/calculators/MortgageAffordabilityCalculator'
import SelfAssessmentEstimator from '@/components/calculators/SelfAssessmentEstimator'
import CgtDividendCalculator from '@/components/calculators/CgtDividendCalculator'
import StudentLoanCalculator from '@/components/calculators/StudentLoanCalculator'

type Props = { params: { tool: string } }

const SITE_URL = process.env.SITE_URL || 'https://www.richquid.co.uk'

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

const CALCULATORS: Record<string, React.ComponentType> = {
  'isa-allowance-tracker': IsaAllowanceTracker,
  'salary-sacrifice-calculator': SalarySacrificeCalculator,
  'emergency-fund-calculator': EmergencyFundCalculator,
  'take-home-pay-calculator': TakeHomePayCalculator,
  'stamp-duty-calculator': StampDutyCalculator,
  'mortgage-affordability-calculator': MortgageAffordabilityCalculator,
  'self-assessment-tax-estimator': SelfAssessmentEstimator,
  'capital-gains-dividend-tax-calculator': CgtDividendCalculator,
  'student-loan-calculator': StudentLoanCalculator,
}

export default function ToolPage({ params }: Props) {
  const tool = getTool(params.tool)
  if (!tool) notFound()

  const Calculator = CALCULATORS[tool.slug]
  const isLive = tool.status === 'live' && Calculator

  const breadcrumbSchema = breadcrumbListSchema([
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: tool.title },
  ])

  const jsonLd = isLive ? {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.title,
    description: tool.description,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    url: `${SITE_URL}/tools/${tool.slug}`,
    publisher: { '@type': 'Organization', name: 'RichQuid', url: SITE_URL },
    offers: { '@type': 'Offer', price: 0, priceCurrency: 'GBP' },
    inLanguage: 'en-GB',
  } : null

  return (
    <article className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <header className="mb-10 border-b border-rule pb-8">
        <p className="metadata mb-3 uppercase tracking-[0.2em] text-[color:var(--gold)]">Calculator</p>
        <h1 className="font-serif-display text-[clamp(34px,5vw,52px)] leading-[1.05]">{tool.title}</h1>
        <p className="mt-4 text-[18px] leading-relaxed text-[color:var(--ink-2)]">{tool.description}</p>
      </header>

      {isLive ? (
        <Calculator />
      ) : (
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
      )}

      <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-6">
        <Link href="/tools" className="metadata text-[color:var(--green)] underline-offset-4 hover:underline">
          ← All calculators
        </Link>
        <p className="metadata text-[12.5px] text-[color:var(--ink-3)]">
          Tax year {TAX_YEAR} · Last reviewed {new Date(CALC_LAST_REVIEWED).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })} · Educational only, not personal financial advice
        </p>
      </div>

      <AffiliateDisclosure className="mt-10" />
    </article>
  )
}
