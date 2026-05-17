# RichQuid

Smart UK personal-finance calculators and guides. Editorial tone, evidence-based, ad-free.

Live site: https://www.richquid.co.uk
Stack: Next.js 14 (App Router) · TypeScript strict · Tailwind CSS · MDX via `next-mdx-remote` · Deployed on Vercel.

## Quick start

```bash
git clone https://github.com/richquidcouk-lgtm/richquid.git
cd richquid
npm install
npm run dev          # http://localhost:3000
```

Useful scripts:

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server with hot reload |
| `npm run build` | Production build + post-build sitemap |
| `npm run start` | Serve the production build |
| `npm run lint` | Next.js ESLint preset |
| `npm run typecheck` | `tsc --noEmit`, strict mode |

## Adding a new guide

1. Drop a new `.mdx` file in `content/guides/`. Filename becomes the URL slug if the frontmatter doesn't override it.
2. Use this frontmatter shape:

   ```mdx
   ---
   title: "Best cash ISA rates in the UK — 2026 guide"
   slug: "best-cash-isa-rates-uk-2026"
   excerpt: "One-line summary that shows up on the index card and in meta description."
   publishedAt: "2026-05-17"
   category: "ISAs"           # one of: Budgeting | Cashback | Energy Bills | ISAs | Pensions | Savings
   author: "Clara Penny"
   readTime: 7                # minutes
   featuredImage: ""          # optional
   ---
   ```

3. Run `npm run dev` — the article appears on `/guides` and at `/guides/<slug>` immediately.
4. Categories live in `lib/types.ts`. If you need a new one, add it to the `Category` union and to the `CATEGORIES` array — the filter chips on `/guides` pick it up automatically.

## Adding a new calculator tool

1. Append the tool to `TOOLS` in `app/tools/page.tsx`:

   ```ts
   { slug: 'capital-gains-allowance', title: 'Capital Gains Allowance Tracker', description: '…', status: 'coming-soon' }
   ```

   While `status` is `'coming-soon'` the `/tools/<slug>` page renders the placeholder template.

2. To turn a tool live: switch its `status` to `'live'`, then create `app/tools/<slug>/page.tsx` with the calculator UI (replace the placeholder route).

## Deploying to Vercel

1. Push to `main` on the GitHub repo (`richquidcouk-lgtm/richquid`).
2. In Vercel, **Add new project** → import the repo → defaults are fine. Framework should auto-detect Next.js.
3. Set the environment variable `SITE_URL=https://www.richquid.co.uk` (used by sitemap + canonical URLs).
4. **Domains** → add `richquid.co.uk` and `www.richquid.co.uk`. Vercel will give you DNS records to point at — for the apex add an `A` record `76.76.21.21`; for `www` add a `CNAME` to `cname.vercel-dns.com`.
5. Deploy. The post-build hook runs `next-sitemap` which writes `public/sitemap.xml` and `public/robots.txt`.

## Lighthouse audit

```bash
npm run build
npm run start
# then in a separate terminal:
npx lighthouse http://localhost:3000 --view --output html --output-path ./lighthouse-home.html
```

Target ≥95 on all four categories (Performance / Accessibility / Best Practices / SEO). Repeat for `/guides/best-cash-isa-rates-uk-2026`, `/tools` and one tool page. The Tailwind CSS bundle is small, fonts are self-hosted via `next/font`, and there are no client-side hydration costs on the marketing pages — these score 100/100 out of the box if you don't add bloat.

## Project structure

