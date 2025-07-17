import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import MyPlants from '../MyPlants.jsx'

let mockPlants = []
let mockRooms = []

jest.mock('../../PlantContext.jsx', () => ({
  usePlants: () => ({ plants: mockPlants }),
}))

jest.mock('../../RoomContext.jsx', () => ({
  useRooms: () => ({ rooms: mockRooms }),
}))

afterEach(() => {
  mockPlants = []
  mockRooms = []
})

test('shows add room button when no rooms', () => {
  mockRooms = []
  render(
    <MemoryRouter>
      <MyPlants />
    </MemoryRouter>
  )
  const link = screen.getByRole('link', { name: /add room/i })
  expect(link).toBeInTheDocument()
  expect(link).toHaveAttribute('href', '/room/add')
})

test('renders add tile in grid when rooms exist', () => {
  mockRooms = ['Living']
  render(
    <MemoryRouter>
      <MyPlants />
    </MemoryRouter>
  )
  const addTile = screen.getByRole('link', { name: /add room/i })
  expect(addTile).toBeInTheDocument()
  expect(addTile).toHaveAttribute('href', '/room/add')
})

test('shows overdue badge for rooms with tasks', () => {
  jest.useFakeTimers().setSystemTime(new Date('2025-07-10'))
  mockRooms = ['Living']
  mockPlants = [
    {
      id: 1,
      name: 'Plant A',
      room: 'Living',
      image: 'a.jpg',
      lastWatered: '2025-07-01',
      nextFertilize: '2025-07-05',
    },
  ]
  render(
    <MemoryRouter>
      <MyPlants />
    </MemoryRouter>
  )
  const badge = screen.getByText(/overdue/i)
  expect(badge).toHaveTextContent('⚠️ 2 overdue')
  jest.useRealTimers()
})
