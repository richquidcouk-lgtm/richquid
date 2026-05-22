import type { LucideIcon } from 'lucide-react'
import { Calculator, PiggyBank, ShieldCheck, Scale, TrendingUp } from 'lucide-react'

export interface Tool {
  slug: string
  title: string
  description: string
  status: 'live' | 'coming-soon'
  icon: LucideIcon
  /** Should this tool appear on the homepage Featured Tools section? */
  featured?: boolean
}

export const TOOLS: Tool[] = [
  {
    slug: 'isa-allowance-tracker',
    title: 'ISA Allowance Tracker',
    description: 'See how much of your £20,000 allowance is left, across every type of ISA you hold.',
    status: 'live',
    icon: PiggyBank,
    featured: true,
  },
  {
    slug: 'salary-sacrifice-calculator',
    title: 'Salary Sacrifice Calculator',
    description: "Find out how much your employer's pension scheme actually saves you in tax and NI.",
    status: 'live',
    icon: Calculator,
    featured: true,
  },
  {
    slug: 'emergency-fund-calculator',
    title: 'Emergency Fund Calculator',
    description: 'Work out how much cash you should have set aside, based on your real monthly costs.',
    status: 'live',
    icon: ShieldCheck,
    featured: true,
  },
  {
    slug: 'sipp-vs-workplace-pension',
    title: 'SIPP vs Workplace Pension',
    description: 'Find out when adding a SIPP makes sense on top of your workplace scheme.',
    status: 'coming-soon',
    icon: TrendingUp,
  },
  {
    slug: 'lisa-vs-help-to-buy-isa',
    title: 'LISA vs Help to Buy ISA',
    description: 'Compare the bonus on offer for first-time buyers, side by side.',
    status: 'coming-soon',
    icon: Scale,
  },
]

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find(t => t.slug === slug)
}

export function getFeaturedTools(): Tool[] {
  return TOOLS.filter(t => t.featured)
}
