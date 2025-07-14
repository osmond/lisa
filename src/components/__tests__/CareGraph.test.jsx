import { render, screen } from '@testing-library/react'
import CareGraph from '../CareGraph.jsx'

test('renders grid with highlighted events', () => {
  const events = [
    { date: '2025-07-02' },
    { date: '2025-07-10' },
  ]
  const { container } = render(<CareGraph events={events} />)
  const cells = container.querySelectorAll('[role="gridcell"]')
  expect(cells.length).toBeGreaterThan(30)
  const highlights = container.querySelectorAll('.bg-accent')
  expect(highlights).toHaveLength(2)
})

test('shows message when no events', () => {
  render(<CareGraph events={[]} />)
  expect(screen.getByText('No watering events')).toBeInTheDocument()
})
