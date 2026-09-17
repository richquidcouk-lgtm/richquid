const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const ts = require('typescript')
const cache = {}
function load(name) {
  if (cache[name]) return cache[name]
  const exports = {}; cache[name] = exports
  const source = fs.readFileSync(`lib/${name}.ts`, 'utf8')
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } })
  vm.runInNewContext(outputText, { exports, process: { env: {} }, URL, require: dependency => load(dependency.replace('./', '')) })
  return exports
}
const tax = load('uk-tax'), investment = load('investment-tax')
function close(actual, expected) { assert.ok(Math.abs(actual - expected) < .000001, `${actual} != ${expected}`) }
test('England/Wales/NI annual tax independently calculated through allowance taper', () => {
  for (const [income, expected] of [[0,0],[12570,0],[50270,7540],[100000,27432],[110000,33432],[125140,42516],[150000,53703]]) close(tax.incomeTaxRUK(income), expected)
})
test('2026/27 Scottish taxable bands and allowance taper', () => {
  close(tax.incomeTaxScotland(16537), 753.73)
  close(tax.incomeTaxScotland(29526), 3351.53)
  close(tax.incomeTaxScotland(43662), 6320.09)
  // 3967*.19 + 12989*.20 + 14136*.21 + 31338*.42 + 62710*.45
  close(tax.incomeTaxScotland(125140), 47701.55)
})
test('2026/27 student loan thresholds and rates, including combined plans', () => {
  for (const [plan, threshold, rate] of [['plan1',26900,.09],['plan2',29385,.09],['plan4',33795,.09],['plan5',25000,.09],['postgrad',21000,.06]]) {
    close(tax.studentLoanRepayment(threshold,plan),0)
    close(tax.studentLoanRepayment(threshold+1000,plan),1000*rate)
  }
  close(tax.studentLoanRepayment(30000,'plan2'),55.35)
  close(tax.studentLoanRepayment(30000,'plan2')+tax.studentLoanRepayment(30000,'postgrad'),595.35)
  assert.ok(Number.isNaN(tax.studentLoanRepayment(30000,'invalid')))
})
test('salary sacrifice uses the same taper-aware engine', () => {
  close(tax.incomeTaxRUK(110000)-tax.incomeTaxRUK(100000),6000)
  close(tax.employeeNI(110000)-tax.employeeNI(100000),200)
})
test('money parsing rejects negative, malformed and non-finite amounts', () => {
  for (const input of ['-100','1.2.3','abc','1e6','12,34','Infinity']) assert.ok(Number.isNaN(tax.parseAmount(input)))
  close(tax.parseAmount('£1,234.50'),1234.5);close(tax.parseAmount(''),0)
})
test('dividends first use unspent personal allowance and keep the basic band fixed', () => {
  close(investment.computeDividendTax(0,10000).tax,0)
  close(investment.computeDividendTax(0,14000).tax,99.975)
  close(investment.computeDividendTax(29570,3000).tax,268.75)
  close(investment.computeDividendTax(50000,1000).tax,178.75)
})
test('CGT uses remaining taxable basic band and the exempt amount', () => {
  close(investment.computeCGT(40000,10000).tax,1260)
  close(investment.computeCGT(60000,10000).tax,1680)
  close(investment.computeCGT(0,3000).tax,0)
})
test('savings interest handles low income and a crossing into higher rate', () => {
  close(tax.savingsTax(0,15000).interestTax,0)
  close(tax.savingsTax(30000,800).interestTax,0)
  close(tax.savingsTax(30000,2000).interestTax,200)
  close(tax.savingsTax(50000,1000).interestTax,200)
  close(tax.savingsTax(125140,1000).interestTax,450)
})
test('all historical URLs have unique, exact permanent mappings', () => {
  const redirects = JSON.parse(fs.readFileSync('lib/legacy-redirects.json','utf8'))
  assert.equal(redirects.length,43)
  assert.equal(new Set(redirects.map(r=>r.source)).size,43)
  for (const r of redirects) { assert.equal(r.permanent,true);assert.notEqual(r.source,r.destination);assert.ok(!r.source.includes(':'));assert.ok(!r.destination.includes('?')) }
})

test('article headings preserve inline text, deduplicate IDs and filter unsafe citations', () => {
  const heading = () => ({ type:'element', tagName:'h2', children:[{type:'text',value:'ISA transfers?'}] })
  const tree = { type:'root',children:[heading(),heading(),{type:'element',tagName:'a',properties:{href:'https://www.gov.uk/income-tax-rates'},children:[{type:'text',value:'HMRC'}]},{type:'element',tagName:'a',properties:{href:'javascript:alert(1)'},children:[]}] }
  // This module needs the web-standard URL constructor in the VM.
  const source=fs.readFileSync('lib/article-navigation.ts','utf8'),exports={}
  vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports,URL})
  const result=exports.collectArticleNavigation(tree)
  assert.equal(result.headings[0].id,'isa-transfers');assert.equal(result.headings[1].id,'isa-transfers-1')
  assert.equal(result.sources.length,1);assert.equal(result.sources[0].title,'HMRC')
})
test('JSON-LD serializer cannot close its script element', () => {
  const value={ headline:'</script><script>alert(1)</script>' }
  const encoded=load('schema').serializeJsonLd(value)
  assert.ok(!encoded.includes('<'));assert.deepEqual(JSON.parse(encoded),value)
})
