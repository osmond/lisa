import { render, screen, waitFor } from '@testing-library/react'
import { WeatherProvider } from '../WeatherContext.jsx'

const originalFetch = global.fetch

// Basic consumer component
function Dummy() {
  return <div>child</div>
}

afterEach(() => {
  global.fetch = originalFetch
})

test('shows error banner when fetch fails', async () => {
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

  process.env.VITE_WEATHER_API_KEY = origKey
})
