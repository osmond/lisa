import { render, screen } from '@testing-library/react'
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
})
