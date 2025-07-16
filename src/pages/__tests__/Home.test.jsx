import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from '../Home.jsx'

jest.mock('../../WeatherContext.jsx', () => ({
  useWeather: () => ({ forecast: { rainfall: 0 } }),
}))

jest.mock('../../UserContext.jsx', () => ({
  useUser: () => ({ username: 'Jon' }),
}))

const mockPlants = []

jest.mock('../../PlantContext.jsx', () => ({
  usePlants: () => ({ plants: mockPlants }),
}))

test('shows upbeat message when there are no tasks', () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )
  expect(screen.getByText(/all plants are happy/i)).toBeInTheDocument()
  expect(screen.getByTestId('care-stats')).toBeInTheDocument()
  expect(
    screen.getByRole('link', { name: /add a journal entry/i })
  ).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /set a reminder/i })).toBeInTheDocument()
})

test('care stats render when tasks exist', () => {
  jest.useFakeTimers().setSystemTime(new Date('2025-07-10'))
  mockPlants.splice(0, mockPlants.length, {
    id: 1,
    name: 'Plant A',
    image: 'a.jpg',
    lastWatered: '2025-07-03',
    nextFertilize: '2025-07-10',
  })

  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )

  const stats = screen.getByTestId('care-stats')
  expect(stats).toBeInTheDocument()
  expect(screen.getByTestId('stat-total')).toHaveTextContent('2')
  expect(screen.getByTestId('stat-water')).toHaveTextContent('1')
  expect(screen.getByTestId('stat-fertilize')).toHaveTextContent('1')
})

test('featured card appears before care stats', () => {
  jest.useFakeTimers().setSystemTime(new Date('2025-07-10'))
  mockPlants.splice(0, mockPlants.length, {
    id: 1,
    name: 'Plant A',
    image: 'a.jpg',
    lastWatered: '2025-07-03',
    nextFertilize: '2025-07-10',
  })

  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )

  const featured = screen.getByTestId('featured-card')
  const stats = screen.getByTestId('care-stats')
  expect(featured).toBeInTheDocument()
  const order = featured.compareDocumentPosition(stats)
  expect(order & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
})

test('earliest due plant appears first', () => {
  jest.useFakeTimers().setSystemTime(new Date('2025-07-10'))
  mockPlants.splice(0, mockPlants.length,
    {
      id: 1,
      name: 'Plant A',
      image: 'a.jpg',
      lastWatered: '2025-07-02',
    },
    {
      id: 2,
      name: 'Plant B',
      image: 'b.jpg',
      lastWatered: '2025-07-03',
    }
  )

  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )

  const groups = screen.getAllByTestId('plant-task-card')
  expect(groups[0]).toHaveTextContent('Plant A')
  expect(groups[1]).toHaveTextContent('Plant B')
})

test('tasks for a plant consolidate into one card', () => {
  jest.useFakeTimers().setSystemTime(new Date('2025-07-10'))
  mockPlants.splice(0, mockPlants.length,
    {
      id: 1,
      name: 'Plant A',
      image: 'a.jpg',
      lastWatered: '2025-07-03',
      nextFertilize: '2025-07-10',
    }
  )

  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )

  const groups = screen.getAllByTestId('plant-task-card')
  expect(groups).toHaveLength(1)
  expect(groups[0]).toHaveTextContent('Plant A')
  expect(groups[0].textContent).toMatch(/Water/)
  expect(groups[0].textContent).toMatch(/Fertilize/)
})

