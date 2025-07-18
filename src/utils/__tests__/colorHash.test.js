import { colorHash } from '../colorHash.js'

test('generates deterministic pastel colors', () => {
  expect(colorHash('Kitchen')).toBe('hsl(4, 60%, 85%)')
  expect(colorHash('Kitchen')).toBe(colorHash('Kitchen'))
  expect(colorHash('Living')).not.toBe(colorHash('Kitchen'))
})
