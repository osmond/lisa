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

test('mark as done does not navigate', () => {
  jest.spyOn(window, 'prompt').mockReturnValue('')
  render(
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

test('clears timeout on unmount', () => {
  jest.useFakeTimers()
  const clearSpy = jest.spyOn(global, 'clearTimeout')
  const { unmount } = render(
    <PlantProvider>
      <MemoryRouter>
        <TaskCard task={task} />
      </MemoryRouter>
    </PlantProvider>
  )
  fireEvent.click(screen.getByRole('checkbox'))
  unmount()
  expect(clearSpy).toHaveBeenCalled()
  clearSpy.mockRestore()
  jest.useRealTimers()
})
