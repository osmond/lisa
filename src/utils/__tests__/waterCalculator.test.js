import { getWaterPlan, getSmartWaterPlan } from '../waterCalculator.js'

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

test('smart plan shortens interval for hot weather', () => {
  const { interval, reason } = getSmartWaterPlan('Pothos', 4, { temp: '90°F', rainfall: 0 })
  expect(interval).toBe(getWaterPlan('Pothos', 4).interval - 1)
  expect(reason).toMatch(/hot weather/i)
})

test('smart plan extends interval when rain expected', () => {
  const { interval, reason } = getSmartWaterPlan('Pothos', 4, { rainfall: 80 })
  expect(interval).toBe(getWaterPlan('Pothos', 4).interval + 1)
  expect(reason).toMatch(/rain/i)
})
