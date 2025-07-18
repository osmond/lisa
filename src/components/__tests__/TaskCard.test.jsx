import { render, screen } from '@testing-library/react'
import { MemoryRouter, useNavigate } from 'react-router-dom'
import TaskCard from '../TaskCard.jsx'
import BaseCard from '../BaseCard.jsx'
import { usePlants } from '../../PlantContext.jsx'

const navigateMock = jest.fn()
const markWatered = jest.fn()
const markFertilized = jest.fn()

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
  useNavigate.mockReturnValue(navigateMock)
  usePlantsMock.mockReturnValue({
    plants: [],
    markWatered,
    markFertilized,
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
  expect(badge).toHaveClass('bg-blue-100')
  expect(badge).toHaveClass('text-blue-800')
  expect(badge).toHaveClass('text-xs')
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
  expect(wrapper).toHaveClass('bg-neutral-50')
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
  expect(container.querySelector('.check-pop')).toBeInTheDocument()
})

test('renders badge icon', () => {
  const { container } = render(
    <MemoryRouter>
      <BaseCard variant="task">
        <TaskCard task={task} />
      </BaseCard>
    </MemoryRouter>
  )
  const svg = container.querySelector('svg')
  expect(svg).toBeInTheDocument()
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

