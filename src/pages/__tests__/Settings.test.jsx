import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Settings from '../Settings.jsx'
import { UserProvider } from '../../UserContext.jsx'

jest.mock('../../ThemeContext.jsx', () => ({
  useTheme: () => ({ theme: 'light', toggleTheme: jest.fn() }),
}))
jest.mock('../../WeatherContext.jsx', () => ({
  useWeather: () => ({
    location: '',
    setLocation: jest.fn(),
    timezone: '',
    setTimezone: jest.fn(),
    units: 'metric',
    setUnits: jest.fn(),
  }),
}))

test('updates name in localStorage', () => {
  render(
    <MemoryRouter>
      <UserProvider>
        <Settings />
      </UserProvider>
    </MemoryRouter>
  )
  const input = screen.getByLabelText(/name/i)
  fireEvent.change(input, { target: { value: 'Bob' } })
  expect(localStorage.getItem('userName')).toBe('Bob')
})

test('loads name from localStorage', () => {
  localStorage.setItem('userName', 'Carol')
  render(
    <MemoryRouter>
      <UserProvider>
        <Settings />
      </UserProvider>
    </MemoryRouter>
  )
  expect(screen.getByLabelText(/name/i)).toHaveValue('Carol')
})
