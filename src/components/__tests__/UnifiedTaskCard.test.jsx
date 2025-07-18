import { render, screen } from '@testing-library/react'
import UnifiedTaskCard from '../UnifiedTaskCard.jsx'

jest.useFakeTimers().setSystemTime(new Date('2025-07-10'))

const plant = {
  name: 'Fern',
  image: 'fern.jpg',
  lastWatered: '2025-07-10',
  dueWater: true,
  dueFertilize: false,
  lastCared: '2025-07-07',
}

test('renders plant info and badges', () => {
  render(<UnifiedTaskCard plant={plant} />)
  expect(screen.getByText('Fern')).toBeInTheDocument()
  const waterBadge = screen.getByText('Water')
  expect(waterBadge).toBeInTheDocument()
  expect(waterBadge).toHaveClass('bg-water-100/90')
  expect(screen.queryByText('Fertilize')).toBeNull()
  expect(screen.getByText('Last cared for 3 days ago')).toBeInTheDocument()
})

test('applies urgent style', () => {
  const { container } = render(<UnifiedTaskCard plant={plant} urgent />)
  const wrapper = container.querySelector('[data-testid="unified-task-card"]')
  expect(wrapper).toHaveClass('bg-yellow-50')
})

test('applies overdue style', () => {
  const { container } = render(<UnifiedTaskCard plant={plant} overdue />)
  const wrapper = container.querySelector('[data-testid="unified-task-card"]')
  expect(wrapper).toHaveClass('bg-red-50')
})

test('matches snapshot in dark mode', () => {
  document.documentElement.classList.add('dark')
  const { container } = render(<UnifiedTaskCard plant={plant} />)
  expect(container.firstChild).toMatchSnapshot()
  document.documentElement.classList.remove('dark')
})

afterAll(() => {
  jest.useRealTimers()
})
