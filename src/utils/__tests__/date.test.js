import { daysAgo, formatCareSummary } from '../date.js'

test('daysAgo calculates difference in days', () => {
  jest.useFakeTimers().setSystemTime(new Date('2025-07-10'))
  expect(daysAgo('2025-07-07')).toBe(3)
  jest.useRealTimers()
})

test('formatCareSummary combines last and next watering info', () => {
  jest.useFakeTimers().setSystemTime(new Date('2025-07-10'))
  const summary = formatCareSummary('2025-07-07', '2025-07-10')
  expect(summary).toBe('Last watered 3 days ago \u00B7 Needs water today')
  jest.useRealTimers()
})
