import { formatVolume } from '../units.js'

test('converts cubic inches to mL and oz', () => {
  expect(formatVolume(10)).toBe('164 mL / 6 oz')
  expect(formatVolume(127)).toBe('2081 mL / 70 oz')
})
