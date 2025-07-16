import { render, screen } from '@testing-library/react'
import UnifiedTaskCard from '../UnifiedTaskCard.jsx'

const plant = {
  name: 'Fern',
  image: 'fern.jpg',
  lastWatered: '2025-07-10',
  dueWater: true,
  dueFertilize: false,
  lastCared: '2025-07-10',
}

test('renders plant info and water button', () => {
  render(<UnifiedTaskCard plant={plant} />)
  expect(screen.getByText('Fern')).toBeInTheDocument()
  expect(screen.getByText(/Needs water/)).toBeInTheDocument()
  expect(screen.getByText('Water Now')).toBeInTheDocument()
  expect(screen.queryByText('Fertilize Now')).toBeNull()
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
