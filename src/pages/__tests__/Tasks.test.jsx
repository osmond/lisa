import { render, screen } from '@testing-library/react'
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

jest.mock('../../PlantContext.jsx', () => ({
  usePlants: () => ({ plants: samplePlants }),
}))

jest.mock('../../useWeather.js', () => ({
  __esModule: true,
  default: () => ({ rainTomorrow: 0, eto: 0 }),
}))

test('ignores activities without valid dates when generating events', () => {
  render(<Tasks />)

  expect(screen.queryByText(/Repotted/)).toBeNull()

  const items = screen.getAllByRole('listitem')
  expect(items).toHaveLength(3)
  expect(items[0]).toHaveTextContent('Plant B: Watered on 2025-07-10')
  expect(items[1]).toHaveTextContent('Water Plant B')
  expect(items[2]).toHaveTextContent('Water Plant A')
})
