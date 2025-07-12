import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import TaskItem from '../TaskItem.jsx'

const task = {
  id: 1,
  plantId: 1,
  plantName: 'Monstera',
  image: '/images/monstera.jpg',
  type: 'Water'
}

test('renders task text', () => {
  render(
    <BrowserRouter>
      <TaskItem task={task} />
    </BrowserRouter>
  )
  expect(screen.getByText('Water Monstera')).toBeInTheDocument()
})
