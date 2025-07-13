import { getNextWateringDate } from '../watering.js'

test('postpones watering when rain expected', () => {
  const { date, reason } = getNextWateringDate('2025-07-10', { rainTomorrow: 5 })
  expect(date).toBe('2025-07-18')
  expect(reason).toMatch(/rain expected/i)
})

test('moves watering earlier when ET0 high', () => {
  const { date, reason } = getNextWateringDate('2025-07-10', { eto: 7 })
  expect(date).toBe('2025-07-16')
  expect(reason).toMatch(/ET₀/i)
})
