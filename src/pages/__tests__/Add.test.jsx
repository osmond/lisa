import { render, screen, fireEvent, act } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Add from '../Add.jsx'
import Home from '../Home.jsx'
import SnackbarProvider, { Snackbar } from '../../hooks/SnackbarProvider.jsx'
import { PlantProvider } from '../../PlantContext.jsx'
import { RoomProvider } from '../../RoomContext.jsx'
import { OpenAIProvider } from '../../OpenAIContext.jsx'

jest.mock('../../WeatherContext.jsx', () => ({
  useWeather: () => ({ forecast: { rainfall: 0 } }),
}))

jest.mock('../../UserContext.jsx', () => ({
  useUser: () => ({ username: 'Jon', timeZone: 'UTC' }),
}))

jest.mock('../../WishlistContext.jsx', () => ({
  useWishlist: () => ({ addToWishlist: jest.fn() })
}))

function renderWithSnackbar(ui) {
  return render(
    <OpenAIProvider>
      <SnackbarProvider>
        {ui}
        <Snackbar />
      </SnackbarProvider>
    </OpenAIProvider>
  )
}

test('user can add a plant', () => {
  jest.useFakeTimers()
  renderWithSnackbar(
    <PlantProvider>
      <RoomProvider>
        <MemoryRouter initialEntries={['/onboard']}>
          <Routes>
            <Route path="/onboard" element={<Add />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </MemoryRouter>
      </RoomProvider>
    </PlantProvider>
  )

  fireEvent.change(screen.getByLabelText(/^name$/i), {
    target: { value: 'Test Plant' },
  })
  fireEvent.click(screen.getByRole('button', { name: /add plant/i }))
  act(() => {
    jest.runAllTimers()
  })

  expect(screen.getByLabelText(/^name$/i)).toBeInTheDocument()
})
