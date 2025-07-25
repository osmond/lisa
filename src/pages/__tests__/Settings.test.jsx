import { render, screen, fireEvent } from '@testing-library/react'
import Settings from '../Settings.jsx'

jest.mock('../../ThemeContext.jsx', () => ({
  useTheme: () => ({ theme: 'light', toggleTheme: jest.fn() }),
}))

jest.mock('../../WeatherContext.jsx', () => ({
  useWeather: () => ({
    location: 'NYC',
    setLocation: jest.fn(),
    units: 'imperial',
    setUnits: jest.fn(),
    forecast: null,
  }),
}))

jest.mock('../../UserContext.jsx', () => ({
  useUser: () => ({
    username: 'Jon',
    setUsername: jest.fn(),
    timeZone: 'UTC',
    setTimeZone: jest.fn(),
  }),
}))

jest.mock('../../OpenAIContext.jsx', () => ({
  useOpenAI: () => ({ enabled: true, setEnabled: jest.fn() }),
}))

jest.mock('../../hooks/useToast.jsx', () => ({
  __esModule: true,
  default: () => ({ Toast: () => null, showToast: jest.fn() }),
}))


test('handleReset clears storage and reloads only when confirmed', () => {
  const clearSpy = jest.spyOn(Storage.prototype, 'clear')
  const confirmSpy = jest.spyOn(window, 'confirm')

  confirmSpy.mockReturnValue(false)
  render(<Settings />)
  fireEvent.click(screen.getByRole('button', { name: /reset app/i }))
  expect(clearSpy).not.toHaveBeenCalled()

  confirmSpy.mockReturnValue(true)
  fireEvent.click(screen.getByRole('button', { name: /reset app/i }))
  expect(clearSpy).toHaveBeenCalled()

  confirmSpy.mockRestore()
  clearSpy.mockRestore()
})
