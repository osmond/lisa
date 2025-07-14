import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from '../Home.jsx'

jest.mock('../../WeatherContext.jsx', () => ({
  useWeather: () => ({ forecast: { rainfall: 0 } }),
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
  expect(screen.getByTestId('summary-total')).toBeInTheDocument()
  expect(screen.getByTestId('care-stats')).toBeInTheDocument()
})

test('summary items render when tasks exist', () => {
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

  expect(screen.getByTestId('summary-total')).toHaveTextContent('2')
  expect(screen.getByTestId('summary-water')).toHaveTextContent('1')
  expect(screen.getByTestId('summary-fertilize')).toHaveTextContent('1')
  const stats = screen.getByTestId('care-stats')
  expect(stats).toBeInTheDocument()
})

test('featured card appears before summary', () => {
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
  const summary = screen.getByTestId('summary-total')
  expect(featured).toBeInTheDocument()
  const order = featured.compareDocumentPosition(summary)
  expect(order & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
})

