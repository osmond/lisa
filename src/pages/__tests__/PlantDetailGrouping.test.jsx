import { render, screen, fireEvent } from '@testing-library/react'
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
      name: 'Plant A',
      image: 'a.jpg',
      lastWatered: '2025-07-02',
      careLog: [{ date: '2025-07-10', type: 'Watered' }],
      photos: [],
    },
  ]
})

test('groups events by week when within same month', () => {
  render(
    <MemoryRouter initialEntries={['/plant/1']}>
      <Routes>
        <Route path="/plant/:id" element={<PlantDetail />} />
      </Routes>
    </MemoryRouter>
  )

  fireEvent.click(screen.getByRole('button', { name: /Timeline/ }))

  const headers = screen.getAllByText(/Week of/i)
  expect(headers.length).toBeGreaterThan(0)
  expect(headers[0].className).toMatch(/sticky/)
})

test('groups events by month when spanning multiple months', () => {
  mockPlants = [
    {
      id: 1,
      name: 'Plant A',
      image: 'a.jpg',
      lastWatered: '2025-07-02',
      careLog: [{ date: '2025-08-05', type: 'Watered' }],
      photos: [],
    },
  ]

  render(
    <MemoryRouter initialEntries={['/plant/1']}>
      <Routes>
        <Route path="/plant/:id" element={<PlantDetail />} />
      </Routes>
    </MemoryRouter>
  )

  fireEvent.click(screen.getByRole('button', { name: /Timeline/ }))

  expect(screen.getByText('July 2025')).toBeInTheDocument()
  expect(screen.getByText('August 2025')).toBeInTheDocument()
  expect(screen.queryByText(/Week of/)).toBeNull()
})
