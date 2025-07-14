import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import PlantDetail from '../PlantDetail.jsx'

let mockPlants = []

jest.mock('../../PlantContext.jsx', () => ({
  usePlants: () => ({
    plants: mockPlants,
    addPhoto: jest.fn(),
    removePhoto: jest.fn(),
    markWatered: jest.fn(),
    logEvent: jest.fn(),
  }),
}))

beforeEach(() => {
  mockPlants = [
    {
      id: 1,
      name: 'Test Plant',
      image: 'test.jpg',
      lastWatered: '2025-07-10',
      nextWater: '2025-07-17',
      nextWaterReason: 'high ET\u2080 levels',
      photos: [],
    },
  ]
})

test('displays next water reason in header when available', () => {
  render(
    <MemoryRouter initialEntries={['/plant/1']}>
      <Routes>
        <Route path="/plant/:id" element={<PlantDetail />} />
      </Routes>
    </MemoryRouter>
  )

  expect(
    screen.getByText(/high ET₀ levels/i)
  ).toBeInTheDocument()
})
