import { render, screen, fireEvent, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PlantCard from '../PlantCard.jsx'
import { MemoryRouter, useNavigate } from 'react-router-dom'
import { usePlants } from '../../PlantContext.jsx'

beforeAll(() => {
  if (typeof PointerEvent === 'undefined') {
    window.PointerEvent = window.MouseEvent
  }
})

const navigateMock = jest.fn()
const markWatered = jest.fn()
const removePlant = jest.fn()

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom')
  return { ...actual, useNavigate: jest.fn() }
})

jest.mock('../../PlantContext.jsx', () => ({
  usePlants: jest.fn(),
}))

const usePlantsMock = usePlants

beforeEach(() => {
  navigateMock.mockClear()
  markWatered.mockClear()
  removePlant.mockClear()
  useNavigate.mockReturnValue(navigateMock)
  usePlantsMock.mockReturnValue({
    plants: [],
    markWatered,
    removePlant,
    updatePlant: jest.fn(),
    addPlant: jest.fn(),
    addPhoto: jest.fn(),
    removePhoto: jest.fn(),
  })
})

const plant = {
  id: 1,
  image: 'test.jpg',
  name: 'Aloe Vera',
  lastWatered: '2024-05-01',
  nextWater: '2024-05-07'
}

test('renders plant name', () => {
  render(
    <MemoryRouter>
      <PlantCard plant={plant} />
    </MemoryRouter>
  )
  expect(screen.getByText('Aloe Vera')).toBeInTheDocument()
})

test('water button triggers watering with note', () => {
  render(
    <MemoryRouter>
      <PlantCard plant={plant} />
    </MemoryRouter>
  )
  fireEvent.click(screen.getByText('Water'))
  const dialog = screen.getByRole('dialog', { name: /optional note/i })
  fireEvent.change(dialog.querySelector('textarea'), { target: { value: 'note' } })
  fireEvent.click(screen.getByText('Save'))
  expect(markWatered).toHaveBeenCalledWith(1, 'note')
})

test('edit button navigates to edit page', () => {
  render(
    <MemoryRouter>
      <PlantCard plant={plant} />
    </MemoryRouter>
  )
  fireEvent.click(screen.getByText('Edit'))
  expect(navigateMock).toHaveBeenCalledWith('/plant/1/edit')
})

test('delete button shows confirm modal before removing plant', () => {
  render(
    <MemoryRouter>
      <PlantCard plant={plant} />
    </MemoryRouter>
  )
  fireEvent.click(screen.getByText('Delete'))
  const dialog = screen.getByRole('dialog', { name: /delete this plant/i })
  expect(dialog).toBeInTheDocument()
  fireEvent.click(screen.getByText('Confirm'))
  expect(removePlant).toHaveBeenCalledWith(1)
})

test('delete cancelled does not remove plant', () => {
  render(
    <MemoryRouter>
      <PlantCard plant={plant} />
    </MemoryRouter>
  )
  fireEvent.click(screen.getByText('Delete'))
  fireEvent.click(screen.getByText('Cancel'))
  expect(removePlant).not.toHaveBeenCalled()
})

test('clicking card adds ripple effect', () => {
  const { container } = render(
    <MemoryRouter>
      <PlantCard plant={plant} />
    </MemoryRouter>
  )
  const wrapper = screen.getByTestId('card-wrapper')
  fireEvent.mouseDown(wrapper)
  expect(container.querySelector('.ripple-effect')).toBeInTheDocument()
})

test('arrow right opens watering note modal', () => {
  render(
    <MemoryRouter>
      <PlantCard plant={plant} />
    </MemoryRouter>
  )
  const wrapper = screen.getByTestId('card-wrapper')
  wrapper.focus()
  fireEvent.keyDown(wrapper, { key: 'ArrowRight' })
  expect(screen.getByRole('dialog', { name: /optional note/i })).toBeInTheDocument()
})

test('arrow left navigates to edit page', () => {
  render(
    <MemoryRouter>
      <PlantCard plant={plant} />
    </MemoryRouter>
  )
  const wrapper = screen.getByTestId('card-wrapper')
  wrapper.focus()
  fireEvent.keyDown(wrapper, { key: 'ArrowLeft' })
  expect(navigateMock).toHaveBeenCalledWith('/plant/1/edit')
})


