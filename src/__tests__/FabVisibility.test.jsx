import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App.jsx'

jest.mock('../PlantContext.jsx', () => ({
  usePlants: () => ({ plants: [] }),
}))

jest.mock('../WeatherContext.jsx', () => ({
  useWeather: () => ({ forecast: { rainfall: 0 } }),
}))

jest.mock('../UserContext.jsx', () => ({
  useUser: () => ({ username: 'Jon' }),
}))

jest.mock('../ThemeContext.jsx', () => ({
  useTheme: () => ({ theme: 'light', toggleTheme: () => {} }),
}))

const routesWithFab = [
  '/',
  '/myplants',
  '/add',
  '/profile',
  '/timeline',
  '/plant/1',
  '/plant/1/edit',
  '/nonexistent',
]

const routesWithoutFab = ['/care', '/tasks']

describe('Floating Action Button visibility', () => {
  test.each(routesWithFab)('shows FAB on %s', route => {
    render(
      <MemoryRouter initialEntries={[route]}>
        <App />
      </MemoryRouter>
    )

    expect(screen.queryByLabelText(/add plant/i)).toBeInTheDocument()
  })

  test.each(routesWithoutFab)('hides FAB on %s', route => {
    render(
      <MemoryRouter initialEntries={[route]}>
        <App />
      </MemoryRouter>
    )

    expect(screen.queryByLabelText(/add plant/i)).toBeNull()
  })
})
