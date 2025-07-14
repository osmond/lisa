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

jest.mock('../../UserContext.jsx', () => ({
  useUser: () => ({ username: 'Kay' }),
}))

test('shows upbeat message when there are no tasks', () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )
  expect(screen.getByText(/all plants are happy/i)).toBeInTheDocument()
})

test('summary progress renders when tasks exist', () => {
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

  expect(screen.getByTestId('summary-progress')).toHaveTextContent(
    '0 of 2 plants watered today'
  )
})

