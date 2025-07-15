import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Tasks from '../Tasks.jsx'

const samplePlants = [
  {
    id: 1,
    name: 'Plant A',
    lastWatered: '2025-07-10',
    activity: ['Repotted'],
  },
  {
    id: 2,
    name: 'Plant B',
    lastWatered: '2025-07-08',
    activity: ['Watered on 2025-07-10'],
  },
]

let mockPlants = samplePlants

jest.mock('../../PlantContext.jsx', () => ({
  usePlants: () => ({ plants: mockPlants }),
}))

jest.mock('../../WeatherContext.jsx', () => ({
  useWeather: () => ({ forecast: { rainfall: 0 } }),
}))

beforeEach(() => {
  mockPlants = samplePlants
})

test('ignores activities without valid dates when generating events', () => {
  render(
    <MemoryRouter>
      <Tasks />
    </MemoryRouter>
  )

  expect(screen.queryByText(/Repotted/)).toBeNull()

  const cards = screen.getAllByTestId('task-card')
  expect(cards).toHaveLength(3)
  expect(cards[0]).toHaveTextContent('Plant B: Watered on 2025-07-10')
  expect(cards[1]).toHaveTextContent('Water')
  expect(cards[1]).toHaveTextContent('Plant B')
  expect(cards[2]).toHaveTextContent('Water')
  expect(cards[2]).toHaveTextContent('Plant A')
})

test('shows friendly message when there are no tasks', () => {
  mockPlants = []
  render(
    <MemoryRouter>
      <Tasks />
    </MemoryRouter>
  )

  expect(screen.getByText(/no tasks coming up/i)).toBeInTheDocument()
  expect(screen.queryAllByTestId('task-card')).toHaveLength(0)
})
