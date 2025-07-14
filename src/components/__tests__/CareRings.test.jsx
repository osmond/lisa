import { render, screen } from '@testing-library/react'
import CareRings from '../CareRings.jsx'

test('ring percentages set stroke offsets', () => {
  render(
    <CareRings waterCompleted={1} waterTotal={2} fertCompleted={1} fertTotal={4} />
  )
  const svg = screen.getByRole('img')
  const circles = svg.querySelectorAll('circle')
  const outer = circles[0]
  const inner = circles[1]
  const outerCirc = parseFloat(outer.getAttribute('stroke-dasharray'))
  const innerCirc = parseFloat(inner.getAttribute('stroke-dasharray'))
  const outerOffset = parseFloat(outer.getAttribute('stroke-dashoffset'))
  const innerOffset = parseFloat(inner.getAttribute('stroke-dashoffset'))
  expect(outerOffset).toBeCloseTo(outerCirc * 0.75)
  expect(innerOffset).toBeCloseTo(innerCirc * 0.5)
})

test('accessible label announces progress', () => {
  render(
    <CareRings waterCompleted={3} waterTotal={4} fertCompleted={2} fertTotal={4} />
  )
  expect(
    screen.getByRole('img', { name: '75% watered, 50% fertilized' })
  ).toBeInTheDocument()
})
