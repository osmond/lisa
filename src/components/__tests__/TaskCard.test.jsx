import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route, useNavigate } from 'react-router-dom'
import TaskCard from '../TaskCard.jsx'
import { usePlants } from '../../PlantContext.jsx'


const markWatered = jest.fn()

beforeAll(() => {
  if (typeof PointerEvent === 'undefined') {
    window.PointerEvent = window.MouseEvent
  }
})

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom')
  return { ...actual, useNavigate: jest.fn() }
})

jest.mock('../../PlantContext.jsx', () => ({
  usePlants: jest.fn(),
}))


const usePlantsMock = usePlants

beforeEach(() => {
  markWatered.mockClear()
  usePlantsMock.mockReturnValue({
    plants: [],
    markWatered,

const navigateMock = jest.fn()
const markWatered = jest.fn()
const updatePlant = jest.fn()
const usePlantsMock = usePlants

beforeEach(() => {
  navigateMock.mockClear()
  markWatered.mockClear()
  updatePlant.mockClear()
  useNavigate.mockReturnValue(navigateMock)
  usePlantsMock.mockReturnValue({
    plants: [],
    markWatered,
    updatePlant,
  })
})

const task = {
  id: 1,
  plantId: 1,
  plantName: 'Monstera',
  image: 'https://images.pexels.com/photos/5699660/pexels-photo-5699660.jpeg',
  type: 'Water'
}

const overdueTask = {
  ...task,
  date: '2000-01-01',
}

test('renders task text', () => {
  render(
    <MemoryRouter>
      <TaskCard task={task} />
    </MemoryRouter>
  )
  expect(screen.getByText('Water Monstera')).toBeInTheDocument()
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


test('mark as done opens modal and saves note', () => {
  const { container } = render(

test('mark as done opens modal', () => {
  render(

    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<TaskCard task={task} />} />
        <Route path="/plant/:id" element={<div>Plant Page</div>} />
      </Routes>
    </MemoryRouter>
  )
  fireEvent.click(screen.getByRole('checkbox'))
  fireEvent.change(screen.getByLabelText(/note/i), { target: { value: 'ok' } })
  fireEvent.click(screen.getByText('Save'))
  expect(markWatered).toHaveBeenCalledWith(1, 'ok')
  expect(screen.queryByText('Plant Page')).not.toBeInTheDocument()
  expect(screen.getByRole('dialog')).toBeInTheDocument()
})

test('cancel note modal does not mark complete', () => {
  const { container } = render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<TaskCard task={task} />} />
      </Routes>
    </MemoryRouter>
  )
  fireEvent.click(screen.getByRole('checkbox'))
  fireEvent.click(screen.getByText('Cancel'))
  expect(markWatered).not.toHaveBeenCalled()
  expect(container.querySelector('.water-drop')).toBeInTheDocument()
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


test('swipe reveals action buttons', () => {
  render(
    <MemoryRouter>
      <TaskCard task={task} />
    </MemoryRouter>
  )
  const wrapper = screen.getByTestId('task-wrapper')
  fireEvent.pointerDown(wrapper, { clientX: 100, buttons: 1 })
  fireEvent.pointerMove(wrapper, { clientX: 0, buttons: 1 })
  fireEvent.pointerUp(wrapper, { clientX: 0 })
  const actions = screen.getByTestId('task-actions')
  expect(actions.className).toMatch(/opacity-100/)
})

test('water action opens modal and saves note', () => {
  render(
    <MemoryRouter>
      <TaskCard task={task} />
    </MemoryRouter>
  )
  const wrapper = screen.getByTestId('task-wrapper')
  fireEvent.pointerDown(wrapper, { clientX: 100, buttons: 1 })
  fireEvent.pointerMove(wrapper, { clientX: 0, buttons: 1 })
  fireEvent.pointerUp(wrapper, { clientX: 0 })
  fireEvent.click(screen.getByRole('button', { name: /water/i }))
  fireEvent.change(screen.getByLabelText(/note/i), {
    target: { value: 'test note' },
  })
  fireEvent.click(screen.getByText('Save'))
  expect(markWatered).toHaveBeenCalledWith(1, 'test note')

test('overdue tasks use red badge styling', () => {
  render(
    <PlantProvider>
      <MemoryRouter>
        <TaskCard task={overdueTask} />
      </MemoryRouter>
    </PlantProvider>

  )
  const button = screen.getByRole('button', { name: /mark complete/i })
  expect(button).toHaveClass('bg-red-100', 'text-red-700')

})
