import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../../App.jsx'

jest.mock('../../PlantContext.jsx', () => ({
  usePlants: () => ({ plants: [] }),
}))

jest.mock('../../WeatherContext.jsx', () => ({
  useWeather: () => ({ forecast: { rainfall: 0 } }),
}))

jest.mock('../../UserContext.jsx', () => ({
  useUser: () => ({ username: 'Jon', setUsername: () => {} }),
}))

jest.mock('../../ThemeContext.jsx', () => ({
  useTheme: () => ({ theme: 'light', toggleTheme: () => {} }),
}))

test('navigating to /profile renders the Settings page', () => {
  render(
    <MemoryRouter initialEntries={['/profile']}>
      <App />
    </MemoryRouter>
  )

  expect(screen.getByRole('heading', { name: /settings/i })).toBeInTheDocument()
})
