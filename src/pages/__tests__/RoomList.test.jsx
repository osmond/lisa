import { render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import RoomList from '../RoomList.jsx'

let mockPlants = []

jest.mock('../../PlantContext.jsx', () => ({
  usePlants: () => ({ plants: mockPlants }),
}))

function renderWithRoute(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/room/:roomName" element={<RoomList />} />
      </Routes>
    </MemoryRouter>
  )
}

test('shows back link to All Plants', () => {
  mockPlants = []
  renderWithRoute('/room/Living')
  const link = screen.getByRole('link', { name: /all plants/i })
  expect(link).toHaveAttribute('href', '/myplants')
  const nav = screen.getByRole('navigation', { name: /breadcrumb/i })
  const items = within(nav).getAllByRole('listitem')
  expect(items).toHaveLength(2)
})

test('displays last fertilized info for plants', () => {
  jest.useFakeTimers().setSystemTime(new Date('2025-07-10'))
  mockPlants = [
    {
      id: 1,
      name: 'Rose',
      room: 'Balcony',
      image: 'rose.jpg',
      placeholderSrc: 'rose.jpg',
      lastWatered: '2025-07-08',
      nextWater: '2025-07-15',
      lastFertilized: '2025-07-05'
    }
  ]
  renderWithRoute('/room/Balcony')
  expect(screen.getByText(/last fertilized 5 days ago/i)).toBeInTheDocument()
  jest.useRealTimers()
})
