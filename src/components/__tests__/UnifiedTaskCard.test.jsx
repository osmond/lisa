import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, useNavigate } from 'react-router-dom'
import UnifiedTaskCard from '../UnifiedTaskCard.jsx'
import { usePlants } from '../../PlantContext.jsx'

const navigateMock = jest.fn()
const markWatered = jest.fn()
const markFertilized = jest.fn()
const updatePlant = jest.fn()

jest.useFakeTimers().setSystemTime(new Date('2025-07-10'))

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom')
  return { ...actual, useNavigate: jest.fn() }
})

jest.mock('../../PlantContext.jsx', () => ({
  usePlants: jest.fn(),
}))

const usePlantsMock = usePlants

const plant = {
  id: 1,
  name: 'Fern',
  image: 'fern.jpg',
  lastWatered: '2025-07-10',
  dueWater: true,
  dueFertilize: false,
  lastCared: '2025-07-07',
}

beforeEach(() => {
  navigateMock.mockClear()
  markWatered.mockClear()
  markFertilized.mockClear()
  useNavigate.mockReturnValue(navigateMock)
  usePlantsMock.mockReturnValue({
    plants: [plant],
    markWatered,
    markFertilized,
    updatePlant,
  })
})

test('renders plant info and badges', () => {
  render(
    <MemoryRouter>
      <UnifiedTaskCard plant={plant} />
    </MemoryRouter>
  )
  expect(screen.getByText('Fern')).toBeInTheDocument()
  const waterBadge = screen.getByText('Water')
  expect(waterBadge).toBeInTheDocument()
  expect(waterBadge).toHaveClass('inline-flex')
  expect(screen.queryByText('Fertilize')).toBeNull()
  expect(screen.getByText('Last cared for 3 days ago')).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: /mark as done/i })).toBeNull()
})

test('applies urgent style', () => {
  const { container } = render(
    <MemoryRouter>
      <UnifiedTaskCard plant={plant} urgent />
    </MemoryRouter>
  )
  const wrapper = container.querySelector('[data-testid="unified-task-card"]')
  expect(wrapper).toHaveClass('bg-sage')
})

test('applies overdue style', () => {
  const { container } = render(
    <MemoryRouter>
      <UnifiedTaskCard plant={plant} overdue />
    </MemoryRouter>
  )
  const wrapper = container.querySelector('[data-testid="unified-task-card"]')
  expect(wrapper).toHaveClass('bg-red-50')
})

test('matches snapshot in dark mode', () => {
  document.documentElement.classList.add('dark')
  const { container } = render(
    <MemoryRouter>
      <UnifiedTaskCard plant={plant} />
    </MemoryRouter>
  )
  expect(container.firstChild).toMatchSnapshot()
  document.documentElement.classList.remove('dark')
})

test('does not render a completion button', () => {
  render(
    <MemoryRouter>
      <UnifiedTaskCard plant={plant} />
    </MemoryRouter>
  )
  expect(screen.queryByRole('button', { name: /mark as done/i })).toBeNull()
})

test('partial left swipe reveals actions', () => {
  render(
    <MemoryRouter>
      <UnifiedTaskCard plant={plant} />
    </MemoryRouter>
  )
  const wrapper = screen.getByTestId('unified-task-card')
  fireEvent.pointerDown(wrapper, { clientX: 100, buttons: 1 })
  fireEvent.pointerMove(wrapper, { clientX: 70, buttons: 1 })
  expect(screen.getByRole('button', { name: /edit task/i })).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: /edit task/i }))
  expect(navigateMock).toHaveBeenCalledWith('/plant/1/edit')
  fireEvent.click(screen.getByRole('button', { name: /reschedule task/i }))
  expect(updatePlant).toHaveBeenCalled()
  fireEvent.click(screen.getByRole('button', { name: /delete task/i }))
  expect(updatePlant).toHaveBeenCalledTimes(2)
})

afterAll(() => {
  jest.useRealTimers()
})
