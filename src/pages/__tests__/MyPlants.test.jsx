import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import MyPlants from '../MyPlants.jsx'

let mockPlants = []
let mockRooms = []

jest.mock('../../PlantContext.jsx', () => ({
  usePlants: () => ({ plants: mockPlants }),
  addBase: (u) => u,
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

  const badge = screen
    .getAllByText(/needs love/i)
    .find(el => el.tagName === 'SPAN')
  expect(badge).toHaveTextContent('2 needs love')

  jest.useRealTimers()
})

test('sorts rooms by plant count', () => {
  mockRooms = ['Kitchen', 'Living']
  mockPlants = [
    { id: 1, name: 'A', room: 'Living', lastWatered: '2025-07-01' },
    { id: 2, name: 'B', room: 'Living', lastWatered: '2025-07-01' },
    { id: 3, name: 'C', room: 'Kitchen', lastWatered: '2025-07-01' },
  ]
  render(
    <MemoryRouter>
      <MyPlants />
    </MemoryRouter>
  )

  const newestBtn = screen.getByRole('button', { name: /newest/i })
  fireEvent.click(newestBtn)

  const links = screen
    .getAllByRole('link')
    .filter(l => l.getAttribute('href') !== '/room/add')
  expect(links[0]).toHaveTextContent('Living')
})

test('filters rooms needing love', () => {
  jest.useFakeTimers().setSystemTime(new Date('2025-07-10'))
  mockRooms = ['Kitchen', 'Living']
  mockPlants = [
    {
      id: 1,
      name: 'A',
      room: 'Living',
      lastWatered: '2025-07-01',
      nextFertilize: '2025-07-05',
    },
    { id: 2, name: 'B', room: 'Kitchen', lastWatered: '2025-07-09' },
  ]
  render(
    <MemoryRouter>
      <MyPlants />
    </MemoryRouter>
  )

  const loveBtn = screen.getByRole('button', { name: /needs love/i })
  fireEvent.click(loveBtn)

  const links = screen
    .getAllByRole('link')
    .filter(l => l.getAttribute('href') !== '/room/add')
  expect(
    screen.queryByRole('link', { name: 'Kitchen' })
  ).toBeNull()
  expect(links).toHaveLength(1)
  expect(links[0]).toHaveTextContent('Living')
  jest.useRealTimers()
})

test('searches plants by name', () => {
  mockRooms = ['Kitchen', 'Living']
  mockPlants = [
    { id: 1, name: 'Fern', room: 'Living', lastWatered: '2025-07-01' },
    { id: 2, name: 'Basil', room: 'Kitchen', lastWatered: '2025-07-01' },
  ]
  render(
    <MemoryRouter>
      <MyPlants />
    </MemoryRouter>
  )

  const search = screen.getByRole('searchbox', { name: /search plants/i })
  fireEvent.change(search, { target: { value: 'fer' } })

  const links = screen
    .getAllByRole('link')
    .filter(l => l.getAttribute('href') !== '/room/add')

  expect(
    screen.queryByRole('link', { name: 'Kitchen' })
  ).toBeNull()
  expect(links).toHaveLength(1)
  expect(links[0]).toHaveTextContent('Living')
})
