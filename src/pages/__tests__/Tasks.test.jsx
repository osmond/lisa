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
})

test('ignores activities without valid dates when generating events', () => {
  render(
    <MemoryRouter>
      <Tasks />
    </MemoryRouter>
  )

  expect(screen.queryByText(/Repotted/)).toBeNull()


  const cards = screen.getAllByTestId('task-card')
  expect(cards.length).toBeGreaterThan(0)

  const items = screen.getAllByRole('listitem')
  expect(items).toHaveLength(2)
  expect(items[0]).toHaveTextContent('Water Plant B')
  expect(items[1]).toHaveTextContent('Water Plant A')

})

test('shows friendly message when there are no tasks', () => {
  mockPlants = []
  render(
    <MemoryRouter>
      <Tasks />
    </MemoryRouter>
  )

  expect(screen.getByText(/no tasks coming up/i)).toBeInTheDocument()
  expect(screen.queryAllByTestId('task-card')).toHaveLength(0)
})


test('filters by type', () => {
  render(<Tasks />)

  const selects = screen.getAllByRole('combobox')
  fireEvent.change(selects[0], { target: { value: 'water' } })

  const items = screen.getAllByRole('listitem')
  expect(items).toHaveLength(2)
  expect(items[0]).toHaveTextContent('Water Plant B')
  expect(items[1]).toHaveTextContent('Water Plant A')
})

test('sorts by plant name', () => {
  render(<Tasks />)

  const selects = screen.getAllByRole('combobox')
  fireEvent.change(selects[2], { target: { value: 'name' } })

  const items = screen.getAllByRole('listitem')
  expect(items[0]).toHaveTextContent(/Plant A/)
})


test('switching to Past tab shows past events', async () => {
  render(<Tasks />)

  const pastTab = screen.getByRole('tab', { name: /Past/i })
  await userEvent.click(pastTab)

  const items = screen.getAllByRole('listitem')
  expect(items).toHaveLength(1)
  expect(items[0]).toHaveTextContent('Plant B: Watered on 2025-07-10')
})
