import { estimateET0, getSpeciesInfo, generateCareSummary } from '../careSummary.js'

test('estimateET0 returns positive value', () => {
  const et = estimateET0(25, 50)
  expect(et).toBeGreaterThan(0)
})

test('species info matches cactus pattern', () => {
  const info = getSpeciesInfo('Golden Cactus')
  expect(info.kc).toBeLessThan(0.5)
  expect(info.distance).toMatch(/ft/)
})

test('generateCareSummary creates water plan', () => {
  const summary = generateCareSummary('Fern', 4, 'Medium', { temp: 75, humidity: 60 })
  expect(summary.waterPlan.interval).toBeGreaterThan(0)
  expect(summary.placement).toMatch(/window/)
  expect(summary.repot).toMatch(/Repot/)
})
