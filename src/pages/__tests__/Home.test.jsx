import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from '../Home.jsx'

jest.mock('../../WeatherContext.jsx', () => ({
  useWeather: () => ({ forecast: { rainfall: 0 } }),
}))

global.mockPlants = []
global.markWatered = jest.fn()

jest.mock('../../PlantContext.jsx', () => ({
  usePlants: () => ({ plants: global.mockPlants, markWatered: global.markWatered }),
}))

beforeEach(() => {
  global.mockPlants.length = 0
  global.markWatered.mockClear()
})

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

test('progress updates when completing a task', () => {
  jest.useFakeTimers().setSystemTime(new Date('2025-07-10'))
  jest.spyOn(window, 'prompt').mockReturnValue('')
  mockPlants.splice(0, mockPlants.length,
    { id: 1, name: 'A', image: 'a.jpg', lastWatered: '2025-07-03' }
  )
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )

  const progress = screen.getByRole('progressbar')
  expect(progress).toHaveAttribute('aria-valuenow', '0')
  fireEvent.click(screen.getByRole('checkbox'))
  expect(progress).toHaveAttribute('aria-valuenow', '1')
})

test('complete all marks every task', () => {
  jest.useFakeTimers().setSystemTime(new Date('2025-07-10'))
  jest.spyOn(window, 'prompt').mockReturnValue('')
  mockPlants.splice(0, mockPlants.length,
    { id: 1, name: 'A', image: 'a.jpg', lastWatered: '2025-07-03' },
    { id: 2, name: 'B', image: 'b.jpg', lastWatered: '2025-07-03' }
  )

  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )

  const progress = screen.getByRole('progressbar')
  expect(progress).toHaveAttribute('aria-valuenow', '0')
  fireEvent.click(screen.getByRole('button', { name: /complete all/i }))
  expect(global.markWatered).toHaveBeenCalledTimes(2)
  expect(progress).toHaveAttribute('aria-valuenow', '2')
})

