import { render } from '@testing-library/react'
import SummaryStrip from '../SummaryStrip.jsx'

test('renders counts and icons', () => {
  const { container } = render(
    <SummaryStrip total={3} watered={1} fertilized={2} />
  )
  expect(container.querySelectorAll('svg')).toHaveLength(3)
  const total = container.querySelector('[data-testid="summary-total"]')
  const water = container.querySelector('[data-testid="summary-water"]')
  const fert = container.querySelector('[data-testid="summary-fertilize"]')
  expect(total.textContent).toBe('3')
  expect(water.textContent).toBe('1')
  expect(fert.textContent).toBe('2')
  container.querySelectorAll('svg').forEach(svg => {
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })
})
