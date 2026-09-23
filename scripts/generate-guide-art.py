"""Create article-specific, decorative editorial SVGs. No rates or data implied."""
from pathlib import Path
import hashlib, json, re
root=Path(__file__).resolve().parents[1]
out=root/'public/illustrations/articles'
out.mkdir(exist_ok=True)
# Each drawing uses a 200px square, inherited ink and an accent fill.
icons={
'home':'<path d="M20 91L100 25l80 66v91H20Z" fill="white"/><path d="M77 182v-65h46v65M45 97h22v25H45m88-25h22v25h-22"/>',
'key':'<circle cx="71" cy="67" r="43" fill="var(--accent)"/><circle cx="71" cy="67" r="13" fill="white"/><path d="M102 98l73 73m-20-20 19-19m-40-1 19-19" stroke-width="15"/>',
'jar':'<rect x="45" y="54" width="110" height="126" rx="25" fill="white"/><rect x="54" y="32" width="92" height="23" rx="6" fill="var(--accent)"/><path d="M70 93h60m-60 25h60m-60 25h35"/>',
'plant':'<path d="M48 121h104l-14 62H62Z" fill="var(--accent)"/><path d="M100 120V65"/><path d="M100 95Q31 92 41 32q62 0 59 63m0-22q51-1 55-53-57 0-55 53" fill="white"/>',
'passport':'<rect x="36" y="20" width="128" height="163" rx="12" fill="var(--accent)"/><circle cx="100" cy="88" r="35" fill="white"/><ellipse cx="100" cy="88" rx="16" ry="35"/><path d="M65 88h70m-63-15h56m-56 30h56M74 150h52"/>',
'globe':'<circle cx="100" cy="100" r="78" fill="white"/><ellipse cx="100" cy="100" rx="36" ry="78"/><path d="M22 100h156M36 57h128M36 143h128"/>',
'card':'<rect x="13" y="44" width="174" height="116" rx="15" fill="white"/><path d="M13 79h174" stroke-width="18"/><rect x="37" y="103" width="28" height="22" rx="4" fill="var(--accent)"/><path d="M39 142h48m24 0h30"/>',
'bank':'<path d="M16 70l84-46 84 46Z" fill="var(--accent)"/><path d="M27 83v77m48-77v77m50-77v77m48-77v77M15 175h170" stroke-width="15"/>',
'document':'<path d="M40 17h83l39 40v125H40Z" fill="white"/><path d="M123 17v40h39M65 85h72m-72 26h72m-72 26h44"/><path d="M107 159l12 12 28-29" stroke="var(--accent)" stroke-width="9"/>',
'calendar':'<rect x="23" y="36" width="154" height="143" rx="13" fill="white"/><path d="M23 77h154M60 21v30m80-30v30"/><path d="M55 103h16m26 0h16m26 0h10M55 135h16m26 0h16" stroke="var(--accent)" stroke-width="12"/>',
'clock':'<circle cx="100" cy="100" r="76" fill="white"/><path d="M100 47v56l38 25" stroke-width="10"/><path d="M100 24v12m76 64h-12m-64 76v-12m-76-64h12"/>',
'lock':'<rect x="39" y="87" width="122" height="93" rx="15" fill="var(--accent)"/><path d="M63 87V58a37 37 0 0 1 74 0v29" stroke-width="12"/><circle cx="100" cy="128" r="11" fill="white"/><path d="M100 138v18"/>',
'wallet':'<rect x="23" y="48" width="146" height="122" rx="16" fill="white"/><path d="M29 48l113-25v25" fill="var(--accent)"/><rect x="116" y="87" width="66" height="46" rx="9" fill="var(--accent)"/><circle cx="139" cy="110" r="4"/>',
'coins':'<ellipse cx="80" cy="161" rx="55" ry="20" fill="var(--accent)"/><path d="M25 132v29m110-29v29"/><ellipse cx="80" cy="132" rx="55" ry="20" fill="var(--accent)"/><path d="M25 102v30m110-30v30"/><ellipse cx="80" cy="102" rx="55" ry="20" fill="white"/><circle cx="142" cy="66" r="40" fill="var(--accent)"/><path d="M129 85h27m-29-17h23m-18 17V50q0-14 22-8"/>',
'calculator':'<rect x="38" y="15" width="125" height="170" rx="16" fill="white"/><rect x="57" y="37" width="87" height="34" rx="4" fill="var(--accent)"/><path d="M61 100h13m32 0h13m-58 32h13m32 0h13m-58 29h13m32 0h13" stroke-width="10"/>',
'briefcase':'<rect x="20" y="63" width="160" height="110" rx="14" fill="white"/><path d="M69 62V33h62v29M20 110h160"/><rect x="88" y="98" width="24" height="28" rx="4" fill="var(--accent)"/>',
'gift':'<rect x="33" y="84" width="134" height="96" fill="white"/><rect x="23" y="63" width="154" height="33" rx="4" fill="var(--accent)"/><path d="M100 63v117m0-117Q31 65 48 31q25-24 52 32m0 0q69 2 52-32-25-24-52 32"/>',
'family':'<circle cx="61" cy="61" r="26" fill="white"/><circle cx="140" cy="61" r="26" fill="white"/><path d="M17 169v-33q0-40 44-40m78 0q44 0 44 40v33"/><circle cx="100" cy="111" r="24" fill="var(--accent)"/><path d="M65 180v-15q0-30 35-30t35 30v15" fill="white"/>',
'shield':'<path d="M100 18l68 24v60q0 48-68 83-68-35-68-83V42Z" fill="white"/><path d="M63 100l25 25 50-55" stroke="var(--accent)" stroke-width="12"/>',
'energy':'<path d="M112 16L44 110h48l-9 75 75-104h-49Z" fill="var(--accent)"/>',
'meter':'<rect x="37" y="20" width="128" height="162" rx="18" fill="white"/><path d="M58 98a43 43 0 0 1 86 0M100 97l22-28"/><circle cx="100" cy="99" r="6" fill="var(--accent)"/><path d="M68 137h65m-65 21h38"/>',
'laptop':'<path d="M34 35h132v110H34Z" fill="white"/><path d="M34 145L13 171h174l-21-26Z" fill="var(--accent)"/><path d="M62 71h74M62 95h49M62 119h61"/>',
'receipt':'<path d="M40 18h120v166l-20-12-20 12-20-12-20 12-20-12-20 12Z" fill="white"/><path d="M66 59h68m-68 29h43m-43 29h68m-68 29h40"/>',
'percent':'<circle cx="61" cy="60" r="29" fill="white"/><circle cx="140" cy="141" r="29" fill="var(--accent)"/><path d="M48 163L153 37" stroke-width="13"/>',
'umbrella':'<path d="M20 105a80 80 0 0 1 160 0q-28-20-53 0-27-20-54 0-27-20-53 0Z" fill="var(--accent)"/><path d="M100 23v-9m0 91v56q0 27 27 13"/>',
'cap':'<path d="M15 77l85-42 85 42-85 42Z" fill="var(--accent)"/><path d="M46 96v47q54 34 108 0V96m31-19v65"/>',
'ticket':'<path d="M22 49h156v35a18 18 0 0 0 0 36v35H22v-35a18 18 0 0 0 0-36Z" fill="white"/><path d="M130 55v94" stroke-dasharray="7 8"/><path d="M seventy 70"/>',
'steps':'<path d="M20 175V132h48V91h48V48h64v127Z" fill="white"/><path d="M37 105l41-40 36-8 47-39m-29 0h30v30" stroke="var(--accent)"/>',
}
icons['ticket']=icons['ticket'].replace('<path d="M seventy 70"/>','<path d="M71 75l8 17 19 3-14 13 3 20-18-10-17 10 3-20-14-13 20-3Z" fill="var(--accent)"/>')
# Explicit editorial subject pair per article, independent of category.
rows='''100k-tax-trap-uk|receipt|steps
50-30-20-budgeting-uk|wallet|calculator
adjustment-to-rate-band-meaning|document|percent
are-cashback-rewards-taxable-uk|gift|receipt
bed-and-isa-explained|plant|document
best-cash-isa-rates-uk-2026|jar|percent
budgeting-irregular-income-uk|wallet|calendar
buy-to-let-tax-uk|home|receipt
can-i-access-my-pension-if-i-have-a-visa|passport|lock
can-i-claim-my-uk-pension-if-i-move-to-india|globe|wallet
can-i-get-a-mortgage-on-a-skilled-worker-visa|briefcase|home
can-i-get-a-mortgage-on-a-visa-in-the-uk|passport|home
can-i-get-a-mortgage-with-1-year-self-employed-accounts|document|home
can-i-get-a-mortgage-with-ilr|shield|key
can-i-have-a-lisa-and-a-stocks-and-shares-isa|home|plant
can-i-have-a-sipp-and-a-workplace-pension-at-the-same-time|jar|briefcase
can-i-inherit-my-spouse-isa-allowance|family|plant
can-i-open-an-isa-if-i-am-not-a-uk-resident|globe|plant
can-i-overpay-my-mortgage-to-clear-it-early|coins|key
can-i-pay-into-a-pension-if-i-am-self-employed|briefcase|jar
can-i-pay-into-my-isa-from-a-foreign-bank-account|globe|bank
can-i-pay-into-two-isas-in-the-same-tax-year|jar|calendar
can-i-port-my-mortgage-to-a-new-house|home|key
can-i-take-my-pension-at-55-and-still-work|clock|briefcase
can-i-transfer-a-cash-isa-to-a-stocks-and-shares-isa|jar|plant
can-i-transfer-my-uk-pension-abroad|jar|globe
can-i-use-overseas-income-for-a-uk-mortgage|globe|home
can-i-withdraw-from-a-fixed-rate-cash-isa-early|lock|clock
cash-isa-cap-12000-april-2027|jar|calendar
cash-isa-vs-personal-savings-allowance|plant|receipt
cgt-shares-crypto-uk|laptop|receipt
check-state-pension-forecast-uk|laptop|clock
debt-snowball-vs-avalanche-uk|coins|steps
dividend-tax-rate-rise-april-2026|plant|calendar
do-i-need-to-pay-tax-on-my-side-hustle-uk|briefcase|receipt
do-i-need-to-register-as-self-employed-for-a-side-hustle|briefcase|document
do-i-pay-tax-on-dividends-from-shares-uk|plant|receipt
do-i-pay-tax-on-freelance-income-alongside-a-full-time-job|laptop|briefcase
do-i-pay-tax-on-isa-withdrawals|jar|receipt
do-i-pay-tax-on-money-sent-from-abroad-to-the-uk|globe|receipt
do-i-pay-tax-on-savings-interest-uk|jar|percent
do-i-pay-tax-on-selling-things-on-vinted-uk|laptop|receipt
do-non-doms-pay-tax-on-foreign-income-uk|passport|receipt
does-an-isa-count-towards-my-personal-savings-allowance|plant|calculator
does-checking-my-credit-score-lower-it|meter|shield
drawdown-vs-annuity-uk|wallet|clock
easy-access-vs-fixed-savings|wallet|lock
first-time-buyer-route-map-uk|steps|home
fixed-vs-tracker-vs-variable-mortgages|home|percent
flexible-isas-explained|jar|wallet
hicbc-explained|family|receipt
how-do-i-file-a-self-assessment-tax-return-for-the-first-time|laptop|document
how-does-pension-tax-relief-work-for-higher-rate-taxpayers|jar|receipt
how-does-premium-bonds-work-and-are-they-worth-it|ticket|jar
how-does-remortgaging-work-and-when-should-i-do-it|home|clock
how-does-the-personal-savings-allowance-work|jar|calculator
how-many-isas-can-i-have-at-once|plant|jar
how-much-can-i-borrow-on-my-salary-uk|home|calculator
how-much-can-i-earn-before-paying-tax-on-a-second-job|briefcase|calculator
how-much-can-i-gift-tax-free-uk|gift|receipt
how-much-deposit-do-i-need-as-a-first-time-buyer|coins|home
how-much-pension-do-i-need-to-retire-comfortably-uk|umbrella|calculator
how-much-tax-do-i-pay-on-rental-income-uk|key|receipt
how-much-tax-will-i-pay-if-i-withdraw-my-whole-pension|wallet|receipt
how-to-build-a-credit-score-from-scratch-uk|card|steps
how-to-build-an-emergency-fund-uk|umbrella|jar
how-to-combine-old-pensions-from-previous-jobs-uk|briefcase|jar
how-to-cut-energy-bill-uk|energy|receipt
how-to-declare-crypto-gains-to-hmrc|laptop|document
how-to-open-a-bank-account-as-a-new-arrival-to-the-uk|passport|bank
is-a-junior-isa-worth-it|family|plant
is-it-better-to-fix-for-2-or-5-years|home|calendar
isa-types-compared|plant|shield
lisa-vs-sipp-retirement|home|umbrella
lsa-lsdba-explained|jar|document
making-tax-digital-income-tax-april-2026|laptop|calendar
marriage-allowance-uk|family|gift
mortgage-overpayment-vs-invest|key|plant
nsi-products-overview-uk|bank|ticket
offset-mortgage-uk|home|jar
pension-auto-enrolment-explained|briefcase|shield
pensions-inheritance-tax-april-2027|family|calendar
premium-bonds-maths|ticket|calculator
remortgaging-timeline-uk|calendar|key
shared-ownership-uk|family|home
sipp-vs-workplace-pension|jar|briefcase
smart-meter-uk-explained|meter|energy
state-pension-age-66-to-67-phase-in|clock|calendar
student-loan-repayment-thresholds-uk|cap|calculator
tax-year-end-checklist-uk|calendar|document
transferring-isa-uk|bank|plant
uk-cashback-credit-cards-explained|card|gift
uk-cashback-current-accounts|bank|coins
uk-cashback-explained|gift|wallet
uk-energy-price-cap-explained|energy|shield
uk-household-bills-cashback-value-ons-data|home|calculator
uk-personal-finance-order-of-operations|steps|wallet
uk-tax-codes-explained|document|calculator
what-changed-this-tax-year|calendar|receipt
what-credit-cards-can-i-get-with-no-uk-credit-history|card|passport
what-credit-score-do-i-need-for-a-mortgage-uk|meter|home
what-documents-do-i-need-to-open-a-uk-bank-account|document|bank
what-expenses-can-i-claim-as-self-employed-uk|receipt|briefcase
what-fees-do-i-pay-when-buying-a-house-uk|key|calculator
what-happens-to-my-isa-if-i-move-abroad|plant|globe
what-happens-to-my-isa-when-i-die-uk|plant|family
what-happens-to-my-lisa-if-i-buy-a-house-over-450k|home|lock
what-happens-to-my-mortgage-if-i-lose-my-job|home|umbrella
what-happens-to-my-pension-if-i-leave-the-uk-permanently|umbrella|globe
what-happens-to-my-pension-when-i-die|umbrella|family
what-happens-to-my-workplace-pension-if-i-change-jobs|briefcase|steps
what-is-a-flexible-isa-and-how-does-it-work|wallet|plant
what-is-a-guarantor-mortgage-and-how-does-it-work|home|shield
what-is-a-regular-saver-account-and-is-it-worth-it|calendar|coins
what-is-the-25-percent-tax-free-pension-lump-sum|jar|percent
what-is-the-annual-allowance-for-pension-contributions|jar|calendar
what-is-the-best-way-to-save-for-a-house-deposit|plant|key
what-is-the-difference-between-apr-and-aer|percent|calculator
what-is-the-personal-allowance-and-how-does-it-work|shield|receipt
what-is-the-trading-allowance-and-how-does-it-work|briefcase|calculator'''
entries=[line.split('|') for line in rows.splitlines()]
assert {r[0] for r in entries}=={p.stem for p in (root/'content/guides').glob('*.mdx')}, 'Update editorial subject mapping for new articles'
palettes=[('#123D35','#EDB96D','#EDF2E9'),('#203F59','#EEA68C','#ECF1F5'),('#533D55','#D7AD79','#F4EEF2'),('#34504B','#A9CBB9','#F6F0E4'),('#794938','#E7B969','#F8EEE6'),('#394467','#B8B4D8','#F0EFF7')]
used=set(); manifest={}
for slug,a,b in entries:
    n=int(hashlib.sha256(slug.encode()).hexdigest()[:8],16)
    layout=n%6; palette=(n//6)%len(palettes)
    while (a,b,layout,palette) in used:
        palette=(palette+1)%len(palettes)
        if palette==0: layout=(layout+1)%6
    used.add((a,b,layout,palette))
    ink,accent,bg=palettes[palette]
    def icon(name,x,y,size,rotate=0):
        return f'<g transform="translate({x} {y}) scale({size/200}) rotate({rotate} 100 100)" stroke="{ink}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none">{icons[name]}</g>'
    # Six materially different compositions; reusable objects, article-specific pairings.
    if layout==0:
        scene=f'<circle cx="290" cy="185" r="190" fill="{accent}"/><rect x="500" y="57" width="243" height="246" rx="26" fill="white" transform="rotate(7 620 180)"/>'+icon(a,160,44,290,-8)+icon(b,522,79,204,7)
    elif layout==1:
        scene=f'<path d="M0 0h520L380 360H0Z" fill="{ink}"/><circle cx="685" cy="100" r="147" fill="{accent}"/><rect x="146" y="61" width="245" height="245" rx="35" fill="{bg}" transform="rotate(-7 265 180)"/>'+icon(a,169,82,203,-7)+icon(b,530,88,245,10)
    elif layout==2:
        scene=f'<path d="M70 298Q280-90 475 193T866 35" stroke="{accent}" stroke-width="85" fill="none"/><circle cx="308" cy="151" r="126" fill="white"/><circle cx="624" cy="224" r="111" fill="white"/>'+icon(a,190,31,230,-6)+icon(b,530,125,191,8)
    elif layout==3:
        scene=f'<rect x="136" y="36" width="626" height="290" rx="145" fill="{ink}"/><circle cx="302" cy="181" r="128" fill="{bg}"/><circle cx="609" cy="181" r="111" fill="{accent}"/><path d="M446 180h40m-12-12 12 12-12 12" stroke="white" stroke-width="5" fill="none"/>'+icon(a,190,69,223)+icon(b,523,95,172)
    elif layout==4:
        scene=f'<path d="M0 270L900 88v272H0Z" fill="{accent}"/><rect x="200" y="33" width="260" height="284" rx="19" fill="white" transform="rotate(-12 330 175)"/><rect x="463" y="63" width="238" height="260" rx="19" fill="{bg}" transform="rotate(12 585 190)"/>'+icon(a,225,70,213,-12)+icon(b,489,99,191,12)
    else:
        scene=f'<circle cx="445" cy="181" r="240" fill="{accent}"/><path d="M0 315h900" stroke="{ink}" stroke-width="3"/><rect x="163" y="228" width="260" height="86" rx="8" fill="white"/><rect x="513" y="265" width="235" height="49" rx="8" fill="{ink}"/>'+icon(a,171,13,246,-5)+icon(b,526,68,212,6)
    # Quiet editorial details add texture without fake charts, logos or claims.
    details=f'<g fill="{ink}" opacity=".15">'+''.join(f'<circle cx="{x}" cy="{y}" r="2"/>' for x in range(790,854,16) for y in range(266,330,16))+'</g>'
    svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 360" width="900" height="360" style="--accent:{accent}"><rect width="900" height="360" fill="{bg}"/>{scene}{details}</svg>'
    # Explicit fills improve compatibility with image renderers that omit CSS variables.
    svg=svg.replace('var(--accent)',accent)
    (out/f'{slug}.svg').write_text(svg,encoding='utf-8')
    manifest[slug]={'subjects':[a,b],'composition':layout,'palette':palette}
(root/'lib/guide-art-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
print(f'Created {len(entries)} article illustrations with {len(used)} distinct compositions.')
