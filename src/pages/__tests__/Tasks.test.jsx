import { render, screen, fireEvent, within, cleanup } from '@testing-library/react'

import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'


import Tasks from '../Tasks.jsx'

const samplePlants = [
  {
    id: 1,
    name: 'Plant A',
    lastWatered: '2025-07-08',
    activity: ['Repotted'],
  },
  {
    id: 2,
    name: 'Plant B',
    lastWatered: '2025-07-16',
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
  jest.useFakeTimers().setSystemTime(new Date("2025-07-16"))
  render(
    <MemoryRouter>
      <Tasks />
    </MemoryRouter>
  )

  expect(screen.queryByText(/Repotted/)).toBeNull()


  const cards = screen.getAllByTestId('task-card')

  expect(cards).toHaveLength(2)
  expect(cards[0]).toHaveTextContent('Plant A')
  expect(cards[1]).toHaveTextContent('Plant B')

  jest.useRealTimers()



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
  jest.useFakeTimers().setSystemTime(new Date("2025-07-16"))
  render(
    <MemoryRouter>
      <Tasks />
    </MemoryRouter>
  )

  const selects = screen.getAllByRole('combobox')
  fireEvent.change(selects[0], { target: { value: 'water' } })

  const cards = screen.getAllByTestId('task-card')
  expect(cards).toHaveLength(2)
  expect(cards[0]).toHaveTextContent('Plant A')
  expect(cards[1]).toHaveTextContent('Plant B')
  jest.useRealTimers()
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


}, 7000)

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
  expect(cards[0]).toHaveClass('opacity-50')
  expect(Array.from(cards).some(c => c.textContent.includes('Watered'))).toBe(
    true
  )
})


test('future watering date does not show Water badge', async () => {
  jest.useFakeTimers().setSystemTime(new Date('2025-07-10'))

  render(
    <MemoryRouter>
      <Tasks />
    </MemoryRouter>
  )

  const tab = screen.getByRole('tab', { name: /By Plant/i })
  fireEvent.click(tab)

  const firstCard = screen.getAllByTestId('unified-task-card')[0]
  expect(within(firstCard).queryByText('Water', { exact: true })).toBeNull()
  jest.useRealTimers()

  const pastTab = screen.getByRole('tab', { name: /Past/i })
  await userEvent.click(pastTab)

  cleanup()

  render(
    <MemoryRouter>
      <Tasks />
    </MemoryRouter>
  )


  const byPlantTab = screen.getByRole('tab', { name: /By Plant/i })
  await userEvent.click(byPlantTab)

  const cards = screen.getAllByTestId('unified-task-card')
  expect(cards).toHaveLength(2)

  expect(within(cards[0]).getByText('Water', { exact: true })).toBeInTheDocument()
  expect(within(cards[1]).queryByText('Water', { exact: true })).toBeNull()

})

test('by plant view shows due and future tasks correctly', async () => {
  mockPlants = [
    {
      id: 1,
      name: 'Due Plant',
      lastWatered: '2025-07-08',
      nextFertilize: '2025-07-15',
      image: '/img1.jpg',
    },
    {
      id: 2,
      name: 'Future Plant',
      lastWatered: '2025-07-16',
      nextFertilize: '2025-07-30',
      image: '/img2.jpg',
    },
  ]

  render(
    <MemoryRouter>
      <Tasks />
    </MemoryRouter>
  )

  const byPlantTab = screen.getByRole('tab', { name: /By Plant/i })
  await userEvent.click(byPlantTab)

  const cards = screen.getAllByTestId('unified-task-card')
  expect(cards).toHaveLength(2)

  const dueCard = cards.find(card =>
    within(card).queryByText('Due Plant')
  )
  const futureCard = cards.find(card =>
    within(card).queryByText('Future Plant')
  )

  expect(within(dueCard).getByText('Water', { exact: true })).toBeInTheDocument()
  expect(within(dueCard).getByText('Fertilize', { exact: true })).toBeInTheDocument()

  expect(within(futureCard).queryByText('Water', { exact: true })).toBeNull()
  expect(within(futureCard).queryByText('Fertilize', { exact: true })).toBeNull()
})
