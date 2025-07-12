import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import TaskItem from '../TaskItem.jsx'

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
      <TaskItem task={task} />
    </MemoryRouter>
  )
  expect(screen.getByText('Water Monstera')).toBeInTheDocument()
})

test('icon svg is aria-hidden', () => {
  const { container } = render(
    <MemoryRouter>
      <TaskItem task={task} />
    </MemoryRouter>
  )
  const svg = container.querySelector('svg')
  expect(svg).toHaveAttribute('aria-hidden', 'true')
});

test('mark as done does not navigate', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<TaskItem task={task} />} />
        <Route path="/plant/:id" element={<div>Plant Page</div>} />
      </Routes>
    </MemoryRouter>
  )
  fireEvent.click(screen.getByText('Mark as Done'))
  expect(screen.queryByText('Plant Page')).not.toBeInTheDocument()

});
