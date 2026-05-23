'use client'

import { usePathname } from 'next/navigation'

/**
 * Conditionally renders site Header + Footer.
 * Suppressed on /embed/* routes so the embedded calculator iframe
 * shows only the calculator, not the surrounding site chrome.
 *
 * Header and Footer are still rendered as Server Components on the
 * server side and passed as ReactNode props.
 */
export default function SiteChrome({
  header,
  footer,
  children,
}: {
  header: React.ReactNode
  footer: React.ReactNode
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isEmbed = pathname?.startsWith('/embed/')

  if (isEmbed) {
    return <main id="main">{children}</main>
  }

  return (
    <>
      {header}
      <main id="main">{children}</main>
      {footer}
    </>
  )
}