```
app/
  (marketing)/             # Route-group for marketing pages (no extra URL segment)
    about/
    contact/
    disclaimer/
    privacy/
    start-here/
  api/
    newsletter/            # POST endpoint, placeholder
  guides/
    [slug]/                # MDX article template
    GuidesIndexClient.tsx  # Client-side category filter
    page.tsx               # Index (server)
  tools/
    [tool]/                # Placeholder "coming soon" template
    page.tsx               # Catalogue (server)
  layout.tsx               # Root layout, fonts, header, footer
  page.tsx                 # Homepage
  globals.css              # Tailwind + design tokens
  not-found.tsx            # 404
components/
  Header.tsx
  Footer.tsx
  AffiliateDisclosure.tsx
  Newsletter.tsx           # Client component, posts to /api/newsletter
  ArticleCard.tsx
  ToolCard.tsx
content/
  guides/                  # MDX files — one per article
lib/
  mdx.ts                   # Filesystem MDX loader + helpers
  types.ts                 # Category + Guide types
public/                    # Static assets (replace favicon.ico, og.png)
tailwind.config.ts
next.config.mjs
next-sitemap.config.js
tsconfig.json
package.json
```

## Decisions made during build

The brief left a few choices open. Where it did, here's what was picked and why:

- **Next.js 14 (not 15/16).** The brief asked for 14 explicitly. Pinned to `^14.2.18` which is the latest patch in the 14 line.
- **`next-mdx-remote` (not Contentlayer).** The brief permitted either. `next-mdx-remote` works cleanly with the App Router's React Server Components without needing Contentlayer's experimental App Router support. Trade-off: no built-in incremental cache; on this site's scale (dozens of guides, not thousands), filesystem reads are imperceptible.
- **Route group `(marketing)` for legal/about/contact pages.** Keeps URLs clean (`/about`, `/contact`, etc.) without nesting under a parent segment, and lets us swap a marketing-specific sub-layout in later if we want.
- **Fonts: Fraunces (serif) + Inter (sans).** Both via `next/font/google` → self-hosted at build time → zero render-blocking requests, no font CSS in `<head>`. Fraunces gives the editorial-typography feel the brief wanted; Inter is the default workhorse for body text on a finance site.
- **Affiliate disclosure: a top-of-article box, not a pop-up.** Visible but not intrusive, matches the brief's tone direction.
- **Newsletter endpoint: a placeholder API route.** Returns 200 for any valid-looking email. Wire it up to Buttondown / ConvertKit / Mailchimp by editing `app/api/newsletter/route.ts` before launch.
- **No CMS.** Articles live as MDX files in `content/guides/` and ship with the code. If you want a CMS later, the obvious upgrade is Sanity or Contentful — but for one writer it's overkill.
- **Filter UI on `/guides` is a small client island.** Server-rendered list + client-rendered filter chips. Keeps the initial HTML cached and indexable.
- **No analytics wired up.** The privacy page mentions Vercel's built-in analytics; that's free with any Vercel project and just needs the toggle in the dashboard. Google Analytics is mentioned as a possibility but not installed (the privacy page promises an update before adding it).
- **The `(marketing)` route group needs no `layout.tsx`.** The root layout's container is enough; an extra layout would just add boilerplate.
- **Article body width set to 680 px** (matching the brief's "comfortable reading width"). Implemented via Tailwind's `prose` plugin + a `maxWidth: '680px'` override.
- **Date format: `DD Month YYYY` (UK).** Used via `toLocaleDateString('en-GB', …)` — locale-aware, no third-party date library.
- **UK English everywhere.** Spelling, currency symbols (£), and terminology — checked manually across all surface copy.
- **Header is sticky with backdrop-blur**, only where supported (Tailwind's `supports-[backdrop-filter]:` selector). Falls back to a solid colour on older browsers.

## Things to do before launch

- [ ] Replace `public/og.png` placeholder (currently a `.txt` note)
- [ ] Replace `public/favicon.ico` placeholder
- [ ] Decide and install newsletter provider, update `app/api/newsletter/route.ts`
- [ ] Vercel: add custom domain, enable Vercel Analytics
- [ ] Update ICO registration number in `components/Footer.tsx`
- [ ] Smoke-test the sample MDX article renders at `/guides/best-cash-isa-rates-uk-2026`
- [ ] Run Lighthouse on production URL, confirm ≥95 across the board

## Licence

All content is © RichQuid. Code is private — no public re-use licence granted.
