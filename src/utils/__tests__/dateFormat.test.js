import { formatDaysAgo } from '../dateFormat.js'

test('formats ISO date to days ago string', () => {
  jest.useFakeTimers().setSystemTime(new Date('2025-07-10'))
  expect(formatDaysAgo('2025-07-07')).toBe('3 days ago')
  expect(formatDaysAgo('2025-07-09')).toBe('1 day ago')
  expect(formatDaysAgo('2025-07-10')).toBe('0 days ago')
  jest.useRealTimers()
})
