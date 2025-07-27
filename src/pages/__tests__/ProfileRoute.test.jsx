import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { OpenAIProvider } from '../../OpenAIContext.jsx'
import App from '../../App.jsx'

jest.mock('../../PlantContext.jsx', () => ({
  usePlants: () => ({ plants: [] }),
  addBase: (u) => u,
}))

jest.mock('../../WeatherContext.jsx', () => ({
  useWeather: () => ({ forecast: { rainfall: 0 } }),
}))

jest.mock('../../UserContext.jsx', () => ({
  useUser: () => ({ username: 'Jon', setUsername: () => {}, timeZone: 'UTC', setTimeZone: () => {} }),
}))

jest.mock('../../ThemeContext.jsx', () => ({
  useTheme: () => ({ theme: 'light', toggleTheme: () => {} }),
}))

jest.mock('../../WishlistContext.jsx', () => ({
  useWishlist: () => ({ wishlist: [] })
}))

test('navigating to /profile renders the Settings page', () => {
  render(
    <OpenAIProvider>
      <MemoryRouter initialEntries={['/profile']}>
        <App />
      </MemoryRouter>
    </OpenAIProvider>
  )

  expect(screen.getByRole('heading', { name: /settings/i })).toBeInTheDocument()
  expect(screen.getByRole('switch', { name: /dark mode/i })).toBeInTheDocument()
})
