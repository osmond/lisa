import { render, screen, fireEvent, act } from '@testing-library/react'
import PlantCard from '../PlantCard.jsx'
import { MemoryRouter, useNavigate } from 'react-router-dom'
import { usePlants } from '../../PlantContext.jsx'

async function swipe(element, startX, endX) {
  fireEvent.pointerDown(element, { clientX: startX, buttons: 1 })
  fireEvent.pointerMove(element, { clientX: endX, buttons: 1 })
  fireEvent.pointerUp(element, { clientX: endX })

  await act(async () => {
    fireEvent.touchStart(element, { touches: [{ clientX: startX }] })
    fireEvent.touchMove(element, { touches: [{ clientX: endX }] })
    fireEvent.touchEnd(element, { changedTouches: [{ clientX: endX }] })
  })
}

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

test('defaults to placeholder image when src is empty', () => {
  const noImagePlant = { ...plant, image: '' }
  const { container } = render(
    <MemoryRouter>
      <PlantCard plant={noImagePlant} />
    </MemoryRouter>
  )
  const img = container.querySelector('img')
  expect(img).toHaveAttribute('src', '/placeholder.svg')
})

test('renders plant name', () => {
  render(
    <MemoryRouter>
      <PlantCard plant={plant} />
    </MemoryRouter>
  )
  expect(screen.getByText('Aloe Vera')).toBeInTheDocument()
})

test('water button submits note via modal', () => {
  render(
    <MemoryRouter>
      <PlantCard plant={plant} />
    </MemoryRouter>
  )
  fireEvent.click(screen.getByText('Water'))
  fireEvent.change(screen.getByLabelText(/note/i), { target: { value: 'hi' } })
  fireEvent.click(screen.getByText('Save'))
  expect(markWatered).toHaveBeenCalledWith(1, 'hi')
})

test('cancel note modal does not water', () => {
  render(
    <MemoryRouter>
      <PlantCard plant={plant} />
    </MemoryRouter>
  )
  fireEvent.click(screen.getByText('Water'))
  fireEvent.click(screen.getByText('Cancel'))
  expect(markWatered).not.toHaveBeenCalled()
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

test('delete button confirms before removing plant', () => {
  const confirmMock = jest.spyOn(window, 'confirm').mockReturnValue(true)
  render(
    <MemoryRouter>
      <PlantCard plant={plant} />
    </MemoryRouter>
  )
  fireEvent.click(screen.getByText('Delete'))
  expect(confirmMock).toHaveBeenCalled()
  expect(removePlant).toHaveBeenCalledWith(1)
  confirmMock.mockRestore()
})

test('delete cancelled does not remove plant', () => {
  const confirmMock = jest.spyOn(window, 'confirm').mockReturnValue(false)
  render(
    <MemoryRouter>
      <PlantCard plant={plant} />
    </MemoryRouter>
  )
  fireEvent.click(screen.getByText('Delete'))
  expect(confirmMock).toHaveBeenCalled()
  expect(removePlant).not.toHaveBeenCalled()
  confirmMock.mockRestore()
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

test('swipe right opens note modal', async () => {
  render(
    <MemoryRouter>
      <PlantCard plant={plant} />
    </MemoryRouter>
  )
  const wrapper = screen.getByTestId('card-wrapper')
  await swipe(wrapper, 0, 100)

  expect(screen.getByRole('dialog')).toBeInTheDocument()
})

test('swipe left navigates to edit page', async () => {
  render(
    <MemoryRouter>
      <PlantCard plant={plant} />
    </MemoryRouter>
  )
  const wrapper = screen.getByTestId('card-wrapper')
  await swipe(wrapper, 100, 20)
  expect(navigateMock).toHaveBeenCalledWith('/plant/1/edit')
})

test('swipe far left confirms before removing plant', async () => {
  const confirmMock = jest.spyOn(window, 'confirm').mockReturnValue(true)
  render(
    <MemoryRouter>
      <PlantCard plant={plant} />
    </MemoryRouter>
  )
  const wrapper = screen.getByTestId('card-wrapper')
  await swipe(wrapper, 200, 0)
  expect(confirmMock).toHaveBeenCalled()
  expect(removePlant).toHaveBeenCalledWith(1)
  confirmMock.mockRestore()
})
