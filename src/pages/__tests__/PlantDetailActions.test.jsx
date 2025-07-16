import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import PlantDetail from '../PlantDetail.jsx'
import { usePlants } from '../../PlantContext.jsx'

const markWatered = jest.fn()
const markFertilized = jest.fn()
let mockPlants = []

jest.mock('../../PlantContext.jsx', () => ({
  usePlants: jest.fn(),
}))

const usePlantsMock = usePlants

beforeEach(() => {
  markWatered.mockClear()
  markFertilized.mockClear()
  mockPlants = [
    {
      id: 1,
      name: 'Plant A',
      image: 'a.jpg',
      lastWatered: '2025-07-01',
      nextWater: '2025-07-08',
      lastFertilized: '2025-06-01',
      nextFertilize: '2025-07-01',
      photos: [],
    },
  ]
  usePlantsMock.mockReturnValue({
    plants: mockPlants,
    markWatered,
    markFertilized,
    addPhoto: jest.fn(),
    removePhoto: jest.fn(),
    logEvent: jest.fn(),
  })
})

test('quick stats action buttons trigger handlers', () => {
  render(
    <MemoryRouter initialEntries={['/plant/1']}>
      <Routes>
        <Route path="/plant/:id" element={<PlantDetail />} />
      </Routes>
    </MemoryRouter>
  )

  fireEvent.click(
    screen.getByRole('button', { name: /mark plant a as watered/i })
  )
  expect(markWatered).toHaveBeenCalledWith(1, '')

  fireEvent.click(
    screen.getByRole('button', { name: /mark plant a as fertilized/i })
  )
  expect(markFertilized).toHaveBeenCalledWith(1, '')
})
