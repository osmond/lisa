import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App.jsx'

jest.mock('../PlantContext.jsx', () => ({
  usePlants: () => ({ plants: [] }),
}))

jest.mock('../WeatherContext.jsx', () => ({
  useWeather: () => ({ forecast: { rainfall: 0 } }),
}))

jest.mock('../UserContext.jsx', () => ({
  useUser: () => ({ username: 'Jon', timeZone: 'UTC' }),
}))

jest.mock('../ThemeContext.jsx', () => ({
  useTheme: () => ({ theme: 'light', toggleTheme: () => {} }),
}))

jest.mock('../RoomContext.jsx', () => ({
  useRooms: () => ({ rooms: [] }),
}))

describe('floating action button visibility', () => {
  test('shows fab on All Plants page', () => {
    render(
      <MemoryRouter initialEntries={[ '/myplants' ]}>
        <App />
      </MemoryRouter>
    )

    const button = screen.getByRole('button', { name: /open create menu/i })
    fireEvent.click(button)
    const overlay = screen.getByRole('dialog', { name: /add menu/i })
    expect(within(overlay).getByRole('link', { name: /add plant/i })).toBeInTheDocument()
    expect(within(overlay).getByRole('link', { name: /add room/i })).toBeInTheDocument()
  })

  test('fab hidden on Profile page', () => {
    render(
      <MemoryRouter initialEntries={[ '/profile' ]}>
        <App />
      </MemoryRouter>
    )

    expect(screen.queryByRole('button', { name: /open create menu/i })).toBeNull()
  })
})

