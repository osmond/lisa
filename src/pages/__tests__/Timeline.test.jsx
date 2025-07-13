import { render, screen } from '@testing-library/react'
import Timeline from '../Timeline.jsx'

const samplePlants = [
  {
    id: 1,
    name: 'Plant A',
    lastWatered: '2025-07-11',
    lastFertilized: '2025-07-01',
    activity: ['Repotted'],
  },
  {
    id: 2,
    name: 'Plant B',
    lastWatered: '2025-07-10',
    activity: ['Watered on 2025-07-09'],
  },
]

jest.mock('../../PlantContext.jsx', () => ({
  usePlants: () => ({ plants: samplePlants }),
}))

test('ignores activities without valid dates when generating events', () => {
  render(<Timeline />)

  expect(screen.queryByText(/Repotted/)).toBeNull()

  const items = screen.getAllByRole('listitem')
  expect(items).toHaveLength(4)
  expect(items[0]).toHaveTextContent('Fertilized Plant A')
  expect(items[1]).toHaveTextContent('Plant B: Watered on 2025-07-09')
  expect(items[2]).toHaveTextContent('Watered Plant B')
  expect(items[3]).toHaveTextContent('Watered Plant A')
})
