import { render, screen } from '@testing-library/react'
import ProgressRing from '../ProgressRing.jsx'

function getDashoffset(circle) {
  return parseFloat(circle.getAttribute('stroke-dashoffset'))
}

test('renders progress with correct aria attributes and text', () => {
  const { container } = render(<ProgressRing completed={2} total={4} />)
  const progress = screen.getByRole('progressbar')
  expect(progress).toHaveAttribute('aria-valuenow', '2')
  expect(progress).toHaveAttribute('aria-valuemax', '4')
  expect(screen.getByText('2/4')).toBeInTheDocument()

  const circles = container.querySelectorAll('circle')
  const radius = 36
  const stroke = 4
  const normalized = radius - stroke * 2
  const circumference = normalized * 2 * Math.PI
  const expectedOffset = circumference - (2 / 4) * circumference
  expect(getDashoffset(circles[1])).toBeCloseTo(expectedOffset)
})

