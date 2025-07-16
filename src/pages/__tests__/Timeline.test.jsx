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

let mockPlants = samplePlants
jest.mock('../../PlantContext.jsx', () => ({
  usePlants: () => ({ plants: mockPlants }),
}))

beforeEach(() => {
  mockPlants = samplePlants
})

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

test('renders care log notes', () => {
  mockPlants = [
    {
      id: 1,
      name: 'Plant A',
      careLog: [
        { date: '2025-07-02', type: 'Watered', note: 'deep soak' },
      ],
    },
  ]

  render(<Timeline />)
  expect(screen.getByText(/Watered Plant A/)).toBeInTheDocument()
  expect(screen.getByText('deep soak')).toBeInTheDocument()
})

test('renders an icon for events', () => {
  const { container } = render(<Timeline />)
  const svg = container.querySelector('svg[aria-hidden="true"]')
  expect(svg).toBeInTheDocument()
})

test('displays month headers when events span months', () => {
  mockPlants = [
    { id: 1, name: 'A', lastWatered: '2025-07-01' },
    { id: 2, name: 'B', lastWatered: '2025-08-02' },
  ]

  render(<Timeline />)

  const headings = screen.getAllByRole('heading', { level: 3 })
  expect(headings).toHaveLength(2)
  expect(headings[0]).toHaveTextContent('July 2025')
  expect(headings[1]).toHaveTextContent('August 2025')
})
