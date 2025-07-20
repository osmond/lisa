import generateSampleQuestions from '../generateSampleQuestions.js'

test('returns defaults when no plant provided', () => {
  const qs = generateSampleQuestions()
  expect(qs).toContain('How often should I water my plant?')
})

test('uses plant attributes when available', () => {
  const plant = {
    name: 'Aloe',
    light: 'Bright',
    humidity: 'Low',
    room: 'Kitchen',
    nextFertilize: '2025-08-01',
  }
  const qs = generateSampleQuestions(plant)
  expect(qs[0]).toBe('How often should I water my Aloe?')
  expect(qs).toContain('When should I fertilize my Aloe next?')
  expect(qs).toContain('Does Aloe need bright light?')
})
