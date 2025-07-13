import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from '../Home.jsx'

jest.mock('../../PlantContext.jsx', () => ({
  usePlants: () => ({ plants: [] }),
}))

jest.mock('../../WeatherContext.jsx', () => ({
  useWeather: () => ({ forecast: { rainfall: 0 } }),
}))

test('shows upbeat message when there are no tasks', () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )
  expect(screen.getByText(/all plants are happy/i)).toBeInTheDocument()
})
