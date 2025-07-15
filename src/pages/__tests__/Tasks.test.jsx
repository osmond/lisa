import { render, screen } from '@testing-library/react'
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
  render(<Tasks />)

  expect(screen.queryByText(/Repotted/)).toBeNull()

  const items = screen.getAllByRole('listitem')
  expect(items).toHaveLength(2)
  expect(items[0]).toHaveTextContent('Water Plant B')
  expect(items[1]).toHaveTextContent('Water Plant A')
})

test('shows friendly message when there are no tasks', () => {
  mockPlants = []
  render(<Tasks />)

  expect(screen.getByText(/no tasks coming up/i)).toBeInTheDocument()
  expect(screen.queryAllByRole('listitem')).toHaveLength(0)
})

test('switching to Past tab shows past events', async () => {
  render(<Tasks />)

  const pastTab = screen.getByRole('tab', { name: /Past/i })
  await userEvent.click(pastTab)

  const items = screen.getAllByRole('listitem')
  expect(items).toHaveLength(1)
  expect(items[0]).toHaveTextContent('Plant B: Watered on 2025-07-10')
})
