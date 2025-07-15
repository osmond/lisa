import { render, screen, fireEvent, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import TaskCard from '../TaskCard.jsx'
import BaseCard from '../BaseCard.jsx'

import { PlantProvider, usePlants } from '../../PlantContext.jsx'

beforeAll(() => {
  if (typeof PointerEvent === 'undefined') {
    window.PointerEvent = window.MouseEvent
  }
})

jest.mock('../../PlantContext.jsx', () => {
  const actual = jest.requireActual('../../PlantContext.jsx')
  return { ...actual, usePlants: jest.fn() }
})


const usePlantsMock = usePlants

const markWatered = jest.fn()
const markFertilized = jest.fn()

beforeEach(() => {
  markWatered.mockClear()
  markFertilized.mockClear()
  usePlantsMock.mockReturnValue({
    plants: [],
    markWatered,
    markFertilized,
    logEvent: jest.fn(),
    addPlant: jest.fn(),
    updatePlant: jest.fn(),
    removePlant: jest.fn(),
    addPhoto: jest.fn(),
    removePhoto: jest.fn(),
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
})

test('incomplete tasks show alert style', () => {
  const { container } = render(
    <PlantProvider>
      <MemoryRouter>
        <BaseCard variant="task">
          <TaskCard task={task} />
        </BaseCard>
      </MemoryRouter>
    </PlantProvider>
  )
  const wrapper = container.querySelector('[data-testid="task-card"]')
  expect(wrapper).toHaveClass('bg-sage')
  expect(wrapper).toHaveClass('ring-accent')
})

test('applies highlight when urgent', () => {
  const { container } = render(
    <MemoryRouter>
      <BaseCard variant="task">
        <TaskCard task={task} urgent />
      </BaseCard>
    </MemoryRouter>
  )
  const wrapper = container.querySelector('[data-testid="task-card"]')
  expect(wrapper).toHaveClass('ring-2')
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
  const wrapper = container.querySelector('[data-testid="task-card"]')
  expect(wrapper).toHaveClass('ring-2')
  expect(wrapper).toHaveClass('ring-orange-300')
  expect(screen.getByTestId('overdue-badge')).toBeInTheDocument()
})

test('shows completed state', () => {
  const { container } = render(
    <MemoryRouter>
      <BaseCard variant="task">
        <TaskCard task={task} completed />
      </BaseCard>
    </MemoryRouter>
  )
  const wrapper = container.querySelector('[data-testid="task-card"]')
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
  const chip = screen.getByText(/ET₀/i)
  expect(chip).toHaveAttribute(
    'aria-label',
    expect.stringContaining('Last watered 3 days ago')
  )
  jest.useRealTimers()
})

test('compact mode hides reason and ET₀ info', () => {
  const compactTask = { ...task, reason: 'Needs water' }
  render(
    <MemoryRouter>
      <BaseCard variant="task">
        <TaskCard task={compactTask} compact />
      </BaseCard>
    </MemoryRouter>
  )
  expect(screen.queryByText('Needs water')).not.toBeInTheDocument()
  expect(screen.queryByText(/ET₀/)).not.toBeInTheDocument()
})

test('mark as done does not navigate', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route
          path="/"
          element={(
            <BaseCard variant="task">
              <TaskCard task={task} />
            </BaseCard>
          )}
        />
        <Route path="/plant/:id" element={<div>Plant Page</div>} />
      </Routes>
    </MemoryRouter>
  )
  fireEvent.click(screen.getByRole('checkbox'))
  const dialog = screen.getByRole('dialog', { name: /optional note/i })
  fireEvent.change(dialog.querySelector('textarea'), { target: { value: '' } })
  fireEvent.click(screen.getByText('Save'))
  expect(screen.queryByText('Plant Page')).not.toBeInTheDocument()
})

test('completing with note calls log function', () => {
  render(
    <MemoryRouter>
      <BaseCard variant="task">
        <TaskCard task={task} />
      </BaseCard>
    </MemoryRouter>
  )
  fireEvent.click(screen.getByRole('checkbox'))
  const dialog = screen.getByRole('dialog', { name: /optional note/i })
  fireEvent.change(dialog.querySelector('textarea'), { target: { value: 'hello' } })
  fireEvent.click(screen.getByText('Save'))
  expect(markWatered).toHaveBeenCalledWith(1, 'hello')
})

test('clicking card adds ripple effect', () => {
  const { container } = render(
    <MemoryRouter>
      <BaseCard variant="task">
        <TaskCard task={task} />
      </BaseCard>
    </MemoryRouter>
  )
  const wrapper = container.querySelector('[data-testid="task-card"]')
  fireEvent.mouseDown(wrapper)
  expect(container.querySelector('.ripple-effect')).toBeInTheDocument()
})

test('keyboard Enter and Space trigger completion with ripple', async () => {
  const onComplete = jest.fn()
  const { container } = render(
    <MemoryRouter>
      <BaseCard variant="task">
        <TaskCard task={task} onComplete={onComplete} />
      </BaseCard>
    </MemoryRouter>
  )
  const button = screen.getByRole('button', { name: /mark complete/i })
  const user = userEvent.setup()
  button.focus()
  await user.keyboard('{Enter}')
  expect(container.querySelector('.ripple-effect')).toBeInTheDocument()
  expect(onComplete).toHaveBeenCalledWith(task)
  container.querySelector('.ripple-effect')?.remove()
  await user.keyboard(' ')
  expect(container.querySelector('.ripple-effect')).toBeInTheDocument()
  expect(onComplete).toHaveBeenCalledTimes(2)
})

test('arrow right marks task complete', () => {
  const onComplete = jest.fn()
  render(
    <MemoryRouter>
      <BaseCard variant="task">
        <TaskCard task={task} onComplete={onComplete} />
      </BaseCard>
    </MemoryRouter>
  )
  const wrapper = screen.getByTestId('task-card')
  wrapper.focus()
  fireEvent.keyDown(wrapper, { key: 'ArrowRight' })
  expect(onComplete).toHaveBeenCalledWith(task)
})

test('swipe right marks task complete', async () => {
  const onComplete = jest.fn()
  render(
    <MemoryRouter>
      <BaseCard variant="task">
        <TaskCard task={task} onComplete={onComplete} />
      </BaseCard>
    </MemoryRouter>
  )
  const wrapper = screen.getByTestId('task-card')
  fireEvent.pointerDown(wrapper, { clientX: 0, buttons: 1 })
  fireEvent.pointerMove(wrapper, { clientX: 80, buttons: 1 })
  fireEvent.pointerUp(wrapper, { clientX: 80 })
  const user = userEvent.setup()
  await act(async () => {
    fireEvent.touchStart(wrapper, { touches: [{ clientX: 0 }] })
    fireEvent.touchMove(wrapper, { touches: [{ clientX: 80 }] })
    fireEvent.touchEnd(wrapper)
  })
  expect(onComplete).toHaveBeenCalledWith(task)
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

test('shows toast on completion', () => {
  jest.useFakeTimers()
  render(
    <MemoryRouter>
      <BaseCard variant="task">
        <TaskCard task={task} />
      </BaseCard>
    </MemoryRouter>
  )
  fireEvent.click(screen.getByRole('checkbox'))
  const dialog = screen.getByRole('dialog', { name: /optional note/i })
  fireEvent.change(dialog.querySelector('textarea'), { target: { value: '' } })
  fireEvent.click(screen.getByText('Save'))
  expect(screen.getByText('Watered Monstera 🌿')).toBeInTheDocument()
  act(() => {
    jest.runAllTimers()
  })
  expect(screen.queryByText('Watered Monstera 🌿')).not.toBeInTheDocument()
  jest.useRealTimers()
})
