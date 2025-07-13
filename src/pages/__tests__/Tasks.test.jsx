import { render, screen } from '@testing-library/react'
import Tasks from '../Tasks.jsx'

const samplePlants = [
  {
    id: 1,
    name: 'Plant A',
    nextWater: '2025-07-17',
    activity: ['Repotted'],
  },
  {
    id: 2,
    name: 'Plant B',
    nextWater: '2025-07-15',
    activity: ['Watered on 2025-07-10'],
  },
]

jest.mock('../../PlantContext.jsx', () => ({
  usePlants: () => ({ plants: samplePlants }),
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
