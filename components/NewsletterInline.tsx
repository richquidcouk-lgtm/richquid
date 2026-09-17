import Link from 'next/link'
export default function NewsletterInline() {
  return <div className="mt-8 flex justify-center gap-5"><Link className="underline" href="/guides">Explore guides</Link><Link className="underline" href="/tools">Use a calculator</Link></div>
}
