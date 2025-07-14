import { render, screen, fireEvent, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
  expect(screen.getByText('Monstera')).toBeInTheDocument()
  expect(screen.getByText('Water')).toBeInTheDocument()
})

test('applies highlight when urgent', () => {
  const { container } = render(
    <PlantProvider>
      <MemoryRouter>
        <TaskCard task={task} urgent />
      </MemoryRouter>
    </PlantProvider>
  )
  const wrapper = container.firstChild
  expect(wrapper).toHaveClass('ring-2')
  expect(wrapper).toHaveClass('ring-green-300')
  expect(wrapper).toHaveClass('dark:ring-green-400')
})

test('applies overdue styling', () => {
  const { container } = render(
    <PlantProvider>
      <MemoryRouter>
        <TaskCard task={task} overdue />
      </MemoryRouter>
    </PlantProvider>
  )
  const wrapper = container.firstChild


  expect(wrapper).not.toHaveClass('ring-2')

  expect(screen.getByTestId('overdue-badge')).toBeInTheDocument()
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

test('keyboard Enter and Space trigger completion with ripple', async () => {
  const onComplete = jest.fn()
  const { container } = render(
    <PlantProvider>
      <MemoryRouter>
        <TaskCard task={task} onComplete={onComplete} />
      </MemoryRouter>
    </PlantProvider>
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
    <PlantProvider>
      <MemoryRouter>
        <TaskCard task={task} onComplete={onComplete} />
      </MemoryRouter>
    </PlantProvider>
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
    <PlantProvider>
      <MemoryRouter>
        <TaskCard task={task} urgent />
      </MemoryRouter>
    </PlantProvider>
  )
  expect(container.firstChild).toMatchSnapshot()
  document.documentElement.classList.remove('dark')
})
