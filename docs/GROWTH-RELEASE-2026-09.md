# September organic growth implementation

## Delivered in this release

- Improve nine existing priority guides while retaining titles, slugs and canonical destinations: foreign-bank ISA funding, UK pension in India, NS&I, trading allowance, newcomer banking, limited-history credit cards, cashback accounts/cards and ISA transfers.
- Correct inaccurate India uprating guidance with a visible correction; remove unverified Indian-tax estimates and pension transfer recommendations. Correct partnership eligibility and record-keeping claims in the trading-allowance guide.
- Add explicit calculation examples and supported-case instructions to the existing ISA tracker, including transfers versus new subscriptions and separate LISA limits.
- Add the net cashback calculator and embed route. It handles a flat rate, monthly cap, all-year fees, qualifying months, entered other costs and a first-year-only bonus. Explain unsupported tiered/fixed rewards and provider rounding.
- Provide a printable, no-signup newcomer banking checklist and contextual links between guides and tools. Improve Start Here and related-guide selection.
- Replace automatically loaded Google Analytics with an explicit optional-analytics choice. Keep calculators usable without analytics, omit query strings from configured page views and send only approved tool identifiers in calculator events.
- Prepare a private working portfolio of 32 observed queries plus four new/unattributed hypotheses, and a distribution kit with four relevant resource teams and four post drafts. No messages or posts sent.

## Measurement setup still requiring the owner's accounts

There is no connected Search Console or Google Analytics account in this session. The query baseline uses the supplied historical export, not new UK-only data.

1. GSC: export UK-only query/page/device cohorts for matching 28-day windows; use exact-page filters for priority pages. Check indexing and Google-selected canonicals after deployment. Submit the existing sitemap and request recrawls for materially changed priority pages as appropriate.
2. GA4: verify consent accepted/declined and one event per action in DebugView. The new events are `calculator_start` and `calculator_complete`, with `tool_slug` for the cashback tool and ISA tracker. Register `tool_slug` as an event-scoped custom dimension if required.
3. In the GA4 web stream, check Enhanced Measurement settings. Disable automatic history-based page changes if they duplicate the application's explicit SPA page views. Review/disable automatic form interaction and other event collection not needed for the learning funnel; do not enable collection of calculator financial inputs.
4. Do not configure starts or keystrokes as key events merely to improve engagement figures. Choose completion as a key event only if it matches the measurement objective. Consent changes can alter observed traffic; annotate the deployment date before comparing cohorts.
5. Confirm legitimate internal/developer filtering and inspect actual referrals. Crawler permission does not establish indexing or AI citation.

## Verification boundaries

All browser surfaces reported unavailable. Visual/mobile interaction and GA network collection have not been observed in a browser. The free PageSpeed API returned HTTP 429 quota exceeded; no Core Web Vitals score is claimed. Use GSC's field reports and PageSpeed when access is available.

No paid service, ad spend, mailing signup, purchased link or outreach send was used. The author's real identity/role remains awaiting owner clarification; this release does not invent professional credentials. The remaining 90-day plan requires ongoing factual maintenance, deliberate distribution and fresh performance evidence.

## Primary sources reviewed

- https://www.gov.uk/individual-savings-accounts
- https://www.gov.uk/individual-savings-accounts/if-you-move-abroad
- https://www.gov.uk/individual-savings-accounts/transferring-your-isa
- https://www.gov.uk/individual-savings-accounts/withdrawing-your-money
- https://www.gov.uk/state-pension-if-you-retire-abroad/rates-of-state-pension
- https://www.gov.uk/government/publications/india-tax-treaties (Articles 19 and 20 checked in the linked treaty)
- https://www.gov.uk/transferring-your-pension/transferring-to-an-overseas-pension-scheme
- https://www.gov.uk/guidance/tax-free-allowances-on-property-and-trading-income
- https://www.gov.uk/guidance/selling-goods-or-services-on-a-digital-platform
- https://www.gov.uk/self-assessment-tax-returns/deadlines
- https://www.nsandi.com/get-to-know-us/security/protect-your-money
- https://www.nsandi.com/products and individual Premium Bonds/Direct Saver/Income Bonds product pages
- https://www.nsandi.com/help/manage-your-savings/tax-on-savings
- https://monzo.com/help/opening-an-account/how-to-open-a-Monzo-Personal-Account
- https://www.hsbc.co.uk/help/banking-made-easy/help-us-identify-you/
- https://www.moneyhelper.org.uk/en/everyday-money/credit/when-youve-been-refused-credit

Nine guide revision dates reflect the work on those guides. They do not certify all 116 articles or all changing provider terms. Hypothetical reward examples are labelled and are not represented as live offers.
