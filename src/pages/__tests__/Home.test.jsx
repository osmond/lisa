import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from '../Home.jsx'
import SnackbarProvider, { Snackbar } from '../../hooks/SnackbarProvider.jsx'
import { OpenAIProvider } from '../../OpenAIContext.jsx'

jest.mock('../../WeatherContext.jsx', () => ({
  useWeather: () => ({ forecast: { rainfall: 0 } }),
}))

jest.mock('../../UserContext.jsx', () => ({
  useUser: () => ({ username: 'Jon', timeZone: 'UTC' }),
}))

const mockPlants = []

jest.mock('../../PlantContext.jsx', () => {
  const actual = jest.requireActual('../../PlantContext.jsx')
  return {
    ...actual,
    usePlants: jest.fn(),
  }
})

const usePlantsMock = require('../../PlantContext.jsx').usePlants
usePlantsMock.mockImplementation(() => ({ plants: mockPlants, error: '' }))

const discoverPlant = { id: 99, name: 'Calathea', image: 'd.jpg' }
const actualDiscoverHook = jest.requireActual('../../hooks/useDiscoverablePlant.js')
const mockDiscoverHook = jest.fn(() => ({
  plants: [discoverPlant],
  loading: false,
  error: '',
  refetch: jest.fn(),
  skipToday: jest.fn(),
  remindLater: jest.fn(),
  skipped: false,
}))

jest.mock('../../hooks/useDiscoverablePlant.js', () => ({
  __esModule: true,
  default: (...args) => mockDiscoverHook(...args),
}))

jest.mock('../../WishlistContext.jsx', () => ({
  useWishlist: () => ({
    addToWishlist: jest.fn(),
    removeFromWishlist: jest.fn(),
    wishlist: []
  })
}))

function renderWithSnackbar(ui) {
  return render(
    <OpenAIProvider>
      <SnackbarProvider>
        <MemoryRouter>{ui}</MemoryRouter>
        <Snackbar />
      </SnackbarProvider>
    </OpenAIProvider>
  )
}

afterEach(async () => {
  jest.useRealTimers()
  await waitFor(() => {})
})

test('shows upbeat message when there are no tasks', () => {
  renderWithSnackbar(<Home />)
  expect(
    screen.getByText(/no tasks due now – your care plan is on track/i)
  ).toBeInTheDocument()
  expect(screen.getByTestId('care-stats')).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /view care plan/i })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /browse tasks/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /add plant/i })).toBeInTheDocument()
})

test('care stats render when tasks exist', () => {
  jest.useFakeTimers().setSystemTime(new Date('2025-07-10'))
  mockPlants.splice(0, mockPlants.length, {
    id: 1,
    name: 'Plant A',
    image: 'a.jpg',
    lastWatered: '2025-07-03',
    nextFertilize: '2025-07-10',
  })

  renderWithSnackbar(
      <Home />
  )

  const stats = screen.getByTestId('care-stats')
  expect(stats).toBeInTheDocument()
  expect(screen.getByTestId('stat-total')).toHaveTextContent('2')
  expect(screen.getByTestId('stat-water')).toHaveTextContent('1')
  expect(screen.getByTestId('stat-fertilize')).toHaveTextContent('1')
})

test('discovery card appears before care stats', () => {
  renderWithSnackbar(<Home />)

  const section = screen.getByTestId('discovery-section')
  const stats = screen.getByTestId('care-stats')
  expect(section).toBeInTheDocument()
  const order = section.compareDocumentPosition(stats)
  expect(order & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
})

test('earliest due task appears first', () => {
  jest.useFakeTimers().setSystemTime(new Date('2025-07-10'))
  mockPlants.splice(0, mockPlants.length,
    {
      id: 1,
      name: 'Plant A',
      image: 'a.jpg',
      lastWatered: '2025-07-02',
    },
    {
      id: 2,
      name: 'Plant B',
      image: 'b.jpg',
      lastWatered: '2025-07-03',
    }
  )

  renderWithSnackbar(
      <Home />
  )

  const tasks = screen.getAllByTestId('simple-task-card')
  expect(tasks[0]).toHaveTextContent('Plant A')
  expect(tasks[1]).toHaveTextContent('Plant B')
})





test('tasks container renders with background', () => {
  renderWithSnackbar(
      <Home />
  )

  expect(screen.getByTestId('tasks-container')).not.toHaveClass('bg-sage')
})


test('discovery section provides extra spacing', () => {
  renderWithSnackbar(<Home />)

  const container = screen.getByTestId('tasks-container')
  expect(container).toBeInTheDocument()
  expect(container).not.toHaveClass('bg-sage')

  const section = screen.getByTestId('discovery-section')
  expect(section).toHaveClass('mb-4')
})

test('shows fallback list when discovery fetch fails', async () => {
  const origFetch = global.fetch
  global.fetch = jest.fn(() => Promise.reject(new Error('fail')))
  mockDiscoverHook.mockImplementationOnce(actualDiscoverHook.default)
  renderWithSnackbar(<Home />)
  await screen.findByText(/Chinese Evergreen|Fiddle Leaf Fig|Spider Plant|English Ivy|Boston Fern/)
  global.fetch = origFetch
})

test('shows error when plant fetch fails', () => {
  usePlantsMock.mockReturnValueOnce({ plants: [], error: 'Failed to load plants' })
  renderWithSnackbar(<Home />)
  expect(screen.getByText('Failed to load plants')).toBeInTheDocument()
})

