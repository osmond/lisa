import { render } from '@testing-library/react'
import SummaryStrip from '../SummaryStrip.jsx'

test('renders counts, icons and progress rings', () => {
  const { container } = render(
    <SummaryStrip
      total={3}
      watered={1}
      fertilized={2}
      waterCompleted={0}
      waterTotal={1}
      fertCompleted={0}
      fertTotal={2}
    />
  )
  expect(container.querySelectorAll('svg').length).toBeGreaterThanOrEqual(6)
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
