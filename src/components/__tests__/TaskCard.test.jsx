import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import TaskCard from '../TaskCard.jsx'
import { usePlants } from '../../PlantContext.jsx'

const markWatered = jest.fn()

jest.mock('../../PlantContext.jsx', () => ({
  usePlants: jest.fn(),
}))

const usePlantsMock = usePlants

beforeEach(() => {
  markWatered.mockClear()
  usePlantsMock.mockReturnValue({
    plants: [],
    markWatered,
  })
})

const task = {
  id: 1,
  plantId: 1,
  plantName: 'Monstera',
  image: 'https://images.pexels.com/photos/5699660/pexels-photo-5699660.jpeg',
  type: 'Water'
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
  expect(container.querySelector('.water-drop')).toBeInTheDocument()
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
