import type { LucideIcon } from 'lucide-react'
import {
  Calculator, PiggyBank, ShieldCheck, Scale, TrendingUp,
  Wallet, Home, Landmark, Receipt, LineChart, GraduationCap,
} from 'lucide-react'

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
    slug: 'take-home-pay-calculator',
    title: 'Take-Home Pay Calculator',
    description: 'See what actually lands in your bank after tax, NI, pension and student loan — for England, Wales, NI or Scotland.',
    status: 'live',
    icon: Wallet,
    featured: true,
  },
  {
    slug: 'stamp-duty-calculator',
    title: 'Stamp Duty Calculator',
    description: 'SDLT, LBTT or LTT — work out the property tax owed in England, Scotland or Wales, with first-time buyer and second-home rules.',
    status: 'live',
    icon: Home,
    featured: true,
  },
  {
    slug: 'mortgage-affordability-calculator',
    title: 'Mortgage Affordability',
    description: 'How much a UK lender would actually let you borrow — with the same stress test they use.',
    status: 'live',
    icon: Landmark,
    featured: true,
  },
  {
    slug: 'isa-allowance-tracker',
    title: 'ISA Allowance Tracker',
    description: 'See how much of your £20,000 allowance is left, across every type of ISA you hold.',
    status: 'live',
    icon: PiggyBank,
  },
  {
    slug: 'salary-sacrifice-calculator',
    title: 'Salary Sacrifice Calculator',
    description: "Find out how much your employer's pension scheme actually saves you in tax and NI.",
    status: 'live',
    icon: Calculator,
  },
  {
    slug: 'emergency-fund-calculator',
    title: 'Emergency Fund Calculator',
    description: 'Work out how much cash you should have set aside, based on your real monthly costs.',
    status: 'live',
    icon: ShieldCheck,
  },
  {
    slug: 'self-assessment-tax-estimator',
    title: 'Self-Assessment Tax Estimator',
    description: 'Side hustle or self-employed? Estimate the tax and Class 4 NI you&rsquo;ll owe before filing.',
    status: 'live',
    icon: Receipt,
  },
  {
    slug: 'capital-gains-dividend-tax-calculator',
    title: 'Capital Gains & Dividend Tax',
    description: 'Work out CGT or dividend tax owed outside an ISA, with the post-2024 rates and lower allowances.',
    status: 'live',
    icon: LineChart,
  },
  {
    slug: 'student-loan-calculator',
    title: 'Student Loan Repayment',
    description: 'See what you&rsquo;ll repay across Plans 1, 2, 4, 5 and Postgrad — including the combined undergrad+postgrad case.',
    status: 'live',
    icon: GraduationCap,
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
