import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import PlantDetail from '../PlantDetail.jsx'

let mockPlants = []
jest.mock('../../PlantContext.jsx', () => ({
  usePlants: () => ({
    plants: mockPlants,
    addPhoto: jest.fn(),
    removePhoto: jest.fn(),
  }),
}))

beforeEach(() => {
  mockPlants = [
    {
      id: 1,
      name: 'Plant A',
      image: 'a.jpg',
      careLog: [
        { date: '2025-07-02', type: 'Watered', note: 'deep soak' },
      ],
      photos: [],
    },
  ]
})

test('shows notes from care log in timeline', () => {
  render(
    <MemoryRouter initialEntries={['/plant/1']}>
      <Routes>
        <Route path="/plant/:id" element={<PlantDetail />} />
      </Routes>
    </MemoryRouter>
  )

  expect(screen.getByText('July 2, 2025')).toBeInTheDocument()
  expect(screen.getByText(/Watered/)).toBeInTheDocument()
  expect(screen.getByText('deep soak')).toBeInTheDocument()

})
