import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useNavigate } from 'react-router-dom'
import { usePlants } from '../../PlantContext.jsx'
import TaskCard from '../TaskCard.jsx'
import BaseCard from '../BaseCard.jsx'

beforeAll(() => {
  if (typeof PointerEvent === 'undefined') {
    window.PointerEvent = window.MouseEvent
  }
})

const navigateMock = jest.fn()
const markWatered = jest.fn()
const markFertilized = jest.fn()
const updatePlant = jest.fn()
const logEvent = jest.fn()

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom')
  return { ...actual, useNavigate: jest.fn() }
})

jest.mock('../../PlantContext.jsx', () => ({
  usePlants: jest.fn(),
}))

const usePlantsMock = usePlants

beforeEach(() => {
  navigateMock.mockClear()
  markWatered.mockClear()
  markFertilized.mockClear()
  updatePlant.mockClear()
  logEvent.mockClear()
  useNavigate.mockReturnValue(navigateMock)
  usePlantsMock.mockReturnValue({
    markWatered,
    markFertilized,
    logEvent,
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
  render(
    <MemoryRouter>
      <BaseCard variant="task">
        <TaskCard task={task} />
      </BaseCard>
    </MemoryRouter>
  )
  expect(screen.getByText('Monstera')).toBeInTheDocument()
  const badge = screen.getByText('To Water')
  expect(badge).toBeInTheDocument()
  expect(badge).toHaveClass('inline-flex')
  expect(badge).toHaveClass('bg-water-100')
  expect(badge).toHaveClass('text-water-800')
  expect(badge).toHaveClass('font-medium')
})

test('incomplete tasks show alert style', () => {
  const { container } = render(
    <MemoryRouter>
      <BaseCard variant="task">
        <TaskCard task={task} />
      </BaseCard>
    </MemoryRouter>
  )
  const wrapper = container.querySelector('.shadow-sm')
  expect(wrapper).toHaveClass('bg-white')
})

test('applies highlight when urgent', () => {
  const { container } = render(
    <MemoryRouter>
      <BaseCard variant="task">
        <TaskCard task={task} urgent />
      </BaseCard>
    </MemoryRouter>
  )
  const wrapper = container.querySelector('.shadow-sm')
  expect(wrapper).toHaveClass('ring-green-300')
  expect(wrapper).toHaveClass('dark:ring-green-400')
})

test('applies overdue styling', () => {
  const { container } = render(
    <MemoryRouter>
      <BaseCard variant="task">
        <TaskCard task={task} overdue />
      </BaseCard>
    </MemoryRouter>
  )
  const wrapper = container.querySelector('.shadow-sm')
  expect(wrapper).not.toHaveClass('ring-orange-300')
  const badge = screen.getByTestId('overdue-badge')
  expect(badge).toBeInTheDocument()
  expect(badge).toHaveClass('bg-fertilize-500')
  expect(badge).toHaveClass('overdue-ping')
})

test('shows completed state', () => {
  const { container } = render(
    <MemoryRouter>
      <BaseCard variant="task">
        <TaskCard task={task} completed />
      </BaseCard>
    </MemoryRouter>
  )
  const wrapper = container.querySelector('.shadow-sm')
  expect(wrapper).toHaveClass('opacity-50')
  expect(wrapper).toHaveClass('bg-gray-100')
  const checkbox = container.querySelector('input[type="checkbox"]')
  expect(checkbox).toBeChecked()
  expect(container.querySelector('.check-pop')).toBeInTheDocument()
})

test('icon svg is aria-hidden', () => {
  const { container } = render(
    <MemoryRouter>
      <BaseCard variant="task">
        <TaskCard task={task} />
      </BaseCard>
    </MemoryRouter>
  )
  const svg = container.querySelector('svg')
  expect(svg).toHaveAttribute('aria-hidden', 'true')
})

test('shows info chip with accessibility label', () => {
  jest.useFakeTimers().setSystemTime(new Date('2025-07-10'))
  render(
    <MemoryRouter>
      <BaseCard variant="task">
        <TaskCard task={task} />
      </BaseCard>
    </MemoryRouter>
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
  render(
    <MemoryRouter>
      <BaseCard variant="task">
        <TaskCard task={compactTask} compact />
      </BaseCard>
    </MemoryRouter>
  )
  expect(screen.queryByText('Needs water')).not.toBeInTheDocument()
  expect(screen.queryByText(/Evapotranspiration/)).not.toBeInTheDocument()
})

test('card shows ripple on click', async () => {
  const { container } = render(
    <MemoryRouter>
      <BaseCard variant="task">
        <TaskCard task={task} />
      </BaseCard>
    </MemoryRouter>
  )
  const wrapper = container.querySelector('[data-testid="task-card"]')
  const user = userEvent.setup()
  await user.click(wrapper)
  expect(container.querySelector('.ripple-effect')).toBeInTheDocument()
})


test('matches snapshot in dark mode', () => {
  jest.useFakeTimers().setSystemTime(new Date('2025-07-16'))
  document.documentElement.classList.add('dark')
  const { container } = render(
    <MemoryRouter>
      <BaseCard variant="task">
        <TaskCard task={task} urgent />
      </BaseCard>
    </MemoryRouter>
  )
  expect(container.firstChild).toMatchSnapshot()
  document.documentElement.classList.remove('dark')
  jest.useRealTimers()
})

