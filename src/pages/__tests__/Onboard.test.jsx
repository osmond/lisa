import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Onboard from '../Onboard.jsx'
import { getWaterPlan } from '../../utils/waterCalculator.js'
import { __addPlant as addPlant } from '../../PlantContext.jsx'

let mockRooms = ['Office']

jest.mock('../../PlantContext.jsx', () => {
  const addPlant = jest.fn()
  return {
    __esModule: true,
    usePlants: () => ({ addPlant }),
    __addPlant: addPlant,
  }
})

jest.mock('../../RoomContext.jsx', () => ({
  useRooms: () => ({ rooms: mockRooms }),
}))

jest.mock('../../OpenAIContext.jsx', () => ({
  useOpenAI: () => ({ enabled: true }),
}))

jest.mock('../../WeatherContext.jsx', () => ({
  useWeather: () => ({ forecast: { humidity: 55 } }),
}))


afterEach(() => {
  addPlant.mockClear()
  global.fetch && (global.fetch = undefined)
})

test('generates plan and adds plant then navigates home', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve({ text: 'ok' }) })
  )

  render(
    <MemoryRouter initialEntries={['/onboard']}>
      <Routes>
        <Route path="/onboard" element={<Onboard />} />
        <Route path="/" element={<div>Home</div>} />
      </Routes>
    </MemoryRouter>
  )

  fireEvent.change(screen.getByLabelText(/plant name/i), {
    target: { value: 'Aloe' },
  })
  fireEvent.change(screen.getByLabelText(/pot diameter/i), {
    target: { value: '4' },
  })

  fireEvent.click(screen.getByRole('button', { name: /generate care plan/i }))

  await waitFor(() => screen.getByTestId('care-plan'))

  fireEvent.click(screen.getByRole('button', { name: /add plant/i }))

  const expected = getWaterPlan('Aloe', '4', 'Medium')
  expect(addPlant).toHaveBeenCalledWith(
    expect.objectContaining({ waterPlan: expected, light: 'Medium' })
  )
  expect(screen.getByText('Home')).toBeInTheDocument()
})

test('autocomplete fills scientific name', async () => {
  const taxaData = { results: [ { id: 1, name: 'Aloe vera', preferred_common_name: 'Aloe' } ] }
  const planData = { text: 'ok' }
  global.fetch = jest.fn()
    .mockResolvedValueOnce({ json: () => Promise.resolve(taxaData) })
    .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(planData) })

  render(
    <MemoryRouter initialEntries={['/onboard']}>
      <Routes>
        <Route path="/onboard" element={<Onboard />} />
        <Route path="/" element={<div>Home</div>} />
      </Routes>
    </MemoryRouter>
  )

  const nameInput = screen.getByLabelText(/plant name/i)
  fireEvent.change(nameInput, { target: { value: 'Al' } })
  await waitFor(() => screen.getByText('Aloe vera'))
  fireEvent.change(nameInput, { target: { value: 'Aloe' } })
  fireEvent.change(screen.getByLabelText(/pot diameter/i), { target: { value: '4' } })
  fireEvent.click(screen.getByRole('button', { name: /generate care plan/i }))
  await waitFor(() => screen.getByTestId('care-plan'))
  fireEvent.click(screen.getByRole('button', { name: /add plant/i }))

  expect(addPlant).toHaveBeenCalledWith(
    expect.objectContaining({ scientificName: 'Aloe vera', name: 'Aloe' })
  )
})
