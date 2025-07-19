import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, useNavigate } from 'react-router-dom'
import SnackbarProvider, { Snackbar } from '../../hooks/SnackbarProvider.jsx'
import TaskCard from '../TaskCard.jsx'
import BaseCard from '../BaseCard.jsx'
import { usePlants } from '../../PlantContext.jsx'

const navigateMock = jest.fn()
const markWatered = jest.fn()
const markFertilized = jest.fn()
const updatePlant = jest.fn()

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom')
  return { ...actual, useNavigate: jest.fn() }
})

jest.mock('../../PlantContext.jsx', () => ({
  usePlants: jest.fn(),
}))

const usePlantsMock = usePlants

function renderWithSnackbar(ui) {
  return render(
    <SnackbarProvider>
      <MemoryRouter>
        {ui}
      </MemoryRouter>
      <Snackbar />
    </SnackbarProvider>
  )
}

beforeEach(() => {
  navigateMock.mockClear()
  markWatered.mockClear()
  markFertilized.mockClear()
  useNavigate.mockReturnValue(navigateMock)
  usePlantsMock.mockReturnValue({
    plants: [],
    markWatered,
    markFertilized,
    updatePlant,
  })
})


const task = {
  id: 1,
  plantId: 1,
  plantName: 'Monstera',
  image: 'https://images.pexels.com/photos/5699660/pexels-photo-5699660.jpeg',
  type: 'Water',
  lastWatered: '2025-07-07'
}

test('renders task text', () => {
  renderWithSnackbar(
      <BaseCard variant="task">
        <TaskCard task={task} />
      </BaseCard>
  )
  expect(screen.getByText('Monstera')).toBeInTheDocument()
  const badge = screen.getByText('To Water')
  expect(badge).toBeInTheDocument()
  expect(badge).toHaveClass('inline-flex')
  expect(badge).toHaveClass('bg-sky-100')
  expect(badge).toHaveClass('text-sky-700')
  expect(badge).toHaveClass('text-badge')
  expect(badge).toHaveClass('font-medium')
})

test('incomplete tasks show alert style', () => {
  const { container } = renderWithSnackbar(
      <BaseCard variant="task">
        <TaskCard task={task} />
      </BaseCard>
  )
  const wrapper = container.querySelector('.shadow')
  expect(wrapper).toHaveClass('bg-slate-50')
})

test('applies highlight when urgent', () => {
  const { container } = renderWithSnackbar(
      <BaseCard variant="task">
        <TaskCard task={task} urgent />
      </BaseCard>
  )
  const wrapper = container.querySelector('.shadow')
  expect(wrapper).toHaveClass('ring-amber-300')
  expect(wrapper).toHaveClass('dark:ring-amber-400')
})


test('shows completed state', () => {
  const { container } = renderWithSnackbar(
      <BaseCard variant="task">
        <TaskCard task={task} completed />
      </BaseCard>
  )
  const wrapper = container.querySelector('.shadow')
  expect(wrapper).toHaveClass('opacity-50')
  expect(wrapper).toHaveClass('bg-gray-100')
  expect(container.querySelector('.check-pop')).toBeInTheDocument()
})

test('renders badge icon', () => {
  const { container } = renderWithSnackbar(
      <BaseCard variant="task">
        <TaskCard task={task} />
      </BaseCard>
  )
  const svg = container.querySelector('svg')
  expect(svg).toBeInTheDocument()
})

test('shows info chip with accessibility label', () => {
  jest.useFakeTimers().setSystemTime(new Date('2025-07-10'))
  renderWithSnackbar(
      <BaseCard variant="task">
        <TaskCard task={task} />
      </BaseCard>
  )
  const chip = screen.getByText(/Evapotranspiration/i)
  expect(chip).toHaveAttribute(
    'aria-label',
    expect.stringContaining('Last watered 3 days ago')
  )
  jest.useRealTimers()
})

test('compact mode hides reason and evapotranspiration info', () => {
  const compactTask = { ...task, reason: 'Needs water' }
  renderWithSnackbar(
      <BaseCard variant="task">
        <TaskCard task={compactTask} compact />
      </BaseCard>
  )
  expect(screen.queryByText('Needs water')).not.toBeInTheDocument()
  expect(screen.queryByText(/Evapotranspiration/)).not.toBeInTheDocument()
})

test('partial left swipe reveals actions', () => {
  renderWithSnackbar(
      <BaseCard variant="task">
        <TaskCard task={task} />
      </BaseCard>
  )
  const wrapper = screen.getByTestId('task-card')
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



test('matches snapshot in dark mode', () => {
  jest.useFakeTimers().setSystemTime(new Date('2025-07-16'))
  document.documentElement.classList.add('dark')
  const { container } = renderWithSnackbar(
      <BaseCard variant="task">
        <TaskCard task={task} urgent />
      </BaseCard>
  )
  expect(container.firstChild).toMatchSnapshot()
  document.documentElement.classList.remove('dark')
  jest.useRealTimers()
})

