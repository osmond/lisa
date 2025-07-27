import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import EditPlant from '../EditPlant.jsx'
import { __updatePlant as updatePlant } from '../../PlantContext.jsx'

let mockPlants = []
let mockRooms = []

jest.mock('../../PlantContext.jsx', () => {
  const updatePlant = jest.fn()
  return {
    __esModule: true,
    usePlants: () => ({ plants: mockPlants, updatePlant }),
    __updatePlant: updatePlant,
    addBase: (u) => u,
  }
})

jest.mock('../../RoomContext.jsx', () => ({
  useRooms: () => ({ rooms: mockRooms }),
}))

afterEach(() => {
  updatePlant.mockClear()
})

test('room field displays current value and submits updates', () => {
  mockRooms = ['Living', 'Kitchen']
  mockPlants = [
    {
      id: 1,
      name: 'Fern',
      room: 'Living',
      lastWatered: '',
      nextWater: '',
      lastFertilized: '',
      nextFertilize: '',
      image: ''
    },
  ]

  render(
    <MemoryRouter initialEntries={['/plant/1/edit']}>
      <Routes>
        <Route path="/plant/:id/edit" element={<EditPlant />} />
      </Routes>
    </MemoryRouter>
  )

  const input = screen.getByLabelText(/room/i)
  expect(input).toHaveValue('Living')

  fireEvent.change(input, { target: { value: 'Kitchen' } })
  fireEvent.click(screen.getByRole('button', { name: /save changes/i }))

  expect(updatePlant).toHaveBeenCalledWith(
    1,
    expect.objectContaining({ room: 'Kitchen' })
  )
})
