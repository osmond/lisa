import { isFrequentWatering } from '../watering.js'

test('flags frequent watering for snake plant', () => {
  const log = [
    { date: '2025-07-10', type: 'Watered' },
    { date: '2025-07-14', type: 'Watered' },
  ]
  expect(isFrequentWatering(log, 'Snake Plant')).toBe(true)
})

test('does not flag watering when spaced out', () => {
  const log = [
    { date: '2025-07-01', type: 'Watered' },
    { date: '2025-07-12', type: 'Watered' },
  ]
  expect(isFrequentWatering(log, 'Snake Plant')).toBe(false)
})

test('flags frequent watering for regular plant', () => {
  const log = [
    { date: '2025-07-05', type: 'Watered' },
    { date: '2025-07-07', type: 'Watered' },
  ]
  expect(isFrequentWatering(log, 'Monstera')).toBe(true)
})
