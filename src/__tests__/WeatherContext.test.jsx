import { render, screen, waitFor } from '@testing-library/react'
import { WeatherProvider } from '../WeatherContext.jsx'

// Basic consumer component
function Dummy() {
  return <div>child</div>
}

test('shows error banner when fetch fails', async () => {
  const origFetch = global.fetch
  const origKey = process.env.VITE_WEATHER_API_KEY
  process.env.VITE_WEATHER_API_KEY = 'key'
  global.fetch = jest.fn(() => Promise.reject(new Error('fail')))

  render(
    <WeatherProvider>
      <Dummy />
    </WeatherProvider>
  )

  expect(screen.getByText(/loading weather/i)).toBeInTheDocument()

  await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())
  expect(screen.getByRole('alert')).toHaveTextContent(/failed to load weather data/i)
  expect(screen.queryByText(/loading weather/i)).not.toBeInTheDocument()

  global.fetch = origFetch
  process.env.VITE_WEATHER_API_KEY = origKey
})

test('shows error when api key missing', async () => {
  const origKey = process.env.VITE_WEATHER_API_KEY
  delete process.env.VITE_WEATHER_API_KEY

  render(
    <WeatherProvider>
      <Dummy />
    </WeatherProvider>
  )

  await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())
  expect(screen.getByRole('alert')).toHaveTextContent(/missing api key/i)
  expect(screen.queryByText(/loading weather/i)).not.toBeInTheDocument()

  process.env.VITE_WEATHER_API_KEY = origKey
})
