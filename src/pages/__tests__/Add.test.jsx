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

test('user can complete steps and add a plant', () => {
  jest.useFakeTimers()
  renderWithSnackbar(
    <PlantProvider>
      <RoomProvider>
        <MemoryRouter initialEntries={['/add']}>
          <Routes>
            <Route path="/add" element={<Add />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </MemoryRouter>
      </RoomProvider>
    </PlantProvider>
  )

  // step 1
  expect(screen.getByText(/step 1 of 4/i)).toBeInTheDocument()
  fireEvent.change(screen.getByLabelText(/name/i), {
    target: { value: 'Test Plant' },
  })
  fireEvent.click(screen.getByRole('button', { name: /next/i }))

  // step 2
  expect(screen.getByText(/step 2 of 4/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/image url/i)).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: /next/i }))

  // step 3
  expect(screen.getByText(/step 3 of 4/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/last watered/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/last fertilized/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/next fertilizing/i)).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: /next/i }))

  // step 4
  expect(screen.getByText(/step 4 of 4/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/room/i)).toBeInTheDocument()
  fireEvent.change(screen.getByLabelText(/room/i), { target: { value: 'Desk' } })
  fireEvent.change(screen.getByLabelText(/notes/i), { target: { value: 'Thrives' } })
  fireEvent.change(screen.getByLabelText(/care level/i), { target: { value: 'easy' } })
  fireEvent.click(screen.getByRole('button', { name: /add plant/i }))
  act(() => {
    jest.runAllTimers()
  })

  expect(screen.getByTestId('tasks-container')).toBeInTheDocument()
})
