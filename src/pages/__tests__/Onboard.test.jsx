import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Onboard from '../Onboard.jsx'
import { __addPlant as addPlant } from '../../PlantContext.jsx'

let mockRooms = ['Office']

jest.mock('../../PlantContext.jsx', () => {
  const addPlant = jest.fn()
  return {
    __esModule: true,
    usePlants: () => ({ addPlant }),
    __addPlant: addPlant,
    addBase: (u) => u,
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
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          text: 'ok',
          water: 7,
          water_volume_ml: 500,
          water_volume_oz: 17,
        }),
    })
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

  expect(addPlant).toHaveBeenCalledWith(
    expect.objectContaining({
      waterPlan: { interval: 7, volume_ml: 500, volume_oz: 17 },
      light: 'Medium',
    })
  )
  expect(screen.getByText('Home')).toBeInTheDocument()
})

test('autocomplete fills scientific name', async () => {
  const planData = { text: 'ok', water: 7, water_volume_ml: 500, water_volume_oz: 17 }
  global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(planData) }))

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
  await waitFor(() => screen.getByText('Aloe Vera'))
  fireEvent.change(nameInput, { target: { value: 'Aloe Vera' } })
  fireEvent.change(screen.getByLabelText(/pot diameter/i), { target: { value: '4' } })
  fireEvent.click(screen.getByRole('button', { name: /generate care plan/i }))
  await waitFor(() => screen.getByTestId('care-plan'))
  fireEvent.click(screen.getByRole('button', { name: /add plant/i }))

  expect(addPlant).toHaveBeenCalledWith(
    expect.objectContaining({ scientificName: 'Aloe Vera', name: 'Aloe Vera' })
  )
})

test('selecting a name fetches defaults', async () => {
  const planData = {
    light: 'Low',
    humidity: 60,
    water: 5,
    water_volume_ml: 400,
    water_volume_oz: 13,
  }
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve(planData) })
  )

  render(
    <MemoryRouter initialEntries={['/onboard']}>
      <Routes>
        <Route path="/onboard" element={<Onboard />} />
      </Routes>
    </MemoryRouter>
  )

  fireEvent.change(screen.getByLabelText(/pot diameter/i), {
    target: { value: '6' },
  })
  fireEvent.change(screen.getByLabelText(/plant name/i), {
    target: { value: 'Snake' },
  })

  await waitFor(() => expect(global.fetch).toHaveBeenCalled())
  await waitFor(() =>
    expect(screen.getByLabelText(/light level/i)).toHaveValue('Low')
  )
  expect(screen.getByLabelText(/humidity/i)).toHaveValue(60)
})

test('shows error message on failure', async () => {
  global.fetch = jest.fn(() => Promise.resolve({ ok: false, json: () => Promise.resolve({ error: 'bad' }) }))
  render(
    <MemoryRouter initialEntries={['/onboard']}>
      <Routes>
        <Route path="/onboard" element={<Onboard />} />
      </Routes>
    </MemoryRouter>
  )
  fireEvent.change(screen.getByLabelText(/plant name/i), { target: { value: 'A' } })
  fireEvent.click(screen.getByRole('button', { name: /generate care plan/i }))
  await waitFor(() => screen.getByRole('alert'))
  expect(screen.getByRole('alert')).toHaveTextContent('Failed to generate plan')
})

test('uses fallback plan on failure', async () => {
  global.fetch = jest.fn(() => Promise.resolve({ ok: false, json: () => Promise.resolve({ error: 'bad' }) }))
  render(
    <MemoryRouter initialEntries={['/onboard']}>
      <Routes>
        <Route path="/onboard" element={<Onboard />} />
      </Routes>
    </MemoryRouter>
  )
  fireEvent.change(screen.getByLabelText(/plant name/i), { target: { value: 'Aloe' } })
  fireEvent.change(screen.getByLabelText(/pot diameter/i), { target: { value: '4' } })
  fireEvent.click(screen.getByRole('button', { name: /generate care plan/i }))
  await waitFor(() => screen.getByTestId('water-plan'))
  expect(screen.getByTestId('water-plan')).toHaveTextContent('0 mL / 0 oz every 0 days')
})

test('shows spinner while loading', async () => {
  let resolveFetch
  global.fetch = jest.fn(
    () =>
      new Promise(res => {
        resolveFetch = () =>
          res({
            ok: true,
            json: () =>
              Promise.resolve({
                text: 'ok',
                water: 1,
                water_volume_ml: 100,
                water_volume_oz: 3,
              }),
          })
      })
  )

  render(
    <MemoryRouter initialEntries={['/onboard']}>
      <Routes>
        <Route path="/onboard" element={<Onboard />} />
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

  expect(screen.getByTestId('spinner')).toBeInTheDocument()

  resolveFetch()
  await waitFor(() => screen.getByTestId('care-plan'))
})
