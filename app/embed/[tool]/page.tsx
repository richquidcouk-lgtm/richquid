import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { TOOLS, getTool } from '@/lib/tools'
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

export function generateStaticParams() {
  return TOOLS.filter(t => t.status === 'live').map(t => ({ tool: t.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const tool = getTool(params.tool)
  if (!tool) return { title: 'Calculator not found', robots: { index: false, follow: false } }
  return {
    title: `${tool.title} — embed`,
    description: tool.description,
    robots: { index: false, follow: false },
    alternates: { canonical: `${SITE_URL}/tools/${tool.slug}` },
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

export default function EmbedPage({ params }: Props) {
  const tool = getTool(params.tool)
  if (!tool) notFound()
  const Calculator = CALCULATORS[tool.slug]
  if (!Calculator) notFound()

  return (
    <div className="mx-auto max-w-[800px] px-4 py-4 sm:px-6 sm:py-6">
      <header className="mb-4 border-b border-rule pb-3">
        <h1 className="font-serif-display text-[clamp(20px,3.5vw,28px)] leading-tight">
          {tool.title}
        </h1>
      </header>

      <Calculator />

      <footer className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-rule pt-3 text-[12px] text-[color:var(--ink-3)]">
        <span>Educational only · not personal financial advice</span>
        <Link
          href={`${SITE_URL}/tools/${tool.slug}`}
          target="_top"
          rel="noopener"
          className="font-semibold text-[color:var(--green)] underline-offset-4 hover:underline"
        >
          Powered by Rich<span className="text-[color:var(--green-dark)]">Quid</span> →
        </Link>
      </footer>
    </div>
  )
}
