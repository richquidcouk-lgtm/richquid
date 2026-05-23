import Link from 'next/link'
import { CATEGORIES, categorySlug } from '@/lib/types'

/**
 * Secondary navigation bar showing All + 8 content categories.
 * Rendered site-wide below the main Header.
 */
export default function CategoryNav() {
  return (
    <nav
      aria-label="Categories"
      className="border-b border-rule bg-[color:var(--paper)]/95 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--paper)]/85"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <ul className="flex items-center gap-x-1 gap-y-1 overflow-x-auto whitespace-nowrap py-2 text-[13px] sm:gap-x-2 sm:text-[14px]">
          <li>
            <Link
              href="/guides"
              className="inline-block rounded-full px-3 py-1 font-semibold text-[color:var(--ink)] hover:bg-[color:var(--green-soft)] hover:text-[color:var(--green-dark)]"
            >
              All
            </Link>
          </li>
          {CATEGORIES.map(cat => (
            <li key={cat}>
              <Link
                href={`/guides/category/${categorySlug(cat)}`}
                className="inline-block rounded-full px-3 py-1 text-[color:var(--ink-2)] hover:bg-[color:var(--green-soft)] hover:text-[color:var(--green-dark)]"
              >
                {cat}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
