import { render, screen, fireEvent, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

beforeAll(() => {
  if (typeof PointerEvent === 'undefined') {
    window.PointerEvent = window.MouseEvent
  }
})
import TaskItem from '../TaskItem.jsx'
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
        <TaskItem task={task} />
      </MemoryRouter>
    </PlantProvider>
  )
  expect(screen.getByText('Water Monstera')).toBeInTheDocument()
})

test('icon svg is aria-hidden', () => {
  const { container } = render(
    <PlantProvider>
      <MemoryRouter>
        <TaskItem task={task} />
      </MemoryRouter>
    </PlantProvider>
  )
  const svg = container.querySelector('svg')
  expect(svg).toHaveAttribute('aria-hidden', 'true')
});

test('mark as done does not navigate', () => {
  jest.spyOn(window, 'prompt').mockReturnValue('')
  render(
    <PlantProvider>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<TaskItem task={task} />} />
          <Route path="/plant/:id" element={<div>Plant Page</div>} />
        </Routes>
      </MemoryRouter>
    </PlantProvider>
  )
  fireEvent.click(screen.getByText('Done'))
  expect(screen.queryByText('Plant Page')).not.toBeInTheDocument()

});

test('clicking item adds ripple effect', () => {
  const { container } = render(
    <PlantProvider>
      <MemoryRouter>
        <TaskItem task={task} />
      </MemoryRouter>
    </PlantProvider>
  )
  const wrapper = container.firstChild
  fireEvent.mouseDown(wrapper)
  expect(container.querySelector('.ripple-effect')).toBeInTheDocument()
})

test.skip('swipe right triggers onComplete', async () => {
  const onComplete = jest.fn()
  const { container } = render(
    <PlantProvider>
      <MemoryRouter>
        <TaskItem task={task} onComplete={onComplete} />
      </MemoryRouter>
    </PlantProvider>
  )
  const wrapper = container.firstChild
  fireEvent.pointerDown(wrapper, { clientX: 0, buttons: 1 })
  fireEvent.pointerMove(wrapper, { clientX: 80, buttons: 1 })
  fireEvent.pointerUp(wrapper, { clientX: 80 })
  expect(onComplete).toHaveBeenCalledWith(task)
})

test('swipe left navigates to edit page', async () => {
  const { container } = render(
    <PlantProvider>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<TaskItem task={task} />} />
          <Route path="/plant/:id/edit" element={<div>Edit Page</div>} />
        </Routes>
      </MemoryRouter>
    </PlantProvider>
  )
  const wrapper = container.firstChild
  fireEvent.pointerDown(wrapper, { clientX: 100, buttons: 1 })
  fireEvent.pointerMove(wrapper, { clientX: 20, buttons: 1 })
  fireEvent.pointerUp(wrapper, { clientX: 20 })
  expect(screen.getByText('Edit Page')).toBeInTheDocument()
})
