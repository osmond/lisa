import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import EditCarePlan from '../EditCarePlan.jsx'
import { __updatePlant as updatePlant } from '../../PlantContext.jsx'

const mockPlants = [
  {
    id: 1,
    name: 'Aloe',
    diameter: 4,
    room: 'Office',
    humidity: 40,
    light: 'Medium',
    waterPlan: { interval: 3, volume_ml: 100, volume_oz: 3 },
    carePlan: { fertilize: 15 },
  },
]

jest.mock('../../PlantContext.jsx', () => {
  const updatePlant = jest.fn()
  return {
    __esModule: true,
    usePlants: () => ({ plants: mockPlants, updatePlant }),
    __updatePlant: updatePlant,
    addBase: (u) => u,
  }
})

jest.mock('../../OpenAIContext.jsx', () => ({
  useOpenAI: () => ({ enabled: true }),
}))

afterEach(() => {
  updatePlant.mockClear()
  global.fetch && (global.fetch = undefined)
})

test('generates plan and saves updates', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          water: 7,
          water_volume_ml: 500,
          water_volume_oz: 17,
          fertilize: 30,
        }),
    })
  )

  render(
    <MemoryRouter initialEntries={['/plant/1/edit-care-plan']}>
      <Routes>
        <Route path="/plant/:id/edit-care-plan" element={<EditCarePlan />} />
        <Route path="/plant/:id" element={<div>Detail</div>} />
      </Routes>
    </MemoryRouter>
  )

  fireEvent.click(screen.getByRole('button', { name: /generate care plan/i }))

  await waitFor(() => expect(screen.getByLabelText(/water interval/i)).toHaveValue(7))
  expect(screen.getByLabelText(/fertilize interval/i)).toHaveValue(30)

  fireEvent.click(screen.getByRole('button', { name: /save/i }))

  expect(updatePlant).toHaveBeenCalledWith(
    1,
    expect.objectContaining({
      waterPlan: { interval: 7, volume_ml: 500, volume_oz: 17 },
      carePlan: expect.objectContaining({ fertilize: 30, water: 7 }),
    })
  )

  expect(screen.getByText('Detail')).toBeInTheDocument()
})
