import { render, screen, fireEvent } from '@testing-library/react'
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

jest.mock('../RoomContext.jsx', () => ({
  useRooms: () => ({ rooms: [] }),
}))

const routesWithAddLink = [
  '/',
  '/myplants',
  '/add',
  '/profile',
  '/timeline',
  '/tasks',
  '/nonexistent',
]

const plantRoutes = ['/plant/1']

describe('Menu contents based on route', () => {
  test.each(routesWithAddLink)('shows Add Plant and Add Room links on %s', route => {
    render(
      <MemoryRouter initialEntries={[route]}>
        <App />
      </MemoryRouter>
    )

    const button = screen.getByRole('button', { name: /open navigation menu/i })
    fireEvent.click(button)
    const links = screen.getAllByRole('link', { name: /add plant/i })
    expect(links.length).toBeGreaterThan(0)
    const roomLinks = screen.getAllByRole('link', { name: /add room/i })
    expect(roomLinks.length).toBeGreaterThan(0)
  })

  test.each(plantRoutes)('shows Add Plant and Add Room links on %s', route => {
    render(
      <MemoryRouter initialEntries={[route]}>
        <App />
      </MemoryRouter>
    )

    const button = screen.getByRole('button', { name: /open navigation menu/i })
    fireEvent.click(button)
    expect(screen.getByRole('link', { name: /add plant/i })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /add room/i }).length).toBeGreaterThan(0)
  })
})
