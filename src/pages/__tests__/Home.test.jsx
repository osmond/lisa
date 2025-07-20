import { render, screen } from '@testing-library/react'
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

jest.mock('../../PlantContext.jsx', () => ({
  usePlants: () => ({ plants: mockPlants }),
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

afterEach(() => {
  jest.useRealTimers()
})

test('shows upbeat message when there are no tasks', () => {
  renderWithSnackbar(
      <Home />
  )
  expect(screen.getByText(/all plants are happy/i)).toBeInTheDocument()
  expect(screen.getByTestId('care-stats')).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /add note/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /take photo/i })).toBeInTheDocument()
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

test('featured card appears before care stats', () => {
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

  const featured = screen.getByTestId('featured-card')
  const stats = screen.getByTestId('care-stats')
  expect(featured).toBeInTheDocument()
  const order = featured.compareDocumentPosition(stats)
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


test('featured section provides extra spacing', () => {
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

  const container = screen.getByTestId('tasks-container')
  expect(container).toBeInTheDocument()
  expect(container).not.toHaveClass('bg-sage')


  const section = screen.getByTestId('featured-card').closest('section')
  expect(section).toHaveClass('mb-4')
})

