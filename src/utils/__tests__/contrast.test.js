import { contrastRatio } from '../contrast.js'

const lightAccent = '#1e7832'
const darkAccent = '#7fb77e'
const lightBg = '#f9faf8'
const darkBg = '#1f2937'

// WCAG AA requires 4.5:1 for text contrast

test('light accent contrasts with light background', () => {
  expect(contrastRatio(lightAccent, lightBg)).toBeGreaterThanOrEqual(4.5)
})

test('light accent contrasts with white text', () => {
  expect(contrastRatio(lightAccent, '#ffffff')).toBeGreaterThanOrEqual(4.5)
})

test('dark accent contrasts with dark background', () => {
  expect(contrastRatio(darkAccent, darkBg)).toBeGreaterThanOrEqual(4.5)
})

test('dark accent contrasts with black icons', () => {
  expect(contrastRatio(darkAccent, '#000000')).toBeGreaterThanOrEqual(3)
})
