import type { Tool } from '@/components/ToolCard'

export const TOOLS: Tool[] = [
  { slug: 'isa-allowance-tracker',       title: 'ISA Allowance Tracker',       description: 'See how much of your £20,000 allowance is left this tax year.', status: 'coming-soon' },
  { slug: 'sipp-vs-workplace-pension',   title: 'SIPP vs Workplace Pension',   description: 'Find out when adding a SIPP makes sense on top of your workplace scheme.', status: 'coming-soon' },
  { slug: 'lisa-vs-help-to-buy-isa',     title: 'LISA vs Help to Buy ISA',     description: 'Compare the bonus on offer for first-time buyers, side by side.', status: 'coming-soon' },
  { slug: 'salary-sacrifice-calculator', title: 'Salary Sacrifice Calculator', description: 'Check if your employer scheme is actually worth it.', status: 'coming-soon' },
  { slug: 'emergency-fund-calculator',   title: 'Emergency Fund Calculator',   description: 'Work out the right size for your safety net based on your real costs.', status: 'coming-soon' },
]

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find(t => t.slug === slug)
}
