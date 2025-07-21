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


test('smart plan matches baseline without context', () => {
  const plant = { name: 'Pothos', diameter: 4 }
  const smart = getSmartWaterPlan(plant, { date: '2025-04-10' })
  const base = getWaterPlan('Pothos', 4)
  expect(smart).toEqual(base)
})

test('shortens interval during heatwave', () => {
  const plant = { name: 'Pothos', diameter: 4 }
  const plan = getSmartWaterPlan(plant, { temp: 95, date: '2025-04-10' })
  expect(plan.interval).toBe(5)
})

test('extends interval during rain spell', () => {
  const plant = { name: 'Pothos', diameter: 4 }
  const plan = getSmartWaterPlan(plant, { rainfall: 80, date: '2025-04-10' })
  expect(plan.interval).toBe(9)
})

test('reduces interval for hot, dry weather', () => {
  const plant = { name: 'Pothos', diameter: 4 }
  const plan = getSmartWaterPlan(plant, {
    temp: 95,
    humidity: 25,
    date: '2025-06-01'
  })
  expect(plan.interval).toBe(3)
})

test('extends interval for winter season', () => {
  const plant = { name: 'Pothos', diameter: 4 }
  const plan = getSmartWaterPlan(plant, { date: '2025-12-15' })
  expect(plan.interval).toBe(8)
})

test('adjusts interval based on early watering logs', () => {
  const plant = { name: 'Pothos', diameter: 4 }
  const logs = [
    { date: '2025-04-01' },
    { date: '2025-04-06' },
    { date: '2025-04-11' },
  ]
  const plan = getSmartWaterPlan(plant, { date: '2025-04-10' }, logs)
  expect(plan.interval).toBe(5)
})

test('adjusts interval based on late watering logs', () => {
  const plant = { name: 'Pothos', diameter: 4 }
  const logs = [
    { date: '2025-04-01' },
    { date: '2025-04-11' },
    { date: '2025-04-21' },
  ]
  const plan = getSmartWaterPlan(plant, { date: '2025-04-10' }, logs)
  expect(plan.interval).toBe(10)

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
