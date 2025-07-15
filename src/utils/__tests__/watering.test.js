import { getNextWateringDate, getWateringInfo } from '../watering.js'

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

test('handles invalid fromDate by defaulting to today', () => {
  jest.useFakeTimers().setSystemTime(new Date('2025-01-01'))
  expect(() => getNextWateringDate('')).not.toThrow()
  const { date } = getNextWateringDate('')
  expect(date).toBe('2025-01-08')
  jest.useRealTimers()
})

test('returns days since last watered', () => {
  jest.useFakeTimers().setSystemTime(new Date('2025-07-10'))
  const { daysSince } = getWateringInfo('2025-07-07')
  expect(daysSince).toBe(3)
  jest.useRealTimers()
})

test('includes eto value when provided', () => {
  const { eto } = getWateringInfo('2025-07-07', { eto: 5 })
  expect(eto).toBe(5)
})
