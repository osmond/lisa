import { render, screen, waitFor } from '@testing-library/react'
import { WeatherProvider, useWeather } from '../WeatherContext.jsx'

function ShowWeather() {
  const { forecast, error } = useWeather()
  return (
    <div>
      <span data-testid="forecast">{forecast ? 'y' : 'n'}</span>
      <span data-testid="error">{error || ''}</span>
    </div>
  )
}

describe('WeatherProvider', () => {
  const originalFetch = global.fetch
  beforeEach(() => {
    process.env.VITE_WEATHER_API_KEY = 'test'
    global.fetch = jest.fn().mockRejectedValue(new Error('fail'))
  })

  afterEach(() => {
    global.fetch = originalFetch
    delete process.env.VITE_WEATHER_API_KEY
  })

  test('sets error when fetch fails', async () => {
    render(
      <WeatherProvider>
        <ShowWeather />
      </WeatherProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('error').textContent).toContain('fail')
    })
    expect(screen.getByTestId('forecast').textContent).toBe('n')
  })
})
