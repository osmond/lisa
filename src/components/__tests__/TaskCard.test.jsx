import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import TaskCard from '../TaskCard.jsx'
import { PlantProvider } from '../../PlantContext.jsx'

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
    <PlantProvider>
      <MemoryRouter>
        <TaskCard task={task} />
      </MemoryRouter>
    </PlantProvider>
  )
  expect(screen.getByText('Water Monstera')).toBeInTheDocument()
})

test('icon svg is aria-hidden', () => {
  const { container } = render(
    <PlantProvider>
      <MemoryRouter>
        <TaskCard task={task} />
      </MemoryRouter>
    </PlantProvider>
  )
  const svg = container.querySelector('svg')
  expect(svg).toHaveAttribute('aria-hidden', 'true')
})

test('mark as done does not navigate and shows animation', () => {
  jest.spyOn(window, 'prompt').mockReturnValue('')
  const { container } = render(
    <PlantProvider>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<TaskCard task={task} />} />
          <Route path="/plant/:id" element={<div>Plant Page</div>} />
        </Routes>
      </MemoryRouter>
    </PlantProvider>
  )
  fireEvent.click(screen.getByRole('checkbox'))
  expect(screen.queryByText('Plant Page')).not.toBeInTheDocument()
  expect(container.querySelector('.water-drop')).toBeInTheDocument()
})

test('clicking card adds ripple effect', () => {
  const { container } = render(
    <PlantProvider>
      <MemoryRouter>
        <TaskCard task={task} />
      </MemoryRouter>
    </PlantProvider>
  )
  const wrapper = container.firstChild
  fireEvent.mouseDown(wrapper)
  expect(container.querySelector('.ripple-effect')).toBeInTheDocument()
})

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
