import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import PlantDetail from '../PlantDetail.jsx'
import { usePlants } from '../../PlantContext.jsx'

let mockPlants = []
const updatePhotoCaption = jest.fn()

jest.mock('../../PlantContext.jsx', () => {
  const actual = jest.requireActual('../../PlantContext.jsx')
  return { ...actual, usePlants: jest.fn() }
})

const usePlantsMock = usePlants

beforeEach(() => {
  mockPlants = [
    {
      id: 1,
      name: 'Plant A',
      image: 'a.jpg',
      careLog: [],
      photos: [{ src: 'a.jpg', caption: '' }],
    },
  ]
  updatePhotoCaption.mockClear()
  usePlantsMock.mockReturnValue({
    plants: mockPlants,
    addPhoto: jest.fn(),
    removePhoto: jest.fn(),
    updatePhotoCaption,
    markWatered: jest.fn(),
    markFertilized: jest.fn(),
    logEvent: jest.fn(),
  })
})

test('editing caption calls context', () => {
  render(
    <MemoryRouter initialEntries={['/plant/1']}>
      <Routes>
        <Route path="/plant/:id" element={<PlantDetail />} />
      </Routes>
    </MemoryRouter>
  )

  const input = screen.getByPlaceholderText(/caption/i)
  fireEvent.change(input, { target: { value: 'Hello' } })
  expect(updatePhotoCaption).toHaveBeenCalledWith(1, 0, 'Hello')
})
