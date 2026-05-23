'use client'

import { useState } from 'react'
import { Check, Code2 } from 'lucide-react'

/**
 * "Embed this calculator" UI shown on each tool page.
 * Renders the iframe HTML snippet a publisher can copy onto their site.
 */
export default function EmbedSnippet({ slug, title }: { slug: string; title: string }) {
  const [copied, setCopied] = useState(false)
  const iframeHeight = 1100 // generous default; publishers can adjust
  const iframeCode = `<iframe
  src="https://www.richquid.co.uk/embed/${slug}"
  width="100%"
  height="${iframeHeight}"
  frameborder="0"
  style="border:none;max-width:800px;width:100%;"
  loading="lazy"
  title="${title.replace(/"/g, '&quot;')} — calculator by RichQuid">
</iframe>`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(iframeCode)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    }
  }

  return (
    <details className="mt-8 rounded-md border border-rule bg-white p-5 text-[14.5px] leading-relaxed text-[color:var(--ink-2)]">
      <summary className="flex cursor-pointer items-center gap-2 font-semibold text-[color:var(--ink)]">
        <Code2 className="h-4 w-4 text-[color:var(--green)]" strokeWidth={1.75} aria-hidden />
        Embed this calculator on your site
      </summary>

      <div className="mt-4 space-y-3">
        <p>
          You can embed this calculator on your own website with the iframe snippet below. It works on any HTML page, blog or CMS. We ask that you keep the &ldquo;Powered by RichQuid&rdquo; link visible — no other restrictions.
        </p>
        <p className="metadata text-[12.5px] text-[color:var(--ink-3)]">
          Educational only. Not personal financial advice. Tax-year figures may change; check periodically.
        </p>

        <div className="relative">
          <pre className="overflow-x-auto rounded-md border border-rule bg-[color:var(--paper)] p-3 text-[12.5px] leading-relaxed text-[color:var(--ink-2)]">
{iframeCode}
          </pre>
          <button
            type="button"
            onClick={copy}
            className="absolute right-2 top-2 inline-flex items-center gap-1.5 rounded-md border border-rule bg-white px-2.5 py-1 text-[12px] font-semibold text-[color:var(--ink-2)] hover:border-[color:var(--green)] hover:text-[color:var(--green)]"
            aria-live="polite"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" strokeWidth={2.5} aria-hidden />
                Copied
              </>
            ) : (
              <>Copy</>
            )}
          </button>
        </div>

        <p className="metadata text-[12.5px] text-[color:var(--ink-3)]">
          Height defaults to {iframeHeight}px — adjust to fit your layout. The iframe is fully responsive within an 800px max-width container.
        </p>
      </div>
    </details>
  )
}
