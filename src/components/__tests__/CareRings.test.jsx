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
  expect(outerOffset).toBeCloseTo(outerCirc * 0.5)
  expect(innerOffset).toBeCloseTo(innerCirc * 0.75)
})

test('accessible label announces progress', () => {
  render(
    <CareRings waterCompleted={3} waterTotal={4} fertCompleted={2} fertTotal={4} />
  )
  expect(
    screen.getByRole('img', { name: '75% watered, 50% fertilized' })
  ).toBeInTheDocument()
})

test('shows combined progress when incomplete', () => {
  const { container } = render(
    <CareRings waterCompleted={1} waterTotal={2} fertCompleted={0} fertTotal={2} />
  )
  expect(screen.getByText('1 / 4 tasks done')).toBeInTheDocument()
  const svg = container.querySelector('svg')
  expect(svg.getAttribute('class')).toMatch(/ring-pulse/)
})

test('shows progress text and swirl when complete', () => {
  const { container } = render(
    <CareRings waterCompleted={2} waterTotal={2} fertCompleted={1} fertTotal={1} />
  )
  expect(screen.getByText('🎉 All done!')).toBeInTheDocument()
  const svg = container.querySelector('svg')
  expect(svg.getAttribute('class')).toMatch(/swirl-once/)
})

test('shows rest day text when no tasks', () => {
  const { container } = render(<CareRings />)
  expect(screen.getByText('Rest Day')).toBeInTheDocument()
  const svg = container.querySelector('svg')
  expect(svg.getAttribute('class')).not.toMatch(/ring-pulse|swirl-once/)
})

test('fires onClick handler', () => {
  const onClick = jest.fn()
  render(
    <CareRings waterCompleted={0} waterTotal={1} fertCompleted={0} fertTotal={1} onClick={onClick} />
  )
  const wrapper = screen.getByRole('img').parentElement
  wrapper && wrapper.click()
  expect(onClick).toHaveBeenCalled()
})
