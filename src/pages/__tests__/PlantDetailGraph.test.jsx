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
      lastWatered: '2025-07-10',
      careLog: [
        { date: '2025-07-10', type: 'Watered' },
        { date: '2025-07-15', type: 'Fertilized' },
      ],
      photos: [],
    },
  ]
})

test('renders care graph when tab selected', () => {
  render(
    <MemoryRouter initialEntries={['/plant/1']}>
      <Routes>
        <Route path="/plant/:id" element={<PlantDetail />} />
      </Routes>
    </MemoryRouter>
  )

  fireEvent.click(screen.getByRole('button', { name: /Timeline/ }))
  fireEvent.click(screen.getByRole('tab', { name: /Care Graph/ }))

  expect(screen.getByRole('grid')).toBeInTheDocument()
})
