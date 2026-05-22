/**
 * UK personal finance glossary terms.
 *
 * Definitions are written in plain English and reference HMRC / FCA / TPR /
 * gov.uk where applicable. They're educational, not advice. When a regulated
 * figure (an allowance, a threshold, a tax rate) is mentioned, prefer a phrase
 * like "currently" rather than baking in a specific year — the year changes
 * but the definition shouldn't have to.
 */

export interface GlossaryTerm {
  /** Display term, e.g. "AER (Annual Equivalent Rate)". */
  term: string
  /** Anchor slug — lowercase, hyphenated. */
  slug: string
  /** Short single-line definition (~ 1 sentence). */
  short: string
  /** Longer paragraph for the body. */
  body: string
  /** Other glossary slugs related to this one. */
  related?: string[]
  /** Authoritative source for the term. */
  source?: { label: string; url: string }
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    term: 'AER (Annual Equivalent Rate)',
    slug: 'aer',
    short: 'The interest rate on a savings account expressed as if interest is paid and reinvested once a year.',
    body: 'AER lets you compare savings products on a like-for-like basis. A product paying interest monthly with the same headline rate as one paying annually will have a slightly higher AER, because the monthly interest itself earns interest. Always compare AER to AER, not gross to gross.',
    related: ['gross-rate'],
  },
  {
    term: 'Adjusted Net Income',
    slug: 'adjusted-net-income',
    short: 'Total taxable income minus certain reliefs — the figure HMRC uses for the personal allowance taper and the High Income Child Benefit Charge.',
    body: 'Adjusted net income starts with your taxable income (salary, pension, dividends, rental etc.) and subtracts grossed-up pension contributions and gift aid donations. It is the figure that triggers the £100,000 personal allowance taper, and that determines whether the High Income Child Benefit Charge applies.',
    related: ['personal-allowance', 'hicbc'],
    source: { label: 'gov.uk: adjusted net income', url: 'https://www.gov.uk/guidance/adjusted-net-income' },
  },
  {
    term: 'Annual Allowance (pension)',
    slug: 'annual-allowance-pension',
    short: 'The most you can pay into a pension in a tax year while still getting full tax relief.',
    body: 'The standard annual allowance is currently £60,000. It covers all contributions combined — yours, your employer’s, and the tax relief added by HMRC. High earners face a tapered allowance that reduces by £1 for every £2 of adjusted income above £260,000, down to a minimum of £10,000. Unused allowance from the previous three tax years may be available via carry-forward.',
    related: ['mpaa', 'carry-forward'],
    source: { label: 'gov.uk: tax on private pension', url: 'https://www.gov.uk/tax-on-your-private-pension/annual-allowance' },
  },
  {
    term: 'AVC (Additional Voluntary Contributions)',
    slug: 'avc',
    short: 'Extra pension contributions you make on top of the standard employer scheme.',
    body: 'AVCs are paid into a workplace pension to top up your retirement savings. They get tax relief at your marginal rate and benefit from the employer’s scheme infrastructure. AVCs are subject to the same annual allowance limit as ordinary contributions.',
    related: ['annual-allowance-pension'],
  },
  {
    term: 'Bank of England base rate',
    slug: 'boe-base-rate',
    short: 'The interest rate the Bank of England charges to commercial banks — the anchor for most UK borrowing and saving rates.',
    body: 'Set monthly by the Bank’s Monetary Policy Committee. Changes filter through into mortgage rates, savings rates, credit card rates and the wider economy with a lag of weeks to months.',
    source: { label: 'BoE: Bank Rate', url: 'https://www.bankofengland.co.uk/monetary-policy/the-interest-rate-bank-rate' },
  },
  {
    term: 'Bed and breakfasting (CGT)',
    slug: 'bed-and-breakfasting',
    short: 'Selling an asset to crystallise a capital gain and then buying it back the next morning — a tactic now restricted by the 30-day rule.',
    body: 'Until 1998, investors could sell shares on 5 April to use the CGT allowance and buy them back on 6 April. The 30-day rule means a repurchase of the same asset within 30 days is matched against the disposal, neutralising the gain. Bed-and-ISA (selling and rebuying inside an ISA) and bed-and-spouse (selling to a spouse) are not caught by the rule.',
    related: ['cgt'],
  },
  {
    term: 'Capital Gains Tax (CGT)',
    slug: 'cgt',
    short: 'Tax on the profit when you sell an asset for more than you paid.',
    body: 'CGT is paid on the gain, not the sale proceeds. The annual exempt amount is currently £3,000. From 30 October 2024 the rates are 18% (basic-rate band) and 24% (higher-rate band) for all assets, including residential property other than your main home. Gains inside an ISA or SIPP are tax-free.',
    related: ['annual-exempt-amount-cgt', 'isa'],
    source: { label: 'HMRC: Capital Gains Tax', url: 'https://www.gov.uk/capital-gains-tax' },
  },
  {
    term: 'Carry-forward (pension)',
    slug: 'carry-forward',
    short: 'Using unused pension annual allowance from the previous three tax years.',
    body: 'You can carry forward unused allowance from up to three earlier tax years, in oldest-first order, provided you were a member of a registered pension scheme in those years. Carry-forward stops working for DC contributions once you’ve triggered the Money Purchase Annual Allowance.',
    related: ['annual-allowance-pension', 'mpaa'],
  },
  {
    term: 'CHAPS / BACS / Faster Payments',
    slug: 'payments',
    short: 'The main UK payment rails — different speeds and costs.',
    body: 'Faster Payments is near-instant and free for personal use, with a per-payment limit set by your bank. BACS takes three working days and is used for direct debits and standing orders. CHAPS is same-day but typically costs £20–£30; used for property completions and other large one-off payments.',
  },
  {
    term: 'Class 2 / Class 4 NI',
    slug: 'class-2-4-ni',
    short: 'National Insurance categories paid by the self-employed.',
    body: 'Class 2 NI was abolished for most self-employed people from April 2024 — voluntary contributions remain available to fill state pension gaps. Class 4 NI is paid on self-employed profits: 6% between the lower (currently £12,570) and upper (£50,270) profits limits, and 2% above.',
    related: ['national-insurance'],
    source: { label: 'HMRC: NI rates', url: 'https://www.gov.uk/self-employed-national-insurance-rates' },
  },
  {
    term: 'CPI / CPIH',
    slug: 'cpi-cpih',
    short: 'Consumer Price Index — the headline UK inflation measure.',
    body: 'CPI tracks the price of a typical basket of consumer goods and services. CPIH includes owner-occupier housing costs. CPI is the headline number used in news reports and for some uprating decisions; CPIH is preferred by the ONS as the more comprehensive measure.',
    source: { label: 'ONS: inflation and price indices', url: 'https://www.ons.gov.uk/economy/inflationandpriceindices' },
  },
  {
    term: 'Dividend Allowance',
    slug: 'dividend-allowance',
    short: 'The amount of dividend income you can receive each tax year tax-free, outside an ISA.',
    body: 'Currently £500 per tax year (it was £2,000 as recently as 2022/23). Dividends above this are taxed at 8.75% in the basic-rate band, 33.75% in the higher-rate band and 39.35% in the additional-rate band. Dividends inside a stocks & shares ISA aren’t taxed and don’t use the allowance.',
    related: ['isa', 'income-tax-bands'],
    source: { label: 'HMRC: tax on dividends', url: 'https://www.gov.uk/tax-on-dividends' },
  },
  {
    term: 'Drawdown',
    slug: 'drawdown',
    short: 'Taking income directly from your pension pot rather than buying an annuity.',
    body: 'Flexi-access drawdown lets you keep the pot invested and withdraw what you need. The first 25% of the pot is usually tax-free (capped at the Lump Sum Allowance); the rest is taxed as income. Triggering drawdown income (beyond the tax-free element) activates the Money Purchase Annual Allowance.',
    related: ['mpaa', 'lsa'],
  },
  {
    term: 'ETF (Exchange-Traded Fund)',
    slug: 'etf',
    short: 'A fund that trades on a stock exchange like a single share.',
    body: 'ETFs typically track an index (FTSE 100, S&P 500, global all-cap etc.) at low cost. They settle on the exchange, so you buy at a known price. Most stocks & shares ISAs and SIPPs allow ETF holdings. Look at the ongoing charges figure (OCF), tracking error, and whether the ETF is physically or synthetically replicated.',
    related: ['isa', 'sipp'],
  },
  {
    term: 'FCA (Financial Conduct Authority)',
    slug: 'fca',
    short: 'The UK regulator for financial services firms, advisers and product marketing.',
    body: 'The FCA authorises and supervises banks, investment firms, mortgage advisers and consumer credit providers. Anyone giving regulated financial advice must be authorised. Firms that aren’t authorised cannot legally provide personalised advice.',
    source: { label: 'FCA', url: 'https://www.fca.org.uk/' },
  },
  {
    term: 'FSCS (Financial Services Compensation Scheme)',
    slug: 'fscs',
    short: 'The UK’s deposit and investor compensation scheme — protects your savings if a regulated firm fails.',
    body: 'FSCS protection covers up to £85,000 per person, per banking group, for cash deposits. Investment claims are capped at £85,000 per person, per firm. Note that some banking brands share a single banking licence (Halifax and Bank of Scotland, for example) — splitting savings across brands inside the same group doesn’t increase protection.',
    source: { label: 'FSCS', url: 'https://www.fscs.org.uk/' },
  },
  {
    term: 'Gilt',
    slug: 'gilt',
    short: 'A UK government bond — a loan to HM Treasury, paid back with interest.',
    body: 'Gilts are issued in different maturities (short, medium, long) and can be conventional (fixed coupon) or index-linked (uprated by RPI). Yields on gilts influence fixed mortgage pricing and pension fund hedging strategies.',
  },
  {
    term: 'Gross / net (interest)',
    slug: 'gross-rate',
    short: 'Gross is the headline rate before compounding; AER assumes interest is reinvested.',
    body: 'Since 2016, banks pay savings interest gross — no tax is deducted at source. Any tax owed on interest above the Personal Savings Allowance is paid through Self Assessment or via PAYE coding adjustment.',
    related: ['aer', 'psa'],
  },
  {
    term: 'HICBC (High Income Child Benefit Charge)',
    slug: 'hicbc',
    short: 'A clawback of child benefit when an adjusted net income exceeds the threshold.',
    body: 'When one parent’s adjusted net income passes the threshold (currently £60,000), they begin to repay child benefit through Self Assessment. The clawback reaches 100% at £80,000. Pension contributions reduce adjusted net income and can keep parents below the threshold.',
    related: ['adjusted-net-income'],
    source: { label: 'HMRC: HICBC', url: 'https://www.gov.uk/child-benefit-tax-charge' },
  },
  {
    term: 'IFISA (Innovative Finance ISA)',
    slug: 'ifisa',
    short: 'An ISA wrapper for peer-to-peer lending and certain crowd-funded debt investments.',
    body: 'Contributions count toward the same £20,000 annual ISA allowance shared with cash, stocks & shares and lifetime ISAs. The underlying products are higher-risk than cash and aren’t generally covered by FSCS — investors can lose money. The market has shrunk significantly since the late 2010s.',
    related: ['isa', 'fscs'],
  },
  {
    term: 'IHT (Inheritance Tax)',
    slug: 'iht',
    short: 'Tax on an estate at death — 40% on value above the nil-rate band.',
    body: 'The nil-rate band is currently £325,000 per person, with an additional Residence Nil-Rate Band of up to £175,000 when a main home is passed to direct descendants. Spouses can transfer unused allowance, so couples can pass on up to £1 million IHT-free in some cases. Gifts made more than seven years before death are normally exempt.',
    related: ['rnrb', 'annual-exempt-amount-iht'],
    source: { label: 'HMRC: Inheritance Tax', url: 'https://www.gov.uk/inheritance-tax' },
  },
  {
    term: 'Income tax bands',
    slug: 'income-tax-bands',
    short: 'The slices of income that get taxed at each rate.',
    body: 'For England, Wales and Northern Ireland (2025/26): personal allowance £12,570 (tapered from £100k); basic rate 20% to £50,270; higher rate 40% to £125,140; additional rate 45% above. Scotland uses six different bands, from 19% to 48%.',
    related: ['personal-allowance', 'paye'],
    source: { label: 'HMRC: income tax rates', url: 'https://www.gov.uk/income-tax-rates' },
  },
  {
    term: 'ISA (Individual Savings Account)',
    slug: 'isa',
    short: 'A tax-free wrapper for savings or investments — £20,000 annual contribution limit.',
    body: 'You can pay up to £20,000 per tax year into ISA wrappers in any mix of cash, stocks & shares, lifetime (capped at £4,000) and innovative finance ISAs. Interest, dividends and capital gains inside an ISA are not taxed. The allowance does not roll over.',
    related: ['lisa', 'ifisa', 'cgt', 'dividend-allowance'],
    source: { label: 'HMRC: ISAs', url: 'https://www.gov.uk/individual-savings-accounts' },
  },
  {
    term: 'Junior ISA',
    slug: 'junior-isa',
    short: 'An ISA wrapper for under-18s — separate £9,000 annual allowance.',
    body: 'Held in the child’s name and locked until they turn 18, at which point the account converts to an adult ISA. The Junior ISA allowance is separate from the adult £20,000 — parents and grandparents can contribute up to £9,000 per child per tax year combined.',
    related: ['isa'],
  },
  {
    term: 'LBTT (Land and Buildings Transaction Tax)',
    slug: 'lbtt',
    short: 'Scotland’s equivalent of stamp duty.',
    body: 'Banded rates from 0% to 12%, with a £40,000 lower threshold for the Additional Dwelling Supplement of 8% on second homes. First-time buyer relief raises the 0% threshold from £145,000 to £175,000.',
    related: ['sdlt', 'ltt'],
    source: { label: 'Revenue Scotland: LBTT', url: 'https://revenue.scot/taxes/land-buildings-transaction-tax' },
  },
  {
    term: 'LISA (Lifetime ISA)',
    slug: 'lisa',
    short: 'An ISA for first-home buyers or retirement, with a 25% government bonus on contributions.',
    body: 'You can pay up to £4,000 per tax year into a LISA, receiving a 25% bonus from HMRC (up to £1,000). The account must be open for at least 12 months before being used. Property purchases must be £450,000 or less. Withdrawals for any other purpose before age 60 trigger a 25% penalty.',
    related: ['isa'],
    source: { label: 'HMRC: Lifetime ISA', url: 'https://www.gov.uk/lifetime-isa' },
  },
  {
    term: 'LSA / LSDBA',
    slug: 'lsa',
    short: 'Lump Sum Allowance and Lump Sum and Death Benefit Allowance — the post-LTA framework.',
    body: 'The Lifetime Allowance was abolished from 6 April 2024. In its place: the Lump Sum Allowance caps tax-free pension lump sums at £268,275, and the Lump Sum and Death Benefit Allowance caps tax-free lump sums on death at £1,073,100. Income drawdown above 25% of the pot remains taxable.',
    related: ['drawdown', 'annual-allowance-pension'],
  },
  {
    term: 'LTI (Loan to Income)',
    slug: 'lti',
    short: 'The ratio of mortgage borrowing to gross annual income.',
    body: 'Most UK lenders cap mortgage borrowing at 4 to 4.5× gross income. A small number stretch to 5–5.5× for higher earners or specific products. The Bank of England separately limits the share of high-LTI lending an individual lender can do.',
    related: ['ltv'],
  },
  {
    term: 'LTT (Land Transaction Tax)',
    slug: 'ltt',
    short: 'Wales’ equivalent of stamp duty.',
    body: 'Banded rates from 0% to 12% above the £225,000 starting threshold. No separate first-time buyer relief — the £225k threshold applies to everyone. Higher residential rates for second homes (5–17%) are a different band set entirely.',
    related: ['sdlt', 'lbtt'],
    source: { label: 'Welsh Revenue Authority: LTT', url: 'https://gov.wales/land-transaction-tax-guide' },
  },
  {
    term: 'LTV (Loan to Value)',
    slug: 'ltv',
    short: 'Mortgage loan as a percentage of property value.',
    body: 'A £180,000 mortgage on a £200,000 property has an LTV of 90%. Lower LTV usually unlocks better interest rates, with cliff edges at 95%, 90%, 85%, 80%, 75% and 60%. Lenders also use LTV to assess risk when deciding whether to lend at all.',
    related: ['lti'],
  },
  {
    term: 'Marriage Allowance',
    slug: 'marriage-allowance',
    short: 'A transfer of unused personal allowance between basic-rate spouses worth up to ~£252 per year.',
    body: 'If one spouse earns below the personal allowance, they can transfer up to £1,260 of it to the other (provided the recipient is a basic-rate taxpayer). Claims can be backdated up to four tax years. Civil partners qualify on the same terms.',
    related: ['personal-allowance'],
    source: { label: 'HMRC: Marriage Allowance', url: 'https://www.gov.uk/marriage-allowance' },
  },
  {
    term: 'MPAA (Money Purchase Annual Allowance)',
    slug: 'mpaa',
    short: 'A reduced pension annual allowance triggered by flexibly accessing a defined-contribution pension.',
    body: 'Once triggered (typically by taking taxable income from a DC pot beyond the 25% tax-free element), the annual allowance for DC contributions drops to £10,000. Carry-forward no longer applies to DC contributions. Defined-benefit accrual is unaffected.',
    related: ['annual-allowance-pension', 'drawdown'],
  },
  {
    term: 'National Insurance (NI)',
    slug: 'national-insurance',
    short: 'A separate tax on earnings that funds the state pension and some benefits.',
    body: 'Employees pay Class 1 NI: currently 8% on earnings between £12,570 and £50,270, then 2% above. Employers pay Class 1 secondary at 15%. The self-employed pay Class 4 NI on profits. Voluntary Class 2 and Class 3 contributions can be made to fill gaps in your NI record for state pension purposes.',
    related: ['class-2-4-ni', 'state-pension'],
  },
  {
    term: 'NS&I',
    slug: 'nsi',
    short: 'National Savings and Investments — the government-backed savings provider.',
    body: 'NS&I products are 100% backed by HM Treasury — protection is unlimited and doesn’t fall under the FSCS £85,000 cap. Premium Bonds, Income Bonds and Direct Saver are the most widely held NS&I products. Rates are competitive at times, not always.',
    related: ['premium-bonds', 'fscs'],
  },
  {
    term: 'ONS (Office for National Statistics)',
    slug: 'ons',
    short: 'The UK’s national statistical institute — publisher of CPI, employment and many other figures.',
    body: 'ONS publishes inflation indices (CPI, CPIH, RPI), employment and earnings figures, GDP and a wide range of household and demographic data. Their releases are scheduled in advance on the official statistics calendar.',
    source: { label: 'ONS', url: 'https://www.ons.gov.uk/' },
  },
  {
    term: 'PAYE (Pay As You Earn)',
    slug: 'paye',
    short: 'The system employers use to deduct income tax and NI from pay before it reaches the employee.',
    body: 'PAYE applies your tax code (which encodes your personal allowance and any adjustments) to each payslip. End-of-year reconciliation is automatic for most simple cases; complex situations are handled via Self Assessment.',
    related: ['tax-code', 'self-assessment'],
  },
  {
    term: 'Personal Allowance',
    slug: 'personal-allowance',
    short: 'The amount you can earn each tax year before income tax applies — currently £12,570.',
    body: 'The personal allowance is reduced by £1 for every £2 of adjusted net income over £100,000, and disappears entirely at £125,140 — creating an effective 60% tax rate in that £25,140 band. The basic allowance is frozen at £12,570 until at least April 2028.',
    related: ['adjusted-net-income', 'income-tax-bands'],
  },
  {
    term: 'Premium Bonds',
    slug: 'premium-bonds',
    short: 'NS&I product where the interest is paid as monthly prize draws rather than guaranteed interest.',
    body: 'Each £1 bond is entered into a monthly prize draw. The annual prize rate is currently around 3.8%, paid as tax-free prizes. The actual return varies — most holders win less than the prize rate; a few win much more. Maximum holding is £50,000.',
    related: ['nsi'],
  },
  {
    term: 'PSA (Personal Savings Allowance)',
    slug: 'psa',
    short: 'The amount of non-ISA savings interest you can receive tax-free each year.',
    body: 'Basic-rate taxpayers get £1,000 per year; higher-rate £500; additional-rate £0. With rates higher than they were for most of the 2010s, the PSA can be filled by around £22,000 in a 4.5% account at basic rate.',
    related: ['isa', 'income-tax-bands'],
  },
  {
    term: 'Qualifying Earnings',
    slug: 'qualifying-earnings',
    short: 'The band of pay used to calculate auto-enrolment pension contributions.',
    body: 'For 2025/26 the band runs from £6,240 to £50,270. The legal minimum 8% workplace pension contribution is applied to the slice of pay within this band, not the full salary. Many employers use a more generous base — full salary or pensionable pay — but the legal floor is band-based.',
    related: ['auto-enrolment', 'annual-allowance-pension'],
    source: { label: 'TPR: auto-enrolment', url: 'https://www.thepensionsregulator.gov.uk/en/employers/automatic-enrolment-duties' },
  },
  {
    term: 'Auto-enrolment',
    slug: 'auto-enrolment',
    short: 'The UK law requiring employers to put eligible workers into a workplace pension automatically.',
    body: 'Eligible workers (aged 22 to State Pension age, earning over £10,000) must be enrolled. Total minimum contribution is 8% of qualifying earnings — 3% employer, 4% employee, 1% tax relief. Employees can opt out, but get re-enrolled every three years.',
    related: ['qualifying-earnings'],
  },
  {
    term: 'RNRB (Residence Nil-Rate Band)',
    slug: 'rnrb',
    short: 'An additional IHT allowance when a main home is passed to direct descendants.',
    body: 'Up to £175,000 per person on top of the standard £325,000 nil-rate band. Tapered for estates over £2 million. Couples can pass on up to £1 million IHT-free in some cases by combining both allowances.',
    related: ['iht'],
  },
  {
    term: 'SDLT (Stamp Duty Land Tax)',
    slug: 'sdlt',
    short: 'The property purchase tax in England and Northern Ireland.',
    body: 'Banded rates from 0% to 12% for residential property. First-time buyer relief: 0% to £300,000, 5% on the slice £300k–£500k, no relief above £500k. Additional property (second homes, buy-to-let): +5% on every band, from 31 October 2024.',
    related: ['lbtt', 'ltt'],
    source: { label: 'HMRC: SDLT', url: 'https://www.gov.uk/stamp-duty-land-tax' },
  },
  {
    term: 'Salary sacrifice',
    slug: 'salary-sacrifice',
    short: 'Giving up part of your contractual salary in exchange for a non-cash benefit, usually pension contributions.',
    body: 'Because the sacrificed amount never appears as salary, it doesn’t attract income tax or employee National Insurance. The employer also saves on employer NI. Some schemes pass the employer’s NI saving into the pension as well; many don’t.',
    related: ['national-insurance', 'annual-allowance-pension'],
  },
  {
    term: 'Self Assessment',
    slug: 'self-assessment',
    short: 'The HMRC system for reporting income that isn’t taxed through PAYE.',
    body: 'Required if you’re self-employed, earn over £150,000 PAYE income, have untaxed income above certain thresholds, or owe the High Income Child Benefit Charge. The deadline for online filing is 31 January following the tax year end. Late filing triggers automatic penalties.',
    related: ['paye', 'hicbc'],
    source: { label: 'HMRC: Self Assessment', url: 'https://www.gov.uk/self-assessment-tax-returns' },
  },
  {
    term: 'SIPP (Self-Invested Personal Pension)',
    slug: 'sipp',
    short: 'A personal pension where you choose the investments yourself.',
    body: 'Same tax wrapper as any other pension — contributions get tax relief, growth is tax-free, 25% lump sum at retirement (up to the Lump Sum Allowance). Investment choice is much wider than a typical workplace scheme: funds, ETFs, individual shares, bonds. Platform fees vary widely.',
    related: ['annual-allowance-pension', 'lsa'],
  },
  {
    term: 'Stocks & Shares ISA',
    slug: 'stocks-shares-isa',
    short: 'An ISA wrapper for investments — funds, ETFs, shares, bonds.',
    body: 'Counts toward the same £20,000 annual ISA allowance shared with cash, lifetime and innovative finance ISAs. Dividends, interest and capital gains inside the wrapper are tax-free. Platforms charge various combinations of percentage fees, flat fees and dealing fees — comparison matters.',
    related: ['isa', 'etf'],
  },
  {
    term: 'State Pension',
    slug: 'state-pension',
    short: 'The pension paid by the government from State Pension age, based on your NI record.',
    body: 'The new State Pension (for those reaching SPA after 6 April 2016) requires 35 qualifying years for the full amount. Each missing year reduces the pension proportionally. Voluntary NI contributions can fill gaps — sometimes a very high-return use of cash for people approaching pension age.',
    related: ['national-insurance'],
    source: { label: 'gov.uk: State Pension', url: 'https://www.gov.uk/new-state-pension' },
  },
  {
    term: 'Student loan plans',
    slug: 'student-loan-plans',
    short: 'The repayment plans used for UK student loans — Plan 1, 2, 4, 5 and Postgrad.',
    body: 'Each plan has its own income threshold and write-off period. Plan 5 (England, courses starting Aug 2023+) repays for up to 40 years before write-off. Repayments are 9% of income above the threshold (6% for Postgrad), deducted via PAYE.',
    source: { label: 'gov.uk: student loans', url: 'https://www.gov.uk/repaying-your-student-loan' },
  },
  {
    term: 'Tax code',
    slug: 'tax-code',
    short: 'The code on your payslip that tells your employer how much tax-free income to apply.',
    body: 'The most common code is 1257L — the L indicates a standard personal allowance, the digits 1257 are the allowance divided by 10. Other codes (K, BR, D0, NT, T) handle adjustments for benefits-in-kind, multiple jobs, or special situations. Wrong codes are common and worth checking via your personal tax account.',
    related: ['personal-allowance', 'paye'],
  },
  {
    term: 'Tax year',
    slug: 'tax-year',
    short: 'The UK tax year runs from 6 April to the following 5 April.',
    body: 'The 6-April-to-5-April convention dates back to the introduction of the Gregorian calendar in 1752. ISA, pension and CGT allowances reset at midnight on 5 April. End-of-year processing deadlines fall on or shortly after 5 April for most consumer products.',
  },
  {
    term: 'Trading Allowance',
    slug: 'trading-allowance',
    short: 'A £1,000 tax-free allowance for casual self-employment or side hustle income.',
    body: 'If your gross self-employed or miscellaneous income is under £1,000 for the tax year, you don’t need to register for Self Assessment. Above £1,000 you can choose either to deduct actual expenses or claim the £1,000 allowance instead — whichever produces a lower taxable profit.',
    related: ['self-assessment'],
  },
  {
    term: 'Annual Exempt Amount (CGT)',
    slug: 'annual-exempt-amount-cgt',
    short: 'The amount of capital gain you can realise tax-free each year — currently £3,000.',
    body: 'Down from £6,000 in 2023/24 and £12,300 before that. Gains above this are taxed at 18% in the basic-rate band and 24% above. Couples each have their own AEA, so transferring an asset to a spouse before sale can double the tax-free amount.',
    related: ['cgt'],
  },
  {
    term: 'Annual Exempt Amount (IHT gift)',
    slug: 'annual-exempt-amount-iht',
    short: 'You can give away £3,000 per tax year and it leaves your estate immediately for IHT purposes.',
    body: 'Unused allowance from the previous tax year can be brought forward, so the maximum in a single year is £6,000. Smaller gifts (up to £250 per recipient) and gifts in consideration of marriage have their own separate exemptions.',
    related: ['iht'],
  },
]

export function groupByLetter(): Record<string, GlossaryTerm[]> {
  const grouped: Record<string, GlossaryTerm[]> = {}
  for (const t of GLOSSARY) {
    const letter = t.term[0].toUpperCase()
    if (!grouped[letter]) grouped[letter] = []
    grouped[letter].push(t)
  }
  for (const letter of Object.keys(grouped)) {
    grouped[letter].sort((a, b) => a.term.localeCompare(b.term))
  }
  return grouped
}
