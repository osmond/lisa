import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Tasks from '../Tasks.jsx'

jest.mock('../../WeatherContext.jsx', () => ({
  useWeather: () => ({ forecast: { rainfall: 0 }, timezone: 'UTC' }),
}))

let mockPlants = []
jest.mock('../../PlantContext.jsx', () => ({
  usePlants: () => ({ plants: mockPlants }),
}))

beforeEach(() => {
  jest.useFakeTimers().setSystemTime(new Date('2025-07-10'))
  mockPlants = [
    {
      id: 1,
      name: 'Fern',
      image: 'a.jpg',
      lastWatered: '2025-07-01',
      urgency: 'overdue',
      type: 'fern',
    },
    {
      id: 2,
      name: 'Aloe',
      image: 'b.jpg',
      lastWatered: '2025-07-03',
      urgency: 'high',
      type: 'succulent',
    },
    {
      id: 3,
      name: 'Palm',
      image: 'c.jpg',
      lastWatered: '2025-07-05',
      urgency: 'low',
      type: 'fern',
    },
  ]
})

afterEach(() => {
  jest.useRealTimers()
})

test('groups tasks by date', () => {
  render(
    <MemoryRouter>
      <Tasks />
    </MemoryRouter>
  )

  expect(screen.getByRole('heading', { name: /needs attention/i })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: /today/i })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: /upcoming/i })).toBeInTheDocument()

  const needs = screen.getByRole('heading', { name: /needs attention/i }).nextSibling
  expect(needs).toHaveTextContent('Water Fern')
  const today = screen.getByRole('heading', { name: /today/i }).nextSibling
  expect(today).toHaveTextContent('Water Aloe')
  const upcoming = screen.getByRole('heading', { name: /upcoming/i }).nextSibling
  expect(upcoming).toHaveTextContent('Water Palm')
})

test('filters tasks by urgency and type', () => {
  render(
    <MemoryRouter>
      <Tasks />
    </MemoryRouter>
  )
  const selects = screen.getAllByRole('combobox')
  // first select is urgency
  fireEvent.change(selects[0], { target: { value: 'overdue' } })

  expect(screen.getByText('Water Fern')).toBeInTheDocument()
  expect(screen.queryByText('Water Aloe')).toBeNull()

  // second select is type
  fireEvent.change(selects[1], { target: { value: 'fern' } })
  expect(screen.getByText('Water Fern')).toBeInTheDocument()
  expect(screen.queryByText('Water Palm')).toBeNull()
})