test('delete key confirms before removing plant', () => {

  render(
    <MemoryRouter>
      <PlantCard plant={plant} />
    </MemoryRouter>
  )
  const wrapper = screen.getByTestId('card-wrapper')
  wrapper.focus()
  fireEvent.keyDown(wrapper, { key: 'Delete' })
  const dialog = screen.getByRole('dialog', { name: /delete this plant/i })
  expect(dialog).toBeInTheDocument()
  fireEvent.click(screen.getByText('Confirm'))
  expect(removePlant).toHaveBeenCalledWith(1)
})

test('backspace key confirms before removing plant', () => {
  render(
    <MemoryRouter>
      <PlantCard plant={plant} />
    </MemoryRouter>
  )
  const wrapper = screen.getByTestId('card-wrapper')
  wrapper.focus()
  fireEvent.keyDown(wrapper, { key: 'Backspace' })
  const dialog = screen.getByRole('dialog', { name: /delete this plant/i })
  expect(dialog).toBeInTheDocument()
  fireEvent.click(screen.getByText('Confirm'))
  expect(removePlant).toHaveBeenCalledWith(1)
})

test.skip('swipe right waters plant', async () => {
  render(
    <MemoryRouter>
      <PlantCard plant={plant} />
    </MemoryRouter>
  )
  const wrapper = screen.getByTestId('card-wrapper')

  fireEvent.pointerDown(wrapper, { clientX: 0, buttons: 1 })
  fireEvent.pointerMove(wrapper, { clientX: 100, buttons: 1 })
  fireEvent.pointerUp(wrapper, { clientX: 100 })

  const user = userEvent.setup()
  await act(async () => {
    fireEvent.touchStart(wrapper, { touches: [{ clientX: 0 }] })
    fireEvent.touchMove(wrapper, { touches: [{ clientX: 80 }] })
    fireEvent.touchEnd(wrapper)
  })

  expect(markWatered).toHaveBeenCalledWith(1, '')
})

test('swipe left navigates to edit page', async () => {
  render(
    <MemoryRouter>
      <PlantCard plant={plant} />
    </MemoryRouter>
  )
  const wrapper = screen.getByTestId('card-wrapper')
  const user = userEvent.setup()
  await act(async () => {
    fireEvent.pointerDown(wrapper, { clientX: 100, buttons: 1 })
    expect(wrapper.querySelector('.ripple-effect')).toBeInTheDocument()
    fireEvent.pointerMove(wrapper, { clientX: 20, buttons: 1 })
    fireEvent.pointerUp(wrapper, { clientX: 20 })

    fireEvent.touchStart(wrapper, { touches: [{ clientX: 100 }] })
    fireEvent.touchMove(wrapper, { touches: [{ clientX: 20 }] })
    fireEvent.touchEnd(wrapper)
  })
  expect(navigateMock).toHaveBeenCalledWith('/plant/1/edit')
})

test('swipe far left shows confirm modal and removes plant', async () => {
  render(
    <MemoryRouter>
      <PlantCard plant={plant} />
    </MemoryRouter>
  )
  const wrapper = screen.getByTestId('card-wrapper')
  const user = userEvent.setup()
  await act(async () => {
    fireEvent.pointerDown(wrapper, { clientX: 200, buttons: 1 })
    expect(wrapper.querySelector('.ripple-effect')).toBeInTheDocument()
    fireEvent.pointerMove(wrapper, { clientX: 0, buttons: 1 })
    fireEvent.pointerUp(wrapper, { clientX: 0 })

    fireEvent.touchStart(wrapper, { touches: [{ clientX: 200 }] })
    fireEvent.touchMove(wrapper, { touches: [{ clientX: 0 }] })
    fireEvent.touchEnd(wrapper)
  })
  const dialog = screen.getByRole('dialog', { name: /delete this plant/i })
  expect(dialog).toBeInTheDocument()
  fireEvent.click(screen.getByText('Confirm'))
  expect(removePlant).toHaveBeenCalledWith(1)
})

test('matches snapshot in dark mode', () => {
  document.documentElement.classList.add('dark')
  const { container } = render(
    <MemoryRouter>
      <PlantCard plant={plant} />
    </MemoryRouter>
  )
  expect(container.firstChild).toMatchSnapshot()
  document.documentElement.classList.remove('dark')
})
