import { relativeDate } from '../relativeDate.js'

test('future dates return in X days', () => {
  const base = new Date('2025-07-10')
  expect(relativeDate('2025-07-15', base)).toBe('in 5 days')
})

test('past dates return X days ago', () => {
  const base = new Date('2025-07-10')
  expect(relativeDate('2025-07-05', base)).toBe('5 days ago')
})

test('today returns today', () => {
  const base = new Date('2025-07-10')
  expect(relativeDate('2025-07-10', base)).toBe('today')
})
