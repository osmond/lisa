import { render, screen } from '@testing-library/react'
import ProgressRing from '../ProgressRing.jsx'

test('default mode sets stroke offset', () => {
  const { container } = render(<ProgressRing percent={0.5} size={40} />)
  const circle = container.querySelector('circle')
  const circ = parseFloat(circle.getAttribute('stroke-dasharray'))
  const off = parseFloat(circle.getAttribute('stroke-dashoffset'))
  expect(off).toBeCloseTo(circ * 0.5)
})

test('count mode shows text', () => {
  const { container } = render(
    <ProgressRing percent={1} size={40} displayMode="count" displayText="7/7" />
  )
  expect(screen.getByTestId('stat-text').textContent).toBe('7/7')
  const circle = container.querySelector('circle')
  const circ = parseFloat(circle.getAttribute('stroke-dasharray'))
  const off = parseFloat(circle.getAttribute('stroke-dashoffset'))
  expect(off).toBeCloseTo(0)
})
