import { render, screen, fireEvent, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import TaskCard from '../TaskCard.jsx'
import { usePlants } from '../../PlantContext.jsx'
import { PlantProvider } from '../../PlantContext.jsx'

jest.mock('../../PlantContext.jsx', () => ({
  usePlants: jest.fn(),
  PlantProvider: ({ children }) => <>{children}</>,
}))

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
      <TaskCard task={task} />
    </MemoryRouter>
  )
  expect(screen.getByText('Monstera')).toBeInTheDocument()
  expect(screen.getByText('To Water')).toBeInTheDocument()
})

test('incomplete tasks show alert style', () => {
  const { container } = render(
    <PlantProvider>
      <MemoryRouter>
        <TaskCard task={task} />
      </MemoryRouter>
    </PlantProvider>
  )
  const wrapper = container.firstChild
  expect(wrapper).toHaveClass('bg-sage')
  expect(wrapper).toHaveClass('ring-accent')
})

test('applies highlight when urgent', () => {
  const { container } = render(
    <MemoryRouter>
      <TaskCard task={task} urgent />
    </MemoryRouter>
  )
  const wrapper = container.firstChild
  expect(wrapper).toHaveClass('ring-2')
  expect(wrapper).toHaveClass('ring-green-300')
  expect(wrapper).toHaveClass('dark:ring-green-400')
})

test('applies overdue styling', () => {
  const { container } = render(
    <MemoryRouter>
      <TaskCard task={task} overdue />
    </MemoryRouter>
  )
  const wrapper = container.firstChild
  expect(wrapper).toHaveClass('ring-2')
  expect(wrapper).toHaveClass('ring-orange-300')
  expect(screen.getByTestId('overdue-badge')).toBeInTheDocument()
})

test('shows completed state', () => {
  const { container } = render(
    <MemoryRouter>
      <TaskCard task={task} completed />
    </MemoryRouter>
  )
  const wrapper = container.firstChild
  expect(wrapper).toHaveClass('opacity-50')
  expect(wrapper).toHaveClass('bg-gray-100')
  const checkbox = container.querySelector('input[type="checkbox"]')
  expect(checkbox).toBeChecked()
  expect(container.querySelector('.check-pop')).toBeInTheDocument()
})

test('icon svg is aria-hidden', () => {
  const { container } = render(
    <MemoryRouter>
      <TaskCard task={task} />
    </MemoryRouter>
  )
  const svg = container.querySelector('svg')
  expect(svg).toHaveAttribute('aria-hidden', 'true')
})

test('shows info chip with accessibility label', () => {
  jest.useFakeTimers().setSystemTime(new Date('2025-07-10'))
  render(
    <MemoryRouter>
      <TaskCard task={task} />
    </MemoryRouter>
  )
  const chip = screen.getByText(/ET₀/i)
  expect(chip).toHaveAttribute(
    'aria-label',
    expect.stringContaining('Last watered 3 days ago')
  )
  jest.useRealTimers()
})

test('mark as done does not navigate', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<TaskCard task={task} />} />
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
      <TaskCard task={task} />
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
      <TaskCard task={task} />
    </MemoryRouter>
  )
  const wrapper = container.firstChild
  fireEvent.mouseDown(wrapper)
  expect(container.querySelector('.ripple-effect')).toBeInTheDocument()
})

test('keyboard Enter and Space trigger completion with ripple', async () => {
  const onComplete = jest.fn()
  const { container } = render(
    <MemoryRouter>
      <TaskCard task={task} onComplete={onComplete} />
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

test.skip('swipe right marks task complete', async () => {
  const onComplete = jest.fn()
  render(
    <MemoryRouter>
      <TaskCard task={task} onComplete={onComplete} />
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
  document.documentElement.classList.add('dark')
  const { container } = render(
    <MemoryRouter>
      <TaskCard task={task} urgent />
    </MemoryRouter>
  )
  expect(container.firstChild).toMatchSnapshot()
  document.documentElement.classList.remove('dark')
})
