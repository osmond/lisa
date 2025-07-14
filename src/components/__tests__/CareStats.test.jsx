import { render, screen } from '@testing-library/react'
import CareStats from '../CareStats.jsx'

test('renders stats with numbers and icons', () => {
  const { container } = render(
    <CareStats
      waterCompleted={1}
      waterTotal={2}
      fertCompleted={2}
      fertTotal={2}
    />
  )
  expect(screen.getByTestId('stat-water')).toBeInTheDocument()
  expect(screen.getByTestId('stat-fertilize')).toBeInTheDocument()
  expect(screen.getByTestId('stat-total')).toBeInTheDocument()
  const svgs = container.querySelectorAll('svg')
  expect(svgs.length).toBeGreaterThanOrEqual(6)
  svgs.forEach(svg => {
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })
  const texts = screen.getAllByTestId('stat-text').map(el => el.textContent)
  expect(texts).toEqual(['3/4', '1/2', '2/2'])
})
