import { render, screen, fireEvent } from '@testing-library/react'

import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'


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
  localStorage.clear()
})

test('ignores activities without valid dates when generating events', () => {
  render(
    <MemoryRouter>
      <Tasks />
    </MemoryRouter>
  )

  expect(screen.queryByText(/Repotted/)).toBeNull()


  const cards = screen.getAllByTestId('task-card')

  expect(cards).toHaveLength(2)
  expect(cards[0]).toHaveTextContent('To Water')
  expect(cards[0]).toHaveTextContent('Plant B')
  expect(cards[1]).toHaveTextContent('To Water')
  expect(cards[1]).toHaveTextContent('Plant A')
  expect(cards.length).toBeGreaterThan(0)




})

test('shows friendly message when there are no tasks', () => {
  mockPlants = []
  render(
    <MemoryRouter>
      <Tasks />
    </MemoryRouter>
  )

  expect(screen.getByText(/All caught up/i)).toBeInTheDocument()
  expect(screen.queryAllByTestId('task-card')).toHaveLength(0)
})


test('filters by type', () => {
  render(
    <MemoryRouter>
      <Tasks />
    </MemoryRouter>
  )

  const selects = screen.getAllByRole('combobox')
  fireEvent.change(selects[0], { target: { value: 'water' } })

  const cards = screen.getAllByTestId('task-card')
  expect(cards).toHaveLength(2)
  expect(cards[0]).toHaveTextContent('To Water')
  expect(cards[0]).toHaveTextContent('Plant B')
  expect(cards[1]).toHaveTextContent('To Water')
  expect(cards[1]).toHaveTextContent('Plant A')
})

test('sorts by plant name', () => {
  render(
    <MemoryRouter>
      <Tasks />
    </MemoryRouter>
  )

  const selects = screen.getAllByRole('combobox')
  fireEvent.change(selects[2], { target: { value: 'name' } })

  const cards = screen.getAllByTestId('task-card')
  expect(cards[0]).toHaveTextContent('Plant A')

})


test('switching to Past tab shows past events', async () => {
  render(
    <MemoryRouter>
      <Tasks />
    </MemoryRouter>
  )

  const pastTab = screen.getByRole('tab', { name: /Past/i })
  await userEvent.click(pastTab)


  const cards = screen.getAllByTestId('task-card')
  expect(cards).toHaveLength(1)
  expect(cards[0]).toHaveTextContent('Plant B: Watered on 2025-07-10')


})

test('completed tasks are styled', () => {
  const today = new Date().toISOString().slice(0, 10)
  mockPlants = [
    {
      id: 1,
      name: 'Plant C',
      lastWatered: today,
      nextFertilize: today,
      lastFertilized: today,
    },
  ]
  render(
    <MemoryRouter>
      <Tasks />
    </MemoryRouter>
  )
  const cards = screen.getAllByTestId('task-card')
  const inner = cards[0].querySelector('.shadow-sm')
  expect(inner).toHaveClass('opacity-50')
  expect(Array.from(cards).some(c => c.textContent.includes('Watered'))).toBe(
    true
  )
})

test('future watering date does not show Water Now button', () => {
  jest.useFakeTimers().setSystemTime(new Date('2025-07-10'))
  render(
    <MemoryRouter>
      <Tasks />
    </MemoryRouter>
  )

  const tab = screen.getByRole('tab', { name: /By Plant/i })
  fireEvent.click(tab)

  expect(screen.queryByText('Water Now')).toBeNull()
  jest.useRealTimers()
})
