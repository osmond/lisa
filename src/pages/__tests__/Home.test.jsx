import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from '../Home.jsx'

let mockForecast = { rainfall: 0 }

jest.mock('../../WeatherContext.jsx', () => ({
  useWeather: () => ({ forecast: mockForecast }),
}))


afterEach(() => {
  mockForecast = { rainfall: 0 }
  if (window.prompt && window.prompt.mockClear) {
    window.prompt.mockClear()
  }
})

const mockPlants = []
global.mockPlants = mockPlants
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

test('summary items render when tasks exist', async () => {
  jest.useFakeTimers().setSystemTime(new Date('2025-07-10'))
  global.mockPlants.splice(0, global.mockPlants.length, {
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
  await waitFor(() => {
    expect(screen.getByTestId('summary-total')).toHaveTextContent('2')
  })
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


test('progress updates when completing a task', async () => {
  jest.useFakeTimers().setSystemTime(new Date('2025-07-10'))
  jest.spyOn(window, 'prompt').mockReturnValue('')
  global.mockPlants.splice(0, global.mockPlants.length,
    { id: 1, name: 'A', image: 'a.jpg', lastWatered: '2025-07-03' }
  )
  const { findByRole } = render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )

  const progress = await findByRole('progressbar')
  expect(progress).toHaveAttribute('aria-valuenow', '0')
  fireEvent.click(screen.getByRole('checkbox'))
  expect(progress).toHaveAttribute('aria-valuenow', '1')
})

test('complete all marks every task', async () => {
  jest.useFakeTimers().setSystemTime(new Date('2025-07-10'))
  const promptSpy = jest.spyOn(window, 'prompt').mockReturnValue('')
  mockForecast = { rainfall: 100 }
  global.mockPlants.splice(0, global.mockPlants.length,
    { id: 1, name: 'A', image: 'a.jpg', lastWatered: '2025-07-02' },
    { id: 2, name: 'B', image: 'b.jpg', lastWatered: '2025-07-02' }
  )


  const { findByRole } = render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )


  const progress = await findByRole('progressbar')
  expect(progress).toHaveAttribute('aria-valuenow', '0')
  const button = screen.getByRole('button', { name: /complete all/i })
  expect(screen.getByTestId('water-list')).not.toContainElement(button)
  fireEvent.click(button)
  expect(global.markWatered).toHaveBeenCalledTimes(2)
  expect(promptSpy).not.toHaveBeenCalled()
  expect(progress).toHaveAttribute('aria-valuenow', '2')

})

