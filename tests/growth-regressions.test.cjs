const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const ts = require('typescript')
function load(file, extra = {}) {
  const exports = {}
  const { outputText } = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } })
  vm.runInNewContext(outputText, { exports, ...extra })
  return exports
}
const { calculateCashback } = load('lib/cashback.ts')
const sample = { monthlySpend: 1500, rate: 1, monthlyCap: 10, monthlyFee: 2, annualFee: 0, bonus: 100, qualifyingMonths: 12, annualCosts: 0 }
const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} != ${expected}`)
test('cashback cap is applied before annual fees, and bonus only changes year one', () => {
  const result = calculateCashback(sample)
  assert.equal(result.monthlyReward, 10); assert.equal(result.annualReward, 120)
  assert.equal(result.annualFees, 24); assert.equal(result.recurringNet, 96); assert.equal(result.firstYearNet, 196)
  close(result.effectiveRate, 96 / 18000 * 100)
  close(result.breakEvenMonthlySpend, 200)
})
test('missing qualifying months does not reduce the twelve monthly fees', () => {
  assert.equal(calculateCashback({ ...sample, qualifyingMonths: 8 }).recurringNet, 56)
  const none = calculateCashback({ ...sample, qualifyingMonths: 0, bonus: 0 })
  assert.equal(none.recurringNet, -24); assert.equal(none.breakEvenMonthlySpend, null)
})
test('zero cap, uncapped rewards, additional costs and zero spending stay distinct', () => {
  assert.equal(calculateCashback({ ...sample, monthlyCap: 0 }).annualReward, 0)
  assert.equal(calculateCashback({ ...sample, monthlyCap: null }).annualReward, 180)
  assert.equal(calculateCashback({ ...sample, annualFee: 30, annualCosts: 25 }).recurringNet, 41)
  assert.equal(calculateCashback({ ...sample, monthlySpend: 0 }).effectiveRate, null)
  assert.equal(calculateCashback({ ...sample, monthlyFee: 20 }).breakEvenMonthlySpend, null)
  assert.equal(calculateCashback({ ...sample, monthlyFee: 10 }).breakEvenMonthlySpend, 1000)
})
test('invalid and overflowing financial inputs are rejected', () => {
  for (const change of [{ monthlySpend: -1 }, { rate: 101 }, { monthlyCap: -1 }, { rate: NaN }, { qualifyingMonths: 2.5 }, { qualifyingMonths: 13 }, { annualFee: Infinity }, { monthlySpend: Number.MAX_VALUE }]) {
    assert.throws(() => calculateCashback({ ...sample, ...change }))
  }
})
test('guide comparison arithmetic agrees with independently specified scenarios', () => {
  for (const [spend, a, b] of [[3000, 15, 0], [6000, 30, 30], [12000, 60, 90]]) {
    const base = { ...sample, monthlySpend: spend / 12, monthlyCap: null, monthlyFee: 0, bonus: 0 }
    close(calculateCashback({ ...base, rate: .5 }).recurringNet, a)
    close(calculateCashback({ ...base, rate: 1, annualFee: 30 }).recurringNet, b)
  }
})
test('calculator telemetry requires explicit consent and never includes financial inputs', () => {
  const calls = []
  let choice = null
  const context = { window: { location: { pathname: '/tools/net-cashback-calculator' }, gtag: (...args) => calls.push(args) }, localStorage: { getItem: () => choice } }
  const analytics = load('lib/analytics.ts', context)
  analytics.trackToolEvent('calculator_complete', 'net-cashback-calculator'); assert.equal(calls.length, 0)
  choice = 'accepted'; analytics.trackToolEvent('calculator_complete', 'net-cashback-calculator')
  assert.equal(JSON.stringify(calls), JSON.stringify([['event', 'calculator_complete', { tool_slug: 'net-cashback-calculator' }]]))
  analytics.trackToolEvent('calculator_complete', 'salary=60000'); assert.equal(calls.length, 1)
  choice = 'declined'; analytics.trackToolEvent('calculator_complete', 'isa-allowance-tracker'); assert.equal(calls.length, 1)
  choice = 'accepted'; context.window.location.pathname = '/embed/net-cashback-calculator'; analytics.trackToolEvent('calculator_start', 'net-cashback-calculator'); assert.equal(calls.length, 1)
  context.localStorage.getItem = () => { throw new Error('blocked') }; assert.doesNotThrow(() => analytics.trackToolEvent('calculator_start', 'net-cashback-calculator'))
})
