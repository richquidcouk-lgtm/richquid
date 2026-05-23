import Link from 'next/link'
import CategoryNav from './CategoryNav'

const NAV = [
  { href: '/tools', label: 'Tools' },
  { href: '/guides', label: 'Guides' },
  { href: '/best-savings-rates', label: 'Rates' },
  { href: '/about', label: 'About' },
  { href: '/start-here', label: 'Start Here' },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-[color:var(--paper)]/85 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--paper)]/75">
      <div className="border-b border-rule">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="font-serif-display text-2xl tracking-tight">
            Rich<span className="text-[color:var(--green)]">Quid</span>
          </Link>
          <nav aria-label="Primary" className="flex items-center gap-1 sm:gap-2 text-[15px]">
            {NAV.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded px-2.5 py-1.5 text-[color:var(--ink-2)] transition-colors hover:text-[color:var(--green)] hover:bg-[color:var(--green-soft)] sm:px-3"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <CategoryNav />
    </header>
  )
}
