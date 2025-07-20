import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import PlantDetail from '../PlantDetail.jsx'
import { usePlants } from '../../PlantContext.jsx'
import { MenuProvider } from '../../MenuContext.jsx'
import SnackbarProvider, { Snackbar } from '../../hooks/SnackbarProvider.jsx'
import { OpenAIProvider } from '../../OpenAIContext.jsx'

// Confetti relies on the canvas API which JSDOM doesn't fully implement.
// Mock it here to avoid noisy warnings during tests.
jest.mock('canvas-confetti', () => ({
  __esModule: true,
  default: () => {},
}))

const markWatered = jest.fn()
const markFertilized = jest.fn()
let mockPlants = []

jest.mock('../../PlantContext.jsx', () => ({
  usePlants: jest.fn(),
}))

const usePlantsMock = usePlants

beforeEach(() => {
  markWatered.mockClear()
  markFertilized.mockClear()
  mockPlants = [
    {
      id: 1,
      name: 'Plant A',
      image: 'a.jpg',
      lastWatered: '2025-07-01',
      nextWater: '2025-07-08',
      lastFertilized: '2025-06-01',
      nextFertilize: '2025-07-01',
      photos: [],
    },
  ]
  usePlantsMock.mockReturnValue({
    plants: mockPlants,
    markWatered,
    markFertilized,
    addPhoto: jest.fn(),
    removePhoto: jest.fn(),
    logEvent: jest.fn(),
  })
})

test('quick stats action buttons trigger handlers', () => {
  render(
    <OpenAIProvider>
      <SnackbarProvider>
        <MenuProvider>
          <MemoryRouter initialEntries={['/plant/1']}>
            <Routes>
              <Route path="/plant/:id" element={<PlantDetail />} />
            </Routes>
          </MemoryRouter>
        </MenuProvider>
        <Snackbar />
      </SnackbarProvider>
    </OpenAIProvider>
  )

  fireEvent.click(screen.getByRole('button', { name: /add to journal/i }))
  fireEvent.click(screen.getByRole('button', { name: /mark watered/i }))
  expect(markWatered).toHaveBeenCalledWith(1, '')

  fireEvent.click(screen.getByRole('button', { name: /add to journal/i }))
  fireEvent.click(screen.getByRole('button', { name: /mark fertilized/i }))
  expect(markFertilized).toHaveBeenCalledWith(1, '')
})

test('fab opens note modal', () => {
  render(
    <OpenAIProvider>
      <SnackbarProvider>
        <MenuProvider>
          <MemoryRouter initialEntries={['/plant/1']}>
            <Routes>
              <Route path="/plant/:id" element={<PlantDetail />} />
            </Routes>
          </MemoryRouter>
        </MenuProvider>
        <Snackbar />
      </SnackbarProvider>
    </OpenAIProvider>
  )

  fireEvent.click(screen.getByRole('button', { name: /add to journal/i }))
  fireEvent.click(screen.getByRole('button', { name: /add note/i }))
  expect(screen.getByRole('dialog', { name: /note/i })).toBeInTheDocument()
})

test('fab triggers file input click', () => {
  const clickSpy = jest
    .spyOn(HTMLInputElement.prototype, 'click')
    .mockImplementation(() => {})

  render(
    <OpenAIProvider>
      <SnackbarProvider>
        <MenuProvider>
          <MemoryRouter initialEntries={['/plant/1']}>
            <Routes>
              <Route path="/plant/:id" element={<PlantDetail />} />
            </Routes>
          </MemoryRouter>
        </MenuProvider>
        <Snackbar />
      </SnackbarProvider>
    </OpenAIProvider>
  )

  fireEvent.click(screen.getByRole('tab', { name: /gallery/i }))

  fireEvent.click(screen.getByRole('button', { name: /add to journal/i }))
  fireEvent.click(screen.getByRole('button', { name: /add photo/i }))
  expect(clickSpy).toHaveBeenCalled()
  clickSpy.mockRestore()
})
