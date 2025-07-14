import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from '../Home.jsx'

let mockForecast = { rainfall: 0 }

jest.mock('../../WeatherContext.jsx', () => ({
  useWeather: () => ({ forecast: mockForecast }),
}))

afterEach(() => {
  mockForecast = { rainfall: 0 }
})

const mockPlants = []

jest.mock('../../PlantContext.jsx', () => ({
  usePlants: () => ({ plants: mockPlants }),
}))

test('shows messages when there are no tasks', () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )
  expect(screen.getByText(/no watering needed/i)).toBeInTheDocument()
  expect(screen.getByText(/no fertilizing needed/i)).toBeInTheDocument()
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
})

test('renders correct greeting icon for morning time', () => {
  jest.useFakeTimers().setSystemTime(new Date('2025-07-10T08:00:00Z'))

  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )

  const icon = screen.getByTestId('greeting-icon')
  expect(icon.innerHTML).toContain('<circle')
})

test('shows rain suggestion when heavy rain is forecast', () => {
  mockForecast = { temp: '70°F', condition: 'Cloudy', rainfall: 60 }

  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )

  expect(
    screen.getByText(/skip watering if it rains tomorrow/i)
  ).toBeInTheDocument()
})

