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

  await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())
  expect(screen.getByRole('alert')).toHaveTextContent(/failed to load weather data/i)

  global.fetch = origFetch
  process.env.VITE_WEATHER_API_KEY = origKey
})
