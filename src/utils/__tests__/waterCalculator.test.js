import { getWaterPlan } from '../waterCalculator.js'

test('calculates pot volume from diameter', () => {
  const { volume } = getWaterPlan('Pothos', 4)
  expect(volume).toBe(Math.round(Math.PI * 2 * 2 * 3))
})

test('returns longer interval for cactus', () => {
  const { interval } = getWaterPlan('Bunny Ear Cactus', 6)
  expect(interval).toBe(14)
})

test('returns short interval for fern', () => {
  const { interval } = getWaterPlan('Boston Fern', 6)
  expect(interval).toBe(3)
})
