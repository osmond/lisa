import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CareView from '../CareView.jsx'

let mockPlants = []

jest.mock('../../PlantContext.jsx', () => ({
  usePlants: () => ({ plants: mockPlants })
}))

jest.mock('../../WeatherContext.jsx', () => ({
  useWeather: () => ({ forecast: { rainfall: 0 } })
}))

beforeEach(() => {
  mockPlants = []
})

test('tasks sort correctly when switching sort option', () => {
  jest.useFakeTimers().setSystemTime(new Date('2025-07-08'))
  mockPlants = [
    { id: 1, name: 'Z Plant', image: 'z.jpg', lastWatered: '2025-06-30', urgency: 'high' },
    { id: 2, name: 'A Plant', image: 'a.jpg', lastWatered: '2025-06-30' }
  ]

  render(
    <MemoryRouter>
      <CareView />
    </MemoryRouter>
  )

  let cards = screen.getAllByTestId('task-card')
  expect(cards[0]).toHaveTextContent('Z Plant')
  expect(cards[1]).toHaveTextContent('A Plant')

  const select = screen.getByRole('combobox')
  fireEvent.change(select, { target: { value: 'name' } })

  cards = screen.getAllByTestId('task-card')
  expect(cards[0]).toHaveTextContent('A Plant')
  expect(cards[1]).toHaveTextContent('Z Plant')
  jest.useRealTimers()
})

test('shows friendly message when no tasks are due', () => {
  render(
    <MemoryRouter>
      <CareView />
    </MemoryRouter>
  )

  expect(screen.getByText('All plants are happy today!')).toBeInTheDocument()
})
