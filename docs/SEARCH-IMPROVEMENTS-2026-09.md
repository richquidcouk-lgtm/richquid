# September 2026 corrective release

## Completed

- Corrected taxable-income bands and allowance taper in the shared tax engine; salary sacrifice now uses that same engine.
- Updated Scottish 2026/27 bands and Plan 1/2/4 thresholds; unified stale calculator year labels.
- Corrected unused personal allowance in dividend tax and added a savings calculation that handles the starting rate and band crossings.
- Added independent financial regression fixtures, validated monetary drafts and safer shared calculator URLs.
- Separated mortgage applicants for income tax/NI, removed claims of matching lender/FCA underwriting, and clarified supported cases for tools.
- Mapped all 43 exported legacy URLs to their checked equivalents with permanent redirects.
- Disabled both newsletter signup surfaces and return 503 without accepting data until a real provider exists.
- Corrected deposit-protection wording while preserving the separate investment limit; refreshed ISA-transfer, bank-document, newcomer, credit-history and cashback guides using specific sources and original arithmetic examples.
- Added Banking and Credit category; maintained existing article URLs.
- Articles have renderer-derived contents anchors, source lists, publisher/author IDs and contextual calculator links. All 11 live tools have source/assumption/reading sections.
- Added safe JSON-LD serialization and explicit search/retrieval crawler rules in the generator config.
- Excluded two unfinished tools from indexing and sitemap; sitemap article dates reflect actual content metadata, not every build.
- Historical savings ranges are labelled as such; homepage macro figures link to current official releases instead of showing stale values as current.

## Verification and next work

Run `npm test`, `npm run lint`, `npm run build`, then the production route audit. The route audit must verify all 43 redirects, article canonicals/anchors/JSON-LD, sitemap membership and newsletter 503 behavior.

The financial fixtures cover standard modelled scenarios. Tool explanations identify exclusions; this is not a complete HMRC filing/payroll engine.

Newsletter activation requires the owner's chosen provider and configuration; no account or mailing service has been invented. Core Web Vitals, browser visual QA, genuine bot IP access, Search Console validation and citation/referral monitoring require their respective runtime/account evidence. Crawlers are permitted but citations are not guaranteed.

Continue the editorial source review of the remaining guide inventory, particularly overseas pensions, provider-specific conditions and future rule changes. The updated sources section only lists references actually present in each article; it does not imply every article has received a fresh factual certification. Keep remaining unverified content separate from completed corrections.

Review UK page/query cohorts around 30 September with the supplied baseline; do not interpret the historical 404 count as an immediate failure after correct redirects deploy. Do not submit duplicate content for every query spelling.

## Verified results

- Production build: 164 static pages; lint passes without warnings.
- 11 regression tests passed.
- Production audit: 116 guides, 171 visible citation links, 147 sitemap URLs.
- All 43 permanent redirects reached the expected working destination; four destination image routes returned image content.
- Newsletter endpoint returned 503 and the homepage had no signup form.
- Browser tooling reported no available browsers; visual/mobile interaction QA is not claimed.
