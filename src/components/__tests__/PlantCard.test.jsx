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

test('water button triggers watering', () => {
  jest.spyOn(window, 'prompt').mockReturnValue('')
  render(
    <MemoryRouter>
      <PlantCard plant={plant} />
    </MemoryRouter>
  )
  fireEvent.click(screen.getByText('Water'))
  expect(markWatered).toHaveBeenCalledWith(1, '')
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

test('delete button removes plant', () => {
  render(
    <MemoryRouter>
      <PlantCard plant={plant} />
    </MemoryRouter>
  )
  fireEvent.click(screen.getByText('Delete'))
  expect(removePlant).toHaveBeenCalledWith(1)
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

test('swipe right waters plant', async () => {
  jest.spyOn(window, 'prompt').mockReturnValue('')
  render(
    <MemoryRouter>
      <PlantCard plant={plant} />
    </MemoryRouter>
  )
  const wrapper = screen.getByTestId('card-wrapper')
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
    fireEvent.touchStart(wrapper, { touches: [{ clientX: 100 }] })
    fireEvent.touchMove(wrapper, { touches: [{ clientX: 20 }] })
    fireEvent.touchEnd(wrapper)
  })
  expect(navigateMock).toHaveBeenCalledWith('/plant/1/edit')
})

test('swipe far left removes plant', async () => {
  render(
    <MemoryRouter>
      <PlantCard plant={plant} />
    </MemoryRouter>
  )
  const wrapper = screen.getByTestId('card-wrapper')
  const user = userEvent.setup()
  await act(async () => {
    fireEvent.touchStart(wrapper, { touches: [{ clientX: 200 }] })
    fireEvent.touchMove(wrapper, { touches: [{ clientX: 0 }] })
    fireEvent.touchEnd(wrapper)
  })
  expect(removePlant).toHaveBeenCalledWith(1)
})
